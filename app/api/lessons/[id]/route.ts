import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseServer, withAuth, withRateLimit } from "@/lib/api-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(request, async (req, user) => {
    return withRateLimit(
      req,
      async () => {
        try {
          const supabase = await createSupabaseServer()

          // Check if user is enrolled in the course
          const { data: lesson } = await supabase
            .from("lessons")
            .select(`
            *,
            course:courses(
              id,
              title,
              enrollments!inner(user_id)
            )
          `)
            .eq("id", params.id)
            .eq("course.enrollments.user_id", user.id)
            .single()

          if (!lesson) {
            return NextResponse.json({ error: "Lesson not found or access denied" }, { status: 404 })
          }

          // Track progress
          await supabase.from("lesson_progress").upsert({
            user_id: user.id,
            lesson_id: params.id,
            last_accessed_at: new Date().toISOString(),
          })

          return NextResponse.json({ lesson })
        } catch (error) {
          return NextResponse.json({ error: "Internal server error" }, { status: 500 })
        }
      },
      60,
    ) // 60 requests per minute
  })
}
