-- Insert sample courses (only if no courses exist)
INSERT INTO public.courses (title, slug, description, content_mdx, instructor_id, thumbnail_url, level, duration_minutes, is_published)
SELECT 
  'HTML & CSS Cơ Bản',
  'html-css-co-ban',
  'Học HTML và CSS từ cơ bản đến nâng cao',
  '# HTML & CSS Cơ Bản

Khóa học này sẽ giúp bạn nắm vững HTML và CSS từ cơ bản.

## Nội dung khóa học
- HTML cơ bản
- CSS styling
- Responsive design
- Flexbox và Grid',
  (SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1),
  '/placeholder.svg?height=200&width=300',
  'beginner',
  180,
  true
WHERE NOT EXISTS (SELECT 1 FROM public.courses);

INSERT INTO public.courses (title, slug, description, content_mdx, instructor_id, thumbnail_url, level, duration_minutes, is_published)
SELECT 
  'JavaScript Nâng Cao',
  'javascript-nang-cao',
  'Nắm vững JavaScript ES6+ và các khái niệm nâng cao',
  '# JavaScript Nâng Cao

Khóa học JavaScript từ cơ bản đến nâng cao.

## Nội dung khóa học
- ES6+ features
- Async/Await
- DOM manipulation
- API integration',
  (SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1),
  '/placeholder.svg?height=200&width=300',
  'intermediate',
  240,
  true
WHERE NOT EXISTS (SELECT 1 FROM public.courses WHERE slug = 'javascript-nang-cao');

INSERT INTO public.courses (title, slug, description, content_mdx, instructor_id, thumbnail_url, level, duration_minutes, is_published)
SELECT 
  'React & Next.js',
  'react-nextjs',
  'Xây dựng ứng dụng web hiện đại với React và Next.js',
  '# React & Next.js

Học cách xây dựng ứng dụng web với React và Next.js.

## Nội dung khóa học
- React components
- State management
- Next.js routing
- Server-side rendering',
  (SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1),
  '/placeholder.svg?height=200&width=300',
  'advanced',
  300,
  true
WHERE NOT EXISTS (SELECT 1 FROM public.courses WHERE slug = 'react-nextjs');
