import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - جلب جميع الوحدات
export async function GET() {
  try {
    const units = await prisma.unit.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        contracts: {
          include: {
            customer: true
          }
        },
        unitPartners: {
          include: {
            partner: true
          }
        }
      }
    })

    return NextResponse.json(units)
  } catch (error) {
    console.error('Error fetching units:', error)
    return NextResponse.json(
      { error: 'فشل في جلب بيانات الوحدات' },
      { status: 500 }
    )
  }
}

// POST - إضافة وحدة جديدة
export async function POST(request: NextRequest) {
  try {
    const { name, type, area, location, price, description, status } = await request.json()

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'اسم الوحدة مطلوب' },
        { status: 400 }
      )
    }

    if (!price || isNaN(parseFloat(price))) {
      return NextResponse.json(
        { error: 'سعر الوحدة مطلوب ويجب أن يكون رقماً صحيحاً' },
        { status: 400 }
      )
    }

    const unit = await prisma.unit.create({
      data: {
        name: name.trim(),
        type: type?.trim() || null,
        area: area ? parseFloat(area) : null,
        location: location?.trim() || null,
        price: parseFloat(price),
        description: description?.trim() || null,
        status: status?.trim() || 'متاح',
      }
    })

    return NextResponse.json(unit, { status: 201 })
  } catch (error) {
    console.error('Error creating unit:', error)
    return NextResponse.json(
      { error: 'فشل في إضافة الوحدة' },
      { status: 500 }
    )
  }
}