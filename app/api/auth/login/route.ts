import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseServer, withRateLimit } from "@/lib/api-utils"
import { loginSchema } from "@/lib/validation"

export async function POST(request: NextRequest) {
  return withRateLimit(
    request,
    async () => {
      try {
        const body = await request.json()
        const { email, password } = loginSchema.parse(body)

        const supabase = await createSupabaseServer()

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 400 })
        }

        return NextResponse.json({
          user: data.user,
          session: data.session,
        })
      } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 })
      }
    },
    5,
  ) // 5 requests per minute
}
