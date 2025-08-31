"use client"
import { ChevronLeft, ChevronRight, BookOpen, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Chapter {
  id: number
  title: string
  status: "completed" | "current" | "locked"
}

interface ChapterContentProps {
  chapter: Chapter
  onNext: () => void
  onPrevious: () => void
  canGoNext: boolean
  canGoPrevious: boolean
}

export function ChapterContent({ chapter, onNext, onPrevious, canGoNext, canGoPrevious }: ChapterContentProps) {
  // Mock content - replace with real content from database
  const getChapterContent = (chapterId: number) => {
    const contents: Record<number, { content: string; duration: string }> = {
      1: {
        content: `# Giới thiệu về C++

C++ là một ngôn ngữ lập trình mạnh mẽ được phát triển bởi Bjarne Stroustrup tại Bell Labs vào năm 1979. 

## Tại sao học C++?

- **Hiệu suất cao**: C++ cho phép kiểm soát tài nguyên hệ thống một cách chi tiết
- **Đa năng**: Có thể sử dụng cho game development, system programming, embedded systems
- **Nền tảng vững chắc**: Hiểu C++ giúp học các ngôn ngữ khác dễ dàng hơn

## Cài đặt môi trường

1. Tải và cài đặt IDE (Visual Studio, Code::Blocks, hoặc Dev-C++)
2. Cài đặt compiler (GCC hoặc MinGW)
3. Kiểm tra cài đặt bằng cách compile chương trình đầu tiên

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
\`\`\``,
        duration: "15 phút",
      },
      2: {
        content: `# Biến và kiểu dữ liệu

Trong C++, biến là vùng nhớ được đặt tên để lưu trữ dữ liệu.

## Các kiểu dữ liệu cơ bản

### Kiểu số nguyên
- \`int\`: số nguyên 32-bit
- \`long\`: số nguyên 64-bit
- \`short\`: số nguyên 16-bit

### Kiểu số thực
- \`float\`: số thực độ chính xác đơn
- \`double\`: số thực độ chính xác kép

### Kiểu ký tự
- \`char\`: ký tự đơn
- \`string\`: chuỗi ký tự

## Khai báo biến

\`\`\`cpp
int age = 25;
double height = 1.75;
char grade = 'A';
string name = "John Doe";
\`\`\``,
        duration: "20 phút",
      },
      3: {
        content: `# Cấu trúc điều khiển

Cấu trúc điều khiển cho phép chương trình thực hiện các quyết định và lặp lại các hành động.

## Câu lệnh điều kiện

### If-else
\`\`\`cpp
if (condition) {
    // code block
} else if (another_condition) {
    // code block
} else {
    // code block
}
\`\`\`

### Switch-case
\`\`\`cpp
switch (variable) {
    case value1:
        // code
        break;
    case value2:
        // code
        break;
    default:
        // default code
}
\`\`\`

## Vòng lặp

### For loop
\`\`\`cpp
for (int i = 0; i < 10; i++) {
    cout << i << endl;
}
\`\`\`

### While loop
\`\`\`cpp
while (condition) {
    // code block
}
\`\`\``,
        duration: "25 phút",
      },
    }

    return (
      contents[chapterId] || {
        content: `# Chương ${chapterId}: ${chapter.title}\n\nNội dung đang được cập nhật...`,
        duration: "10 phút",
      }
    )
  }

  const { content, duration } = getChapterContent(chapter.id)

  return (
    <div className="flex flex-col h-full">
      {/* Chapter Header */}
      <div className="border-b bg-card/30 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline">Chương {chapter.id}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {duration}
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">{chapter.title}</h1>
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
                <div
                  className="whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: content
                      .replace(
                        /```cpp\n([\s\S]*?)\n```/g,
                        '<pre class="bg-muted p-4 rounded-lg overflow-x-auto"><code class="language-cpp">$1</code></pre>',
                      )
                      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
                      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
                      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3 mt-6">$1</h2>')
                      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2 mt-4">$1</h3>'),
                  }}
                />
              </div>
            </CardContent>
          </Card>
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
            Chương trước
          </Button>

          <div className="text-sm text-muted-foreground">Chương {chapter.id} / 8</div>

          <Button onClick={onNext} disabled={!canGoNext} className="flex items-center gap-2">
            Chương tiếp theo
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
