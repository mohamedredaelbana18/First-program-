'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { 
  FileText, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar, 
  DollarSign,
  ArrowLeft,
  User,
  Building2,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface Contract {
  id: string
  customerId: string
  customerName: string
  unitId: string
  unitName: string
  totalPrice: number
  downPayment: number
  remaining: number
  installments: number
  startDate: Date
  endDate?: Date
  status: string
  notes?: string
  createdAt: Date
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newContract, setNewContract] = useState({
    customerId: '',
    customerName: '',
    unitId: '',
    unitName: '',
    totalPrice: '',
    downPayment: '',
    installments: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    status: 'نشط',
    notes: ''
  })

  const contractStatuses = ['نشط', 'مكتمل', 'متوقف', 'ملغي']

  const handleAddContract = () => {
    if (!newContract.customerName.trim() || !newContract.unitName.trim() || !newContract.totalPrice) return

    const totalPrice = parseFloat(newContract.totalPrice)
    const downPayment = parseFloat(newContract.downPayment) || 0
    const remaining = totalPrice - downPayment

    const contract: Contract = {
      id: `CON-${Date.now()}`,
      customerId: newContract.customerId || `C-${Date.now()}`,
      customerName: newContract.customerName,
      unitId: newContract.unitId || `U-${Date.now()}`,
      unitName: newContract.unitName,
      totalPrice,
      downPayment,
      remaining,
      installments: parseInt(newContract.installments) || 0,
      startDate: new Date(newContract.startDate),
      endDate: newContract.endDate ? new Date(newContract.endDate) : undefined,
      status: newContract.status,
      notes: newContract.notes || undefined,
      createdAt: new Date()
    }

    setContracts([...contracts, contract])
    setNewContract({
      customerId: '', customerName: '', unitId: '', unitName: '',
      totalPrice: '', downPayment: '', installments: '',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '', status: 'نشط', notes: ''
    })
    setShowAddForm(false)
  }

  const handleDeleteContract = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العقد؟')) {
      setContracts(contracts.filter(c => c.id !== id))
    }
  }

  const filteredContracts = contracts.filter(contract =>
    contract.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.unitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.id.toLowerCase().includes(searchTerm.toLowerCase())
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'نشط': return <CheckCircle className="h-4 w-4" />
      case 'مكتمل': return <CheckCircle className="h-4 w-4" />
      case 'متوقف': return <Clock className="h-4 w-4" />
      case 'ملغي': return <AlertCircle className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const totalValue = contracts.reduce((sum, contract) => sum + contract.totalPrice, 0)
  const totalRemaining = contracts.reduce((sum, contract) => sum + contract.remaining, 0)
  const activeContracts = contracts.filter(c => c.status === 'نشط').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800" dir="rtl">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <FileText className="h-6 w-6 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  إدارة العقود
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  إدارة العقود والأقساط والمدفوعات
                </p>
              </div>
            </div>
            <Button onClick={() => setShowAddForm(true)} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 ml-2" />
              عقد جديد
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Stats */}
        <div className="grid gap-6 md:grid-cols-5 mb-8">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث في العقود (العميل، الوحدة، رقم العقد)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
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
        </div>

        {/* Add Contract Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>إنشاء عقد جديد</CardTitle>
              <CardDescription>
                أدخل بيانات العقد الجديد
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="customerName">اسم العميل *</Label>
                  <Input
                    id="customerName"
                    value={newContract.customerName}
                    onChange={(e) => setNewContract({...newContract, customerName: e.target.value})}
                    placeholder="أدخل اسم العميل"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unitName">اسم الوحدة *</Label>
                  <Input
                    id="unitName"
                    value={newContract.unitName}
                    onChange={(e) => setNewContract({...newContract, unitName: e.target.value})}
                    placeholder="أدخل اسم الوحدة"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="totalPrice">السعر الإجمالي (ج.م) *</Label>
                  <Input
                    id="totalPrice"
                    type="number"
                    value={newContract.totalPrice}
                    onChange={(e) => setNewContract({...newContract, totalPrice: e.target.value})}
                    placeholder="أدخل السعر الإجمالي"
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
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">تاريخ البداية</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newContract.startDate}
                    onChange={(e) => setNewContract({...newContract, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">تاريخ النهاية</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newContract.endDate}
                    onChange={(e) => setNewContract({...newContract, endDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="status">حالة العقد</Label>
                  <select
                    id="status"
                    value={newContract.status}
                    onChange={(e) => setNewContract({...newContract, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {contractStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="notes">ملاحظات</Label>
                  <Input
                    id="notes"
                    value={newContract.notes}
                    onChange={(e) => setNewContract({...newContract, notes: e.target.value})}
                    placeholder="أدخل أي ملاحظات إضافية"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddContract} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 ml-2" />
                  إنشاء العقد
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contracts List */}
        {filteredContracts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                لا توجد عقود
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm ? 'لم يتم العثور على عقود تطابق البحث' : 'ابدأ بإنشاء عقد جديد'}
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
          <div className="grid gap-4">
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
                          عقد رقم: {contract.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          تم الإنشاء: {contract.createdAt.toLocaleDateString('ar-EG')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(contract.status)}`}>
                        {getStatusIcon(contract.status)}
                        {contract.status}
                      </span>
                    </div>
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

                  <div className="grid gap-4 md:grid-cols-3 mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">المقدم</p>
                      <p className="text-lg font-bold text-blue-600">{contract.downPayment.toLocaleString('ar-EG')} ج.م</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">المتبقي</p>
                      <p className="text-lg font-bold text-orange-600">{contract.remaining.toLocaleString('ar-EG')} ج.م</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">عدد الأقساط</p>
                      <p className="text-lg font-bold text-purple-600">{contract.installments}</p>
                    </div>
                  </div>

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
                    <Button variant="outline" size="sm" className="flex-1">
                      <Calendar className="h-4 w-4 ml-1" />
                      إدارة الأقساط
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteContract(contract.id)}
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
      </div>
    </div>
  )
}