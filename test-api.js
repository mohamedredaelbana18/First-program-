// اختبار API Routes
const testAPI = async () => {
  const baseURL = 'http://localhost:3000'
  
  console.log('🧪 بدء اختبار API Routes...')
  
  try {
    // اختبار 1: جلب العملاء
    console.log('\n1️⃣ اختبار جلب العملاء...')
    const getResponse = await fetch(`${baseURL}/api/customers`)
    console.log('GET /api/customers:', getResponse.status)
    
    if (getResponse.ok) {
      const customers = await getResponse.json()
      console.log('✅ عدد العملاء:', customers.length)
    } else {
      console.log('❌ فشل جلب العملاء')
    }
    
    // اختبار 2: إضافة عميل جديد
    console.log('\n2️⃣ اختبار إضافة عميل...')
    const postResponse = await fetch(`${baseURL}/api/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'أحمد محمد',
        phone: '01234567890',
        email: 'ahmed@example.com',
        address: 'القاهرة، مصر',
        notes: 'عميل تجريبي'
      }),
    })
    
    console.log('POST /api/customers:', postResponse.status)
    
    if (postResponse.ok) {
      const newCustomer = await postResponse.json()
      console.log('✅ تم إنشاء عميل جديد:', newCustomer.id)
      
      // اختبار 3: جلب العملاء مرة أخرى للتأكد
      console.log('\n3️⃣ التحقق من حفظ البيانات...')
      const verifyResponse = await fetch(`${baseURL}/api/customers`)
      if (verifyResponse.ok) {
        const updatedCustomers = await verifyResponse.json()
        console.log('✅ عدد العملاء بعد الإضافة:', updatedCustomers.length)
        
        // البحث عن العميل الجديد
        const foundCustomer = updatedCustomers.find(c => c.id === newCustomer.id)
        if (foundCustomer) {
          console.log('✅ العميل موجود في قاعدة البيانات:', foundCustomer.name)
        } else {
          console.log('❌ العميل غير موجود في قاعدة البيانات')
        }
      }
      
    } else {
      const error = await postResponse.json()
      console.log('❌ فشل إضافة العميل:', error.error)
    }
    
  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error.message)
  }
}

// تشغيل الاختبار
testAPI()