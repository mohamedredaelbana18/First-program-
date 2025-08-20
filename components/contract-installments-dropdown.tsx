'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Minus,
  Building2, 
  Users, 
  DollarSign, 
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Loader2
} from 'lucide-react'
import { formatMoneyEGP, formatDateArabic, convertToArabicNumbers } from '@/lib/formatters'

interface ContractInstallment {
  id: string
  amount: number
  dueDate: Date
  paidDate?: Date
  status: string
  notes?: string
}

interface ContractInstallmentsDropdownProps {
  contractId: string
  contractCode: string
  unitName: string
  unitType?: string
  partners?: Array<{ name: string; sharePercent?: number }>
  totalPrice: number
  className?: string
}

export function ContractInstallmentsDropdown({
  contractId,
  contractCode,
  unitName,
  unitType,
  partners = [],
  totalPrice,
  className
}: ContractInstallmentsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [installments, setInstallments] = useState<ContractInstallment[]>([])
  const [loading, setLoading] = useState(false)

  const fetchInstallments = async () => {
    if (loading) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/installments?contractId=${contractId}`)
      if (response.ok) {
        const data = await response.json()
        setInstallments(data.map((inst: any) => ({
          ...inst,
          dueDate: new Date(inst.dueDate),
          paidDate: inst.paidDate ? new Date(inst.paidDate) : undefined
        })))
      }
    } catch (error) {
      console.error('خطأ في جلب أقساط العقد:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = () => {
    if (!isOpen) {
      fetchInstallments()
    }
    setIsOpen(!isOpen)
  }

  const handlePayInstallment = async (installmentId: string) => {
    if (!confirm('هل تريد تسديد هذا القسط؟')) return

    try {
      const response = await fetch(`/api/installments/${installmentId}/pay`, {
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
      alert('فشل في تسديد القسط')
    }
  }

  // حساب الإحصائيات
  const totalInstallments = installments.length
  const paidInstallments = installments.filter(i => i.status === 'مدفوع').length
  const overdueInstallments = installments.filter(i => {
    const today = new Date()
    return new Date(i.dueDate) < today && i.status !== 'مدفوع'
  }).length
  
  const totalPaid = installments
    .filter(i => i.status === 'مدفوع')
    .reduce((sum, i) => sum + i.amount, 0)
  
  const totalRemaining = installments
    .filter(i => i.status !== 'مدفوع')
    .reduce((sum, i) => sum + i.amount, 0)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'مدفوع': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'متأخر': return <AlertTriangle className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مدفوع': return 'bg-green-100 text-green-800'
      case 'متأخر': return 'bg-red-100 text-red-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  const formatPartners = () => {
    if (!partners || partners.length === 0) return 'لا يوجد شركاء'
    
    if (partners.length === 1) {
      const partner = partners[0]
      const shareText = partner.sharePercent ? ` (${convertToArabicNumbers(partner.sharePercent.toString())}%)` : ''
      return `${partner.name}${shareText}`
    }
    
    if (partners.length === 2) {
      return partners.map(p => {
        const shareText = p.sharePercent ? ` (${convertToArabicNumbers(p.sharePercent.toString())}%)` : ''
        return `${p.name}${shareText}`
      }).join('، ')
    }
    
    const firstTwo = partners.slice(0, 2).map(p => p.name).join('، ')
    const remaining = partners.length - 2
    return `${firstTwo} +${convertToArabicNumbers(remaining.toString())}`
  }

  return (
    <div className={className}>
      {/* Header مع زر التوسيع */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <div className="flex-1 space-y-2">
          {/* الصف الأول: الوحدة والنوع */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-gray-900 dark:text-white">
                {unitName}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              نوع: {unitType || '—'}
            </div>
          </div>

          {/* الصف الثاني: الشركاء والسعر */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              <span className="text-gray-600">الشركاء:</span>
              <span className="font-medium">{formatPartners()}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-gray-600">السعر:</span>
              <span className="font-bold text-green-600">{formatMoneyEGP(totalPrice)}</span>
            </div>
          </div>

          {/* الصف الثالث: ملخص الأقساط */}
          {isOpen && installments.length > 0 && (
            <div className="flex items-center gap-4 text-sm pt-2 border-t">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span>المسدد: {formatMoneyEGP(totalPaid)}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-orange-600" />
                <span>الباقي: {formatMoneyEGP(totalRemaining)}</span>
              </div>
              {overdueInstallments > 0 && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-red-600 font-medium">
                    إنذار: {convertToArabicNumbers(overdueInstallments.toString())} قسط متأخر
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* زر التوسيع */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggle}
          className="flex-shrink-0 w-8 h-8 p-0"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isOpen ? (
            <Minus className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* قائمة الأقساط المنسدلة */}
      {isOpen && (
        <div className="mt-2 space-y-2 pl-4 border-r-2 border-gray-200 dark:border-gray-700">
          {loading ? (
            <div className="p-4 text-center">
              <Loader2 className="h-6 w-6 mx-auto mb-2 animate-spin text-blue-600" />
              <p className="text-sm text-gray-500">جاري تحميل الأقساط...</p>
            </div>
          ) : installments.length === 0 ? (
            <div className="p-4 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500">لا توجد أقساط لهذا العقد</p>
            </div>
          ) : (
            installments.map((installment) => {
              const isOverdue = new Date(installment.dueDate) < new Date() && installment.status !== 'مدفوع'
              
              return (
                <Card 
                  key={installment.id} 
                  className={`${isOverdue ? 'border-red-200 bg-red-50/30' : ''}`}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <span className="text-xs font-bold text-blue-600">
                              {convertToArabicNumbers(installments.indexOf(installment) + 1 + '')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-green-600">
                              {formatMoneyEGP(installment.amount)}
                            </span>
                            <Badge className={`text-xs ${getStatusColor(installment.status)}`}>
                              {getStatusIcon(installment.status)}
                              {installment.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                          <div>
                            <span>الاستحقاق: </span>
                            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                              {formatDateArabic(installment.dueDate)}
                            </span>
                          </div>
                          
                          {installment.paidDate && (
                            <div className="text-green-600">
                              <CheckCircle className="inline h-3 w-3 ml-1" />
                              <span>تم الدفع: {formatDateArabic(installment.paidDate)}</span>
                            </div>
                          )}
                          
                          {isOverdue && (
                            <div className="text-red-600 font-medium">
                              <AlertTriangle className="inline h-3 w-3 ml-1" />
                              <span>متأخر {(() => {
                                const diffDays = Math.floor(
                                  (new Date().getTime() - new Date(installment.dueDate).getTime()) / (1000 * 60 * 60 * 24)
                                )
                                return `${convertToArabicNumbers(diffDays.toString())} ${diffDays === 1 ? 'يوم' : 'أيام'}`
                              })()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* أزرار العمليات */}
                      <div className="flex gap-1">
                        {installment.status !== 'مدفوع' && (
                          <Button
                            size="sm"
                            onClick={() => handlePayInstallment(installment.id)}
                            className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1"
                          >
                            <CheckCircle className="h-3 w-3 ml-1" />
                            سداد
                          </Button>
                        )}
                      </div>
                    </div>

                    {installment.notes && (
                      <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs">
                        <strong>ملاحظة:</strong> {installment.notes}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}

          {/* ملخص إجمالي */}
          {installments.length > 0 && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-gray-600">المسدد</p>
                  <p className="font-bold text-green-600">{formatMoneyEGP(totalPaid)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600">الباقي</p>
                  <p className="font-bold text-orange-600">{formatMoneyEGP(totalRemaining)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600">المستحق</p>
                  <p className={`font-bold ${overdueInstallments > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                    {convertToArabicNumbers(overdueInstallments.toString())} قسط
                  </p>
                </div>
              </div>

              {/* إنذار للأقساط المتأخرة */}
              {overdueInstallments > 0 && (
                <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 rounded border border-red-200">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-semibold text-sm">
                      إنذار: يوجد {convertToArabicNumbers(overdueInstallments.toString())} قسط متأخر عن الموعد
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}