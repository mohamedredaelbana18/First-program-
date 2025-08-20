#!/usr/bin/env node

/**
 * مولد NEXTAUTH_SECRET
 * يستخدم crypto.randomBytes لإنشاء secret آمن
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function generateSecret() {
  // إنشاء 32 بايت عشوائي وتحويله إلى base64
  const secret = crypto.randomBytes(32).toString('base64');
  return secret;
}

function updateEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  const secret = generateSecret();
  
  let envContent = '';
  
  // قراءة الملف الحالي إذا كان موجوداً
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // التحقق من وجود NEXTAUTH_SECRET
  if (envContent.includes('NEXTAUTH_SECRET=')) {
    console.log('✅ NEXTAUTH_SECRET موجود بالفعل في .env.local');
    return;
  }
  
  // إضافة NEXTAUTH_SECRET
  const secretLine = `NEXTAUTH_SECRET="${secret}"\n`;
  
  if (envContent && !envContent.endsWith('\n')) {
    envContent += '\n';
  }
  
  envContent += secretLine;
  
  // كتابة الملف
  fs.writeFileSync(envPath, envContent);
  
  console.log('🔐 تم إنشاء NEXTAUTH_SECRET جديد في .env.local');
  console.log('📄 Secret:', secret);
  console.log('');
  console.log('⚠️  احتفظ بهذا السر آمناً ولا تشاركه مع أحد!');
  console.log('📋 لنسخ السر للحافظة، استخدم:');
  console.log(`echo "${secret}" | pbcopy`);
}

// تشغيل المولد
if (require.main === module) {
  console.log('🚀 بدء إنشاء NEXTAUTH_SECRET...');
  updateEnvFile();
}

module.exports = { generateSecret };