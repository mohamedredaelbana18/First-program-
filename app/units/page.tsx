'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Building2, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MapPin, 
  Ruler,
  DollarSign,
  Home,
  Building,
  Loader2
} from 'lucide-react'

interface Unit {
  id: string
  name: string
  type?: string | null
  area?: number | null
  location?: string | null
  price: number
  description?: string | null
  status: string
  createdAt: Date
  updatedAt: Date
}

export default function UnitsPage() {
  const [units, setUnits] = useState<Unit[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newUnit, setNewUnit] = useState({
    name: '',
    type: '',
    area: '',
    location: '',
    price: '',
    description: '',
    status: 'متاح'
  })

  const unitTypes = ['شقة', 'فيلا', 'محل تجاري', 'مكتب', 'أرض', 'مستودع', 'أخرى']
  const unitStatuses = ['متاح', 'محجوز', 'مباع', 'تحت الصيانة']

  // جلب الوحدات من قاعدة البيانات
  useEffect(() => {
    fetchUnits()
  }, [])

  const fetchUnits = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/units')
      if (response.ok) {
        const data = await response.json()
        setUnits(data.map((unit: any) => ({
          ...unit,
          createdAt: new Date(unit.createdAt),
          updatedAt: new Date(unit.updatedAt)
        })))
      }
    } catch (error) {
      console.error('خطأ في جلب الوحدات:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddUnit = async () => {
    if (!newUnit.name.trim() || !newUnit.price) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUnit),
      })

      if (response.ok) {
        const unit = await response.json()
        setUnits([{
          ...unit,
          createdAt: new Date(unit.createdAt),
          updatedAt: new Date(unit.updatedAt)
        }, ...units])
        setNewUnit({ name: '', type: '', area: '', location: '', price: '', description: '', status: 'متاح' })
        setShowAddForm(false)
      } else {
        const error = await response.json()
        alert(error.error || 'فشل في إضافة الوحدة')
      }
    } catch (error) {
      alert('فشل في إضافة الوحدة')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteUnit = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الوحدة؟')) return

    try {
      const response = await fetch(`/api/units/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setUnits(units.filter(u => u.id !== id))
      } else {
        const error = await response.json()
        alert(error.error || 'فشل في حذف الوحدة')
      }
    } catch (error) {
      alert('فشل في حذف الوحدة')
    }
  }

  const filteredUnits = units.filter(unit =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.location?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'متاح': return 'bg-green-100 text-green-800'
      case 'محجوز': return 'bg-yellow-100 text-yellow-800'
      case 'مباع': return 'bg-blue-100 text-blue-800'
      case 'تحت الصيانة': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type?: string | null) => {
    switch (type) {
      case 'شقة': return <Home className="h-5 w-5" />
      case 'فيلا': return <Building className="h-5 w-5" />
      case 'محل تجاري': return <Building2 className="h-5 w-5" />
      default: return <Building2 className="h-5 w-5" />
    }
  }

  const totalValue = units.reduce((sum, unit) => sum + unit.price, 0)

  return (
    <Layout title="إدارة الوحدات العقارية" subtitle="إدارة وتنظيم الوحدات والمشاريع العقارية">
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              قاعدة بيانات الوحدات
            </h2>
            <p className="text-sm text-gray-500">
              إجمالي الوحدات: {units.length} | القيمة الإجمالية: {totalValue.toLocaleString('ar-EG')} ج.م
            </p>
          </div>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 ml-2" />
          وحدة جديدة
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="البحث في الوحدات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>إضافة وحدة عقارية جديدة</CardTitle>
            <CardDescription>سيتم حفظ البيانات في PostgreSQL</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>اسم الوحدة *</Label>
                <Input
                  value={newUnit.name}
                  onChange={(e) => setNewUnit({...newUnit, name: e.target.value})}
                  placeholder="أدخل اسم الوحدة"
                  disabled={submitting}
                />
              </div>
              <div>
                <Label>السعر (ج.م) *</Label>
                <Input
                  type="number"
                  value={newUnit.price}
                  onChange={(e) => setNewUnit({...newUnit, price: e.target.value})}
                  placeholder="أدخل السعر"
                  disabled={submitting}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={handleAddUnit} 
                disabled={submitting || !newUnit.name.trim() || !newUnit.price}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 ml-2" />
                )}
                {submitting ? 'جاري الحفظ...' : 'إضافة الوحدة'}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading or Units List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-blue-600" />
          <p>جاري تحميل الوحدات من قاعدة البيانات...</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUnits.map((unit) => (
            <Card key={unit.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      {getTypeIcon(unit.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{unit.name}</h3>
                      {unit.type && <p className="text-sm text-gray-500">{unit.type}</p>}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(unit.status)}`}>
                    {unit.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-lg font-bold text-blue-600">
                    <DollarSign className="h-5 w-5" />
                    <span>{unit.price.toLocaleString('ar-EG')} ج.م</span>
                  </div>

                  {unit.area && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Ruler className="h-4 w-4" />
                      <span>{unit.area} متر مربع</span>
                    </div>
                  )}

                  {unit.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{unit.location}</span>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 pt-2 border-t">
                    ID: {unit.id} | تم الإنشاء: {unit.createdAt.toLocaleDateString('ar-EG')}
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 ml-1" />
                    تعديل
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteUnit(unit.id)}
                    className="text-red-600 hover:bg-red-50"
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