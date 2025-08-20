import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - تسديد قسط
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('💰 بدء تسديد القسط:', params.id)
    
    const body = await request.json()
    const { paidDate, safeId } = body

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

    // تحديد safeId مع fallback
    let finalSafeId: string | null = null
    
    if (safeId) {
      finalSafeId = safeId
    } else {
      // محاولة الحصول على DEFAULT_SAFE_ID من البيئة
      finalSafeId = process.env.DEFAULT_SAFE_ID || null
      
      // إذا لم يوجد، جلب من الإعدادات
      if (!finalSafeId) {
        const defaultSafeSetting = await prisma.setting.findUnique({
          where: { key: 'DEFAULT_SAFE_ID' }
        })
        finalSafeId = defaultSafeSetting?.value as string || null
      }
    }

    // التحقق من وجود الخزنة إذا كانت محددة
    if (finalSafeId) {
      const safe = await prisma.safe.findUnique({
        where: { id: finalSafeId }
      })

      if (!safe) {
        return NextResponse.json(
          { error: 'Safe not found' },
          { status: 400 }
        )
      }
    }

    // تنفيذ جميع العمليات في transaction واحدة
    const result = await prisma.$transaction(async (tx) => {
      // تحديث حالة القسط
      const updatedInstallment = await tx.installment.update({
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

      // إنشاء سند قبض تلقائي
      const voucher = await tx.voucher.create({
        data: {
          type: 'receipt',
          amount: installment.amount,
          description: `تسديد قسط - عقد ${installment.contract.code || installment.contractId}`,
          date: new Date(paidDate),
          payer: installment.contract.customer.name,
          linked_ref: params.id,
          safeId: finalSafeId
        }
      })

      // تحديث رصيد الخزنة إذا كانت محددة
      if (finalSafeId) {
        await tx.safe.update({
          where: { id: finalSafeId },
          data: {
            balance: {
              increment: installment.amount
            }
          }
        })
      }

      // تسجيل العملية في سجل الأنشطة
      await tx.auditLog.create({
        data: {
          description: `تم تسديد قسط بقيمة ${installment.amount.toLocaleString('ar-EG')} ج.م`,
          details: {
            installmentId: params.id,
            contractId: installment.contractId,
            customerId: installment.contract.customerId,
            amount: installment.amount,
            paidDate: new Date(paidDate),
            voucherId: voucher.id,
            safeId: finalSafeId
          }
        }
      })

      return { updatedInstallment, voucher }
    })

    console.log('✅ تم تسديد القسط بنجاح:', params.id)
    return NextResponse.json(result.updatedInstallment)
    
  } catch (error) {
    console.error('❌ خطأ في تسديد القسط:', error)
    
    // معالجة أخطاء Prisma المحددة
    if (error instanceof Error) {
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json(
          { error: 'Safe not found' },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        error: 'فشل في تسديد القسط',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    )
  }
}