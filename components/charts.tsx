'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  PieChart,
  LineChart,
  BarChart3,
  TrendingUp,
  DollarSign,
  Building2,
  Users,
  Calendar
} from 'lucide-react'

interface ChartData {
  name: string
  value: number
  color?: string
}

interface RevenueChartProps {
  data: ChartData[]
  title: string
  className?: string
}

export function RevenueChart({ data, title, className }: RevenueChartProps) {
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <LineChart className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500">لا توجد بيانات للعرض</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.name}</span>
                <div className="flex items-center gap-3 flex-1 mx-4">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color || 'bg-blue-600'}`}
                      style={{ width: `${(item.value / maxValue) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-green-600">
                    {item.value.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface UnitsDistributionProps {
  data: ChartData[]
  className?: string
}

export function UnitsDistribution({ data, className }: UnitsDistributionProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-purple-600" />
          توزيع الوحدات حسب النوع
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <PieChart className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500">لا توجد وحدات للعرض</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((item, index) => {
              const percentage = total > 0 ? (item.value / total) * 100 : 0
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${item.color || 'bg-blue-600'}`}></div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="text-left">
                    <div className="font-bold">{item.value}</div>
                    <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface StatsCardsProps {
  stats: {
    totalUnits: number
    totalCustomers: number
    activeContracts: number
    totalRevenue: number
    pendingInstallments: number
    completedContracts: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'إجمالي الوحدات',
      value: stats.totalUnits,
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      textColor: 'text-blue-600'
    },
    {
      title: 'العملاء النشطين',
      value: stats.totalCustomers,
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
      textColor: 'text-green-600'
    },
    {
      title: 'العقود النشطة',
      value: stats.activeContracts,
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      textColor: 'text-purple-600'
    },
    {
      title: 'إجمالي الإيرادات',
      value: stats.totalRevenue,
      icon: DollarSign,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
      textColor: 'text-orange-600',
      format: 'currency'
    }
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <div className={`absolute top-0 right-0 w-full h-1 bg-gradient-to-r ${card.color}`}></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {card.format === 'currency' 
                      ? `${card.value.toLocaleString('ar-EG')} ج.م`
                      : card.value.toLocaleString('ar-EG')
                    }
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    <TrendingUp className="inline h-4 w-4 text-green-500 ml-1" />
                    +0% من الشهر الماضي
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}