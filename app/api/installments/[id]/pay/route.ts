import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - تسديد قسط
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('💰 بدء تسديد القسط:', params.id)
    
    const { paidDate } = await request.json()

    // التحقق من وجود القسط
    const installment = await prisma.installment.findUnique({
      where: { id: params.id },
      include: {
        contract: {
          include: {
            customer: true,
            unit: true
          }
        }
      }
    })

    if (!installment) {
      return NextResponse.json(
        { error: 'القسط غير موجود' },
        { status: 404 }
      )
    }

    if (installment.status === 'مدفوع') {
      return NextResponse.json(
        { error: 'القسط مدفوع بالفعل' },
        { status: 400 }
      )
    }

    // تحديث حالة القسط
    const updatedInstallment = await prisma.installment.update({
      where: { id: params.id },
      data: {
        status: 'مدفوع',
        paidDate: new Date(paidDate)
      },
      include: {
        contract: {
          include: {
            customer: true,
            unit: true
          }
        }
      }
    })

    // تسجيل العملية في سجل الأنشطة
    await prisma.auditLog.create({
      data: {
        description: `تم تسديد قسط بقيمة ${installment.amount.toLocaleString('ar-EG')} ج.م`,
        details: {
          installmentId: params.id,
          contractId: installment.contractId,
          customerId: installment.contract.customerId,
          amount: installment.amount,
          paidDate: new Date(paidDate)
        }
      }
    })

    // إنشاء سند قبض تلقائي
    await prisma.voucher.create({
      data: {
        type: 'receipt',
        amount: installment.amount,
        description: `تسديد قسط - عقد ${installment.contract.code || installment.contractId}`,
        date: new Date(paidDate),
        payer: installment.contract.customer.name,
        linked_ref: params.id,
        safeId: 'S-main' // الخزنة الرئيسية - يمكن تخصيصها لاحقاً
      }
    })

    console.log('✅ تم تسديد القسط بنجاح:', params.id)
    return NextResponse.json(updatedInstallment)
  } catch (error) {
    console.error('❌ خطأ في تسديد القسط:', error)
    return NextResponse.json(
      { 
        error: 'فشل في تسديد القسط',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    )
  }
}