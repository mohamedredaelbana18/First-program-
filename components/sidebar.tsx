'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Building2,
  Users,
  FileText,
  HandHeart,
  Wallet,
  UserCheck,
  Calendar,
  BarChart3,
  Settings,
  Home,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  ClipboardList,
  TrendingUp,
  PieChart
} from 'lucide-react'

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const navigation = [
    {
      name: 'لوحة التحكم',
      href: '/',
      icon: Home,
      current: pathname === '/',
      badge: null
    },
    {
      name: 'إدارة الوحدات',
      href: '/units',
      icon: Building2,
      current: pathname === '/units',
      badge: null
    },
    {
      name: 'إدارة العملاء',
      href: '/customers',
      icon: Users,
      current: pathname === '/customers',
      badge: null
    },
    {
      name: 'إدارة العقود',
      href: '/contracts',
      icon: FileText,
      current: pathname === '/contracts',
      badge: null
    },
    {
      name: 'إدارة الأقساط',
      href: '/installments',
      icon: Calendar,
      current: pathname === '/installments',
      badge: '2'
    },
    {
      name: 'إدارة الشركاء',
      href: '/partners',
      icon: HandHeart,
      current: pathname === '/partners',
      badge: null
    },
    {
      name: 'إدارة الخزائن',
      href: '/safes',
      icon: Wallet,
      current: pathname === '/safes',
      badge: null
    },
    {
      name: 'إدارة الوسطاء',
      href: '/brokers',
      icon: UserCheck,
      current: pathname === '/brokers',
      badge: null
    }
  ]

  const reports = [
    {
      name: 'التقارير المالية',
      href: '/reports/financial',
      icon: DollarSign,
      current: pathname === '/reports/financial'
    },
    {
      name: 'تقارير الوحدات',
      href: '/reports/units',
      icon: PieChart,
      current: pathname === '/reports/units'
    },
    {
      name: 'تقارير العقود',
      href: '/reports/contracts',
      icon: ClipboardList,
      current: pathname === '/reports/contracts'
    },
    {
      name: 'تقارير الأداء',
      href: '/reports/performance',
      icon: TrendingUp,
      current: pathname === '/reports/performance'
    }
  ]

  return (
    <div className={cn(
      "flex flex-col bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="text-2xl">🏛️</div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                مدير الاستثمار
              </h1>
              <p className="text-xs text-gray-500">النسخة الاحترافية</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          {collapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  item.current
                    ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", item.current ? "text-blue-600" : "text-gray-500")} />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </div>

        {/* Reports Section */}
        <div className="pt-4">
          {!collapsed && (
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              التقارير والإحصائيات
            </h3>
          )}
          <div className="space-y-1">
            {reports.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    item.current
                      ? "bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <Icon className={cn("h-4 w-4 flex-shrink-0", item.current ? "text-purple-600" : "text-gray-400")} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
            pathname === '/settings'
              ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
          )}
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>الإعدادات</span>}
        </Link>
      </div>
    </div>
  )
}