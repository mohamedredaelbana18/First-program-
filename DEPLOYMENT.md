# 🚀 دليل النشر - مدير الاستثمار العقاري

## 📋 المتطلبات للنشر

### 1. **حساب Vercel**
- اذهب إلى [vercel.com](https://vercel.com)
- سجل حساب جديد أو سجل دخول

### 2. **قاعدة البيانات PostgreSQL**
- احصل على رابط قاعدة البيانات من:
  - **Neon** (مُوصى به): [neon.tech](https://neon.tech)
  - **Render**: [render.com](https://render.com)
  - **Vercel Postgres**: من Vercel Dashboard

## 🚀 خطوات النشر

### الخطوة 1: ربط المشروع بـ Vercel
1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اضغط **"New Project"**
3. اختر **"Import Git Repository"**
4. اختر مستودع GitHub الخاص بك: `mohamedredaelbana18/First-program-`

### الخطوة 2: إعداد متغيرات البيئة
في صفحة إعدادات المشروع، أضف المتغيرات التالية:

```env
DATABASE_URL=postgresql://username:password@host:port/database
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-domain.vercel.app
```

### الخطوة 3: إعداد قاعدة البيانات
1. في Vercel Dashboard، اذهب إلى **"Storage"**
2. اختر **"Connect Database"**
3. اختر **"PostgreSQL"**
4. اتبع الخطوات لإنشاء قاعدة البيانات

### الخطوة 4: النشر
1. اضغط **"Deploy"**
2. انتظر حتى يكتمل البناء
3. احصل على رابط التطبيق

## 🔧 إعدادات إضافية

### إعداد Prisma
```bash
# في Vercel Dashboard > Functions
npx prisma generate
npx prisma db push
```

### إعداد النطاق المخصص (اختياري)
1. في إعدادات المشروع
2. اذهب إلى **"Domains"**
3. أضف نطاقك المخصص

## 📱 الوصول للتطبيق

بعد النشر، يمكنك الوصول للتطبيق عبر:
- **الرابط التلقائي**: `https://your-project.vercel.app`
- **النطاق المخصص** (إذا أضفته)

## 🛠️ استكشاف الأخطاء

### مشاكل شائعة:
1. **خطأ في قاعدة البيانات**: تأكد من صحة `DATABASE_URL`
2. **خطأ في البناء**: تحقق من سجلات البناء في Vercel
3. **خطأ في API**: تحقق من متغيرات البيئة

### للحصول على المساعدة:
- تحقق من سجلات Vercel
- راجع ملف `package.json` للتأكد من التبعيات
- تأكد من صحة إعدادات Prisma

## 🎉 النشر مكتمل!

بعد اتباع هذه الخطوات، سيكون تطبيقك متاحاً على الإنترنت!