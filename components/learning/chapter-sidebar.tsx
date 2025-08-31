"use client"

import { motion } from "framer-motion"
import { CheckCircle, Circle, Lock, PlayCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type ChapterStatus = "completed" | "current" | "locked"

interface Chapter {
  id: number
  title: string
  status: ChapterStatus
}

interface ChapterSidebarProps {
  chapters: Chapter[]
  currentChapter: number
  onChapterSelect: (chapterId: number) => void
}

export function ChapterSidebar({ chapters, currentChapter, onChapterSelect }: ChapterSidebarProps) {
  const getStatusIcon = (status: ChapterStatus, isActive: boolean) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "current":
        return <PlayCircle className={cn("h-5 w-5", isActive ? "text-primary" : "text-blue-500")} />
      case "locked":
        return <Lock className="h-5 w-5 text-muted-foreground" />
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg mb-4">Danh sách chương</h3>
      {chapters.map((chapter, index) => {
        const isActive = chapter.id === currentChapter
        const isClickable = chapter.status !== "locked"

        return (
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() => isClickable && onChapterSelect(chapter.id)}
              disabled={!isClickable}
              className={cn(
                "w-full p-3 rounded-lg text-left transition-all duration-200",
                "flex items-center gap-3 group",
                isActive && "bg-primary/10 border border-primary/20",
                !isActive && isClickable && "hover:bg-muted/50",
                !isClickable && "opacity-60 cursor-not-allowed",
              )}
            >
              <div className="flex-shrink-0">{getStatusIcon(chapter.status, isActive)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Chương {chapter.id}</span>
                </div>
                <h4
                  className={cn(
                    "font-medium text-sm leading-tight",
                    isActive ? "text-primary" : "text-foreground",
                    !isClickable && "text-muted-foreground",
                  )}
                >
                  {chapter.title}
                </h4>
              </div>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="w-1 h-8 bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          </motion.div>
        )
      })}
    </div>
  )
}
