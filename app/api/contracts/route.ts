import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - جلب جميع العقود
export async function GET() {
  try {
    const contracts = await prisma.contract.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
        unit: true,
        installmentsList: {
          orderBy: { dueDate: 'asc' }
        }
      }
    })

    return NextResponse.json(contracts)
  } catch (error) {
    console.error('Error fetching contracts:', error)
    return NextResponse.json(
      { error: 'فشل في جلب بيانات العقود' },
      { status: 500 }
    )
  }
}

// POST - إضافة عقد جديد
export async function POST(request: NextRequest) {
  try {
    console.log('📝 بدء إنشاء عقد جديد...')
    
    const body = await request.json()
    console.log('📦 البيانات المستلمة:', body)
    
    const { 
      code,
      customerId, 
      unitId, 
      totalPrice, 
      downPayment, 
      discountAmount,
      installments, 
      startDate, 
      endDate,
      brokerName,
      brokerAmount,
      commissionSafeId,
      status, 
      notes 
    } = body

    if (!customerId || !unitId || !totalPrice) {
      return NextResponse.json(
        { error: 'بيانات العقد غير مكتملة (العميل، الوحدة، السعر مطلوبة)' },
        { status: 400 }
      )
    }

    const totalPriceNum = parseFloat(totalPrice)
    const downPaymentNum = parseFloat(downPayment) || 0
    const discountNum = parseFloat(discountAmount) || 0
    const remaining = totalPriceNum - downPaymentNum - discountNum
    const installmentCount = parseInt(installments) || 0
    const installmentAmount = installmentCount > 0 ? remaining / installmentCount : 0

    console.log('🔄 إنشاء عقد في قاعدة البيانات...')
    const contract = await prisma.contract.create({
      data: {
        code: code?.trim() || `CON-${Date.now()}`,
        customerId,
        unitId,
        totalPrice: totalPriceNum,
        downPayment: downPaymentNum,
        remaining,
        discountAmount: discountNum,
        installments: installmentCount,
        installmentAmount,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        brokerName: brokerName?.trim() || null,
        brokerAmount: parseFloat(brokerAmount) || 0,
        commissionSafeId: commissionSafeId?.trim() || null,
        status: status || 'نشط',
        notes: notes?.trim() || null,
      },
      include: {
        customer: true,
        unit: true
      }
    })

    // إنشاء الأقساط تلقائياً إذا كان هناك مبلغ متبقي وعدد أقساط
    if (remaining > 0 && parseInt(installments) > 0) {
      const installmentAmount = remaining / parseInt(installments)
      const installmentsData = []

      for (let i = 1; i <= parseInt(installments); i++) {
        const dueDate = new Date(startDate)
        dueDate.setMonth(dueDate.getMonth() + i)

        installmentsData.push({
          contractId: contract.id,
          amount: installmentAmount,
          dueDate,
          status: 'مستحق',
          notes: `قسط رقم ${i} من ${installments}`
        })
      }

      // إنشاء جميع الأقساط دفعة واحدة للأداء الأفضل
      await prisma.installment.createMany({
        data: installmentsData
      })

      // تسجيل العملية في سجل الأنشطة
      await prisma.auditLog.create({
        data: {
          description: `تم توليد ${installments} قسط للعقد ${contract.id}`,
          details: {
            contractId: contract.id,
            customerId: contract.customerId,
            unitId: contract.unitId,
            installmentCount: parseInt(installments),
            installmentAmount,
            totalRemaining: remaining
          }
        }
      })
    }

    return NextResponse.json(contract, { status: 201 })
  } catch (error) {
    console.error('Error creating contract:', error)
    return NextResponse.json(
      { error: 'فشل في إنشاء العقد' },
      { status: 500 }
    )
  }
}