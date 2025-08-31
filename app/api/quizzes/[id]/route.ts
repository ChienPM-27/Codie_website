import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseServer, withAuth, withRateLimit } from "@/lib/api-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(request, async (req, user) => {
    return withRateLimit(
      req,
      async () => {
        try {
          const supabase = await createSupabaseServer()

          const { data: quiz } = await supabase
            .from("quizzes")
            .select(`
            id,
            title,
            description,
            time_limit_minutes,
            questions,
            lesson:lessons!inner(
              course:courses!inner(
                enrollments!inner(user_id)
              )
            )
          `)
            .eq("id", params.id)
            .eq("lesson.course.enrollments.user_id", user.id)
            .single()

          if (!quiz) {
            return NextResponse.json({ error: "Quiz not found or access denied" }, { status: 404 })
          }

          // Remove correct answers from questions
          const sanitizedQuestions = quiz.questions.map((q: any) => ({
            id: q.id,
            question: q.question,
            options: q.options,
            type: q.type,
          }))

          return NextResponse.json({
            ...quiz,
            questions: sanitizedQuestions,
          })
        } catch (error) {
          return NextResponse.json({ error: "Internal server error" }, { status: 500 })
        }
      },
      20,
    ) // 20 requests per minute
  })
}
