'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin,
  ArrowLeft,
  Loader2
} from 'lucide-react'

interface Customer {
  id: string
  name: string
  phone?: string | null
  email?: string | null
  nationalId?: string | null
  address?: string | null
  status: string
  notes?: string | null
  createdAt: Date
  updatedAt: Date
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    nationalId: '',
    address: '',
    status: 'نشط',
    notes: ''
  })

  // جلب العملاء من قاعدة البيانات عند تحميل الصفحة
  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/customers')
      if (response.ok) {
        const data = await response.json()
        setCustomers(data.map((customer: any) => ({
          ...customer,
          createdAt: new Date(customer.createdAt),
          updatedAt: new Date(customer.updatedAt)
        })))
      } else {
        console.error('فشل في جلب العملاء')
      }
    } catch (error) {
      console.error('خطأ في جلب العملاء:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCustomer = async () => {
    if (!newCustomer.name.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      })

      if (response.ok) {
        const customer = await response.json()
        setCustomers([{
          ...customer,
          createdAt: new Date(customer.createdAt),
          updatedAt: new Date(customer.updatedAt)
        }, ...customers])
        setNewCustomer({ name: '', phone: '', email: '', nationalId: '', address: '', status: 'نشط', notes: '' })
        setShowAddForm(false)
      } else {
        const error = await response.json()
        alert(error.error || 'فشل في إضافة العميل')
      }
    } catch (error) {
      console.error('خطأ في إضافة العميل:', error)
      alert('فشل في إضافة العميل')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العميل؟')) return

    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setCustomers(customers.filter(c => c.id !== id))
      } else {
        alert('فشل في حذف العميل')
      }
    } catch (error) {
      console.error('خطأ في حذف العميل:', error)
      alert('فشل في حذف العميل')
    }
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.nationalId?.includes(searchTerm) ||
    customer.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Layout title="إدارة العملاء" subtitle="إدارة وتنظيم بيانات العملاء ومعلومات الاتصال">
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <Users className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              قاعدة بيانات العملاء
            </h2>
            <p className="text-sm text-gray-500">
              إجمالي العملاء: {customers.length}
            </p>
          </div>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 ml-2" />
          عميل جديد
        </Button>
      </div>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="البحث في العملاء (الاسم، الهاتف، البريد الإلكتروني)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      {/* Add Customer Form */}
      {showAddForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>إضافة عميل جديد</CardTitle>
            <CardDescription>
              أدخل بيانات العميل الجديد - سيتم حفظها في قاعدة البيانات
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">اسم العميل *</Label>
                <Input
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  placeholder="أدخل اسم العميل"
                  disabled={submitting}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  placeholder="أدخل رقم الهاتف"
                  disabled={submitting}
                />
              </div>
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  placeholder="أدخل البريد الإلكتروني"
                  disabled={submitting}
                />
              </div>
              <div>
                <Label htmlFor="nationalId">الرقم القومي</Label>
                <Input
                  id="nationalId"
                  value={newCustomer.nationalId}
                  onChange={(e) => setNewCustomer({...newCustomer, nationalId: e.target.value})}
                  placeholder="أدخل الرقم القومي"
                  disabled={submitting}
                />
              </div>
              <div>
                <Label htmlFor="address">العنوان</Label>
                <Input
                  id="address"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                  placeholder="أدخل العنوان"
                  disabled={submitting}
                />
              </div>
              <div>
                <Label htmlFor="status">حالة العميل</Label>
                <select
                  id="status"
                  value={newCustomer.status}
                  onChange={(e) => setNewCustomer({...newCustomer, status: e.target.value})}
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                >
                  <option value="نشط">نشط</option>
                  <option value="غير نشط">غير نشط</option>
                  <option value="محتمل">محتمل</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Input
                  id="notes"
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                  placeholder="أدخل أي ملاحظات إضافية"
                  disabled={submitting}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={handleAddCustomer} 
                className="bg-green-600 hover:bg-green-700"
                disabled={submitting || !newCustomer.name.trim()}
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 ml-2" />
                )}
                {submitting ? 'جاري الحفظ...' : 'إضافة العميل'}
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

      {/* Customers List */}
      {loading ? (
        <Card>
          <CardContent className="text-center py-12">
            <Loader2 className="h-16 w-16 mx-auto mb-4 text-blue-600 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              جاري تحميل العملاء...
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              يتم جلب البيانات من قاعدة البيانات
            </p>
          </CardContent>
        </Card>
      ) : filteredCustomers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'لم يتم العثور على عملاء' : 'لا يوجد عملاء في قاعدة البيانات'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm ? 'جرب مصطلح بحث مختلف' : 'ابدأ بإضافة عميل جديد'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 ml-2" />
                إضافة أول عميل
              </Button>
            )}
          </CardContent>
        </Card>
        ) : (
          <div className="grid gap-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {customer.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            تم الإضافة: {customer.createdAt.toLocaleDateString('ar-EG')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid gap-2 md:grid-cols-3 mt-4">
                        {customer.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Phone className="h-4 w-4" />
                            <span>{customer.phone}</span>
                          </div>
                        )}
                        {customer.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="h-4 w-4" />
                            <span>{customer.email}</span>
                          </div>
                        )}
                        {customer.address && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="h-4 w-4" />
                            <span>{customer.address}</span>
                          </div>
                        )}
                      </div>
                      
                      {customer.notes && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>ملاحظات:</strong> {customer.notes}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mr-4">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteCustomer(customer.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
    </Layout>
  )
}