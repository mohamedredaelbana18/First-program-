'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/layout'
import { CustomerSelect } from '@/components/dropdowns/customer-select'
import { UnitSelect } from '@/components/dropdowns/unit-select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  FileText, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar, 
  DollarSign,
  User,
  Building2,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calculator,
  UserCheck
} from 'lucide-react'

interface Contract {
  id: string
  code?: string | null
  customerId: string
  customerName: string
  unitId: string
  unitName: string
  totalPrice: number
  downPayment: number
  remaining: number
  discountAmount: number
  installments: number
  installmentAmount: number
  startDate: Date
  endDate?: Date | null
  brokerName?: string | null
  brokerAmount: number
  commissionSafeId?: string | null
  status: string
  notes?: string | null
  createdAt: Date
}

export default function ContractsPageComplete() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [newContract, setNewContract] = useState({
    code: '',
    customerId: '',
    customerName: '',
    unitId: '',
    unitName: '',
    unitPrice: 0,
    totalPrice: '',
    downPayment: '',
    discountAmount: '',
    installments: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    brokerName: '',
    brokerAmount: '',
    commissionSafeId: '',
    status: 'نشط',
    notes: ''
  })

  const contractStatuses = ['نشط', 'مكتمل', 'متوقف', 'ملغي']

  useEffect(() => {
    fetchContracts()
  }, [])

  const fetchContracts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/contracts')
      if (response.ok) {
        const data = await response.json()
        setContracts(data.map((contract: any) => ({
          ...contract,
          startDate: new Date(contract.startDate),
          endDate: contract.endDate ? new Date(contract.endDate) : null,
          createdAt: new Date(contract.createdAt),
          customerName: contract.customer?.name || 'عميل محذوف',
          unitName: getUnitDisplayName(contract.unit)
        })))
      }
    } catch (error) {
      console.error('خطأ في جلب العقود:', error)
    } finally {
      setLoading(false)
    }
  }

  // دالة لعرض اسم الوحدة مثل البرنامج الأصلي
  const getUnitDisplayName = (unit: any) => {
    if (!unit) return '—'
    
    const parts = []
    if (unit.name) parts.push(`اسم الوحدة (${unit.name})`)
    if (unit.floor) parts.push(`رقم الدور (${unit.floor})`)
    if (unit.building) parts.push(`رقم العمارة (${unit.building})`)
    if (unit.code) parts.push(`كود (${unit.code})`)
    
    return parts.length > 0 ? parts.join(' ') : unit.name || 'وحدة غير محددة'
  }

  // حساب المبلغ المتبقي وقيمة القسط تلقائياً
  const calculateRemaining = () => {
    const total = parseFloat(newContract.totalPrice) || newContract.unitPrice || 0
    const down = parseFloat(newContract.downPayment) || 0
    const discount = parseFloat(newContract.discountAmount) || 0
    return total - down - discount
  }

  const calculateInstallmentAmount = () => {
    const remaining = calculateRemaining()
    const installmentCount = parseInt(newContract.installments) || 0
    return installmentCount > 0 ? remaining / installmentCount : 0
  }

  const handleCustomerSelect = (customerId: string, customerName: string) => {
    setNewContract({
      ...newContract,
      customerId,
      customerName
    })
  }

  const handleUnitSelect = (unitId: string, unitName: string, unitPrice: number) => {
    setNewContract({
      ...newContract,
      unitId,
      unitName,
      unitPrice,
      totalPrice: unitPrice.toString()
    })
  }

  const handleAddContract = async () => {
    if (!newContract.customerId || !newContract.unitId || !newContract.totalPrice) {
      alert('يرجى ملء جميع البيانات المطلوبة')
      return
    }

    const remaining = calculateRemaining()
    const installmentAmount = calculateInstallmentAmount()

    setSubmitting(true)
    try {
      const contractData = {
        code: newContract.code || `CON-${Date.now()}`,
        customerId: newContract.customerId,
        unitId: newContract.unitId,
        totalPrice: parseFloat(newContract.totalPrice),
        downPayment: parseFloat(newContract.downPayment) || 0,
        remaining,
        discountAmount: parseFloat(newContract.discountAmount) || 0,
        installments: parseInt(newContract.installments) || 0,
        installmentAmount,
        startDate: newContract.startDate,
        endDate: newContract.endDate || null,
        brokerName: newContract.brokerName || null,
        brokerAmount: parseFloat(newContract.brokerAmount) || 0,
        commissionSafeId: newContract.commissionSafeId || null,
        status: newContract.status,
        notes: newContract.notes || null
      }

      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contractData),
      })

      if (response.ok) {
        const contract = await response.json()
        
        // سؤال المستخدم عن توليد الأقساط
        if (remaining > 0 && parseInt(newContract.installments) > 0) {
          const shouldGenerateInstallments = confirm(
            `هل تريد توليد ${newContract.installments} قسط بقيمة ${installmentAmount.toLocaleString('ar-EG')} ج.م لكل قسط؟`
          )
          
          if (shouldGenerateInstallments) {
            try {
              const installmentsResponse = await fetch('/api/installments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  action: 'generate',
                  contractId: contract.id,
                  options: {
                    startDate: newContract.startDate,
                    frequency: 'monthly',
                    replaceExisting: false
                  }
                }),
              })
              
              if (installmentsResponse.ok) {
                alert(`تم توليد ${newContract.installments} قسط بنجاح!`)
              }
            } catch (error) {
              alert('تم إنشاء العقد ولكن فشل في توليد الأقساط')
            }
          }
        }

        // تحديث قائمة العقود
        await fetchContracts()
        
        // إعادة تعيين النموذج
        setNewContract({
          code: '', customerId: '', customerName: '', unitId: '', unitName: '', unitPrice: 0,
          totalPrice: '', downPayment: '', discountAmount: '', installments: '',
          startDate: new Date().toISOString().slice(0, 10), endDate: '',
          brokerName: '', brokerAmount: '', commissionSafeId: '', status: 'نشط', notes: ''
        })
        setShowAddForm(false)
      } else {
        const error = await response.json()
        alert(error.error || 'فشل في إنشاء العقد')
      }
    } catch (error) {
      console.error('خطأ في إنشاء العقد:', error)
      alert('فشل في إنشاء العقد')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredContracts = contracts.filter(contract =>
    contract.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.unitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.brokerName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشط': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'مكتمل': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'متوقف': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'ملغي': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const totalValue = contracts.reduce((sum, contract) => sum + contract.totalPrice, 0)
  const totalRemaining = contracts.reduce((sum, contract) => sum + contract.remaining, 0)
  const activeContracts = contracts.filter(c => c.status === 'نشط').length

  return (
    <Layout title="إدارة العقود" subtitle="إنشاء ومتابعة العقود مع توليد الأقساط التلقائي">
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
            <FileText className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              سجل العقود
            </h2>
            <p className="text-sm text-gray-500">
              إجمالي العقود: {contracts.length} | القيمة الإجمالية: {totalValue.toLocaleString('ar-EG')} ج.م
            </p>
          </div>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 ml-2" />
          عقد جديد
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{contracts.length}</div>
            <p className="text-sm opacity-80">إجمالي العقود</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{activeContracts}</div>
            <p className="text-sm opacity-80">عقود نشطة</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="text-lg font-bold">{totalValue.toLocaleString('ar-EG')} ج.م</div>
            <p className="text-sm opacity-80">إجمالي القيمة</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="text-lg font-bold">{totalRemaining.toLocaleString('ar-EG')} ج.م</div>
            <p className="text-sm opacity-80">المبالغ المتبقية</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="البحث في العقود (العميل، الوحدة، كود العقد، السمسار)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      {/* Add Contract Form */}
      {showAddForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>إنشاء عقد جديد</CardTitle>
            <CardDescription>
              أدخل بيانات العقد الجديد - سيتم توليد الأقساط تلقائياً
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {/* العميل والوحدة */}
              <div className="grid gap-4 md:grid-cols-2">
                <CustomerSelect
                  value={newContract.customerId}
                  onChange={handleCustomerSelect}
                  required
                  disabled={submitting}
                />
                
                <UnitSelect
                  value={newContract.unitId}
                  onChange={handleUnitSelect}
                  required
                  disabled={submitting}
                  filterStatus="متاح"
                />
              </div>

              {/* بيانات العقد الأساسية */}
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="code">كود العقد</Label>
                  <Input
                    id="code"
                    value={newContract.code}
                    onChange={(e) => setNewContract({...newContract, code: e.target.value})}
                    placeholder="سيتم توليده تلقائياً"
                    disabled={submitting}
                  />
                </div>
                
                <div>
                  <Label htmlFor="totalPrice">السعر الإجمالي (ج.م) *</Label>
                  <Input
                    id="totalPrice"
                    type="number"
                    value={newContract.totalPrice}
                    onChange={(e) => setNewContract({...newContract, totalPrice: e.target.value})}
                    placeholder={newContract.unitPrice > 0 ? newContract.unitPrice.toString() : "أدخل السعر"}
                    disabled={submitting}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="downPayment">المقدم (ج.م)</Label>
                  <Input
                    id="downPayment"
                    type="number"
                    value={newContract.downPayment}
                    onChange={(e) => setNewContract({...newContract, downPayment: e.target.value})}
                    placeholder="أدخل قيمة المقدم"
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* الخصم والأقساط */}
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="discountAmount">مبلغ الخصم (ج.م)</Label>
                  <Input
                    id="discountAmount"
                    type="number"
                    value={newContract.discountAmount}
                    onChange={(e) => setNewContract({...newContract, discountAmount: e.target.value})}
                    placeholder="أدخل مبلغ الخصم"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <Label htmlFor="installments">عدد الأقساط</Label>
                  <Input
                    id="installments"
                    type="number"
                    value={newContract.installments}
                    onChange={(e) => setNewContract({...newContract, installments: e.target.value})}
                    placeholder="أدخل عدد الأقساط"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <Label>قيمة القسط الواحد</Label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-md border">
                    <span className="text-lg font-bold text-green-600">
                      {calculateInstallmentAmount().toLocaleString('ar-EG')} ج.م
                    </span>
                  </div>
                </div>
              </div>

              {/* بيانات السمسار */}
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="brokerName">اسم السمسار</Label>
                  <Input
                    id="brokerName"
                    value={newContract.brokerName}
                    onChange={(e) => setNewContract({...newContract, brokerName: e.target.value})}
                    placeholder="أدخل اسم السمسار (اختياري)"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <Label htmlFor="brokerAmount">عمولة السمسار (ج.م)</Label>
                  <Input
                    id="brokerAmount"
                    type="number"
                    value={newContract.brokerAmount}
                    onChange={(e) => setNewContract({...newContract, brokerAmount: e.target.value})}
                    placeholder="أدخل عمولة السمسار"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <Label htmlFor="status">حالة العقد</Label>
                  <select
                    id="status"
                    value={newContract.status}
                    onChange={(e) => setNewContract({...newContract, status: e.target.value})}
                    disabled={submitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                  >
                    {contractStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* التواريخ والملاحظات */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="startDate">تاريخ البداية</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newContract.startDate}
                    onChange={(e) => setNewContract({...newContract, startDate: e.target.value})}
                    disabled={submitting}
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">تاريخ النهاية</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newContract.endDate}
                    onChange={(e) => setNewContract({...newContract, endDate: e.target.value})}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">ملاحظات</Label>
                <textarea
                  id="notes"
                  value={newContract.notes}
                  onChange={(e) => setNewContract({...newContract, notes: e.target.value})}
                  placeholder="أدخل أي ملاحظات إضافية"
                  disabled={submitting}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                />
              </div>

              {/* ملخص مالي */}
              {newContract.totalPrice && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    ملخص مالي
                  </h4>
                  <div className="grid gap-3 md:grid-cols-4 text-sm">
                    <div>
                      <span className="text-gray-500">السعر الإجمالي:</span>
                      <p className="font-bold text-blue-600">{(parseFloat(newContract.totalPrice) || 0).toLocaleString('ar-EG')} ج.م</p>
                    </div>
                    <div>
                      <span className="text-gray-500">المقدم:</span>
                      <p className="font-bold text-green-600">{(parseFloat(newContract.downPayment) || 0).toLocaleString('ar-EG')} ج.م</p>
                    </div>
                    <div>
                      <span className="text-gray-500">الخصم:</span>
                      <p className="font-bold text-orange-600">{(parseFloat(newContract.discountAmount) || 0).toLocaleString('ar-EG')} ج.م</p>
                    </div>
                    <div>
                      <span className="text-gray-500">المتبقي:</span>
                      <p className="font-bold text-red-600">{calculateRemaining().toLocaleString('ar-EG')} ج.م</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <Button 
                onClick={handleAddContract} 
                className="bg-purple-600 hover:bg-purple-700"
                disabled={submitting || !newContract.customerId || !newContract.unitId || !newContract.totalPrice}
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 ml-2" />
                )}
                {submitting ? 'جاري إنشاء العقد...' : 'إنشاء العقد'}
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

      {/* Contracts List */}
      {loading ? (
        <Card>
          <CardContent className="text-center py-12">
            <Loader2 className="h-16 w-16 mx-auto mb-4 text-purple-600 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              جاري تحميل العقود...
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              يتم جلب البيانات من قاعدة البيانات
            </p>
          </CardContent>
        </Card>
      ) : filteredContracts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'لم يتم العثور على عقود' : 'لا توجد عقود في قاعدة البيانات'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm ? 'جرب مصطلح بحث مختلف' : 'ابدأ بإنشاء عقد جديد'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowAddForm(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 ml-2" />
                إنشاء أول عقد
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredContracts.map((contract) => (
            <Card key={contract.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {contract.code || `عقد ${contract.id}`}
                      </h3>
                      <p className="text-sm text-gray-500">
                        تم الإنشاء: {contract.createdAt.toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contract.status)}`}>
                    {contract.status}
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">العميل</p>
                      <p className="font-medium">{contract.customerName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">الوحدة</p>
                      <p className="font-medium">{contract.unitName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">السعر الإجمالي</p>
                      <p className="font-medium text-green-600">{contract.totalPrice.toLocaleString('ar-EG')} ج.م</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">تاريخ البداية</p>
                      <p className="font-medium">{contract.startDate.toLocaleDateString('ar-EG')}</p>
                    </div>
                  </div>
                </div>

                {/* ملخص مالي */}
                <div className="grid gap-4 md:grid-cols-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">المقدم</p>
                    <p className="text-lg font-bold text-blue-600">{contract.downPayment.toLocaleString('ar-EG')} ج.م</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">الخصم</p>
                    <p className="text-lg font-bold text-orange-600">{contract.discountAmount.toLocaleString('ar-EG')} ج.م</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">المتبقي</p>
                    <p className="text-lg font-bold text-red-600">{contract.remaining.toLocaleString('ar-EG')} ج.م</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">قيمة القسط</p>
                    <p className="text-lg font-bold text-purple-600">{contract.installmentAmount.toLocaleString('ar-EG')} ج.م</p>
                  </div>
                </div>

                {/* بيانات السمسار */}
                {contract.brokerName && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">السمسار: {contract.brokerName}</span>
                      {contract.brokerAmount > 0 && (
                        <span className="text-sm text-blue-600">
                          (عمولة: {contract.brokerAmount.toLocaleString('ar-EG')} ج.م)
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {contract.notes && (
                  <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>ملاحظات:</strong> {contract.notes}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 ml-1" />
                    تعديل العقد
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a href={`/installments?contract=${contract.id}`}>
                      <Calendar className="h-4 w-4 ml-1" />
                      إدارة الأقساط ({contract.installments})
                    </a>
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