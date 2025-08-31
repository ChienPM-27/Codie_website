"use client"
import { ChevronLeft, ChevronRight, BookOpen, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Chapter {
  id: number
  title: string
  status: "completed" | "current" | "locked"
}

interface Lesson {
  id: string
  title: string
  content_mdx: string
  duration_minutes: number
  order_index: number
}

interface ChapterContentProps {
  chapter: Chapter
  lesson?: Lesson
  onNext: () => void
  onPrevious: () => void
  onMarkCompleted?: () => void
  canGoNext: boolean
  canGoPrevious: boolean
  isCompleted?: boolean
}

export function ChapterContent({
  chapter,
  lesson,
  onNext,
  onPrevious,
  onMarkCompleted,
  canGoNext,
  canGoPrevious,
  isCompleted = false,
}: ChapterContentProps) {
  const renderMarkdown = (content: string) => {
    return content
      .replace(
        /```javascript\n([\s\S]*?)\n```/g,
        '<pre class="bg-muted p-4 rounded-lg overflow-x-auto"><code class="language-javascript">$1</code></pre>',
      )
      .replace(
        /```jsx\n([\s\S]*?)\n```/g,
        '<pre class="bg-muted p-4 rounded-lg overflow-x-auto"><code class="language-jsx">$1</code></pre>',
      )
      .replace(
        /```cpp\n([\s\S]*?)\n```/g,
        '<pre class="bg-muted p-4 rounded-lg overflow-x-auto"><code class="language-cpp">$1</code></pre>',
      )
      .replace(
        /```bash\n([\s\S]*?)\n```/g,
        '<pre class="bg-muted p-4 rounded-lg overflow-x-auto"><code class="language-bash">$1</code></pre>',
      )
      .replace(
        /```css\n([\s\S]*?)\n```/g,
        '<pre class="bg-muted p-4 rounded-lg overflow-x-auto"><code class="language-css">$1</code></pre>',
      )
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3 mt-6">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2 mt-4">$1</h3>')
      .replace(/^\*\*(.*?)\*\*/gm, "<strong>$1</strong>")
      .replace(/^\* (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/\n\n/g, "<br><br>")
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chapter Header */}
      <div className="border-b bg-card/30 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline">Bài {chapter.id}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {lesson?.duration_minutes || 15} phút
              </div>
              {isCompleted && (
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Đã hoàn thành
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold text-foreground">{lesson?.title || chapter.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Chapter Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Nội dung bài học
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {lesson?.content_mdx ? (
                  <div
                    className="whitespace-pre-wrap leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(lesson.content_mdx),
                    }}
                  />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nội dung bài học đang được cập nhật...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {onMarkCompleted && !isCompleted && (
            <div className="mt-6 text-center">
              <Button onClick={onMarkCompleted} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Đánh dấu hoàn thành
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="border-t bg-card/30 p-6">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="flex items-center gap-2 bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
            Bài trước
          </Button>

          <div className="text-sm text-muted-foreground">Bài {chapter.id}</div>

          <Button onClick={onNext} disabled={!canGoNext} className="flex items-center gap-2">
            Bài tiếp theo
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
