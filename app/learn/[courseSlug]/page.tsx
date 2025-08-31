"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RotateCcw, List, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChapterSidebar } from "@/components/learning/chapter-sidebar"
import { ChapterContent } from "@/components/learning/chapter-content"
import { ChapterSelectorModal } from "@/components/learning/chapter-selector-modal"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"

// Mock data - replace with real data from Supabase
const mockCourse = {
  title: "Học lập trình C++ từ cơ bản đến nâng cao",
  chapters: [
    { id: 1, title: "Giới thiệu về C++", status: "completed" as const },
    { id: 2, title: "Biến và kiểu dữ liệu", status: "completed" as const },
    { id: 3, title: "Cấu trúc điều khiển", status: "current" as const },
    { id: 4, title: "Hàm và thủ tục", status: "locked" as const },
    { id: 5, title: "Mảng và con trỏ", status: "locked" as const },
    { id: 6, title: "Lập trình hướng đối tượng", status: "locked" as const },
    { id: 7, title: "Template và STL", status: "locked" as const },
    { id: 8, title: "Xử lý ngoại lệ", status: "locked" as const },
  ],
}

export default function LearnCoursePage({ params }: { params: { courseSlug: string } }) {
  const [currentChapter, setCurrentChapter] = useState(3)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const completedChapters = mockCourse.chapters.filter((ch) => ch.status === "completed").length
  const progress = (completedChapters / mockCourse.chapters.length) * 100

  const handleChapterSelect = (chapterId: number) => {
    setCurrentChapter(chapterId)
    setIsModalOpen(false)
    setIsMobileDrawerOpen(false)
  }

  const handleNext = () => {
    if (currentChapter < mockCourse.chapters.length) {
      setCurrentChapter(currentChapter + 1)
    }
  }

  const handlePrevious = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1)
    }
  }

  const handleRestart = () => {
    setCurrentChapter(1)
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
                    chapters={mockCourse.chapters}
                    currentChapter={currentChapter}
                    onChapterSelect={handleChapterSelect}
                  />
                </div>
              </DrawerContent>
            </Drawer>

            <div>
              <h1 className="text-xl font-bold text-foreground">{mockCourse.title}</h1>
              <div className="flex items-center gap-4 mt-2">
                <Progress value={progress} className="w-32" />
                <span className="text-sm text-muted-foreground">
                  {completedChapters}/{mockCourse.chapters.length} chương
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
              Chọn chương
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
              chapters={mockCourse.chapters}
              currentChapter={currentChapter}
              onChapterSelect={handleChapterSelect}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-73px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentChapter}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <ChapterContent
                chapter={mockCourse.chapters.find((ch) => ch.id === currentChapter)!}
                onNext={handleNext}
                onPrevious={handlePrevious}
                canGoNext={currentChapter < mockCourse.chapters.length}
                canGoPrevious={currentChapter > 1}
              />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Chapter Selector Modal */}
      <ChapterSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        chapters={mockCourse.chapters}
        currentChapter={currentChapter}
        onChapterSelect={handleChapterSelect}
      />
    </div>
  )
}
