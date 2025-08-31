import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseServer, withAuth, withRateLimit } from "@/lib/api-utils"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(request, async (req, user) => {
    return withRateLimit(
      req,
      async () => {
        try {
          const supabase = await createSupabaseServer()

          const { error } = await supabase.from("lesson_progress").upsert({
            user_id: user.id,
            lesson_id: params.id,
            completed_at: new Date().toISOString(),
            is_completed: true,
          })

          if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
          }

          return NextResponse.json({ message: "Lesson completed" })
        } catch (error) {
          return NextResponse.json({ error: "Internal server error" }, { status: 500 })
        }
      },
      30,
    ) // 30 requests per minute
  })
}
