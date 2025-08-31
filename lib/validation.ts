import { z } from "zod"

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
})

export const signupSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
})

// Course schemas
export const courseSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
  slug: z.string().min(1, "Slug không được để trống"),
  thumbnail_url: z.string().url("URL thumbnail không hợp lệ").optional(),
  price: z.number().min(0, "Giá không được âm"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  is_published: z.boolean().default(false),
})

export const courseUpdateSchema = courseSchema.partial()

// Quiz schemas
export const quizSubmissionSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string(),
      selectedAnswer: z.string(),
    }),
  ),
})

// Lesson schemas
export const lessonSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  content_mdx: z.string().min(1, "Nội dung không được để trống"),
  video_url: z.string().url("URL video không hợp lệ").optional(),
  duration_minutes: z.number().min(1, "Thời lượng phải lớn hơn 0"),
  order_index: z.number().min(0, "Thứ tự không được âm"),
  is_free: z.boolean().default(false),
})

// Progress schemas
export const progressUpdateSchema = z.object({
  completed: z.boolean(),
  progress_percentage: z.number().min(0).max(100),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type CourseInput = z.infer<typeof courseSchema>
export type CourseUpdateInput = z.infer<typeof courseUpdateSchema>
export type QuizSubmissionInput = z.infer<typeof quizSubmissionSchema>
export type LessonInput = z.infer<typeof lessonSchema>
export type ProgressUpdateInput = z.infer<typeof progressUpdateSchema>
