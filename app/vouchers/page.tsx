'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Receipt, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  DollarSign,
  Calendar,
  User,
  Building2,
  TrendingUp,
  TrendingDown,
  Loader2,
  FileText,
  Filter
} from 'lucide-react'

interface Voucher {
  id: string
  type: string // 'receipt' = قبض، 'payment' = صرف
  amount: number
  description?: string | null
  date: Date
  payer?: string | null // للقبض
  beneficiary?: string | null // للصرف
  linked_ref?: string | null // مرجع مرتبط
  safeId?: string | null
  createdAt: Date
}

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  const [newVoucher, setNewVoucher] = useState({
    type: 'receipt',
    amount: '',
    description: '',
    date: new Date().toISOString().slice(0, 10),
    payer: '',
    beneficiary: '',
    safeId: ''
  })

  const voucherTypes = [
    { value: 'all', label: 'جميع السندات' },
    { value: 'receipt', label: 'سندات القبض' },
    { value: 'payment', label: 'سندات الصرف' }
  ]

  useEffect(() => {
    fetchVouchers()
  }, [])

  const fetchVouchers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/vouchers')
      if (response.ok) {
        const data = await response.json()
        setVouchers(data.map((voucher: any) => ({
          ...voucher,
          date: new Date(voucher.date),
          createdAt: new Date(voucher.createdAt)
        })))
      }
    } catch (error) {
      console.error('خطأ في جلب السندات:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddVoucher = async () => {
    if (!newVoucher.amount || !newVoucher.description.trim()) {
      alert('يرجى ملء جميع البيانات المطلوبة')
      return
    }

    setSubmitting(true)
    try {
      const voucherData = {
        ...newVoucher,
        amount: parseFloat(newVoucher.amount),
        payer: newVoucher.type === 'receipt' ? newVoucher.payer : null,
        beneficiary: newVoucher.type === 'payment' ? newVoucher.beneficiary : null
      }

      const response = await fetch('/api/vouchers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(voucherData),
      })

      if (response.ok) {
        await fetchVouchers()
        setNewVoucher({
          type: 'receipt', amount: '', description: '',
          date: new Date().toISOString().slice(0, 10),
          payer: '', beneficiary: '', safeId: ''
        })
        setShowAddForm(false)
      } else {
        const error = await response.json()
        alert(error.error || 'فشل في إضافة السند')
      }
    } catch (error) {
      alert('فشل في إضافة السند')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredVouchers = vouchers.filter(voucher => {
    const matchesSearch = 
      voucher.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.payer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.beneficiary?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === 'all' || voucher.type === typeFilter

    return matchesSearch && matchesType
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'receipt': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'payment': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'receipt': return <TrendingUp className="h-4 w-4" />
      case 'payment': return <TrendingDown className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const totalReceipts = vouchers.filter(v => v.type === 'receipt').reduce((sum, v) => sum + v.amount, 0)
  const totalPayments = vouchers.filter(v => v.type === 'payment').reduce((sum, v) => sum + v.amount, 0)
  const netBalance = totalReceipts - totalPayments

  return (
    <Layout title="إدارة السندات" subtitle="سندات القبض والصرف والعمليات المالية">
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <Receipt className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              سجل السندات المالية
            </h2>
            <p className="text-sm text-gray-500">
              إجمالي السندات: {vouchers.length} | الرصيد الصافي: {netBalance.toLocaleString('ar-EG')} ج.م
            </p>
          </div>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 ml-2" />
          سند جديد
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{vouchers.filter(v => v.type === 'receipt').length}</div>
            <p className="text-sm opacity-80">سندات قبض</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{vouchers.filter(v => v.type === 'payment').length}</div>
            <p className="text-sm opacity-80">سندات صرف</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="text-lg font-bold">{totalReceipts.toLocaleString('ar-EG')} ج.م</div>
            <p className="text-sm opacity-80">إجمالي المقبوضات</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="text-lg font-bold">{totalPayments.toLocaleString('ar-EG')} ج.م</div>
            <p className="text-sm opacity-80">إجمالي المدفوعات</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
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
                  placeholder="البحث في الوصف، الدافع، المستفيد..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

            <div>
              <Label>نوع السند</Label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {voucherTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Search className="h-4 w-4 ml-2" />
                بحث متقدم
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Voucher Form */}
      {showAddForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>إضافة سند جديد</CardTitle>
            <CardDescription>
              إنشاء سند قبض أو صرف جديد
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>نوع السند *</Label>
                <select
                  value={newVoucher.type}
                  onChange={(e) => setNewVoucher({...newVoucher, type: e.target.value})}
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="receipt">سند قبض</option>
                  <option value="payment">سند صرف</option>
                </select>
              </div>

              <div>
                <Label>المبلغ (ج.م) *</Label>
                <Input
                  type="number"
                  value={newVoucher.amount}
                  onChange={(e) => setNewVoucher({...newVoucher, amount: e.target.value})}
                  placeholder="أدخل المبلغ"
                  disabled={submitting}
                  required
                />
              </div>

              <div>
                <Label>التاريخ</Label>
                <Input
                  type="date"
                  value={newVoucher.date}
                  onChange={(e) => setNewVoucher({...newVoucher, date: e.target.value})}
                  disabled={submitting}
                />
              </div>

              <div>
                <Label>{newVoucher.type === 'receipt' ? 'اسم الدافع' : 'اسم المستفيد'}</Label>
                <Input
                  value={newVoucher.type === 'receipt' ? newVoucher.payer : newVoucher.beneficiary}
                  onChange={(e) => setNewVoucher({
                    ...newVoucher, 
                    [newVoucher.type === 'receipt' ? 'payer' : 'beneficiary']: e.target.value
                  })}
                  placeholder={newVoucher.type === 'receipt' ? 'أدخل اسم الدافع' : 'أدخل اسم المستفيد'}
                  disabled={submitting}
                />
              </div>

              <div className="md:col-span-2">
                <Label>وصف السند *</Label>
                <Input
                  value={newVoucher.description}
                  onChange={(e) => setNewVoucher({...newVoucher, description: e.target.value})}
                  placeholder="أدخل وصف السند"
                  disabled={submitting}
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button 
                onClick={handleAddVoucher} 
                className="bg-green-600 hover:bg-green-700"
                disabled={submitting || !newVoucher.amount || !newVoucher.description.trim()}
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 ml-2" />
                )}
                {submitting ? 'جاري الحفظ...' : 'إضافة السند'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
                disabled={submitting}
              >
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vouchers List */}
      {loading ? (
        <Card>
          <CardContent className="text-center py-12">
            <Loader2 className="h-16 w-16 mx-auto mb-4 text-green-600 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              جاري تحميل السندات...
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              يتم جلب البيانات من قاعدة البيانات
            </p>
          </CardContent>
        </Card>
      ) : filteredVouchers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Receipt className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm || typeFilter !== 'all' ? 'لم يتم العثور على سندات' : 'لا توجد سندات في قاعدة البيانات'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || typeFilter !== 'all' 
                ? 'جرب معايير بحث مختلفة'
                : 'ابدأ بإضافة سند جديد أو قم بتسديد أقساط لتوليد سندات تلقائية'
              }
            </p>
            {!searchTerm && typeFilter === 'all' && (
              <Button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 ml-2" />
                إضافة أول سند
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredVouchers.map((voucher) => (
            <Card key={voucher.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      voucher.type === 'receipt' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                    }`}>
                      {getTypeIcon(voucher.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        سند رقم: {voucher.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {voucher.date.toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-left">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getTypeColor(voucher.type)}`}>
                      {getTypeIcon(voucher.type)}
                      {voucher.type === 'receipt' ? 'سند قبض' : 'سند صرف'}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">المبلغ</p>
                      <p className={`text-xl font-bold ${voucher.type === 'receipt' ? 'text-green-600' : 'text-red-600'}`}>
                        {voucher.amount.toLocaleString('ar-EG')} ج.م
                      </p>
                    </div>
                  </div>

                  {voucher.payer && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">الدافع</p>
                        <p className="font-medium">{voucher.payer}</p>
                      </div>
                    </div>
                  )}

                  {voucher.beneficiary && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">المستفيد</p>
                        <p className="font-medium">{voucher.beneficiary}</p>
                      </div>
                    </div>
                  )}
                </div>

                {voucher.description && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>الوصف:</strong> {voucher.description}
                    </p>
                  </div>
                )}

                {voucher.linked_ref && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <FileText className="inline h-4 w-4 ml-1" />
                      مرتبط بـ: {voucher.linked_ref}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 ml-1" />
                    تعديل
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  )
}