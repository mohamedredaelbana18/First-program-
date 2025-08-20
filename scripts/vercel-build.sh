#!/bin/bash

# Vercel Build Script
# يتم تشغيله تلقائياً أثناء البناء على Vercel

echo "🚀 بدء عملية البناء على Vercel..."

# تثبيت الحزم
echo "📦 تثبيت الحزم..."
npm install

# إنشاء Prisma Client
echo "🔧 إنشاء Prisma Client..."
npx prisma generate

# بناء التطبيق
echo "🏗️ بناء التطبيق..."
npm run build

echo "✅ تم الانتهاء من البناء بنجاح!"