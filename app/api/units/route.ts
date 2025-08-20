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
    console.log('🏗️ بدء إضافة وحدة جديدة...')
    
    const body = await request.json()
    console.log('📦 البيانات المستلمة:', body)
    
    const { name, code, type, unitType, area, floor, building, location, price, totalPrice, description, status, notes } = body

    if (!name || !name.trim()) {
      console.log('❌ اسم الوحدة مفقود')
      return NextResponse.json(
        { error: 'اسم الوحدة مطلوب' },
        { status: 400 }
      )
    }

    if (!price || isNaN(parseFloat(price))) {
      console.log('❌ سعر الوحدة غير صحيح:', price)
      return NextResponse.json(
        { error: 'سعر الوحدة مطلوب ويجب أن يكون رقماً صحيحاً' },
        { status: 400 }
      )
    }

    console.log('🔄 إنشاء وحدة في قاعدة البيانات...')
    const unit = await prisma.unit.create({
      data: {
        name: name.trim(),
        code: code?.trim() || null,
        type: type?.trim() || null,
        unitType: unitType?.trim() || 'سكني',
        area: area?.trim() || null,
        floor: floor?.trim() || null,
        building: building?.trim() || null,
        location: location?.trim() || null,
        price: parseFloat(price),
        totalPrice: totalPrice ? parseFloat(totalPrice) : parseFloat(price),
        description: description?.trim() || null,
        status: status?.trim() || 'متاح',
        notes: notes?.trim() || null,
      }
    })

    console.log('✅ تم إنشاء الوحدة بنجاح:', unit.id)
    return NextResponse.json(unit, { status: 201 })
  } catch (error) {
    console.error('❌ خطأ في إنشاء الوحدة:', error)
    return NextResponse.json(
      { 
        error: 'فشل في إضافة الوحدة',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    )
  }
}