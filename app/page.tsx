'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Building2, 
  Users, 
  FileText, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Home,
  Plus,
  BarChart3,
  Wallet
} from 'lucide-react'

export default function RealEstateDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800" dir="rtl">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🏛️</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  مدير الاستثمار العقاري
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  النسخة النهائية - قاعدة بيانات قوية
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                🔒 قفل
              </Button>
              <Button variant="outline" size="sm">
                ⚙️ الإعدادات
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الوحدات</CardTitle>
              <Building2 className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs opacity-80">
                <TrendingUp className="inline h-3 w-3 ml-1" />
                جميع الوحدات العقارية
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">العملاء النشطين</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs opacity-80">
                <Calendar className="inline h-3 w-3 ml-1" />
                عملاء مع عقود نشطة
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">العقود النشطة</CardTitle>
              <FileText className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs opacity-80">
                <BarChart3 className="inline h-3 w-3 ml-1" />
                عقود قيد التنفيذ
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">رصيد الخزائن</CardTitle>
              <Wallet className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0 ج.م</div>
              <p className="text-xs opacity-80">
                <DollarSign className="inline h-3 w-3 ml-1" />
                إجمالي الأرصدة
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                إدارة الوحدات
              </CardTitle>
              <CardDescription>
                إضافة وإدارة الوحدات العقارية والمشاريع
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/units">
                  <Plus className="mr-2 h-4 w-4" />
                  إدارة الوحدات
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                إدارة العملاء
              </CardTitle>
              <CardDescription>
                إضافة عملاء جدد وإدارة بياناتهم
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/customers">
                  <Plus className="mr-2 h-4 w-4" />
                  إدارة العملاء
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                إدارة العقود
              </CardTitle>
              <CardDescription>
                إنشاء عقود جديدة ومتابعة الأقساط
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/contracts">
                  <Plus className="mr-2 h-4 w-4" />
                  إدارة العقود
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-indigo-600" />
                إدارة الشركاء
              </CardTitle>
              <CardDescription>
                إدارة الشركاء والشراكات في الوحدات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link href="/partners">
                  <Users className="mr-2 h-4 w-4" />
                  إدارة الشركاء
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-orange-600" />
                إدارة الخزائن
              </CardTitle>
              <CardDescription>
                متابعة الأرصدة والتحويلات المالية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link href="/safes">
                  <DollarSign className="mr-2 h-4 w-4" />
                  إدارة الخزائن
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-red-600" />
                التقارير والإحصائيات
              </CardTitle>
              <CardDescription>
                تقارير مالية مفصلة وإحصائيات شاملة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link href="/reports">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  عرض التقارير
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>الأنشطة الأخيرة</CardTitle>
            <CardDescription>
              آخر العمليات والتحديثات في النظام
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد أنشطة حديثة</p>
              <p className="text-sm">ابدأ بإضافة وحدات وعملاء لرؤية الأنشطة هنا</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="bg-white dark:bg-gray-800 border-t mt-8">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            💾 قاعدة بيانات PostgreSQL • تصدير PDF/CSV • بحث وفرز متقدم • أقساط مرنة • عمولة وصيانة • تدفقات نقدية • فلاتر تاريخ للتقارير
          </div>
        </div>
      </div>
    </div>
  )
}