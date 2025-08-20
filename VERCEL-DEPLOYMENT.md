# 🚀 دليل النشر السريع على Vercel

## ✅ قائمة المراجعة السريعة

### قبل النشر:
- [ ] الكود موجود على GitHub
- [ ] ملف `.env.example` محدث
- [ ] تم اختبار التطبيق محلياً

### خطوات النشر:

#### 1. 🔗 ربط المشروع
```bash
# ادفع الكود
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 2. 🌐 إنشاء مشروع على Vercel
1. [Vercel Dashboard](https://vercel.com/dashboard) → "New Project"
2. اختر GitHub repository
3. اضغط "Import"

#### 3. 🗄️ إعداد قاعدة البيانات
1. في مشروع Vercel → "Storage" → "Create Database"
2. اختر "Postgres"
3. `DATABASE_URL` سيتم إنشاؤها تلقائياً

#### 4. ⚙️ إعداد متغيرات البيئة
في Settings → Environment Variables:

```env
# مطلوب
NEXTAUTH_SECRET=ضع_قيمة_آمنة_32_حرف
NEXTAUTH_URL=https://your-project.vercel.app

# اختياري - GitHub OAuth
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# اختياري - Google OAuth  
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### 5. 🔐 إنشاء NEXTAUTH_SECRET
```bash
# الطريقة الأولى
openssl rand -base64 32

# الطريقة الثانية  
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# الطريقة الثالثة
npm run generate-secret
```

#### 6. 🔄 تحديث OAuth Callbacks

**GitHub:**
- [GitHub Settings](https://github.com/settings/developers) → OAuth Apps
- Authorization callback URL: `https://your-project.vercel.app/api/auth/callback/github`

**Google:**
- [Google Console](https://console.cloud.google.com/) → APIs & Services → Credentials
- Authorized redirect URI: `https://your-project.vercel.app/api/auth/callback/google`

#### 7. 🚀 إعادة النشر
```bash
# الطريقة الأولى - من Vercel Dashboard
# Deployments → ... → Redeploy

# الطريقة الثانية - دفع commit جديد
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

## 🔧 إعدادات متقدمة

### تحسين الأداء:
```json
// vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 10
    }
  },
  "regions": ["iad1"]
}
```

### متغيرات البيئة للتطوير:
```bash
# تحميل من Vercel
vercel env pull .env.local
```

## 🐛 حل المشاكل الشائعة

### خطأ في NEXTAUTH_SECRET:
```bash
# تأكد من وجود المتغير في Vercel
# يجب أن يكون 32 حرف على الأقل
```

### خطأ في قاعدة البيانات:
```bash
# تأكد من إضافة Vercel Postgres
# DATABASE_URL يجب أن تكون موجودة تلقائياً
```

### خطأ في OAuth:
```bash
# تأكد من Callback URLs
# يجب أن تطابق رابط Vercel تماماً
```

## 📞 الدعم

إذا واجهت مشاكل:
1. تحقق من Vercel Function logs
2. راجع متغيرات البيئة
3. تأكد من OAuth settings
4. جرب إعادة النشر

---

✅ **البرنامج جاهز للعمل على Vercel بدون مشاكل!**