import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, CheckCircle, Circle, Clock } from "lucide-react"
import Link from "next/link"

interface CoursePageProps {
  params: {
    course: string
  }
}

// Sample course data - replace with real data from database
const courseData = {
  "html-css-basics": {
    title: "HTML & CSS Cơ bản",
    description: "Học nền tảng của web development với HTML và CSS",
    lessons: [
      { id: 1, title: "Giới thiệu về HTML", duration: "15 phút", completed: false },
      { id: 2, title: "Cấu trúc tài liệu HTML", duration: "20 phút", completed: false },
      { id: 3, title: "Các thẻ HTML cơ bản", duration: "25 phút", completed: false },
      { id: 4, title: "Giới thiệu về CSS", duration: "18 phút", completed: false },
      { id: 5, title: "CSS Selectors", duration: "22 phút", completed: false },
    ],
  },
  "javascript-advanced": {
    title: "JavaScript Nâng cao",
    description: "Nắm vững JavaScript ES6+ và các concept quan trọng",
    lessons: [
      { id: 1, title: "ES6+ Features", duration: "30 phút", completed: false },
      { id: 2, title: "Async/Await", duration: "25 phút", completed: false },
      { id: 3, title: "Promises", duration: "28 phút", completed: false },
      { id: 4, title: "Modules", duration: "20 phút", completed: false },
      { id: 5, title: "Classes", duration: "22 phút", completed: false },
    ],
  },
  "react-nextjs": {
    title: "React & Next.js",
    description: "Xây dựng ứng dụng web hiện đại với React và Next.js",
    lessons: [
      { id: 1, title: "React Components", duration: "35 phút", completed: false },
      { id: 2, title: "State & Props", duration: "30 phút", completed: false },
      { id: 3, title: "Hooks", duration: "40 phút", completed: false },
      { id: 4, title: "Next.js Routing", duration: "25 phút", completed: false },
      { id: 5, title: "API Routes", duration: "30 phút", completed: false },
    ],
  },
}

export default function CoursePage({ params }: CoursePageProps) {
  const course = courseData[params.course as keyof typeof courseData]

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Khóa học không tồn tại</h1>
          <Link href="/">
            <Button>Về trang chủ</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Về trang chủ
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">{course.title}</h1>
              <p className="text-sm text-gray-600">{course.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Danh sách bài học</h2>
            <Badge variant="secondary">{course.lessons.length} bài học</Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full w-0 transition-all duration-300"></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Tiến độ: 0/{course.lessons.length} bài học</p>
        </div>

        <div className="space-y-4">
          {course.lessons.map((lesson, index) => (
            <Card
              key={lesson.id}
              className="hover:shadow-md transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {lesson.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                      <CardTitle className="text-lg">{lesson.title}</CardTitle>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {lesson.duration}
                      </div>
                    </div>
                  </div>
                  <Link href={`/learn/${params.course}/${lesson.id}`}>
                    <Button size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      {lesson.completed ? "Xem lại" : "Học"}
                    </Button>
                  </Link>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
