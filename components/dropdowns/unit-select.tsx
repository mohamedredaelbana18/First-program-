'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Building2, Loader2 } from 'lucide-react'

interface Unit {
  id: string
  name: string
  code?: string | null
  type?: string | null
  area?: string | null
  floor?: string | null
  building?: string | null
  price: number
  status: string
}

interface UnitSelectProps {
  value: string
  onChange: (unitId: string, unitName: string, unitPrice: number) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  filterStatus?: string // فلتر حسب حالة الوحدة
}

export function UnitSelect({ 
  value, 
  onChange, 
  placeholder = "اختر الوحدة", 
  required = false,
  disabled = false,
  className,
  filterStatus = 'متاح'
}: UnitSelectProps) {
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUnits()
  }, [])

  const fetchUnits = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/units')
      if (response.ok) {
        const data = await response.json()
        setUnits(data)
      }
    } catch (error) {
      console.error('خطأ في جلب الوحدات:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectChange = (unitId: string) => {
    const unit = units.find(u => u.id === unitId)
    if (unit) {
      onChange(unitId, getUnitDisplayName(unit), unit.price)
    }
  }

  // دالة لعرض اسم الوحدة مثل البرنامج الأصلي
  const getUnitDisplayName = (unit: Unit) => {
    if (!unit) return '—'
    
    const parts = []
    if (unit.name) parts.push(`اسم الوحدة (${unit.name})`)
    if (unit.floor) parts.push(`رقم الدور (${unit.floor})`)
    if (unit.building) parts.push(`رقم العمارة (${unit.building})`)
    if (unit.code) parts.push(`كود (${unit.code})`)
    
    return parts.length > 0 ? parts.join(' ') : unit.name || 'وحدة غير محددة'
  }

  // فلترة الوحدات حسب الحالة
  const filteredUnits = filterStatus === 'all' 
    ? units 
    : units.filter(u => u.status === filterStatus)

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-2">
        <Label>الوحدة العقارية {required && <span className="text-red-500">*</span>}</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => window.open('/units', '_blank')}
          className="text-blue-600 hover:text-blue-700"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 p-2 border rounded-md">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-gray-500">جاري تحميل الوحدات...</span>
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
          {filteredUnits.map(unit => (
            <option key={unit.id} value={unit.id}>
              {getUnitDisplayName(unit)} - {unit.price.toLocaleString('ar-EG')} ج.م ({unit.status})
            </option>
          ))}
        </select>
      )}

      {filteredUnits.length === 0 && !loading && (
        <p className="text-sm text-gray-500 mt-1">
          {filterStatus === 'متاح' 
            ? 'لا توجد وحدات متاحة. أضف وحدات جديدة أولاً.'
            : `لا توجد وحدات بحالة "${filterStatus}"`
          }
        </p>
      )}

      {value && (
        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <Building2 className="inline h-4 w-4 ml-1" />
            الوحدة المختارة: {(() => {
              const selectedUnit = units.find(u => u.id === value)
              return selectedUnit ? getUnitDisplayName(selectedUnit) : 'غير محدد'
            })()}
          </p>
          {(() => {
            const selectedUnit = units.find(u => u.id === value)
            return selectedUnit && (
              <p className="text-sm text-green-600 font-medium">
                السعر: {selectedUnit.price.toLocaleString('ar-EG')} ج.م
              </p>
            )
          })()}
        </div>
      )}
    </div>
  )
}