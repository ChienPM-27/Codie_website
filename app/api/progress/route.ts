import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { z } from "zod"

const progressSchema = z.object({
  lessonId: z.string().uuid(),
  courseId: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { lessonId, courseId } = progressSchema.parse(body)

    // Mark lesson as completed
    const { error: progressError } = await supabase.from("lesson_progress").upsert({
      user_id: user.id,
      lesson_id: lessonId,
      completed_at: new Date().toISOString(),
    })

    if (progressError) throw progressError

    // Update enrollment progress
    const { data: lessons } = await supabase.from("lessons").select("id").eq("course_id", courseId)

    const { data: completedLessons } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .in("lesson_id", lessons?.map((l) => l.id) || [])

    const progress = lessons?.length ? ((completedLessons?.length || 0) / lessons.length) * 100 : 0

    const { error: enrollmentError } = await supabase
      .from("enrollments")
      .update({
        progress,
        completed_at: progress === 100 ? new Date().toISOString() : null,
      })
      .eq("user_id", user.id)
      .eq("course_id", courseId)

    if (enrollmentError) throw enrollmentError

    return NextResponse.json({ success: true, progress })
  } catch (error) {
    console.error("Progress tracking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")

    if (!courseId) {
      return NextResponse.json({ error: "Course ID required" }, { status: 400 })
    }

    const { data: progress } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .in("lesson_id", supabase.from("lessons").select("id").eq("course_id", courseId))

    return NextResponse.json({ completedLessons: progress?.map((p) => p.lesson_id) || [] })
  } catch (error) {
    console.error("Get progress error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
