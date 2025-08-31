"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RotateCcw, List, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChapterSidebar } from "@/components/learning/chapter-sidebar"
import { ChapterContent } from "@/components/learning/chapter-content"
import { ChapterSelectorModal } from "@/components/learning/chapter-selector-modal"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

interface Lesson {
  id: string
  title: string
  slug: string
  content_mdx: string
  order_index: number
  duration_minutes: number
  is_free: boolean
}

interface Course {
  id: string
  title: string
  slug: string
  description: string
  lessons: Lesson[]
}

export default function LearnCoursePage({ params }: { params: { courseSlug: string } }) {
  const [course, setCourse] = useState<Course | null>(null)
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { theme, setTheme } = useTheme()
  const { user, supabase } = useAuth()

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        // Fetch course with lessons
        const { data: courseData, error: courseError } = await supabase
          .from("courses")
          .select(`
            id,
            title,
            slug,
            description,
            lessons (
              id,
              title,
              slug,
              content_mdx,
              order_index,
              duration_minutes,
              is_free
            )
          `)
          .eq("slug", params.courseSlug)
          .single()

        if (courseError) throw courseError

        if (courseData) {
          // Sort lessons by order_index
          courseData.lessons.sort((a: Lesson, b: Lesson) => a.order_index - b.order_index)
          setCourse(courseData as Course)

          // Load user progress if logged in
          if (user) {
            const { data: progressData } = await supabase
              .from("lesson_progress")
              .select("lesson_id")
              .eq("user_id", user.id)
              .in(
                "lesson_id",
                courseData.lessons.map((l: Lesson) => l.id),
              )

            const completed = progressData?.map((p) => p.lesson_id) || []
            setCompletedLessons(completed)

            // Find first incomplete lesson or start from beginning
            const firstIncompleteIndex = courseData.lessons.findIndex(
              (lesson: Lesson) => !completed.includes(lesson.id),
            )
            setCurrentLessonIndex(firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0)
          }
        }
      } catch (error) {
        console.error("Error loading course:", error)
        toast.error("Không thể tải khóa học")
      } finally {
        setLoading(false)
      }
    }

    loadCourseData()
  }, [params.courseSlug, user, supabase])

  const markLessonCompleted = async (lessonId: string) => {
    if (!user || !course) return

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId,
          courseId: course.id,
        }),
      })

      if (response.ok) {
        setCompletedLessons((prev) => [...prev, lessonId])
        toast.success("Đã hoàn thành bài học!")
      }
    } catch (error) {
      console.error("Error marking lesson completed:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Đang tải khóa học...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy khóa học</h1>
          <Button onClick={() => window.history.back()}>Quay lại</Button>
        </div>
      </div>
    )
  }

  const currentLesson = course.lessons[currentLessonIndex]
  const progress = (completedLessons.length / course.lessons.length) * 100

  const chapters = course.lessons.map((lesson, index) => ({
    id: index + 1,
    title: lesson.title,
    status: completedLessons.includes(lesson.id)
      ? ("completed" as const)
      : index === currentLessonIndex
        ? ("current" as const)
        : ("locked" as const),
  }))

  const handleChapterSelect = (chapterId: number) => {
    const lessonIndex = chapterId - 1
    if (lessonIndex >= 0 && lessonIndex < course.lessons.length) {
      setCurrentLessonIndex(lessonIndex)
      setIsModalOpen(false)
      setIsMobileDrawerOpen(false)
    }
  }

  const handleNext = () => {
    if (currentLessonIndex < course.lessons.length - 1) {
      // Mark current lesson as completed when moving to next
      if (user && !completedLessons.includes(currentLesson.id)) {
        markLessonCompleted(currentLesson.id)
      }
      setCurrentLessonIndex(currentLessonIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1)
    }
  }

  const handleRestart = () => {
    setCurrentLessonIndex(0)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            <Drawer open={isMobileDrawerOpen} onOpenChange={setIsMobileDrawerOpen}>
              <DrawerTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden bg-transparent">
                  <List className="h-4 w-4" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[80vh]">
                <div className="p-4">
                  <ChapterSidebar
                    chapters={chapters}
                    currentChapter={currentLessonIndex + 1}
                    onChapterSelect={handleChapterSelect}
                  />
                </div>
              </DrawerContent>
            </Drawer>

            <div>
              <h1 className="text-xl font-bold text-foreground">{course.title}</h1>
              <div className="flex items-center gap-4 mt-2">
                <Progress value={progress} className="w-32" />
                <span className="text-sm text-muted-foreground">
                  {completedLessons.length}/{course.lessons.length} bài học
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRestart}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Bắt đầu lại
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
              <List className="h-4 w-4 mr-2" />
              Chọn bài học
            </Button>
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-80 border-r bg-card/30 min-h-[calc(100vh-73px)]">
          <div className="p-4">
            <ChapterSidebar
              chapters={chapters}
              currentChapter={currentLessonIndex + 1}
              onChapterSelect={handleChapterSelect}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-73px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentLessonIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <ChapterContent
                chapter={chapters[currentLessonIndex]}
                lesson={currentLesson}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onMarkCompleted={() => markLessonCompleted(currentLesson.id)}
                canGoNext={currentLessonIndex < course.lessons.length - 1}
                canGoPrevious={currentLessonIndex > 0}
                isCompleted={completedLessons.includes(currentLesson.id)}
              />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Chapter Selector Modal */}
      <ChapterSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        chapters={chapters}
        currentChapter={currentLessonIndex + 1}
        onChapterSelect={handleChapterSelect}
      />
    </div>
  )
}
