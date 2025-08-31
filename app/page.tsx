"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BookOpen, Play, Clock, User, LogIn, UserPlus, Search, X } from "lucide-react"
import { AuthModal } from "@/components/auth/auth-modal"
import { ProfileDropdown } from "@/components/profile/profile-dropdown"
import { useAuth } from "@/hooks/use-auth"

interface Course {
  id: string
  title: string
  description: string
  slug: string
  level: string
  duration_minutes: number
  price: number
  is_published: boolean
  thumbnail_url?: string
  lessons?: { id: string }[]
}

export default function HomePage() {
  const { user, loading, supabase } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [coursesLoading, setCoursesLoading] = useState(true)

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const { data, error } = await supabase
          .from("courses")
          .select(`
            id,
            title,
            description,
            slug,
            level,
            duration_minutes,
            price,
            is_published,
            thumbnail_url,
            lessons (id)
          `)
          .eq("is_published", true)
          .order("created_at", { ascending: false })

        if (error) throw error

        setCourses(data || [])
      } catch (error) {
        console.error("Error loading courses:", error)
      } finally {
        setCoursesLoading(false)
      }
    }

    loadCourses()
  }, [supabase])

  const filteredCourses = useMemo(() => {
    if (!searchTerm.trim()) return courses

    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.level.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [searchTerm, courses])

  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) return []

    const keywords = [
      ...courses.map((c) => c.title.toLowerCase()),
      ...courses.map((c) => c.level.toLowerCase()),
      "javascript",
      "react",
      "html",
      "css",
      "cơ bản",
      "nâng cao",
    ]

    const uniqueKeywords = [...new Set(keywords)]

    return uniqueKeywords
      .filter((keyword) => keyword.includes(searchTerm.toLowerCase()) && keyword !== searchTerm.toLowerCase())
      .slice(0, 5)
  }, [searchTerm, courses])

  const clearSearch = () => {
    setSearchTerm("")
    setShowSuggestions(false)
  }

  const getCourseGradient = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "from-green-500 to-teal-600"
      case "intermediate":
        return "from-blue-500 to-purple-600"
      case "advanced":
        return "from-purple-500 to-pink-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours > 0) {
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
    }
    return `${minutes}m`
  }

  const getLevelText = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "Cơ bản"
      case "intermediate":
        return "Trung bình"
      case "advanced":
        return "Nâng cao"
      default:
        return level
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">LearnHub</span>
            </div>
            <div className="flex items-center space-x-4">
              {loading ? (
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
              ) : user ? (
                <ProfileDropdown />
              ) : (
                <>
                  <AuthModal>
                    <Button variant="ghost" size="sm">
                      <LogIn className="h-4 w-4 mr-2" />
                      Đăng nhập
                    </Button>
                  </AuthModal>
                  <AuthModal defaultTab="register">
                    <Button size="sm">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Đăng ký
                    </Button>
                  </AuthModal>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-balance animate-fade-in">
            Học lập trình web
            <span className="text-blue-600"> hiệu quả</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto text-pretty animate-fade-in-delay">
            Nền tảng học tập với các khóa học chất lượng cao và lộ trình rõ ràng
          </p>

          <div className="max-w-md mx-auto relative animate-fade-in-delay-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                className="pl-10 pr-10 py-3 text-base border-2 border-gray-200 focus:border-blue-500 rounded-full transition-all duration-300"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 animate-fade-in">
                <div className="p-2">
                  <div className="text-xs text-gray-500 mb-2 px-2">Gợi ý tìm kiếm:</div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchTerm(suggestion)
                        setShowSuggestions(false)
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md transition-colors capitalize"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {searchTerm ? `Kết quả tìm kiếm "${searchTerm}"` : "Khóa học"}
            </h2>
            <p className="text-gray-600">
              {searchTerm
                ? `Tìm thấy ${filteredCourses.length} khóa học`
                : "Chọn khóa học phù hợp để bắt đầu hành trình học tập"}
            </p>
          </div>

          {coursesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course, index) => (
                  <Card
                    key={course.id}
                    className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`aspect-video bg-gradient-to-br ${getCourseGradient(course.level)} rounded-t-lg flex items-center justify-center`}
                    >
                      <Play className="h-12 w-12 text-white" />
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={course.price === 0 ? "secondary" : "default"}>
                          {course.price === 0 ? "Miễn phí" : "Premium"}
                        </Badge>
                        <Badge variant="outline">{getLevelText(course.level)}</Badge>
                      </div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDuration(course.duration_minutes)}
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {course.lessons?.length || 0} bài học
                        </div>
                      </div>
                      <Button className="w-full" asChild>
                        <a href={`/learn/${course.slug}`}>Học ngay</a>
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-16 w-16 mx-auto mb-4" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy khóa học</h3>
                  <p className="text-gray-500 mb-4">Thử tìm kiếm với từ khóa khác</p>
                  <Button onClick={clearSearch} variant="outline">
                    Xem tất cả khóa học
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="h-6 w-6" />
            <span className="text-lg font-bold">LearnHub</span>
          </div>
          <p className="text-gray-400">&copy; 2024 LearnHub. Nền tảng học lập trình web.</p>
        </div>
      </footer>
    </div>
  )
}
