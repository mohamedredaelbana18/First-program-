import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - جلب جميع العملاء
export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        contracts: {
          include: {
            unit: true
          }
        }
      }
    })

    return NextResponse.json(customers)
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'فشل في جلب بيانات العملاء' },
      { status: 500 }
    )
  }
}

// POST - إضافة عميل جديد
export async function POST(request: NextRequest) {
  try {
    console.log('📝 بدء إضافة عميل جديد...')
    
    const body = await request.json()
    console.log('📦 البيانات المستلمة:', body)
    
    const { name, phone, email, address, notes } = body

    if (!name || !name.trim()) {
      console.log('❌ اسم العميل مفقود')
      return NextResponse.json(
        { error: 'اسم العميل مطلوب' },
        { status: 400 }
      )
    }

    console.log('🔄 إنشاء عميل في قاعدة البيانات...')
    const customer = await prisma.customer.create({
      data: {
        name: name.trim(),
        phone: phone?.trim() || null,
        email: email?.trim() || null,
        address: address?.trim() || null,
        notes: notes?.trim() || null,
      }
    })

    console.log('✅ تم إنشاء العميل بنجاح:', customer.id)
    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('❌ خطأ في إنشاء العميل:', error)
    return NextResponse.json(
      { 
        error: 'فشل في إضافة العميل',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    )
  }
}