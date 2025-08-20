'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Users, Loader2 } from 'lucide-react'

interface Customer {
  id: string
  name: string
  phone?: string | null
  nationalId?: string | null
  status: string
}

interface CustomerSelectProps {
  value: string
  onChange: (customerId: string, customerName: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export function CustomerSelect({ 
  value, 
  onChange, 
  placeholder = "اختر العميل", 
  required = false,
  disabled = false,
  className 
}: CustomerSelectProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    nationalId: '',
    status: 'نشط'
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/customers')
      if (response.ok) {
        const data = await response.json()
        setCustomers(data)
      }
    } catch (error) {
      console.error('خطأ في جلب العملاء:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCustomer = async () => {
    if (!newCustomer.name.trim()) return

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      })

      if (response.ok) {
        const customer = await response.json()
        setCustomers([customer, ...customers])
        onChange(customer.id, customer.name)
        setNewCustomer({ name: '', phone: '', nationalId: '', status: 'نشط' })
        setShowAddForm(false)
      } else {
        alert('فشل في إضافة العميل')
      }
    } catch (error) {
      alert('فشل في إضافة العميل')
    }
  }

  const handleSelectChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId)
    if (customer) {
      onChange(customerId, customer.name)
    }
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-2">
        <Label>العميل {required && <span className="text-red-500">*</span>}</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowAddForm(true)}
          className="text-green-600 hover:text-green-700"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 p-2 border rounded-md">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-gray-500">جاري تحميل العملاء...</span>
        </div>
      ) : (
        <select
          value={value}
          onChange={(e) => handleSelectChange(e.target.value)}
          disabled={disabled}
          required={required}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <option value="">{placeholder}</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.name} {customer.phone && `- ${customer.phone}`} {customer.nationalId && `(${customer.nationalId})`}
            </option>
          ))}
        </select>
      )}

      {/* Quick Add Customer Form */}
      {showAddForm && (
        <div className="mt-4 p-4 border border-green-200 rounded-lg bg-green-50 dark:bg-green-900/20">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Users className="h-4 w-4" />
            إضافة عميل سريع
          </h4>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label>اسم العميل *</Label>
              <input
                type="text"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                placeholder="أدخل اسم العميل"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <Label>رقم الهاتف</Label>
              <input
                type="text"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                placeholder="أدخل رقم الهاتف"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <Label>الرقم القومي</Label>
              <input
                type="text"
                value={newCustomer.nationalId}
                onChange={(e) => setNewCustomer({...newCustomer, nationalId: e.target.value})}
                placeholder="أدخل الرقم القومي"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <Label>الحالة</Label>
              <select
                value={newCustomer.status}
                onChange={(e) => setNewCustomer({...newCustomer, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="نشط">نشط</option>
                <option value="غير نشط">غير نشط</option>
                <option value="محتمل">محتمل</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button
              onClick={handleAddCustomer}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              disabled={!newCustomer.name.trim()}
            >
              <Plus className="h-4 w-4 ml-1" />
              إضافة
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(false)}
            >
              إلغاء
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}