'use client'

import { Layout } from '@/components/layout'
import { StatsCards, RevenueChart, UnitsDistribution } from '@/components/charts'
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
  HandHeart,
  Plus,
  BarChart3,
  Wallet,
  UserCheck,
  ArrowUpRight,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

export default function Dashboard() {
  // Mock data - في التطبيق الحقيقي سيتم جلبها من قاعدة البيانات
  const stats = {
    totalUnits: 0,
    totalCustomers: 0,
    activeContracts: 0,
    totalBalance: 0,
    pendingInstallments: 0,
    completedContracts: 0,
    totalRevenue: 0,
    activeBrokers: 0
  }

  const quickActions = [
    {
      title: 'وحدة عقارية جديدة',
      description: 'إضافة وحدة عقارية للمشروع',
      href: '/units',
      icon: Building2,
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-blue-600'
    },
    {
      title: 'عميل جديد',
      description: 'إضافة عميل جديد للنظام',
      href: '/customers',
      icon: Users,
      color: 'bg-green-600 hover:bg-green-700',
      textColor: 'text-green-600'
    },
    {
      title: 'عقد جديد',
      description: 'إنشاء عقد بيع أو إيجار',
      href: '/contracts',
      icon: FileText,
      color: 'bg-purple-600 hover:bg-purple-700',
      textColor: 'text-purple-600'
    },
    {
      title: 'شريك جديد',
      description: 'إضافة شريك في الاستثمار',
      href: '/partners',
      icon: HandHeart,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      textColor: 'text-indigo-600'
    },
    {
      title: 'عملية مالية',
      description: 'إيداع أو سحب أو تحويل',
      href: '/safes',
      icon: Wallet,
      color: 'bg-orange-600 hover:bg-orange-700',
      textColor: 'text-orange-600'
    },
    {
      title: 'وسيط جديد',
      description: 'إضافة وسيط عقاري',
      href: '/brokers',
      icon: UserCheck,
      color: 'bg-teal-600 hover:bg-teal-700',
      textColor: 'text-teal-600'
    }
  ]

  const recentActivities = [
    // Mock activities - سيتم جلبها من audit_log
    {
      id: 1,
      type: 'info',
      title: 'مرحباً بك في النظام',
      description: 'ابدأ بإضافة وحدات وعملاء جدد',
      time: 'الآن',
      icon: Activity
    }
  ]

  // Mock chart data
  const revenueData = [
    { name: 'يناير', value: 0, color: 'bg-blue-600' },
    { name: 'فبراير', value: 0, color: 'bg-green-600' },
    { name: 'مارس', value: 0, color: 'bg-purple-600' },
    { name: 'أبريل', value: 0, color: 'bg-orange-600' }
  ]

  const unitsData = [
    { name: 'شقق', value: 0, color: 'bg-blue-600' },
    { name: 'فيلل', value: 0, color: 'bg-green-600' },
    { name: 'محلات', value: 0, color: 'bg-purple-600' },
    { name: 'مكاتب', value: 0, color: 'bg-orange-600' }
  ]

  return (
    <Layout title="لوحة التحكم الرئيسية" subtitle="نظرة شاملة على أداء الاستثمار العقاري">
      {/* Key Performance Indicators */}
      <StatsCards stats={stats} />

      {/* Quick Actions Panel */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-600" />
            الإجراءات السريعة
          </CardTitle>
          <CardDescription>
            اختصارات سريعة للعمليات الأكثر استخداماً
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link key={index} href={action.href}>
                  <div className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 group-hover:bg-opacity-80`}>
                        <Icon className={`h-5 w-5 ${action.textColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {action.description}
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Charts and Analytics */}
      <div className="grid gap-8 lg:grid-cols-2 mb-8">
        <RevenueChart data={revenueData} title="الإيرادات الشهرية" />
        <UnitsDistribution data={unitsData} />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                الأنشطة الأخيرة
              </CardTitle>
              <CardDescription>
                آخر العمليات والتحديثات في النظام
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivities.length === 1 ? (
                <div className="text-center py-12">
                  <Activity className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 dark:text-gray-400 mb-2">مرحباً بك في النظام</p>
                  <p className="text-sm text-gray-400">ابدأ بإضافة وحدات وعملاء لرؤية الأنشطة هنا</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((activity) => {
                    const Icon = activity.icon
                    return (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">{activity.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats & Alerts */}
        <div className="space-y-6">
          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                المهام المعلقة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">أقساط متأخرة</span>
                  </div>
                  <span className="text-sm font-bold text-yellow-600">{stats.pendingInstallments}</span>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">عقود تحتاج متابعة</span>
                  </div>
                  <span className="text-sm font-bold text-blue-600">0</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">مستحقات وسطاء</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">0 ج.م</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                ملخص الأداء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>معدل إتمام العقود</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>معدل تحصيل الأقساط</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>رضا العملاء</span>
                    <span className="font-medium">100%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}