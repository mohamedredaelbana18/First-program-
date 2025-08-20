'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { 
  UserCheck, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin,
  ArrowLeft,
  Percent,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

interface Broker {
  id: string
  name: string
  phone?: string
  email?: string
  address?: string
  commission: number
  notes?: string
  createdAt: Date
}

interface BrokerDue {
  id: string
  brokerId: string
  brokerName: string
  amount: number
  dueDate?: Date
  paidDate?: Date
  status: string
  notes?: string
  createdAt: Date
}

export default function BrokersPage() {
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [brokerDues, setBrokerDues] = useState<BrokerDue[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddBrokerForm, setShowAddBrokerForm] = useState(false)
  const [showAddDueForm, setShowAddDueForm] = useState(false)
  
  const [newBroker, setNewBroker] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    commission: '',
    notes: ''
  })

  const [newDue, setNewDue] = useState({
    brokerId: '',
    amount: '',
    dueDate: '',
    notes: ''
  })

  const dueStatuses = ['مستحق', 'مدفوع', 'متأخر', 'ملغي']

  const handleAddBroker = () => {
    if (!newBroker.name.trim()) return

    const broker: Broker = {
      id: `B-${Date.now()}`,
      name: newBroker.name,
      phone: newBroker.phone || undefined,
      email: newBroker.email || undefined,
      address: newBroker.address || undefined,
      commission: parseFloat(newBroker.commission) || 0,
      notes: newBroker.notes || undefined,
      createdAt: new Date()
    }

    setBrokers([...brokers, broker])
    setNewBroker({ name: '', phone: '', email: '', address: '', commission: '', notes: '' })
    setShowAddBrokerForm(false)
  }

  const handleAddDue = () => {
    if (!newDue.brokerId || !newDue.amount) return

    const broker = brokers.find(b => b.id === newDue.brokerId)
    if (!broker) return

    const due: BrokerDue = {
      id: `BD-${Date.now()}`,
      brokerId: newDue.brokerId,
      brokerName: broker.name,
      amount: parseFloat(newDue.amount),
      dueDate: newDue.dueDate ? new Date(newDue.dueDate) : undefined,
      status: 'مستحق',
      notes: newDue.notes || undefined,
      createdAt: new Date()
    }

    setBrokerDues([...brokerDues, due])
    setNewDue({ brokerId: '', amount: '', dueDate: '', notes: '' })
    setShowAddDueForm(false)
  }

  const handleDeleteBroker = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الوسيط؟')) {
      setBrokers(brokers.filter(b => b.id !== id))
      setBrokerDues(brokerDues.filter(d => d.brokerId !== id))
    }
  }

  const handlePayDue = (dueId: string) => {
    setBrokerDues(brokerDues.map(due => 
      due.id === dueId 
        ? { ...due, status: 'مدفوع', paidDate: new Date() }
        : due
    ))
  }

  const filteredBrokers = brokers.filter(broker =>
    broker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    broker.phone?.includes(searchTerm) ||
    broker.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalCommission = brokers.reduce((sum, broker) => sum + broker.commission, 0)
  const totalDues = brokerDues.reduce((sum, due) => sum + (due.status !== 'مدفوع' ? due.amount : 0), 0)
  const pendingDues = brokerDues.filter(due => due.status === 'مستحق').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مستحق': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'مدفوع': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'متأخر': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'ملغي': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'مستحق': return <Clock className="h-4 w-4" />
      case 'مدفوع': return <CheckCircle className="h-4 w-4" />
      case 'متأخر': return <AlertCircle className="h-4 w-4" />
      case 'ملغي': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

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
              <UserCheck className="h-6 w-6 text-teal-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  إدارة الوسطاء
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  إدارة الوسطاء ومستحقاتهم وعمولاتهم
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowAddDueForm(true)} variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                <Plus className="h-4 w-4 ml-2" />
                مستحق جديد
              </Button>
              <Button onClick={() => setShowAddBrokerForm(true)} className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 ml-2" />
                وسيط جديد
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{brokers.length}</div>
              <p className="text-sm opacity-80">إجمالي الوسطاء</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{totalCommission.toFixed(1)}%</div>
              <p className="text-sm opacity-80">متوسط العمولة</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{pendingDues}</div>
              <p className="text-sm opacity-80">مستحقات معلقة</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-4">
              <div className="text-lg font-bold">{totalDues.toLocaleString('ar-EG')} ج.م</div>
              <p className="text-sm opacity-80">إجمالي المستحقات</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Brokers List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>قائمة الوسطاء</CardTitle>
                <CardDescription>
                  جميع الوسطاء المسجلين في النظام
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="البحث في الوسطاء..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                </div>

                {filteredBrokers.length === 0 ? (
                  <div className="text-center py-8">
                    <UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">
                      {searchTerm ? 'لم يتم العثور على وسطاء' : 'لا يوجد وسطاء'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredBrokers.map((broker) => {
                      const brokerDuesCount = brokerDues.filter(d => d.brokerId === broker.id && d.status !== 'مدفوع').length
                      const brokerTotalDues = brokerDues
                        .filter(d => d.brokerId === broker.id && d.status !== 'مدفوع')
                        .reduce((sum, d) => sum + d.amount, 0)

                      return (
                        <div key={broker.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                                <UserCheck className="h-5 w-5 text-teal-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{broker.name}</h3>
                                <div className="flex items-center gap-1 text-sm text-blue-600">
                                  <Percent className="h-3 w-3" />
                                  <span>عمولة {broker.commission}%</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-left">
                              {brokerDuesCount > 0 && (
                                <div className="text-sm">
                                  <span className="text-red-600 font-medium">
                                    {brokerTotalDues.toLocaleString('ar-EG')} ج.م
                                  </span>
                                  <p className="text-xs text-gray-500">{brokerDuesCount} مستحق</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="grid gap-2 md:grid-cols-2 mb-3">
                            {broker.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Phone className="h-4 w-4" />
                                <span>{broker.phone}</span>
                              </div>
                            )}
                            {broker.email && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Mail className="h-4 w-4" />
                                <span>{broker.email}</span>
                              </div>
                            )}
                          </div>

                          {broker.notes && (
                            <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 mb-3">
                              {broker.notes}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Edit className="h-4 w-4 ml-1" />
                              تعديل
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <DollarSign className="h-4 w-4 ml-1" />
                              المستحقات
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDeleteBroker(broker.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Broker Dues */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>المستحقات</CardTitle>
                <CardDescription>
                  مستحقات الوسطاء المعلقة
                </CardDescription>
              </CardHeader>
              <CardContent>
                {brokerDues.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">لا توجد مستحقات</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {brokerDues.slice(0, 10).map((due) => (
                      <div key={due.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-sm">{due.brokerName}</p>
                            <p className="text-lg font-bold text-green-600">
                              {due.amount.toLocaleString('ar-EG')} ج.م
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(due.status)}`}>
                            {getStatusIcon(due.status)}
                            {due.status}
                          </span>
                        </div>
                        
                        {due.dueDate && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                            <Calendar className="h-3 w-3" />
                            <span>استحقاق: {due.dueDate.toLocaleDateString('ar-EG')}</span>
                          </div>
                        )}

                        {due.status === 'مستحق' && (
                          <Button 
                            size="sm" 
                            onClick={() => handlePayDue(due.id)}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 ml-1" />
                            تسديد
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Broker Form */}
        {showAddBrokerForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>إضافة وسيط جديد</CardTitle>
                <CardDescription>
                  أدخل بيانات الوسيط الجديد
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="brokerName">اسم الوسيط *</Label>
                    <Input
                      id="brokerName"
                      value={newBroker.name}
                      onChange={(e) => setNewBroker({...newBroker, name: e.target.value})}
                      placeholder="أدخل اسم الوسيط"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="brokerPhone">رقم الهاتف</Label>
                    <Input
                      id="brokerPhone"
                      value={newBroker.phone}
                      onChange={(e) => setNewBroker({...newBroker, phone: e.target.value})}
                      placeholder="أدخل رقم الهاتف"
                    />
                  </div>
                  <div>
                    <Label htmlFor="brokerEmail">البريد الإلكتروني</Label>
                    <Input
                      id="brokerEmail"
                      type="email"
                      value={newBroker.email}
                      onChange={(e) => setNewBroker({...newBroker, email: e.target.value})}
                      placeholder="أدخل البريد الإلكتروني"
                    />
                  </div>
                  <div>
                    <Label htmlFor="brokerCommission">نسبة العمولة (%)</Label>
                    <Input
                      id="brokerCommission"
                      type="number"
                      step="0.1"
                      value={newBroker.commission}
                      onChange={(e) => setNewBroker({...newBroker, commission: e.target.value})}
                      placeholder="أدخل نسبة العمولة"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="brokerAddress">العنوان</Label>
                    <Input
                      id="brokerAddress"
                      value={newBroker.address}
                      onChange={(e) => setNewBroker({...newBroker, address: e.target.value})}
                      placeholder="أدخل العنوان"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="brokerNotes">ملاحظات</Label>
                    <Input
                      id="brokerNotes"
                      value={newBroker.notes}
                      onChange={(e) => setNewBroker({...newBroker, notes: e.target.value})}
                      placeholder="أدخل أي ملاحظات إضافية"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleAddBroker} className="bg-teal-600 hover:bg-teal-700">
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة الوسيط
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddBrokerForm(false)}>
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Due Form */}
        {showAddDueForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>إضافة مستحق جديد</CardTitle>
                <CardDescription>
                  أدخل بيانات المستحق الجديد
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dueBroker">اختر الوسيط</Label>
                    <select
                      id="dueBroker"
                      value={newDue.brokerId}
                      onChange={(e) => setNewDue({...newDue, brokerId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">اختر الوسيط</option>
                      {brokers.map(broker => (
                        <option key={broker.id} value={broker.id}>{broker.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="dueAmount">المبلغ المستحق</Label>
                    <Input
                      id="dueAmount"
                      type="number"
                      value={newDue.amount}
                      onChange={(e) => setNewDue({...newDue, amount: e.target.value})}
                      placeholder="أدخل المبلغ"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">تاريخ الاستحقاق</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newDue.dueDate}
                      onChange={(e) => setNewDue({...newDue, dueDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueNotes">ملاحظات</Label>
                    <Input
                      id="dueNotes"
                      value={newDue.notes}
                      onChange={(e) => setNewDue({...newDue, notes: e.target.value})}
                      placeholder="أدخل ملاحظات"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleAddDue} className="bg-teal-600 hover:bg-teal-700">
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة المستحق
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddDueForm(false)}>
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}