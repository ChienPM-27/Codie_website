import { type NextRequest, NextResponse } from "next/server"
import { createSupabaseServer, withAuth, withRateLimit } from "@/lib/api-utils"
import { quizSubmissionSchema } from "@/lib/validation"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  return withAuth(request, async (req, user) => {
    return withRateLimit(
      req,
      async () => {
        try {
          const body = await req.json()
          const { answers } = quizSubmissionSchema.parse(body)

          const supabase = await createSupabaseServer()

          // Get quiz with correct answers
          const { data: quiz } = await supabase
            .from("quizzes")
            .select("questions, passing_score")
            .eq("id", params.id)
            .single()

          if (!quiz) {
            return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
          }

          // Calculate score
          let correctAnswers = 0
          const results = quiz.questions.map((question: any) => {
            const userAnswer = answers[question.id]
            const isCorrect = userAnswer === question.correct_answer
            if (isCorrect) correctAnswers++

            return {
              questionId: question.id,
              userAnswer,
              correctAnswer: question.correct_answer,
              isCorrect,
            }
          })

          const score = (correctAnswers / quiz.questions.length) * 100
          const passed = score >= quiz.passing_score

          // Save submission
          const { data: submission, error } = await supabase
            .from("quiz_submissions")
            .insert({
              user_id: user.id,
              quiz_id: params.id,
              answers,
              score,
              passed,
            })
            .select()
            .single()

          if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
          }

          return NextResponse.json({
            submission,
            score,
            passed,
            results,
          })
        } catch (error) {
          return NextResponse.json({ error: "Invalid request" }, { status: 400 })
        }
      },
      5,
    ) // 5 requests per minute (prevent spam)
  })
}
