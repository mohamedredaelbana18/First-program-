import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - جلب عميل واحد
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: params.id },
      include: {
        contracts: {
          include: {
            unit: true,
            installmentsList: true
          }
        }
      }
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'العميل غير موجود' },
        { status: 404 }
      )
    }

    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error fetching customer:', error)
    return NextResponse.json(
      { error: 'فشل في جلب بيانات العميل' },
      { status: 500 }
    )
  }
}

// PUT - تحديث عميل
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, phone, email, address, notes } = await request.json()

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'اسم العميل مطلوب' },
        { status: 400 }
      )
    }

    const customer = await prisma.customer.update({
      where: { id: params.id },
      data: {
        name: name.trim(),
        phone: phone?.trim() || null,
        email: email?.trim() || null,
        address: address?.trim() || null,
        notes: notes?.trim() || null,
      }
    })

    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json(
      { error: 'فشل في تحديث العميل' },
      { status: 500 }
    )
  }
}

// DELETE - حذف عميل
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // التحقق من وجود عقود مرتبطة بالعميل
    const contractsCount = await prisma.contract.count({
      where: { customerId: params.id }
    })

    if (contractsCount > 0) {
      return NextResponse.json(
        { error: `لا يمكن حذف العميل لأنه مرتبط بـ ${contractsCount} عقد` },
        { status: 400 }
      )
    }

    await prisma.customer.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'تم حذف العميل بنجاح' })
  } catch (error) {
    console.error('Error deleting customer:', error)
    return NextResponse.json(
      { error: 'فشل في حذف العميل' },
      { status: 500 }
    )
  }
}