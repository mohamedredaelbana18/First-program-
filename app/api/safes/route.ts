import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - جلب جميع الخزائن
export async function GET() {
  try {
    const safes = await prisma.safe.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        transfersFrom: {
          include: {
            toSafe: true
          },
          orderBy: { date: 'desc' },
          take: 5
        },
        transfersTo: {
          include: {
            fromSafe: true
          },
          orderBy: { date: 'desc' },
          take: 5
        }
      }
    })

    return NextResponse.json(safes)
  } catch (error) {
    console.error('Error fetching safes:', error)
    return NextResponse.json(
      { error: 'فشل في جلب بيانات الخزائن' },
      { status: 500 }
    )
  }
}

// POST - إضافة خزنة جديدة
export async function POST(request: NextRequest) {
  try {
    const { name, currency, notes } = await request.json()

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'اسم الخزنة مطلوب' },
        { status: 400 }
      )
    }

    const safe = await prisma.safe.create({
      data: {
        name: name.trim(),
        balance: 0,
        currency: currency || 'EGP',
        notes: notes?.trim() || null,
      }
    })

    return NextResponse.json(safe, { status: 201 })
  } catch (error) {
    console.error('Error creating safe:', error)
    return NextResponse.json(
      { error: 'فشل في إضافة الخزنة' },
      { status: 500 }
    )
  }
}