'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/layout'
import { InstallmentsAccordion } from '@/components/installments-accordion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { 
  Calendar, 
  Search, 
  Filter, 
  DollarSign,
  Download,
  Plus,
  Loader2
} from 'lucide-react'

interface Installment {
  id: string
  contractId: string
  contractNumber: string
  customerName: string
  unitName: string
  amount: number
  dueDate: Date
  paidDate?: Date
  status: string
  notes?: string
  createdAt: Date
  contract?: {
    unit?: {
      unitType?: string
    }
    installments?: number
  }
}

export default function InstallmentsPageAccordion() {
  const [installments, setInstallments] = useState<Installment[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInstallments()
  }, [])

  const fetchInstallments = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/installments')
      if (response.ok) {
        const data = await response.json()
        setInstallments(data.map((installment: any) => ({
          ...installment,
          dueDate: new Date(installment.dueDate),
          paidDate: installment.paidDate ? new Date(installment.paidDate) : undefined,
          createdAt: new Date(installment.createdAt),
          contractNumber: installment.contract?.code || installment.contractId,
          customerName: installment.contract?.customer?.name || 'عميل محذوف',
          unitName: getUnitDisplayName(installment.contract?.unit)
        })))
      } else {
        console.error('فشل في جلب الأقساط')
      }
    } catch (error) {
      console.error('خطأ في جلب الأقساط:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUnitDisplayName = (unit: any) => {
    if (!unit) return '—'
    
    const parts = []
    if (unit.name) parts.push(`اسم الوحدة (${unit.name})`)
    if (unit.floor) parts.push(`رقم الدور (${unit.floor})`)
    if (unit.building) parts.push(`رقم العمارة (${unit.building})`)
    if (unit.code) parts.push(`كود (${unit.code})`)
    
    return parts.length > 0 ? parts.join(' ') : unit.name || 'وحدة غير محددة'
  }

  const handlePayInstallment = async (id: string) => {
    if (!confirm('هل تريد تسديد هذا القسط؟')) return

    try {
      const response = await fetch(`/api/installments/${id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paidDate: new Date().toISOString() }),
      })

      if (response.ok) {
        await fetchInstallments() // إعادة جلب البيانات
        alert('تم تسديد القسط بنجاح!')
      } else {
        const error = await response.json()
        alert(error.error || 'فشل في تسديد القسط')
      }
    } catch (error) {
      console.error('خطأ في تسديد القسط:', error)
      alert('فشل في تسديد القسط')
    }
  }

  const handleEditInstallment = (id: string) => {
    // TODO: فتح نموذج تعديل القسط
    console.log('تعديل القسط:', id)
    alert('سيتم إضافة نموذج تعديل القسط قريباً')
  }

  const filteredInstallments = installments.filter(installment => {
    const matchesSearch = 
      installment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      installment.unitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      installment.contractNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || installment.status === statusFilter

    const matchesDate = (() => {
      if (dateFilter === 'all') return true
      
      const today = new Date()
      const dueDate = new Date(installment.dueDate)
      
      switch (dateFilter) {
        case 'today':
          return dueDate.toDateString() === today.toDateString()
        case 'week':
          const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
          return dueDate >= today && dueDate <= weekFromNow
        case 'month':
          return dueDate.getMonth() === today.getMonth() && dueDate.getFullYear() === today.getFullYear()
        case 'overdue':
          return dueDate < today && installment.status !== 'مدفوع'
        default:
          return true
      }
    })()

    return matchesSearch && matchesStatus && matchesDate
  })

  // تحويل البيانات لتنسيق Accordion
  const accordionData = filteredInstallments.map(installment => ({
    id: installment.id,
    clientName: installment.customerName,
    unitName: installment.unitName,
    unitType: installment.contract?.unit?.unitType,
    partners: [], // سيتم جلبها من API الشركاء لاحقاً
    amount: installment.amount,
    dueDate: installment.dueDate,
    contractCode: installment.contractNumber,
    status: installment.status === 'مدفوع' ? 'paid' : 
           new Date(installment.dueDate) < new Date() && installment.status !== 'مدفوع' ? 'overdue' :
           installment.status === 'مستحق' ? 'unpaid' : 'pending',
    notes: installment.notes,
    totalInstallments: installment.contract?.installments,
    paidDate: installment.paidDate
  }))

  const installmentStatuses = [
    { value: 'all', label: 'جميع الأقساط' },
    { value: 'مستحق', label: 'مستحق الدفع' },
    { value: 'مدفوع', label: 'مدفوع' },
    { value: 'متأخر', label: 'متأخر' },
    { value: 'مؤجل', label: 'مؤجل' }
  ]

  const dateFilters = [
    { value: 'all', label: 'جميع التواريخ' },
    { value: 'today', label: 'اليوم' },
    { value: 'week', label: 'هذا الأسبوع' },
    { value: 'month', label: 'هذا الشهر' },
    { value: 'overdue', label: 'متأخرة' }
  ]

  const totalInstallments = installments.length
  const paidInstallments = installments.filter(i => i.status === 'مدفوع').length
  const overdueInstallments = installments.filter(i => {
    const today = new Date()
    const dueDate = new Date(i.dueDate)
    return dueDate < today && i.status !== 'مدفوع'
  }).length
  const totalAmount = installments.reduce((sum, i) => sum + i.amount, 0)
  const paidAmount = installments.filter(i => i.status === 'مدفوع').reduce((sum, i) => sum + i.amount, 0)

  return (
    <Layout title="إدارة الأقساط" subtitle="متابعة وإدارة جميع أقساط العقود مع عرض تفصيلي">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{totalInstallments}</div>
            <p className="text-sm opacity-80">إجمالي الأقساط</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{paidInstallments}</div>
            <p className="text-sm opacity-80">أقساط مدفوعة</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{overdueInstallments}</div>
            <p className="text-sm opacity-80">أقساط متأخرة</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="text-lg font-bold">{totalAmount.toLocaleString('ar-EG')} ج.م</div>
            <p className="text-sm opacity-80">إجمالي المبالغ</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
          <CardContent className="p-4">
            <div className="text-lg font-bold">{paidAmount.toLocaleString('ar-EG')} ج.م</div>
            <p className="text-sm opacity-80">المبالغ المحصلة</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            البحث والفلترة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="search">البحث</Label>
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="العميل، الوحدة، رقم العقد..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="statusFilter">حالة القسط</Label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {installmentStatuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="dateFilter">فلتر التاريخ</Label>
              <select
                id="dateFilter"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {dateFilters.map(filter => (
                  <option key={filter.value} value={filter.value}>{filter.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 ml-2" />
                تصدير
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Installments Accordion */}
      {loading ? (
        <Card>
          <CardContent className="text-center py-12">
            <Loader2 className="h-16 w-16 mx-auto mb-4 text-blue-600 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              جاري تحميل الأقساط...
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              يتم جلب البيانات من قاعدة البيانات
            </p>
          </CardContent>
        </Card>
      ) : (
        <InstallmentsAccordion
          installments={accordionData}
          onPayInstallment={handlePayInstallment}
          onEditInstallment={handleEditInstallment}
          multipleOpen={true}
        />
      )}

      {/* رسالة عدم وجود أقساط */}
      {!loading && filteredInstallments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              لا توجد أقساط
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' 
                ? 'لم يتم العثور على أقساط تطابق المعايير المحددة'
                : 'لا توجد أقساط في النظام بعد'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && dateFilter === 'all' && (
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <Link href="/contracts">
                  <Plus className="h-4 w-4 ml-2" />
                  إنشاء عقد جديد
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </Layout>
  )
}