'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/layout'
import { InstallmentsAccordion } from '@/components/installments-accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Calendar, Search, Filter, Download, Plus, Loader2 } from 'lucide-react'

export default function InstallmentsPageAccordion() {
  const [installments, setInstallments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchInstallments()
  }, [])

  const fetchInstallments = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/installments')
      if (response.ok) {
        const data = await response.json()
        setInstallments(data)
      }
    } catch (error) {
      console.error('خطأ في جلب الأقساط:', error)
    } finally {
      setLoading(false)
    }
  }

  // دالة تحويل حالة القسط من DB إلى النوع المطلوب
  const toStatus = (dbStatus: string, dueDate: Date): 'paid' | 'unpaid' | 'overdue' | 'pending' => {
    if (!dbStatus) return 'pending'
    
    const status = dbStatus.toLowerCase().trim()
    
    switch (status) {
      case 'مدفوع':
      case 'paid':
        return 'paid'
      case 'مستحق':
      case 'unpaid':
        // التحقق من التأخير
        const today = new Date()
        const due = new Date(dueDate)
        return due < today ? 'overdue' : 'unpaid'
      case 'متأخر':
      case 'overdue':
        return 'overdue'
      case 'معلق':
      case 'مؤجل':
      case 'pending':
        return 'pending'
      default:
        // للحالات غير المعروفة، تحقق من التاريخ
        const currentDate = new Date()
        const dueDateTime = new Date(dueDate)
        return dueDateTime < currentDate ? 'overdue' : 'pending'
    }
  }

  const handlePayInstallment = async (id: string) => {
    try {
      const response = await fetch(`/api/installments/${id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paidDate: new Date().toISOString() }),
      })

      if (response.ok) {
        await fetchInstallments()
        alert('تم تسديد القسط بنجاح!')
      } else {
        alert('فشل في تسديد القسط')
      }
    } catch (error) {
      alert('فشل في تسديد القسط')
    }
  }

  // تحويل البيانات للتنسيق المطلوب مع إصلاح TypeScript
  const accordionData = installments.map((installment: any) => {
    // تحديد نوع partners بشكل صريح
    const partners: Array<{ name: string; sharePercent?: number }> = []
    
    return {
      id: installment.id,
      clientName: installment.contract?.customer?.name || 'عميل محذوف',
      unitName: installment.contract?.unit?.name || 'وحدة محذوفة',
      unitType: installment.contract?.unit?.unitType || undefined,
      partners, // مصفوفة مُعرّفة بشكل صريح
      amount: installment.amount,
      dueDate: installment.dueDate,
      contractCode: installment.contract?.code || installment.contractId,
      status: toStatus(installment.status, new Date(installment.dueDate)), // استخدام دالة التحويل
      notes: installment.notes,
      totalInstallments: installment.contract?.installments,
      paidDate: installment.paidDate
    }
  })

  return (
    <Layout title="إدارة الأقساط" subtitle="متابعة وإدارة جميع أقساط العقود مع عرض تفصيلي">
      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            البحث والفلترة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>البحث</Label>
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="العميل، الوحدة، رقم العقد..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <div>
              <Label>حالة القسط</Label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">جميع الأقساط</option>
                <option value="مستحق">مستحق الدفع</option>
                <option value="مدفوع">مدفوع</option>
                <option value="متأخر">متأخر</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 ml-2" />
                تصدير
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accordion */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-600" />
          <p>جاري تحميل الأقساط...</p>
        </div>
      ) : (
        <InstallmentsAccordion
          installments={accordionData}
          onPayInstallment={handlePayInstallment}
          onEditInstallment={(id) => console.log('تعديل:', id)}
          multipleOpen={true}
        />
      )}
    </Layout>
  )
}