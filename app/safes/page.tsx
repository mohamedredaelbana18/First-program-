'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { 
  Wallet, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ArrowLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Banknote
} from 'lucide-react'

interface Safe {
  id: string
  name: string
  balance: number
  currency: string
  notes?: string
  createdAt: Date
}

interface Transfer {
  id: string
  fromSafeId: string
  fromSafeName: string
  toSafeId: string
  toSafeName: string
  amount: number
  description?: string
  date: Date
  createdAt: Date
}

export default function SafesPage() {
  const [safes, setSafes] = useState<Safe[]>([
    { 
      id: 'S-main', 
      name: 'الخزنة الرئيسية', 
      balance: 0, 
      currency: 'EGP', 
      createdAt: new Date() 
    }
  ])
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddSafeForm, setShowAddSafeForm] = useState(false)
  const [showTransferForm, setShowTransferForm] = useState(false)
  const [showDepositForm, setShowDepositForm] = useState(false)
  const [showWithdrawForm, setShowWithdrawForm] = useState(false)
  
  const [newSafe, setNewSafe] = useState({
    name: '',
    currency: 'EGP',
    notes: ''
  })

  const [newTransfer, setNewTransfer] = useState({
    fromSafeId: '',
    toSafeId: '',
    amount: '',
    description: ''
  })

  const [depositData, setDepositData] = useState({
    safeId: '',
    amount: '',
    description: ''
  })

  const [withdrawData, setWithdrawData] = useState({
    safeId: '',
    amount: '',
    description: ''
  })

  const currencies = ['EGP', 'USD', 'EUR', 'SAR']

  const handleAddSafe = () => {
    if (!newSafe.name.trim()) return

    const safe: Safe = {
      id: `S-${Date.now()}`,
      name: newSafe.name,
      balance: 0,
      currency: newSafe.currency,
      notes: newSafe.notes || undefined,
      createdAt: new Date()
    }

    setSafes([...safes, safe])
    setNewSafe({ name: '', currency: 'EGP', notes: '' })
    setShowAddSafeForm(false)
  }

  const handleTransfer = () => {
    if (!newTransfer.fromSafeId || !newTransfer.toSafeId || !newTransfer.amount) return
    
    const amount = parseFloat(newTransfer.amount)
    if (amount <= 0) return

    const fromSafe = safes.find(s => s.id === newTransfer.fromSafeId)
    const toSafe = safes.find(s => s.id === newTransfer.toSafeId)
    
    if (!fromSafe || !toSafe || fromSafe.balance < amount) {
      alert('رصيد غير كافي أو خطأ في البيانات')
      return
    }

    // Update balances
    setSafes(safes.map(safe => {
      if (safe.id === newTransfer.fromSafeId) {
        return { ...safe, balance: safe.balance - amount }
      }
      if (safe.id === newTransfer.toSafeId) {
        return { ...safe, balance: safe.balance + amount }
      }
      return safe
    }))

    // Add transfer record
    const transfer: Transfer = {
      id: `T-${Date.now()}`,
      fromSafeId: newTransfer.fromSafeId,
      fromSafeName: fromSafe.name,
      toSafeId: newTransfer.toSafeId,
      toSafeName: toSafe.name,
      amount,
      description: newTransfer.description || undefined,
      date: new Date(),
      createdAt: new Date()
    }

    setTransfers([transfer, ...transfers])
    setNewTransfer({ fromSafeId: '', toSafeId: '', amount: '', description: '' })
    setShowTransferForm(false)
  }

  const handleDeposit = () => {
    if (!depositData.safeId || !depositData.amount) return
    
    const amount = parseFloat(depositData.amount)
    if (amount <= 0) return

    setSafes(safes.map(safe => 
      safe.id === depositData.safeId 
        ? { ...safe, balance: safe.balance + amount }
        : safe
    ))

    const safe = safes.find(s => s.id === depositData.safeId)
    const transfer: Transfer = {
      id: `D-${Date.now()}`,
      fromSafeId: 'external',
      fromSafeName: 'إيداع خارجي',
      toSafeId: depositData.safeId,
      toSafeName: safe?.name || 'خزنة',
      amount,
      description: depositData.description || 'إيداع',
      date: new Date(),
      createdAt: new Date()
    }

    setTransfers([transfer, ...transfers])
    setDepositData({ safeId: '', amount: '', description: '' })
    setShowDepositForm(false)
  }

  const handleWithdraw = () => {
    if (!withdrawData.safeId || !withdrawData.amount) return
    
    const amount = parseFloat(withdrawData.amount)
    if (amount <= 0) return

    const safe = safes.find(s => s.id === withdrawData.safeId)
    if (!safe || safe.balance < amount) {
      alert('رصيد غير كافي')
      return
    }

    setSafes(safes.map(s => 
      s.id === withdrawData.safeId 
        ? { ...s, balance: s.balance - amount }
        : s
    ))

    const transfer: Transfer = {
      id: `W-${Date.now()}`,
      fromSafeId: withdrawData.safeId,
      fromSafeName: safe.name,
      toSafeId: 'external',
      toSafeName: 'سحب خارجي',
      amount,
      description: withdrawData.description || 'سحب',
      date: new Date(),
      createdAt: new Date()
    }

    setTransfers([transfer, ...transfers])
    setWithdrawData({ safeId: '', amount: '', description: '' })
    setShowWithdrawForm(false)
  }

  const handleDeleteSafe = (id: string) => {
    const safe = safes.find(s => s.id === id)
    if (safe && safe.balance !== 0) {
      alert('لا يمكن حذف خزنة تحتوي على رصيد')
      return
    }
    if (confirm('هل أنت متأكد من حذف هذه الخزنة؟')) {
      setSafes(safes.filter(s => s.id !== id))
    }
  }

  const filteredSafes = safes.filter(safe =>
    safe.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalBalance = safes.reduce((sum, safe) => sum + safe.balance, 0)
  const recentTransfers = transfers.slice(0, 5)

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
              <Wallet className="h-6 w-6 text-orange-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  إدارة الخزائن
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  متابعة الأرصدة والتحويلات المالية
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowTransferForm(true)} variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                <ArrowUpRight className="h-4 w-4 ml-2" />
                تحويل
              </Button>
              <Button onClick={() => setShowAddSafeForm(true)} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 ml-2" />
                خزنة جديدة
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{totalBalance.toLocaleString('ar-EG')} ج.م</div>
              <p className="text-sm opacity-80">إجمالي الأرصدة</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{safes.length}</div>
              <p className="text-sm opacity-80">عدد الخزائن</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{transfers.length}</div>
              <p className="text-sm opacity-80">إجمالي التحويلات</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{safes.filter(s => s.balance > 0).length}</div>
              <p className="text-sm opacity-80">خزائن نشطة</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                إيداع سريع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowDepositForm(true)} className="w-full bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 ml-2" />
                إيداع في خزنة
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                سحب سريع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowWithdrawForm(true)} variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-50">
                <ArrowDownLeft className="h-4 w-4 ml-2" />
                سحب من خزنة
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Add Safe Form */}
        {showAddSafeForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>إضافة خزنة جديدة</CardTitle>
              <CardDescription>
                أدخل بيانات الخزنة الجديدة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="safeName">اسم الخزنة *</Label>
                  <Input
                    id="safeName"
                    value={newSafe.name}
                    onChange={(e) => setNewSafe({...newSafe, name: e.target.value})}
                    placeholder="أدخل اسم الخزنة"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="currency">العملة</Label>
                  <select
                    id="currency"
                    value={newSafe.currency}
                    onChange={(e) => setNewSafe({...newSafe, currency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {currencies.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="safeNotes">ملاحظات</Label>
                  <Input
                    id="safeNotes"
                    value={newSafe.notes}
                    onChange={(e) => setNewSafe({...newSafe, notes: e.target.value})}
                    placeholder="أدخل أي ملاحظات إضافية"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddSafe} className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة الخزنة
                </Button>
                <Button variant="outline" onClick={() => setShowAddSafeForm(false)}>
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transfer Form */}
        {showTransferForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>تحويل بين الخزائن</CardTitle>
              <CardDescription>
                تحويل مبلغ من خزنة إلى أخرى
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="fromSafe">من خزنة</Label>
                  <select
                    id="fromSafe"
                    value={newTransfer.fromSafeId}
                    onChange={(e) => setNewTransfer({...newTransfer, fromSafeId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر الخزنة المرسلة</option>
                    {safes.map(safe => (
                      <option key={safe.id} value={safe.id}>
                        {safe.name} ({safe.balance.toLocaleString('ar-EG')} {safe.currency})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="toSafe">إلى خزنة</Label>
                  <select
                    id="toSafe"
                    value={newTransfer.toSafeId}
                    onChange={(e) => setNewTransfer({...newTransfer, toSafeId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر الخزنة المستقبلة</option>
                    {safes.filter(s => s.id !== newTransfer.fromSafeId).map(safe => (
                      <option key={safe.id} value={safe.id}>
                        {safe.name} ({safe.balance.toLocaleString('ar-EG')} {safe.currency})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="transferAmount">المبلغ</Label>
                  <Input
                    id="transferAmount"
                    type="number"
                    value={newTransfer.amount}
                    onChange={(e) => setNewTransfer({...newTransfer, amount: e.target.value})}
                    placeholder="أدخل المبلغ"
                  />
                </div>
                <div>
                  <Label htmlFor="transferDescription">وصف التحويل</Label>
                  <Input
                    id="transferDescription"
                    value={newTransfer.description}
                    onChange={(e) => setNewTransfer({...newTransfer, description: e.target.value})}
                    placeholder="أدخل وصف التحويل"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleTransfer} className="bg-blue-600 hover:bg-blue-700">
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                  تنفيذ التحويل
                </Button>
                <Button variant="outline" onClick={() => setShowTransferForm(false)}>
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Safes List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>الخزائن</CardTitle>
                <CardDescription>
                  قائمة جميع الخزائن وأرصدتها
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredSafes.length === 0 ? (
                  <div className="text-center py-8">
                    <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">لا توجد خزائن</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredSafes.map((safe) => (
                      <div key={safe.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                            <Wallet className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{safe.name}</h3>
                            <p className="text-sm text-gray-500">{safe.currency}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-2xl font-bold text-green-600">
                            {safe.balance.toLocaleString('ar-EG')} {safe.currency}
                          </p>
                          <div className="flex gap-1 mt-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {safe.id !== 'S-main' && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteSafe(safe.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Transfers */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>التحويلات الأخيرة</CardTitle>
                <CardDescription>
                  آخر العمليات المالية
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentTransfers.length === 0 ? (
                  <div className="text-center py-8">
                    <ArrowUpRight className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">لا توجد تحويلات</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentTransfers.map((transfer) => (
                      <div key={transfer.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {transfer.fromSafeId === 'external' ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : transfer.toSafeId === 'external' ? (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4 text-blue-600" />
                            )}
                            <span className="text-sm font-medium">
                              {transfer.amount.toLocaleString('ar-EG')} ج.م
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {transfer.date.toLocaleDateString('ar-EG')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          من: {transfer.fromSafeName} → إلى: {transfer.toSafeName}
                        </p>
                        {transfer.description && (
                          <p className="text-xs text-gray-500 mt-1">{transfer.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                إيداع في خزنة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="depositSafe">اختر الخزنة</Label>
                  <select
                    id="depositSafe"
                    value={depositData.safeId}
                    onChange={(e) => setDepositData({...depositData, safeId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">اختر الخزنة</option>
                    {safes.map(safe => (
                      <option key={safe.id} value={safe.id}>{safe.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="depositAmount">المبلغ</Label>
                  <Input
                    id="depositAmount"
                    type="number"
                    value={depositData.amount}
                    onChange={(e) => setDepositData({...depositData, amount: e.target.value})}
                    placeholder="أدخل المبلغ"
                  />
                </div>
                <div>
                  <Label htmlFor="depositDesc">وصف العملية</Label>
                  <Input
                    id="depositDesc"
                    value={depositData.description}
                    onChange={(e) => setDepositData({...depositData, description: e.target.value})}
                    placeholder="أدخل وصف العملية"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleDeposit} className="bg-green-600 hover:bg-green-700">
                  إيداع
                </Button>
                <Button variant="outline" onClick={() => setShowDepositForm(false)}>
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                سحب من خزنة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="withdrawSafe">اختر الخزنة</Label>
                  <select
                    id="withdrawSafe"
                    value={withdrawData.safeId}
                    onChange={(e) => setWithdrawData({...withdrawData, safeId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">اختر الخزنة</option>
                    {safes.filter(s => s.balance > 0).map(safe => (
                      <option key={safe.id} value={safe.id}>
                        {safe.name} (رصيد: {safe.balance.toLocaleString('ar-EG')} {safe.currency})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="withdrawAmount">المبلغ</Label>
                  <Input
                    id="withdrawAmount"
                    type="number"
                    value={withdrawData.amount}
                    onChange={(e) => setWithdrawData({...withdrawData, amount: e.target.value})}
                    placeholder="أدخل المبلغ"
                  />
                </div>
                <div>
                  <Label htmlFor="withdrawDesc">وصف العملية</Label>
                  <Input
                    id="withdrawDesc"
                    value={withdrawData.description}
                    onChange={(e) => setWithdrawData({...withdrawData, description: e.target.value})}
                    placeholder="أدخل وصف العملية"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleWithdraw} variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                  سحب
                </Button>
                <Button variant="outline" onClick={() => setShowWithdrawForm(false)}>
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}