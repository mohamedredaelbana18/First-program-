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

  // جلب الوحدات من قاعدة البيانات عند تحميل الصفحة
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
      } else {
        console.error('فشل في جلب الوحدات')
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
        headers: {
          'Content-Type': 'application/json',
        },
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
      console.error('خطأ في إضافة الوحدة:', error)
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
      console.error('خطأ في حذف الوحدة:', error)
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
      case 'متاح': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'محجوز': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'مباع': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'تحت الصيانة': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
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
  const availableUnits = units.filter(u => u.status === 'متاح').length

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

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="البحث في الوحدات (الاسم، النوع، الموقع)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      {/* Add Unit Form */}
      {showAddForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>إضافة وحدة عقارية جديدة</CardTitle>
            <CardDescription>
              أدخل بيانات الوحدة العقارية الجديدة - سيتم حفظها في قاعدة البيانات
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">اسم الوحدة *</Label>
                <Input
                  id="name"
                  value={newUnit.name}
                  onChange={(e) => setNewUnit({...newUnit, name: e.target.value})}
                  placeholder="أدخل اسم الوحدة"
                  disabled={submitting}
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">نوع الوحدة</Label>
                <select
                  id="type"
                  value={newUnit.type}
                  onChange={(e) => setNewUnit({...newUnit, type: e.target.value})}
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <option value="">اختر نوع الوحدة</option>
                  {unitTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="area">المساحة (متر مربع)</Label>
                <Input
                  id="area"
                  type="number"
                  value={newUnit.area}
                  onChange={(e) => setNewUnit({...newUnit, area: e.target.value})}
                  placeholder="أدخل المساحة"
                  disabled={submitting}
                />
              </div>
              <div>
                <Label htmlFor="location">الموقع</Label>
                <Input
                  id="location"
                  value={newUnit.location}
                  onChange={(e) => setNewUnit({...newUnit, location: e.target.value})}
                  placeholder="أدخل الموقع"
                  disabled={submitting}
                />
              </div>
              <div>
                <Label htmlFor="price">السعر (ج.م) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={newUnit.price}
                  onChange={(e) => setNewUnit({...newUnit, price: e.target.value})}
                  placeholder="أدخل السعر"
                  disabled={submitting}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">حالة الوحدة</Label>
                <select
                  id="status"
                  value={newUnit.status}
                  onChange={(e) => setNewUnit({...newUnit, status: e.target.value})}
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {unitStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">وصف الوحدة</Label>
                <Input
                  id="description"
                  value={newUnit.description}
                  onChange={(e) => setNewUnit({...newUnit, description: e.target.value})}
                  placeholder="أدخل وصف الوحدة"
                  disabled={submitting}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={handleAddUnit} 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={submitting || !newUnit.name.trim() || !newUnit.price}
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 ml-2" />
                )}
                {submitting ? 'جاري الحفظ...' : 'إضافة الوحدة'}
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

      {/* Units List */}
      {loading ? (
        <Card>
          <CardContent className="text-center py-12">
            <Loader2 className="h-16 w-16 mx-auto mb-4 text-blue-600 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              جاري تحميل الوحدات...
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              يتم جلب البيانات من قاعدة البيانات
            </p>
          </CardContent>
        </Card>
      ) : filteredUnits.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'لم يتم العثور على وحدات' : 'لا توجد وحدات عقارية في قاعدة البيانات'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm ? 'جرب مصطلح بحث مختلف' : 'ابدأ بإضافة وحدة عقارية جديدة'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 ml-2" />
                إضافة أول وحدة
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUnits.map((unit) => (
            <Card key={unit.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      {getTypeIcon(unit.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {unit.name}
                      </h3>
                      {unit.type && (
                        <p className="text-sm text-gray-500">{unit.type}</p>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(unit.status)}`}>
                    {unit.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-lg font-bold text-blue-600">
                    <DollarSign className="h-5 w-5" />
                    <span>{unit.price.toLocaleString('ar-EG')} ج.م</span>
                  </div>

                  {unit.area && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Ruler className="h-4 w-4" />
                      <span>{unit.area} متر مربع</span>
                    </div>
                  )}

                  {unit.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span>{unit.location}</span>
                    </div>
                  )}

                  {unit.description && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {unit.description}
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 pt-2 border-t">
                    تم الإضافة: {unit.createdAt.toLocaleDateString('ar-EG')}
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