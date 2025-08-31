"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Auth callback error:", error)
        router.push("/?error=auth_failed")
        return
      }

      if (data.session) {
        // Create profile if it doesn't exist
        const { data: profile } = await supabase.from("profiles").select("id").eq("id", data.session.user.id).single()

        if (!profile) {
          await supabase.from("profiles").insert({
            id: data.session.user.id,
            full_name: data.session.user.user_metadata.full_name || data.session.user.email,
            email: data.session.user.email,
            role: "student",
          })
        }

        router.push("/dashboard")
      } else {
        router.push("/")
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Đang xử lý đăng nhập...</p>
      </div>
    </div>
  )
}
