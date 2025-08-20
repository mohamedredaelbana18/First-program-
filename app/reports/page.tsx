'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  ArrowLeft,
  Calendar,
  FileText,
  Download,
  Filter,
  Building2,
  Users,
  Wallet,
  PieChart,
  LineChart
} from 'lucide-react'

export default function ReportsPage() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [reportType, setReportType] = useState('overview')

  // Mock data - في التطبيق الحقيقي سيتم جلبها من قاعدة البيانات
  const mockStats = {
    totalUnits: 0,
    totalCustomers: 0,
    totalContracts: 0,
    totalRevenue: 0,
    totalBalance: 0,
    activeContracts: 0,
    pendingInstallments: 0,
    completedContracts: 0
  }

  const reportTypes = [
    { value: 'overview', label: 'نظرة عامة', icon: BarChart3 },
    { value: 'financial', label: 'التقرير المالي', icon: DollarSign },
    { value: 'units', label: 'تقرير الوحدات', icon: Building2 },
    { value: 'customers', label: 'تقرير العملاء', icon: Users },
    { value: 'contracts', label: 'تقرير العقود', icon: FileText },
    { value: 'installments', label: 'تقرير الأقساط', icon: Calendar },
    { value: 'partners', label: 'تقرير الشركاء', icon: Users },
    { value: 'safes', label: 'تقرير الخزائن', icon: Wallet }
  ]

  const handleExportPDF = () => {
    alert('سيتم تصدير التقرير كـ PDF')
  }

  const handleExportExcel = () => {
    alert('سيتم تصدير التقرير كـ Excel')
  }

  const renderOverviewReport = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">إجمالي الوحدات</p>
                <p className="text-2xl font-bold">{mockStats.totalUnits}</p>
              </div>
              <Building2 className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">إجمالي العملاء</p>
                <p className="text-2xl font-bold">{mockStats.totalCustomers}</p>
              </div>
              <Users className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">العقود النشطة</p>
                <p className="text-2xl font-bold">{mockStats.activeContracts}</p>
              </div>
              <FileText className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">إجمالي الإيرادات</p>
                <p className="text-xl font-bold">{mockStats.totalRevenue.toLocaleString('ar-EG')} ج.م</p>
              </div>
              <DollarSign className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-blue-600" />
              توزيع الوحدات حسب النوع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-center">
                <PieChart className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500">الرسم البياني سيظهر هنا</p>
                <p className="text-sm text-gray-400">عند إضافة بيانات</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-green-600" />
              الإيرادات الشهرية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-center">
                <LineChart className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500">مخطط الإيرادات سيظهر هنا</p>
                <p className="text-sm text-gray-400">عند إضافة عقود</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

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
              <BarChart3 className="h-6 w-6 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  التقارير والإحصائيات
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  تقارير مالية مفصلة وإحصائيات شاملة
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExportExcel} variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                <Download className="h-4 w-4 ml-2" />
                Excel
              </Button>
              <Button onClick={handleExportPDF} className="bg-red-600 hover:bg-red-700">
                <Download className="h-4 w-4 ml-2" />
                PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              فلاتر التقرير
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <Label htmlFor="reportType">نوع التقرير</Label>
                <select
                  id="reportType"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {reportTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="dateFrom">من تاريخ</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dateTo">إلى تاريخ</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <Filter className="h-4 w-4 ml-2" />
                  تطبيق الفلتر
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Content */}
        {reportType === 'overview' && renderOverviewReport()}

        {reportType === 'financial' && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>الإيرادات والمصروفات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span>إجمالي الإيرادات</span>
                    <span className="font-bold text-green-600">{mockStats.totalRevenue.toLocaleString('ar-EG')} ج.م</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span>المبالغ المحصلة</span>
                    <span className="font-bold text-blue-600">0 ج.م</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <span>المبالغ المستحقة</span>
                    <span className="font-bold text-orange-600">0 ج.م</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>أرصدة الخزائن</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <span>الخزنة الرئيسية</span>
                    <span className="font-bold text-purple-600">0 ج.م</span>
                  </div>
                  <div className="text-center py-4 text-gray-500">
                    <Wallet className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">لا توجد خزائن إضافية</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Other report types placeholder */}
        {reportType !== 'overview' && reportType !== 'financial' && (
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                تقرير {reportTypes.find(t => t.value === reportType)?.label}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                سيتم عرض التقرير المفصل هنا عند إضافة البيانات
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={handleExportPDF} variant="outline">
                  <Download className="h-4 w-4 ml-2" />
                  تصدير PDF
                </Button>
                <Button onClick={handleExportExcel} variant="outline">
                  <Download className="h-4 w-4 ml-2" />
                  تصدير Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}