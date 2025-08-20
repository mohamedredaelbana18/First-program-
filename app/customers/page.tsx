'use client'

import { useState } from 'react'
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
  ArrowLeft
} from 'lucide-react'

interface Customer {
  id: string
  name: string
  phone?: string
  email?: string
  address?: string
  notes?: string
  createdAt: Date
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  })

  const handleAddCustomer = () => {
    if (!newCustomer.name.trim()) return

    const customer: Customer = {
      id: `C-${Date.now()}`,
      name: newCustomer.name,
      phone: newCustomer.phone || undefined,
      email: newCustomer.email || undefined,
      address: newCustomer.address || undefined,
      notes: newCustomer.notes || undefined,
      createdAt: new Date()
    }

    setCustomers([...customers, customer])
    setNewCustomer({ name: '', phone: '', email: '', address: '', notes: '' })
    setShowAddForm(false)
  }

  const handleDeleteCustomer = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العميل؟')) {
      setCustomers(customers.filter(c => c.id !== id))
    }
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
                أدخل بيانات العميل الجديد
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
                  />
                </div>
                <div>
                  <Label htmlFor="address">العنوان</Label>
                  <Input
                    id="address"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                    placeholder="أدخل العنوان"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="notes">ملاحظات</Label>
                  <Input
                    id="notes"
                    value={newCustomer.notes}
                    onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                    placeholder="أدخل أي ملاحظات إضافية"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddCustomer} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة العميل
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Customers List */}
        {filteredCustomers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                لا يوجد عملاء
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm ? 'لم يتم العثور على عملاء يطابقون البحث' : 'ابدأ بإضافة عميل جديد'}
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