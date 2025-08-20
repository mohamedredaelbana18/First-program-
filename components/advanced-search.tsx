'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Search,
  Filter,
  X,
  Calendar,
  DollarSign,
  SlidersHorizontal
} from 'lucide-react'

interface AdvancedSearchProps {
  onSearch: (filters: any) => void
  fields: SearchField[]
  className?: string
}

interface SearchField {
  key: string
  label: string
  type: 'text' | 'number' | 'date' | 'select' | 'range'
  options?: { value: string; label: string }[]
  placeholder?: string
}

export function AdvancedSearch({ onSearch, fields, className }: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<Record<string, any>>({})

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
  }

  const handleApplyFilters = () => {
    onSearch(filters)
    setIsOpen(false)
  }

  const handleClearFilters = () => {
    setFilters({})
    onSearch({})
  }

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== '' && value !== null && value !== undefined
  ).length

  return (
    <div className={className}>
      {/* Search Bar */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="البحث السريع..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pr-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="relative"
        >
          <SlidersHorizontal className="h-4 w-4 ml-2" />
          فلاتر متقدمة
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      {/* Advanced Filters */}
      {isOpen && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                الفلاتر المتقدمة
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {fields.map((field) => (
                <div key={field.key}>
                  <Label htmlFor={field.key}>{field.label}</Label>
                  
                  {field.type === 'text' && (
                    <Input
                      id={field.key}
                      value={filters[field.key] || ''}
                      onChange={(e) => handleFilterChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                    />
                  )}

                  {field.type === 'number' && (
                    <Input
                      id={field.key}
                      type="number"
                      value={filters[field.key] || ''}
                      onChange={(e) => handleFilterChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                    />
                  )}

                  {field.type === 'date' && (
                    <Input
                      id={field.key}
                      type="date"
                      value={filters[field.key] || ''}
                      onChange={(e) => handleFilterChange(field.key, e.target.value)}
                    />
                  )}

                  {field.type === 'select' && (
                    <select
                      id={field.key}
                      value={filters[field.key] || ''}
                      onChange={(e) => handleFilterChange(field.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">جميع الخيارات</option>
                      {field.options?.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {field.type === 'range' && (
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="من"
                        type="number"
                        value={filters[`${field.key}_min`] || ''}
                        onChange={(e) => handleFilterChange(`${field.key}_min`, e.target.value)}
                      />
                      <Input
                        placeholder="إلى"
                        type="number"
                        value={filters[`${field.key}_max`] || ''}
                        onChange={(e) => handleFilterChange(`${field.key}_max`, e.target.value)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-6 pt-4 border-t">
              <Button onClick={handleApplyFilters} className="bg-blue-600 hover:bg-blue-700">
                <Filter className="h-4 w-4 ml-2" />
                تطبيق الفلاتر
              </Button>
              <Button variant="outline" onClick={handleClearFilters}>
                <X className="h-4 w-4 ml-2" />
                مسح الفلاتر
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}