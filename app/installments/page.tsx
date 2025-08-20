'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/layout'
import { ContractInstallmentsDropdown } from '@/components/contract-installments-dropdown'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Calendar, 
  Search, 
  Filter, 
  DollarSign,
  Download,
  Plus,
  Loader2,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { formatMoneyEGP, convertToArabicNumbers } from '@/lib/formatters'
import Link from 'next/link'

interface ContractWithInstallments {
  id: string
  code?: string | null
  customerName: string
  unitName: string
  unitType?: string
  partners?: Array<{ name: string; sharePercent?: number }>
  totalPrice: number
  installments: number
  installmentsData?: Array<{
    id: string
    amount: number
    dueDate: Date
    status: string
    paidDate?: Date
  }>
}

export default function InstallmentsPageOrganized() {
  const [contracts, setContracts] = useState<ContractWithInstallments[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContractsWithInstallments()
  }, [])

  const fetchContractsWithInstallments = async () => {
    setLoading(true)
    try {
      // جلب العقود مع الأقساط
      const response = await fetch('/api/contracts')
      if (response.ok) {
        const data = await response.json()
        setContracts(data.map((contract: any) => ({
          id: contract.id,
          code: contract.code,
          customerName: contract.customer?.name || 'عميل محذوف',
          unitName: getUnitDisplayName(contract.unit),
          unitType: contract.unit?.unitType,
          partners: [], // سيتم جلبه من الشراكات لاحقاً
          totalPrice: contract.totalPrice,
          installments: contract.installments,
          installmentsData: contract.installmentsList?.map((inst: any) => ({
            ...inst,
            dueDate: new Date(inst.dueDate),
            paidDate: inst.paidDate ? new Date(inst.paidDate) : undefined
          }))
        })))
      }
    } catch (error) {
      console.error('خطأ في جلب العقود:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUnitDisplayName = (unit: any) => {
    if (!unit) return '—'
    
    const parts = []
    if (unit.name) parts.push(`اسم الوحدة (${unit.name})`)
    if (unit.floor) parts.push(`رقم الدور (${unit.floor})`)
    if (unit.building) parts.push(`رقم العمارة (${unit.building})`)
    if (unit.code) parts.push(`كود (${unit.code})`)
    
    return parts.length > 0 ? parts.join(' ') : unit.name || 'وحدة غير محددة'
  }

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      contract.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.unitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.code?.toLowerCase().includes(searchTerm.toLowerCase())

    if (statusFilter === 'all') return matchesSearch

    // فلترة حسب حالة الأقساط
    if (!contract.installmentsData) return false

    const hasMatchingStatus = contract.installmentsData.some(inst => {
      switch (statusFilter) {
        case 'مدفوع':
          return inst.status === 'مدفوع'
        case 'مستحق':
          return inst.status !== 'مدفوع' && new Date(inst.dueDate) >= new Date()
        case 'متأخر':
          return inst.status !== 'مدفوع' && new Date(inst.dueDate) < new Date()
        default:
          return true
      }
    })

    return matchesSearch && hasMatchingStatus
  })

  // حساب الإحصائيات
  const totalContracts = contracts.length
  const contractsWithInstallments = contracts.filter(c => c.installments > 0).length
  const totalInstallments = contracts.reduce((sum, c) => sum + (c.installmentsData?.length || 0), 0)
  const paidInstallments = contracts.reduce((sum, c) => 
    sum + (c.installmentsData?.filter(i => i.status === 'مدفوع').length || 0), 0
  )
  const overdueInstallments = contracts.reduce((sum, c) => 
    sum + (c.installmentsData?.filter(i => 
      i.status !== 'مدفوع' && new Date(i.dueDate) < new Date()
    ).length || 0), 0
  )

  const statusFilters = [
    { value: 'all', label: 'جميع العقود' },
    { value: 'مستحق', label: 'عقود بأقساط مستحقة' },
    { value: 'مدفوع', label: 'عقود بأقساط مدفوعة' },
    { value: 'متأخر', label: 'عقود بأقساط متأخرة' }
  ]

  return (
    <Layout title="إدارة الأقساط" subtitle="عرض الأقساط مجمعة حسب العقود مع إمكانية التوسيع">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{convertToArabicNumbers(totalContracts.toString())}</div>
            <p className="text-sm opacity-80">إجمالي العقود</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{convertToArabicNumbers(contractsWithInstallments.toString())}</div>
            <p className="text-sm opacity-80">عقود بأقساط</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{convertToArabicNumbers(totalInstallments.toString())}</div>
            <p className="text-sm opacity-80">إجمالي الأقساط</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{convertToArabicNumbers(paidInstallments.toString())}</div>
            <p className="text-sm opacity-80">أقساط مدفوعة</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{convertToArabicNumbers(overdueInstallments.toString())}</div>
            <p className="text-sm opacity-80">أقساط متأخرة</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            البحث والفلترة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label>البحث في العقود</Label>
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="العميل، الوحدة، كود العقد..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

            <div>
              <Label>فلتر حسب الأقساط</Label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusFilters.map(filter => (
                  <option key={filter.value} value={filter.value}>{filter.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 ml-2" />
                تصدير التقرير
              </Button>
            </div>

            <div className="flex items-end">
              <Button asChild variant="outline" className="w-full">
                <Link href="/contracts">
                  <Plus className="h-4 w-4 ml-2" />
                  عقد جديد
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* العقود مع dropdown الأقساط */}
      {loading ? (
        <Card>
          <CardContent className="text-center py-12">
            <Loader2 className="h-16 w-16 mx-auto mb-4 text-blue-600 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              جاري تحميل العقود والأقساط...
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              يتم جلب البيانات من قاعدة البيانات
            </p>
          </CardContent>
        </Card>
      ) : filteredContracts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm || statusFilter !== 'all' ? 'لم يتم العثور على عقود' : 'لا توجد عقود مع أقساط'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'جرب معايير بحث مختلفة'
                : 'ابدأ بإنشاء عقود جديدة مع أقساط'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <Link href="/contracts">
                  <Plus className="h-4 w-4 ml-2" />
                  إنشاء عقد جديد
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredContracts.map((contract) => {
            // حساب إحصائيات سريعة للعقد
            const contractInstallments = contract.installmentsData || []
            const contractPaid = contractInstallments.filter(i => i.status === 'مدفوع').length
            const contractOverdue = contractInstallments.filter(i => 
              i.status !== 'مدفوع' && new Date(i.dueDate) < new Date()
            ).length

            return (
              <Card key={contract.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* رأس العقد */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {contract.code || `عقد ${contract.id}`}
                        </h3>
                        <p className="text-sm text-gray-500">
                          العميل: {contract.customerName}
                        </p>
                      </div>
                    </div>

                    {/* إحصائيات سريعة */}
                    <div className="flex items-center gap-2">
                      {contractOverdue > 0 && (
                        <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {convertToArabicNumbers(contractOverdue.toString())} متأخر
                        </Badge>
                      )}
                      <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        {convertToArabicNumbers(contractPaid.toString())}/{convertToArabicNumbers(contractInstallments.length.toString())} مدفوع
                      </Badge>
                    </div>
                  </div>

                  {/* Dropdown الأقساط */}
                  <ContractInstallmentsDropdown
                    contractId={contract.id}
                    contractCode={contract.code || contract.id}
                    unitName={contract.unitName}
                    unitType={contract.unitType}
                    partners={contract.partners}
                    totalPrice={contract.totalPrice}
                  />
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* ملخص إجمالي */}
      {!loading && contracts.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              الملخص الإجمالي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4 text-center">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">إجمالي العقود</p>
                <p className="text-2xl font-bold text-blue-600">
                  {convertToArabicNumbers(totalContracts.toString())}
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">إجمالي الأقساط</p>
                <p className="text-2xl font-bold text-purple-600">
                  {convertToArabicNumbers(totalInstallments.toString())}
                </p>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">أقساط مدفوعة</p>
                <p className="text-2xl font-bold text-green-600">
                  {convertToArabicNumbers(paidInstallments.toString())}
                </p>
              </div>
              
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">أقساط متأخرة</p>
                <p className="text-2xl font-bold text-red-600">
                  {convertToArabicNumbers(overdueInstallments.toString())}
                </p>
                {overdueInstallments > 0 && (
                  <div className="mt-2 flex items-center justify-center gap-1 text-xs text-red-600">
                    <AlertTriangle className="h-3 w-3" />
                    <span>يتطلب متابعة فورية</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </Layout>
  )
}