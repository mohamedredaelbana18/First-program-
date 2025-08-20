'use client'

import { useState } from 'react'
import { Layout } from '@/components/layout'
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
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  User,
  Building2,
  Download,
  Plus,
  Edit,
  Trash2
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
}

export default function InstallmentsPage() {
  const [installments, setInstallments] = useState<Installment[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  const installmentStatuses = [
    { value: 'all', label: 'جميع الأقساط', color: 'bg-gray-100' },
    { value: 'مستحق', label: 'مستحق الدفع', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'مدفوع', label: 'مدفوع', color: 'bg-green-100 text-green-800' },
    { value: 'متأخر', label: 'متأخر', color: 'bg-red-100 text-red-800' },
    { value: 'مؤجل', label: 'مؤجل', color: 'bg-blue-100 text-blue-800' }
  ]

  const dateFilters = [
    { value: 'all', label: 'جميع التواريخ' },
    { value: 'today', label: 'اليوم' },
    { value: 'week', label: 'هذا الأسبوع' },
    { value: 'month', label: 'هذا الشهر' },
    { value: 'overdue', label: 'متأخرة' }
  ]

  const handlePayInstallment = (id: string) => {
    if (confirm('هل تريد تسديد هذا القسط؟')) {
      setInstallments(installments.map(inst => 
        inst.id === id 
          ? { ...inst, status: 'مدفوع', paidDate: new Date() }
          : inst
      ))
    }
  }

  const handlePostponeInstallment = (id: string) => {
    const newDate = prompt('أدخل التاريخ الجديد (YYYY-MM-DD):')
    if (newDate) {
      setInstallments(installments.map(inst => 
        inst.id === id 
          ? { ...inst, dueDate: new Date(newDate), status: 'مؤجل' }
          : inst
      ))
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مستحق': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'مدفوع': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'متأخر': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'مؤجل': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'مستحق': return <Clock className="h-4 w-4" />
      case 'مدفوع': return <CheckCircle className="h-4 w-4" />
      case 'متأخر': return <AlertTriangle className="h-4 w-4" />
      case 'مؤجل': return <Calendar className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

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
    <Layout title="إدارة الأقساط" subtitle="متابعة وإدارة جميع أقساط العقود">
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

      {/* Installments List */}
      {filteredInstallments.length === 0 ? (
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
      ) : (
        <div className="space-y-4">
          {filteredInstallments.map((installment) => {
            const isOverdue = new Date(installment.dueDate) < new Date() && installment.status !== 'مدفوع'
            
            return (
              <Card key={installment.id} className={`hover:shadow-lg transition-shadow ${isOverdue ? 'border-red-200 bg-red-50/50' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        installment.status === 'مدفوع' ? 'bg-green-100 dark:bg-green-900' :
                        isOverdue ? 'bg-red-100 dark:bg-red-900' :
                        'bg-yellow-100 dark:bg-yellow-900'
                      }`}>
                        {getStatusIcon(installment.status)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          قسط رقم: {installment.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          عقد: {installment.contractNumber}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-left">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(installment.status)}`}>
                        {getStatusIcon(installment.status)}
                        {installment.status}
                      </div>
                      {isOverdue && (
                        <p className="text-xs text-red-600 mt-1">متأخر عن الموعد</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">العميل</p>
                        <p className="font-medium">{installment.customerName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">الوحدة</p>
                        <p className="font-medium">{installment.unitName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">مبلغ القسط</p>
                        <p className="font-medium text-green-600">{installment.amount.toLocaleString('ar-EG')} ج.م</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">تاريخ الاستحقاق</p>
                        <p className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                          {installment.dueDate.toLocaleDateString('ar-EG')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {installment.paidDate && (
                    <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        <CheckCircle className="inline h-4 w-4 ml-1" />
                        تم التسديد في: {installment.paidDate.toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                  )}

                  {installment.notes && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>ملاحظات:</strong> {installment.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t">
                    {installment.status !== 'مدفوع' && (
                      <>
                        <Button 
                          onClick={() => handlePayInstallment(installment.id)}
                          className="bg-green-600 hover:bg-green-700"
                          size="sm"
                        >
                          <CheckCircle className="h-4 w-4 ml-1" />
                          تسديد
                        </Button>
                        <Button 
                          onClick={() => handlePostponeInstallment(installment.id)}
                          variant="outline"
                          size="sm"
                        >
                          <Calendar className="h-4 w-4 ml-1" />
                          تأجيل
                        </Button>
                      </>
                    )}
                    
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 ml-1" />
                      تعديل
                    </Button>
                    
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/contracts`}>
                        <FileText className="h-4 w-4 ml-1" />
                        العقد
                      </Link>
                    </Button>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 mr-auto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </Layout>
  )
}