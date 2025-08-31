import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseServer, withAuth, withRateLimit } from "@/lib/api-utils"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(request, async (req, user) => {
    return withRateLimit(
      req,
      async () => {
        try {
          const supabase = await createSupabaseServer()

          // Check if already enrolled
          const { data: existing } = await supabase
            .from("enrollments")
            .select("id")
            .eq("user_id", user.id)
            .eq("course_id", params.id)
            .single()

          if (existing) {
            return NextResponse.json({ error: "Already enrolled" }, { status: 400 })
          }

          const { data: enrollment, error } = await supabase
            .from("enrollments")
            .insert({
              user_id: user.id,
              course_id: params.id,
            })
            .select()
            .single()

          if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
          }

          return NextResponse.json({ enrollment }, { status: 201 })
        } catch (error) {
          return NextResponse.json({ error: "Internal server error" }, { status: 500 })
        }
      },
      10,
    ) // 10 requests per minute
  })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(request, async (req, user) => {
    return withRateLimit(
      req,
      async () => {
        try {
          const supabase = await createSupabaseServer()

          const { error } = await supabase
            .from("enrollments")
            .delete()
            .eq("user_id", user.id)
            .eq("course_id", params.id)

          if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
          }

          return NextResponse.json({ message: "Unenrolled successfully" })
        } catch (error) {
          return NextResponse.json({ error: "Internal server error" }, { status: 500 })
        }
      },
      10,
    ) // 10 requests per minute
  })
}
