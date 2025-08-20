import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - جلب جميع الأقساط
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contractId = searchParams.get('contractId')
    const status = searchParams.get('status')

    const where: any = {}
    if (contractId) where.contractId = contractId
    if (status && status !== 'all') where.status = status

    const installments = await prisma.installment.findMany({
      where,
      orderBy: { dueDate: 'asc' },
      include: {
        contract: {
          include: {
            customer: true,
            unit: true
          }
        }
      }
    })

    return NextResponse.json(installments)
  } catch (error) {
    console.error('Error fetching installments:', error)
    return NextResponse.json(
      { error: 'فشل في جلب بيانات الأقساط' },
      { status: 500 }
    )
  }
}

// POST - إضافة قسط جديد أو توليد أقساط للعقد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // إذا كان طلب توليد أقساط للعقد
    if (body.action === 'generate' && body.contractId) {
      return await generateInstallmentsForContract(body.contractId, body.options)
    }
    
    // إضافة قسط واحد
    const { contractId, amount, dueDate, status, notes } = body

    if (!contractId || !amount || !dueDate) {
      return NextResponse.json(
        { error: 'بيانات القسط غير مكتملة' },
        { status: 400 }
      )
    }

    const installment = await prisma.installment.create({
      data: {
        contractId,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        status: status || 'مستحق',
        notes: notes?.trim() || null,
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

    return NextResponse.json(installment, { status: 201 })
  } catch (error) {
    console.error('Error creating installment:', error)
    return NextResponse.json(
      { error: 'فشل في إضافة القسط' },
      { status: 500 }
    )
  }
}

// دالة توليد الأقساط تلقائياً للعقد
async function generateInstallmentsForContract(contractId: string, options: any) {
  try {
    // جلب بيانات العقد
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        customer: true,
        unit: true,
        installmentsList: true
      }
    })

    if (!contract) {
      return NextResponse.json(
        { error: 'العقد غير موجود' },
        { status: 404 }
      )
    }

    // حذف الأقساط الموجودة إذا كان مطلوباً
    if (options.replaceExisting) {
      await prisma.installment.deleteMany({
        where: { contractId }
      })
    }

    // حساب الأقساط
    const { remaining, installments: installmentCount } = contract
    const { startDate, frequency = 'monthly' } = options

    if (remaining <= 0 || installmentCount <= 0) {
      return NextResponse.json(
        { error: 'لا يوجد مبلغ متبقي أو عدد أقساط صحيح' },
        { status: 400 }
      )
    }

    const installmentAmount = remaining / installmentCount
    const installmentsToCreate = []

    // توليد الأقساط
    for (let i = 1; i <= installmentCount; i++) {
      const dueDate = new Date(startDate || contract.startDate)
      
      // حساب تاريخ الاستحقاق حسب التكرار
      switch (frequency) {
        case 'monthly':
          dueDate.setMonth(dueDate.getMonth() + i)
          break
        case 'quarterly':
          dueDate.setMonth(dueDate.getMonth() + (i * 3))
          break
        case 'yearly':
          dueDate.setFullYear(dueDate.getFullYear() + i)
          break
        case 'weekly':
          dueDate.setDate(dueDate.getDate() + (i * 7))
          break
        default:
          dueDate.setMonth(dueDate.getMonth() + i)
      }

      installmentsToCreate.push({
        contractId,
        amount: installmentAmount,
        dueDate,
        status: 'مستحق',
        notes: `قسط رقم ${i} من ${installmentCount}`
      })
    }

    // إنشاء الأقساط في قاعدة البيانات
    const createdInstallments = await prisma.installment.createMany({
      data: installmentsToCreate
    })

    // جلب الأقساط المُنشأة مع العلاقات
    const installments = await prisma.installment.findMany({
      where: { contractId },
      orderBy: { dueDate: 'asc' },
      include: {
        contract: {
          include: {
            customer: true,
            unit: true
          }
        }
      }
    })

    return NextResponse.json({
      message: `تم توليد ${createdInstallments.count} قسط بنجاح`,
      installments
    }, { status: 201 })

  } catch (error) {
    console.error('Error generating installments:', error)
    return NextResponse.json(
      { error: 'فشل في توليد الأقساط' },
      { status: 500 }
    )
  }
}