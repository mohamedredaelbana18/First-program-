const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function ensureMainSafe() {
  try {
    console.log('🔍 التحقق من وجود الخزنة الرئيسية...');
    
    // البحث عن الخزنة الرئيسية
    let mainSafe = await prisma.safe.findUnique({
      where: { id: 'S-main' }
    });
    
    if (!mainSafe) {
      console.log('🏗️ إنشاء الخزنة الرئيسية...');
      mainSafe = await prisma.safe.create({
        data: {
          id: 'S-main',
          name: 'الخزنة الرئيسية',
          balance: 0,
          currency: 'EGP',
          notes: 'الخزنة الافتراضية للنظام'
        }
      });
      console.log('✅ تم إنشاء الخزنة الرئيسية:', mainSafe.id);
    } else {
      console.log('✅ الخزنة الرئيسية موجودة:', mainSafe.name);
      console.log('📊 الرصيد الحالي:', mainSafe.balance.toLocaleString('ar-EG'), mainSafe.currency);
    }
    
    // إنشاء إعداد DEFAULT_SAFE_ID
    await prisma.setting.upsert({
      where: { key: 'DEFAULT_SAFE_ID' },
      update: { value: 'S-main' },
      create: {
        key: 'DEFAULT_SAFE_ID',
        value: 'S-main',
        type: 'string'
      }
    });
    
    console.log('✅ تم تعيين الخزنة الافتراضية في الإعدادات');
    console.log('🎉 النظام جاهز للعمل!');
    
  } catch (error) {
    console.error('❌ خطأ في إعداد الخزنة:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

ensureMainSafe();