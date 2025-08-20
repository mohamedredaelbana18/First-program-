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

#### أ. إنشاء ملف البيئة:
```bash
cp .env.example .env.local
```

#### ب. إنشاء NEXTAUTH_SECRET تلقائياً:
```bash
npm run generate-secret
```

#### ج. تحديث متغيرات البيئة في `.env.local`:

```env
# Database - سيتم إعدادها تلقائياً على Vercel
DATABASE_URL="postgresql://username:password@localhost:5432/first_program_db"

# NextAuth.js - مطلوب
NEXTAUTH_SECRET="تم_إنشاؤها_تلقائياً_بواسطة_السكريبت"
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth (اختياري)
GITHUB_ID="احصل_عليها_من_GitHub_Developer_Settings"
GITHUB_SECRET="احصل_عليها_من_GitHub_Developer_Settings"

# Google OAuth (اختياري)
GOOGLE_CLIENT_ID="احصل_عليها_من_Google_Cloud_Console"
GOOGLE_CLIENT_SECRET="احصل_عليها_من_Google_Cloud_Console"
```

### 3. إعداد OAuth Providers (اختياري)

#### 🔧 GitHub OAuth:

1. اذهب إلى [GitHub Developer Settings](https://github.com/settings/developers)
2. اضغط "New OAuth App"
3. املأ البيانات:
   - **Application name**: اسم التطبيق
   - **Homepage URL**: `http://localhost:3000` (للتطوير) أو `https://your-app.vercel.app` (للإنتاج)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github` (للتطوير) أو `https://your-app.vercel.app/api/auth/callback/github` (للإنتاج)
4. انسخ `Client ID` و `Client Secret`
5. أضفهما إلى `.env.local`:
   ```env
   GITHUB_ID="your_github_client_id"
   GITHUB_SECRET="your_github_client_secret"
   ```

#### 🔧 Google OAuth:

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد أو اختر مشروع موجود
3. فعّل Google+ API:
   - اذهب إلى "APIs & Services" > "Library"
   - ابحث عن "Google+ API" وفعّله
4. أنشئ OAuth 2.0 credentials:
   - اذهب إلى "APIs & Services" > "Credentials"
   - اضغط "Create Credentials" > "OAuth 2.0 Client IDs"
   - اختر "Web application"
   - أضف Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (للتطوير)
     - `https://your-app.vercel.app/api/auth/callback/google` (للإنتاج)
5. انسخ `Client ID` و `Client Secret`
6. أضفهما إلى `.env.local`:
   ```env
   GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   ```

### 4. Database Setup

```bash
# إعداد سريع (ينشئ NEXTAUTH_SECRET ويهيئ قاعدة البيانات)
npm run setup

# أو يدوياً:
npm run db:generate  # إنشاء Prisma client
npm run db:push      # دفع schema إلى قاعدة البيانات
```

### 5. Run Development Server

```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح.

## 🌐 النشر على Vercel

### خطوات النشر التفصيلية:

#### 1. 🔗 ربط المشروع بـ Vercel
```bash
# ادفع الكود إلى GitHub أولاً
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اضغط "New Project"
3. اختر مستودع GitHub الخاص بك
4. اضغط "Import"

#### 2. 🗄️ إعداد قاعدة البيانات
1. في Vercel Dashboard، اذهب إلى مشروعك
2. اضغط على تبويب "Storage"
3. اضغط "Create Database" → "Postgres"
4. اختر اسم لقاعدة البيانات
5. سيتم إنشاء `DATABASE_URL` تلقائياً

#### 3. ⚙️ إعداد متغيرات البيئة

اذهب إلى **Settings** → **Environment Variables** وأضف:

**المتغيرات المطلوبة:**
```env
NEXTAUTH_SECRET=قيمة_مشفرة_عشوائية_32_حرف_أو_أكثر
NEXTAUTH_URL=https://your-project-name.vercel.app
```

**متغيرات OAuth (اختيارية):**
```env
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### 4. 🔐 إنشاء NEXTAUTH_SECRET للإنتاج

**الطريقة الأولى - استخدام openssl:**
```bash
openssl rand -base64 32
```

**الطريقة الثانية - استخدام Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**الطريقة الثالثة - استخدام السكريبت المدمج:**
```bash
npm run generate-secret
```
انسخ القيمة المُنشأة وضعها في Vercel Environment Variables.

#### 5. 🔄 تحديث OAuth URLs

**لـ GitHub:**
- اذهب إلى [GitHub Developer Settings](https://github.com/settings/developers)
- اختر تطبيقك
- حدث Authorization callback URL إلى:
  ```
  https://your-project-name.vercel.app/api/auth/callback/github
  ```

**لـ Google:**
- اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
- اختر مشروعك → APIs & Services → Credentials
- اختر OAuth 2.0 Client ID
- أضف Authorized redirect URI:
  ```
  https://your-project-name.vercel.app/api/auth/callback/google
  ```

#### 6. 🚀 إعادة النشر
1. في Vercel Dashboard، اذهب إلى تبويب "Deployments"
2. اضغط على النقاط الثلاث بجانب آخر deployment
3. اختر "Redeploy"
4. أو ادفع commit جديد إلى GitHub:
   ```bash
   git commit --allow-empty -m "Trigger Vercel redeploy"
   git push origin main
   ```

#### 7. ✅ اختبار النشر
1. افتح رابط التطبيق على Vercel
2. جرب تسجيل الدخول بالبريد الإلكتروني
3. جرب OAuth providers إذا قمت بإعدادها
4. تأكد من عمل قاعدة البيانات

### 🔧 إعدادات إضافية لـ Vercel

#### تحسين الأداء:
```json
// vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x",
      "maxDuration": 10
    }
  }
}
```

#### متغيرات البيئة للتطوير المحلي:
```bash
# تحميل متغيرات البيئة من Vercel
vercel env pull .env.local
```

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

## 🔧 الأوامر المتاحة

```bash
# تطوير وتشغيل
npm run dev              # تشغيل خادم التطوير
npm run build            # بناء المشروع للإنتاج
npm run start            # تشغيل خادم الإنتاج
npm run lint             # فحص الكود بـ ESLint

# قاعدة البيانات
npm run db:generate      # إنشاء Prisma client
npm run db:push          # دفع schema إلى قاعدة البيانات
npm run db:migrate       # تشغيل database migrations
npm run db:studio        # فتح Prisma Studio

# إعداد المشروع
npm run generate-secret  # إنشاء NEXTAUTH_SECRET جديد
npm run setup           # إعداد سريع (secret + database)
```

### 🚀 أوامر الإعداد السريع:

```bash
# للمشروع الجديد
npm install              # تثبيت الحزم
npm run setup           # إعداد المتغيرات وقاعدة البيانات
npm run dev             # تشغيل التطبيق

# لإعادة إنشاء NEXTAUTH_SECRET
npm run generate-secret

# للنشر على Vercel
npm run build           # اختبار البناء محلياً
vercel                  # نشر على Vercel
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