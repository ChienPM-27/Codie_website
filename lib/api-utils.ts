import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { rateLimit } from "./rate-limit"

export async function createSupabaseServer() {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}

export async function withAuth(
  request: NextRequest,
  handler: (req: NextRequest, user: any) => Promise<NextResponse>,
  requiredRole?: string,
) {
  try {
    const supabase = await createSupabaseServer()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check role if required
    if (requiredRole) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

      if (!profile || profile.role !== requiredRole) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    return handler(request, user)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function withRateLimit(request: NextRequest, handler: () => Promise<NextResponse>, limit = 10) {
  const ip = request.ip ?? "127.0.0.1"
  const { success } = await rateLimit.limit(ip, limit)

  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  return handler()
}
