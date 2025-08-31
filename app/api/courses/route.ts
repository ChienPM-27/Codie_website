import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseServer, withAuth, withRateLimit } from "@/lib/api-utils"
import { courseSchema } from "@/lib/validation"

export async function GET(request: NextRequest) {
  return withRateLimit(
    request,
    async () => {
      try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get("search")
        const level = searchParams.get("level")
        const limit = Number.parseInt(searchParams.get("limit") || "10")
        const offset = Number.parseInt(searchParams.get("offset") || "0")

        const supabase = await createSupabaseServer()

        let query = supabase
          .from("courses")
          .select(`
          *,
          instructor:profiles!courses_instructor_id_fkey(full_name, avatar_url),
          _count:enrollments(count)
        `)
          .eq("is_published", true)
          .range(offset, offset + limit - 1)

        if (search) {
          query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
        }

        if (level) {
          query = query.eq("level", level)
        }

        const { data: courses, error } = await query

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 400 })
        }

        return NextResponse.json({ courses })
      } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
      }
    },
    30,
  ) // 30 requests per minute
}

export async function POST(request: NextRequest) {
  return withAuth(
    request,
    async (req, user) => {
      return withRateLimit(
        req,
        async () => {
          try {
            const body = await req.json()
            const courseData = courseSchema.parse(body)

            const supabase = await createSupabaseServer()

            const { data: course, error } = await supabase
              .from("courses")
              .insert({
                ...courseData,
                instructor_id: user.id,
              })
              .select()
              .single()

            if (error) {
              return NextResponse.json({ error: error.message }, { status: 400 })
            }

            return NextResponse.json({ course }, { status: 201 })
          } catch (error) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 })
          }
        },
        5,
      ) // 5 requests per minute
    },
    "author",
  )
}
