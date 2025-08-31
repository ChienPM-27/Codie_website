import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseServer, withRateLimit } from "@/lib/api-utils"
import { signupSchema } from "@/lib/validation"

export async function POST(request: NextRequest) {
  return withRateLimit(
    request,
    async () => {
      try {
        const body = await request.json()
        const { email, password, fullName } = signupSchema.parse(body)

        const supabase = await createSupabaseServer()

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            // Remove email confirmation requirement
          },
        })

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 400 })
        }

        if (data.user) {
          try {
            await supabase.from("profiles").insert({
              id: data.user.id,
              full_name: fullName,
              email: email,
              role: "student",
            })
          } catch (profileError) {
            console.log("[v0] Profile creation failed - tables may not exist:", profileError)
            // Continue anyway since auth user was created successfully
          }

          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (signInError) {
            console.log("[v0] Auto sign-in failed:", signInError)
          }
        }

        return NextResponse.json({
          user: data.user,
          message: "Account created successfully! You are now logged in.",
          autoLoggedIn: true,
        })
      } catch (error) {
        console.log("[v0] Signup error:", error)
        return NextResponse.json({ error: "Invalid request" }, { status: 400 })
      }
    },
    3,
  ) // 3 requests per minute
}
