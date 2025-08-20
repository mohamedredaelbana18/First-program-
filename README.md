# First Program Enhanced

A comprehensive full-stack application built with Next.js 14, TypeScript, Prisma, and PostgreSQL. Features robust authentication, content management, task management, and social features.

## 🚀 Features

- **Authentication System**: Complete auth with NextAuth.js supporting credentials, Google, and GitHub
- **Content Management**: Create, edit, and manage posts with rich content
- **Task Management**: Organize tasks with projects, categories, and priorities
- **Social Features**: Follow users, like posts, comment, and engage with content
- **Robust Database**: PostgreSQL with Prisma ORM for data management
- **Modern UI**: Beautiful interface with Tailwind CSS and Radix UI components
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI, Lucide Icons
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd first-program-enhanced
npm install
```

### 2. Environment Setup

Copy the environment example and configure:

```bash
cp .env.example .env
```

Update `.env` with your values:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/first_program_db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Or run migrations (for production)
npm run db:migrate
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment

### Vercel Deployment

1. **Connect to Vercel**: Push your code to GitHub and connect to Vercel

2. **Database Setup**: 
   - Add Vercel Postgres addon to your project
   - Or use your own PostgreSQL database

3. **Environment Variables**: Set these in Vercel dashboard:
   ```
   DATABASE_URL (automatically provided by Vercel Postgres)
   NEXTAUTH_URL (your-app.vercel.app)
   NEXTAUTH_SECRET (generate a secure secret)
   GOOGLE_CLIENT_ID (optional)
   GOOGLE_CLIENT_SECRET (optional)
   GITHUB_CLIENT_ID (optional)
   GITHUB_CLIENT_SECRET (optional)
   ```

4. **Deploy**: Vercel will automatically deploy on git push

### Local Production Build

```bash
npm run build
npm start
```

## 📊 Database Schema

The application includes comprehensive database models:

- **Users**: Authentication and profile management
- **Posts**: Content creation and management
- **Comments**: Post engagement
- **Likes**: Social interactions
- **Tasks**: Personal task management
- **Projects**: Task organization
- **Categories**: Task categorization
- **Follow System**: Social connections
- **Tags**: Content organization

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
```

## 🎨 Customization

### UI Components

All UI components are located in `components/ui/` and built with Radix UI. You can customize:

- Colors and themes in `tailwind.config.ts`
- Component styles in individual component files
- Global styles in `app/globals.css`

### Database Schema

Modify `prisma/schema.prisma` and run:

```bash
npm run db:push  # For development
# or
npm run db:migrate  # For production
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT session management
- CSRF protection
- SQL injection prevention with Prisma
- Input validation and sanitization

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the [GitHub Issues](link-to-issues)
2. Review the documentation
3. Contact support

---

Built with ❤️ using Next.js and modern web technologies.