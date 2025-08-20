import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - جلب جميع السندات
export async function GET() {
  try {
    const vouchers = await prisma.voucher.findMany({
      orderBy: { date: 'desc' },
      include: {
        safe: true
      }
    })

    return NextResponse.json(vouchers)
  } catch (error) {
    console.error('Error fetching vouchers:', error)
    return NextResponse.json(
      { error: 'فشل في جلب بيانات السندات' },
      { status: 500 }
    )
  }
}

// POST - إضافة سند جديد
export async function POST(request: NextRequest) {
  try {
    console.log('📄 بدء إضافة سند جديد...')
    
    const body = await request.json()
    console.log('📦 البيانات المستلمة:', body)
    
    const { 
      type, 
      amount, 
      description, 
      date, 
      payer, 
      beneficiary, 
      linked_ref, 
      safeId 
    } = body

    if (!type || !amount || !description) {
      return NextResponse.json(
        { error: 'بيانات السند غير مكتملة (النوع، المبلغ، الوصف مطلوبة)' },
        { status: 400 }
      )
    }

    console.log('🔄 إنشاء سند في قاعدة البيانات...')
    const voucher = await prisma.voucher.create({
      data: {
        type,
        amount: parseFloat(amount),
        description: description.trim(),
        date: new Date(date),
        payer: payer?.trim() || null,
        beneficiary: beneficiary?.trim() || null,
        linked_ref: linked_ref?.trim() || null,
        safeId: safeId?.trim() || null,
      }
    })

    // تحديث رصيد الخزنة إذا كانت محددة
    if (safeId) {
      const safe = await prisma.safe.findUnique({ where: { id: safeId } })
      if (safe) {
        const newBalance = type === 'receipt' 
          ? safe.balance + parseFloat(amount)
          : safe.balance - parseFloat(amount)

        await prisma.safe.update({
          where: { id: safeId },
          data: { balance: newBalance }
        })
      }
    }

    // تسجيل العملية في سجل الأنشطة
    await prisma.auditLog.create({
      data: {
        description: `تم إنشاء ${type === 'receipt' ? 'سند قبض' : 'سند صرف'} بقيمة ${parseFloat(amount).toLocaleString('ar-EG')} ج.م`,
        details: {
          voucherId: voucher.id,
          type,
          amount: parseFloat(amount),
          description,
          payer,
          beneficiary,
          linked_ref
        }
      }
    })

    console.log('✅ تم إنشاء السند بنجاح:', voucher.id)
    return NextResponse.json(voucher, { status: 201 })
  } catch (error) {
    console.error('❌ خطأ في إنشاء السند:', error)
    return NextResponse.json(
      { 
        error: 'فشل في إضافة السند',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    )
  }
}