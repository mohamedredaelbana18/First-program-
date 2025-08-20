# 🏛️ مدير الاستثمار العقاري - النسخة النهائية

نظام إدارة شامل للاستثمار العقاري مبني بـ Next.js 14 + TypeScript + PostgreSQL + Prisma

## 🚀 المميزات

### 🏗️ **إدارة الوحدات العقارية**
- إضافة وإدارة الوحدات (شقق، فيلل، محلات، مكاتب)
- تتبع الأسعار والمساحات والمواقع
- حالات الوحدات (متاح، محجوز، مباع، تحت الصيانة)

### 👥 **إدارة العملاء**
- قاعدة بيانات شاملة للعملاء
- بيانات الاتصال والعناوين
- ربط العملاء بالعقود

### 📄 **إدارة العقود والأقساط**
- إنشاء عقود مفصلة
- حساب الأقساط تلقائياً
- متابعة المدفوعات والمستحقات
- حالات العقود (نشط، مكتمل، متوقف)

### 🤝 **إدارة الشركاء**
- إدارة الشركاء ونسب الشراكة
- مجموعات الشركاء
- ربط الشركاء بالوحدات العقارية

### 💰 **إدارة الخزائن**
- عدة خزائن مالية
- تحويلات بين الخزائن
- إيداع وسحب مع تتبع كامل
- أرصدة بعملات مختلفة

### 👨‍💼 **إدارة الوسطاء**
- قاعدة بيانات الوسطاء
- حساب العمولات
- متابعة المستحقات والمدفوعات

### 📊 **التقارير والإحصائيات**
- تقارير مالية مفصلة
- إحصائيات شاملة
- فلاتر تاريخ متقدمة
- تصدير PDF وExcel

## 🛠 التقنيات المستخدمة

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI, Lucide Icons
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL مع Prisma ORM
- **Deployment**: Vercel

## 📋 المتطلبات

- Node.js 18+
- PostgreSQL database (Neon، Render، أو Vercel Postgres)
- npm أو yarn

## 🚀 التشغيل السريع

### 1. تثبيت الحزم
```bash
npm install
```

### 2. إعداد قاعدة البيانات
```bash
# انسخ ملف البيئة
cp .env.example .env

# أدخل DATABASE_URL في .env
# DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# تطبيق المخطط
npm run db:push
```

### 3. تشغيل التطبيق
```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح.

## 🌐 النشر على Vercel

### 1. إعداد قاعدة البيانات
احصل على DATABASE_URL من:
- **Neon** (مُوصى به): [neon.tech](https://neon.tech)
- **Render**: [render.com](https://render.com)
- **Vercel Postgres**: من Vercel Dashboard

### 2. النشر
1. ارفع الكود إلى GitHub
2. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
3. **New Project** → Import من GitHub
4. أضف `DATABASE_URL` في Environment Variables
5. **Deploy**

## 🗄️ مخطط قاعدة البيانات

### الكيانات الرئيسية:
- **customers** - العملاء
- **units** - الوحدات العقارية
- **contracts** - العقود
- **installments** - الأقساط
- **partners** - الشركاء
- **unit_partners** - شراكات الوحدات
- **partner_debts** - ديون الشركاء
- **safes** - الخزائن
- **transfers** - التحويلات المالية
- **vouchers** - السندات
- **brokers** - الوسطاء
- **broker_dues** - مستحقات الوسطاء
- **partner_groups** - مجموعات الشركاء
- **audit_log** - سجل العمليات
- **settings** - الإعدادات

### العلاقات:
- عميل ← عقود (واحد لمتعدد)
- وحدة ← عقود (واحد لمتعدد)
- عقد ← أقساط (واحد لمتعدد)
- شريك ↔ وحدات (متعدد لمتعدد)
- خزنة ← تحويلات (واحد لمتعدد)

## 🔧 الأوامر المتاحة

```bash
# التطوير
npm run dev              # تشغيل خادم التطوير
npm run build           # بناء للإنتاج (مع migration)
npm run build:local     # بناء محلي (بدون migration)
npm run start           # تشغيل الإنتاج

# قاعدة البيانات
npm run db:generate     # إنشاء Prisma client
npm run db:push         # دفع المخطط (تطوير)
npm run db:migrate      # إنشاء migration (تطوير)
npm run db:studio       # فتح Prisma Studio

# أدوات
npm run generate-secret # إنشاء NEXTAUTH_SECRET
npm run setup          # إعداد سريع
```

## 🎨 التخصيص

### الألوان والتصميم
- الألوان في `tailwind.config.ts`
- المكونات في `components/ui/`
- الأنماط العامة في `app/globals.css`

### قاعدة البيانات
- المخطط في `prisma/schema.prisma`
- بعد التعديل: `npm run db:push`

## 🔒 الأمان

- التحقق من صحة البيانات مع Zod
- حماية من SQL Injection مع Prisma
- التحقق من المدخلات في API Routes

## 📱 التصميم المتجاوب

التطبيق محسن للعمل على:
- سطح المكتب (1024px+)
- الأجهزة اللوحية (768px - 1023px)
- الهواتف الذكية (320px - 767px)

## 🆘 الدعم

للمساعدة:
1. راجع الـ GitHub Issues
2. تحقق من Vercel Function Logs
3. راجع Prisma Studio للبيانات

---

**🏗️ مبني بحب باستخدام Next.js والتقنيات الحديثة**