# Educational Platform - Web Development Learning

A comprehensive, production-ready educational platform built with Next.js 14+ and Supabase for teaching web development courses and learning paths.

## 🚀 Features

### Core Functionality
- **Multi-role System**: Guest, Student, Author, and Admin roles with granular permissions
- **Course Management**: Create, edit, and manage courses with lessons, quizzes, and progress tracking
- **Learning Paths**: Structured roadmaps guiding students through their learning journey
- **Progress Tracking**: Real-time progress monitoring and completion certificates
- **Technical Blog**: Educational content and tutorials
- **Search & Filtering**: Advanced course discovery and content search

### Security & Performance
- **Enterprise Security**: 2FA, CSRF protection, XSS prevention, CSP headers
- **Row Level Security**: Comprehensive RLS policies for data protection
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Zod schemas for all user inputs
- **Audit Logging**: Complete activity tracking for compliance

### Technical Stack
- **Frontend**: Next.js 14+, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Testing**: Jest (unit), Playwright (e2e)
- **Security**: Comprehensive security headers and validation

## 🛠 Installation

### Prerequisites
- Node.js 18+ 
- Supabase account
- Git

### Setup Steps

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd learning-platform
   npm install
   \`\`\`

2. **Configure Supabase**
   - Create a new Supabase project
   - Run the SQL scripts in `/scripts` folder in order:
     \`\`\`sql
     -- Execute in Supabase SQL Editor
     001_create_schema.sql
     002_create_functions.sql  
     003_enable_rls.sql
     004_seed_data.sql
     \`\`\`

3. **Environment Variables**
   \`\`\`bash
   # Copy and configure environment variables
   cp .env.example .env.local
   \`\`\`
   
   Required variables:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
   \`\`\`

4. **Run Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

## 📚 Usage

### User Roles

**Guest Users**
- Browse public courses and blog posts
- View course previews and instructor profiles
- Access free content and lessons

**Students** 
- Enroll in courses and track progress
- Complete lessons, quizzes, and assignments
- Access learning paths and roadmaps
- Manage personal learning dashboard

**Authors**
- Create and manage courses
- Upload lessons, videos, and materials
- Track student engagement and progress
- Manage course pricing and access

**Administrators**
- Full platform management
- User role management
- Content moderation and approval
- System analytics and reporting
- Security and audit log access

### Key Features

**Course Creation**
- Rich markdown content with MDX support
- Video lesson integration
- Interactive quizzes and assessments
- Progress tracking and completion certificates

**Learning Experience**
- Structured lesson navigation
- Progress visualization
- Interactive content and code examples
- Community features and discussions

**Admin Dashboard**
- User management and role assignment
- Course approval and content moderation
- System analytics and performance metrics
- Security monitoring and audit logs

## 🧪 Testing

### Unit Tests
\`\`\`bash
npm run test
npm run test:watch
npm run test:coverage
\`\`\`

### E2E Tests
\`\`\`bash
npm run test:e2e
npm run test:e2e:ui
\`\`\`

### Test Coverage
- Authentication flows
- Course enrollment and progress
- Admin management functions
- Security validation
- API endpoints

## 🔒 Security

### Implemented Security Measures

**Authentication & Authorization**
- Supabase Auth with email/password
- Role-based access control (RBAC)
- Session management with secure cookies
- Password strength requirements

**Data Protection**
- Row Level Security (RLS) on all tables
- Input validation with Zod schemas
- SQL injection prevention
- XSS protection with CSP headers

**API Security**
- Rate limiting on all endpoints
- CSRF protection
- Request validation and sanitization
- Audit logging for all actions

**Infrastructure Security**
- Security headers (CSP, HSTS, etc.)
- Environment variable protection
- Secure file upload handling
- Database connection security

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Course Management
- `GET /api/courses` - List courses
- `POST /api/courses` - Create course (Author+)
- `PUT /api/courses/[id]` - Update course (Author+)
- `DELETE /api/courses/[id]` - Delete course (Admin)

### User Management
- `GET /api/users` - List users (Admin)
- `PUT /api/users/[id]` - Update user (Admin)
- `DELETE /api/users/[id]` - Delete user (Admin)

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Configuration
\`\`\`bash
# Production environment variables
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation for API changes
- Follow the established code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation and FAQ
- Contact the development team

## 🔄 Changelog

### v1.0.0 (Current)
- Initial release with core functionality
- Complete authentication system
- Course management and learning interface
- Admin dashboard and user management
- Comprehensive security implementation
- Full test coverage
