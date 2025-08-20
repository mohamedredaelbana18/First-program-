'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronDown, 
  ChevronUp, 
  User, 
  Building2, 
  DollarSign, 
  Calendar,
  FileText,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users
} from 'lucide-react'
import { 
  formatMoneyEGP, 
  formatDateArabic, 
  partnersSummary, 
  formatNumber 
} from '@/lib/formatters'

interface Partner {
  name: string
  sharePercent?: number
}

interface InstallmentData {
  id: string
  clientName: string
  unitName: string
  unitType?: string
  partners?: Partner[]
  amount: number
  dueDate: string | Date
  contractCode: string
  status: 'paid' | 'unpaid' | 'overdue' | 'pending'
  notes?: string
  totalInstallments?: number
  paidDate?: Date
}

interface InstallmentsAccordionProps {
  installments: InstallmentData[]
  onPayInstallment: (id: string) => void
  onEditInstallment: (id: string) => void
  multipleOpen?: boolean // السماح بفتح عدة عناصر
  className?: string
}

export function InstallmentsAccordion({
  installments,
  onPayInstallment,
  onEditInstallment,
  multipleOpen = true,
  className
}: InstallmentsAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems)
    
    if (multipleOpen) {
      // السماح بفتح عدة عناصر
      if (newOpenItems.has(id)) {
        newOpenItems.delete(id)
      } else {
        newOpenItems.add(id)
      }
    } else {
      // فتح عنصر واحد فقط
      if (newOpenItems.has(id)) {
        newOpenItems.clear()
      } else {
        newOpenItems.clear()
        newOpenItems.add(id)
      }
    }
    
    setOpenItems(newOpenItems)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'unpaid': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'pending': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />
      case 'unpaid': return <Clock className="h-4 w-4" />
      case 'overdue': return <AlertTriangle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'مدفوع'
      case 'unpaid': return 'مستحق'
      case 'overdue': return 'متأخر'
      case 'pending': return 'معلق'
      default: return 'غير محدد'
    }
  }

  const isOverdue = (dueDate: string | Date, status: string) => {
    if (status === 'paid') return false
    const due = new Date(dueDate)
    const today = new Date()
    return due < today
  }

  return (
    <div className={`space-y-3 ${className}`} dir="rtl">
      {installments.map((installment) => {
        const isOpen = openItems.has(installment.id)
        const overdue = isOverdue(installment.dueDate, installment.status)
        const partnersInfo = partnersSummary(installment.partners)
        
        return (
          <Card 
            key={installment.id} 
            className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
              overdue ? 'border-red-200 bg-red-50/30' : ''
            }`}
          >
            {/* العنوان المختصر - Collapsed Header */}
            <div
              className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => toggleItem(installment.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  {/* الصف الأول: العميل والوحدة */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-600">العميل:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {installment.clientName}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-600">الوحدة:</span>
                      <span className="font-medium text-gray-900 dark:text-white truncate">
                        {installment.unitName}
                      </span>
                    </div>
                  </div>
                  
                  {/* الصف الثاني: نوع الوحدة والشركاء */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-600">نوع الوحدة:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {installment.unitType || '—'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span 
                        className="font-medium text-gray-900 dark:text-white truncate cursor-help"
                        title={partnersInfo.tooltip}
                      >
                        {partnersInfo.text}
                      </span>
                    </div>
                  </div>
                  
                  {/* الصف الثالث: المبلغ والتاريخ */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">مبلغ القسط:</span>
                      <span className="font-bold text-green-600 text-lg">
                        {formatMoneyEGP(installment.amount)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className={`h-4 w-4 flex-shrink-0 ${overdue ? 'text-red-600' : 'text-gray-500'}`} />
                      <span className="text-gray-600 text-sm">تاريخ الاستحقاق:</span>
                      <span className={`font-medium ${overdue ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                        {formatDateArabic(installment.dueDate)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* الحالة وأيقونة التوسيع */}
                <div className="flex items-center gap-3 mr-4">
                  <Badge className={`${getStatusColor(installment.status)} flex items-center gap-1`}>
                    {getStatusIcon(installment.status)}
                    {getStatusText(installment.status)}
                  </Badge>
                  
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* المحتوى المتوسع - Expanded Content */}
            {isOpen && (
              <CardContent className="border-t bg-gray-50 dark:bg-gray-800/50 p-6">
                <div className="space-y-6">
                  {/* معلومات العقد */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">كود العقد</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {installment.contractCode}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">عدد الأقساط</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {installment.totalInstallments ? formatNumber(installment.totalInstallments) : '—'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">الحالة التفصيلية</p>
                        <Badge className={getStatusColor(installment.status)}>
                          {getStatusIcon(installment.status)}
                          {getStatusText(installment.status)}
                          {installment.paidDate && (
                            <span className="mr-2">
                              - {formatDateArabic(installment.paidDate)}
                            </span>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* تفاصيل الوحدة */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-blue-600" />
                      تفاصيل الوحدة
                    </h4>
                    <div className="grid gap-2 md:grid-cols-2 text-sm">
                      <div>
                        <span className="text-gray-600">اسم الوحدة:</span>
                        <span className="font-medium mr-2">{installment.unitName}</span>
                      </div>
                      {installment.unitType && (
                        <div>
                          <span className="text-gray-600">نوع الوحدة:</span>
                          <span className="font-medium mr-2">{installment.unitType}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* قسم الشركاء */}
                  {installment.partners && installment.partners.length > 0 && (
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-600" />
                        الشركاء ({formatNumber(installment.partners.length)})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {installment.partners.map((partner, index) => (
                          <Badge 
                            key={index}
                            variant="outline"
                            className="bg-white dark:bg-gray-800 border-purple-200 text-purple-800 dark:text-purple-200"
                          >
                            <Users className="h-3 w-3 ml-1" />
                            {partner.name}
                            {partner.sharePercent && (
                              <span className="mr-1 text-purple-600 font-bold">
                                ({formatNumber(partner.sharePercent)}%)
                              </span>
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* الملاحظات */}
                  {installment.notes && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-yellow-600" />
                        ملاحظات
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {installment.notes}
                      </p>
                    </div>
                  )}

                  {/* معلومات إضافية للأقساط المتأخرة */}
                  {overdue && installment.status !== 'paid' && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-semibold">قسط متأخر عن الموعد</span>
                      </div>
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        تأخر لمدة {(() => {
                          const due = new Date(installment.dueDate)
                          const today = new Date()
                          const diffDays = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
                          return `${formatNumber(diffDays)} ${diffDays === 1 ? 'يوم' : 'أيام'}`
                        })()}
                      </p>
                    </div>
                  )}

                  {/* الأزرار */}
                  <div className="flex gap-2 pt-4 border-t">
                    {installment.status !== 'paid' && (
                      <Button 
                        onClick={() => onPayInstallment(installment.id)}
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4 ml-1" />
                        سداد الآن
                      </Button>
                    )}
                    
                    <Button 
                      onClick={() => onEditInstallment(installment.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="h-4 w-4 ml-1" />
                      تعديل
                    </Button>
                    
                    <Button 
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={`/contracts?highlight=${installment.contractCode}`}>
                        <FileText className="h-4 w-4 ml-1" />
                        عرض العقد
                      </a>
                    </Button>

                    {installment.status === 'paid' && installment.paidDate && (
                      <div className="mr-auto flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>تم الدفع في: {formatDateArabic(installment.paidDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}
      
      {installments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              لا توجد أقساط
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              لم يتم العثور على أقساط تطابق المعايير المحددة
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}