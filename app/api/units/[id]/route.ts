import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// DELETE - حذف وحدة
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // التحقق من وجود عقود مرتبطة بالوحدة
    const contractsCount = await prisma.contract.count({
      where: { unitId: params.id }
    })

    if (contractsCount > 0) {
      return NextResponse.json(
        { error: `لا يمكن حذف الوحدة لأنها مرتبطة بـ ${contractsCount} عقد` },
        { status: 400 }
      )
    }

    // حذف شراكات الوحدة أولاً
    await prisma.unitPartner.deleteMany({
      where: { unitId: params.id }
    })

    // حذف الوحدة
    await prisma.unit.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'تم حذف الوحدة بنجاح' })
  } catch (error) {
    console.error('Error deleting unit:', error)
    return NextResponse.json(
      { error: 'فشل في حذف الوحدة' },
      { status: 500 }
    )
  }
}