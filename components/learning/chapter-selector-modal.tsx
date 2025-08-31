"use client"

import { motion } from "framer-motion"
import { CheckCircle, PlayCircle, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type ChapterStatus = "completed" | "current" | "locked"

interface Chapter {
  id: number
  title: string
  status: ChapterStatus
}

interface ChapterSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  chapters: Chapter[]
  currentChapter: number
  onChapterSelect: (chapterId: number) => void
}

export function ChapterSelectorModal({
  isOpen,
  onClose,
  chapters,
  currentChapter,
  onChapterSelect,
}: ChapterSelectorModalProps) {
  const getStatusIcon = (status: ChapterStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "current":
        return <PlayCircle className="h-5 w-5 text-blue-500" />
      case "locked":
        return <Lock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusText = (status: ChapterStatus) => {
    switch (status) {
      case "completed":
        return "Hoàn thành"
      case "current":
        return "Đang học"
      case "locked":
        return "Chưa mở khóa"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Chọn chương học</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[60vh] pr-2">
          <div className="grid gap-3">
            {chapters.map((chapter, index) => {
              const isActive = chapter.id === currentChapter
              const isClickable = chapter.status !== "locked"

              return (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    onClick={() => isClickable && onChapterSelect(chapter.id)}
                    disabled={!isClickable}
                    className={cn(
                      "w-full p-4 rounded-lg text-left transition-all duration-200",
                      "flex items-center gap-4 group border",
                      isActive && "bg-primary/10 border-primary/30",
                      !isActive && isClickable && "hover:bg-muted/50 border-border",
                      !isClickable && "opacity-60 cursor-not-allowed border-border",
                    )}
                  >
                    <div className="flex-shrink-0">{getStatusIcon(chapter.status)}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-muted-foreground">Chương {chapter.id}</span>
                        <span
                          className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            chapter.status === "completed" &&
                              "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                            chapter.status === "current" &&
                              "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                            chapter.status === "locked" &&
                              "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
                          )}
                        >
                          {getStatusText(chapter.status)}
                        </span>
                      </div>
                      <h4
                        className={cn(
                          "font-medium leading-tight",
                          isActive ? "text-primary" : "text-foreground",
                          !isClickable && "text-muted-foreground",
                        )}
                      >
                        {chapter.title}
                      </h4>
                    </div>

                    {isActive && (
                      <motion.div
                        layoutId="modalActiveIndicator"
                        className="w-1 h-12 bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                </motion.div>
              )
            })}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
