-- Insert JavaScript and React courses
INSERT INTO public.courses (id, title, slug, description, instructor_id, level, duration_minutes, price, is_published, thumbnail_url, content_mdx) VALUES
(
    '550e8400-e29b-41d4-a716-446655440020',
    'JavaScript Cơ Bản',
    'javascript-co-ban',
    'Học JavaScript từ cơ bản đến nâng cao. Khóa học dành cho người mới bắt đầu.',
    (SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1),
    'beginner',
    1800,
    0,
    TRUE,
    '/placeholder.svg?height=200&width=300',
    '# JavaScript Cơ Bản

Khóa học JavaScript toàn diện từ cơ bản đến nâng cao.

## Bạn sẽ học được gì?

- Cú pháp JavaScript cơ bản
- Biến, hàm và đối tượng
- DOM manipulation
- Event handling
- Async/await và Promises
- ES6+ features

## Yêu cầu

- Kiến thức HTML/CSS cơ bản
- Máy tính có kết nối internet
- Trình duyệt web hiện đại'
),
(
    '550e8400-e29b-41d4-a716-446655440021',
    'React Cơ Bản',
    'react-co-ban',
    'Học React từ cơ bản. Xây dựng ứng dụng web hiện đại với React.',
    (SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1),
    'intermediate',
    2400,
    0,
    TRUE,
    '/placeholder.svg?height=200&width=300',
    '# React Cơ Bản

Khóa học React toàn diện cho người mới bắt đầu.

## Bạn sẽ học được gì?

- React components và JSX
- State và Props
- Event handling trong React
- React Hooks (useState, useEffect)
- Routing với React Router
- State management

## Yêu cầu

- Kiến thức JavaScript cơ bản
- Hiểu về HTML/CSS
- Node.js đã được cài đặt'
);

-- Insert JavaScript lessons
INSERT INTO public.lessons (id, course_id, title, slug, content_mdx, order_index, duration_minutes, is_free, video_url) VALUES
(
    '550e8400-e29b-41d4-a716-446655440030',
    '550e8400-e29b-41d4-a716-446655440020',
    'Giới thiệu về JavaScript',
    'gioi-thieu-javascript',
    '# Giới thiệu về JavaScript

JavaScript là ngôn ngữ lập trình phổ biến nhất thế giới.

## JavaScript là gì?

JavaScript là ngôn ngữ lập trình được sử dụng để tạo ra các trang web tương tác. Ban đầu được phát triển để chạy trong trình duyệt, nhưng giờ đây JavaScript có thể chạy ở mọi nơi.

## Tại sao học JavaScript?

- **Phổ biến**: Được sử dụng bởi hầu hết các website
- **Linh hoạt**: Frontend, backend, mobile, desktop
- **Cộng đồng lớn**: Nhiều tài liệu và hỗ trợ
- **Cơ hội việc làm**: Nhu cầu cao trên thị trường

## Cài đặt môi trường

Bạn chỉ cần một trình duyệt web để bắt đầu học JavaScript!

```javascript
console.log("Hello, JavaScript!");
