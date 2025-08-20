'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin,
  ArrowLeft,
  Percent,
  Building2,
  DollarSign,
  TrendingUp
} from 'lucide-react'

interface Partner {
  id: string
  name: string
  phone?: string
  email?: string
  address?: string
  share: number
  groupId?: string
  groupName?: string
  notes?: string
  createdAt: Date
}

interface PartnerGroup {
  id: string
  name: string
  description?: string
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [groups, setGroups] = useState<PartnerGroup[]>([
    { id: 'G1', name: 'مجموعة المستثمرين الأساسيين' },
    { id: 'G2', name: 'شركاء المشاريع الجديدة' },
    { id: 'G3', name: 'المستثمرون الدوليون' }
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showGroupForm, setShowGroupForm] = useState(false)
  const [newPartner, setNewPartner] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    share: '',
    groupId: '',
    notes: ''
  })
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: ''
  })

  const handleAddPartner = () => {
    if (!newPartner.name.trim()) return

    const selectedGroup = groups.find(g => g.id === newPartner.groupId)

    const partner: Partner = {
      id: `P-${Date.now()}`,
      name: newPartner.name,
      phone: newPartner.phone || undefined,
      email: newPartner.email || undefined,
      address: newPartner.address || undefined,
      share: parseFloat(newPartner.share) || 0,
      groupId: newPartner.groupId || undefined,
      groupName: selectedGroup?.name,
      notes: newPartner.notes || undefined,
      createdAt: new Date()
    }

    setPartners([...partners, partner])
    setNewPartner({ name: '', phone: '', email: '', address: '', share: '', groupId: '', notes: '' })
    setShowAddForm(false)
  }

  const handleAddGroup = () => {
    if (!newGroup.name.trim()) return

    const group: PartnerGroup = {
      id: `G-${Date.now()}`,
      name: newGroup.name,
      description: newGroup.description || undefined
    }

    setGroups([...groups, group])
    setNewGroup({ name: '', description: '' })
    setShowGroupForm(false)
  }

  const handleDeletePartner = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الشريك؟')) {
      setPartners(partners.filter(p => p.id !== id))
    }
  }

  const handleDeleteGroup = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه المجموعة؟')) {
      setGroups(groups.filter(g => g.id !== id))
      // Update partners to remove group reference
      setPartners(partners.map(p => 
        p.groupId === id 
          ? { ...p, groupId: undefined, groupName: undefined }
          : p
      ))
    }
  }

  const filteredPartners = partners.filter(partner =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.phone?.includes(searchTerm) ||
    partner.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.groupName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalShares = partners.reduce((sum, partner) => sum + partner.share, 0)
  const avgShare = partners.length > 0 ? totalShares / partners.length : 0

  const getShareColor = (share: number) => {
    if (share >= 20) return 'text-green-600 bg-green-50'
    if (share >= 10) return 'text-blue-600 bg-blue-50'
    if (share >= 5) return 'text-orange-600 bg-orange-50'
    return 'text-gray-600 bg-gray-50'
  }

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
              <Users className="h-6 w-6 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  إدارة الشركاء
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  إدارة الشركاء والشراكات في الوحدات العقارية
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowGroupForm(true)} variant="outline" className="border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                <Plus className="h-4 w-4 ml-2" />
                مجموعة جديدة
              </Button>
              <Button onClick={() => setShowAddForm(true)} className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-4 w-4 ml-2" />
                شريك جديد
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Stats */}
        <div className="grid gap-6 md:grid-cols-5 mb-8">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث في الشركاء (الاسم، الهاتف، البريد، المجموعة)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{partners.length}</div>
              <p className="text-sm opacity-80">إجمالي الشركاء</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{groups.length}</div>
              <p className="text-sm opacity-80">المجموعات</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{totalShares.toFixed(1)}%</div>
              <p className="text-sm opacity-80">إجمالي الحصص</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Group Form */}
        {showGroupForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>إضافة مجموعة شركاء جديدة</CardTitle>
              <CardDescription>
                أدخل بيانات المجموعة الجديدة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="groupName">اسم المجموعة *</Label>
                  <Input
                    id="groupName"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                    placeholder="أدخل اسم المجموعة"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="groupDescription">وصف المجموعة</Label>
                  <Input
                    id="groupDescription"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                    placeholder="أدخل وصف المجموعة"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddGroup} className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة المجموعة
                </Button>
                <Button variant="outline" onClick={() => setShowGroupForm(false)}>
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Partner Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>إضافة شريك جديد</CardTitle>
              <CardDescription>
                أدخل بيانات الشريك الجديد
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">اسم الشريك *</Label>
                  <Input
                    id="name"
                    value={newPartner.name}
                    onChange={(e) => setNewPartner({...newPartner, name: e.target.value})}
                    placeholder="أدخل اسم الشريك"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    value={newPartner.phone}
                    onChange={(e) => setNewPartner({...newPartner, phone: e.target.value})}
                    placeholder="أدخل رقم الهاتف"
                  />
                </div>
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newPartner.email}
                    onChange={(e) => setNewPartner({...newPartner, email: e.target.value})}
                    placeholder="أدخل البريد الإلكتروني"
                  />
                </div>
                <div>
                  <Label htmlFor="address">العنوان</Label>
                  <Input
                    id="address"
                    value={newPartner.address}
                    onChange={(e) => setNewPartner({...newPartner, address: e.target.value})}
                    placeholder="أدخل العنوان"
                  />
                </div>
                <div>
                  <Label htmlFor="share">نسبة الشراكة (%)</Label>
                  <Input
                    id="share"
                    type="number"
                    step="0.1"
                    value={newPartner.share}
                    onChange={(e) => setNewPartner({...newPartner, share: e.target.value})}
                    placeholder="أدخل نسبة الشراكة"
                  />
                </div>
                <div>
                  <Label htmlFor="groupId">المجموعة</Label>
                  <select
                    id="groupId"
                    value={newPartner.groupId}
                    onChange={(e) => setNewPartner({...newPartner, groupId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">بدون مجموعة</option>
                    {groups.map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="notes">ملاحظات</Label>
                  <Input
                    id="notes"
                    value={newPartner.notes}
                    onChange={(e) => setNewPartner({...newPartner, notes: e.target.value})}
                    placeholder="أدخل أي ملاحظات إضافية"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddPartner} className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة الشريك
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Groups List */}
        {groups.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>مجموعات الشركاء</CardTitle>
              <CardDescription>
                إدارة مجموعات الشركاء المختلفة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groups.map((group) => {
                  const groupPartners = partners.filter(p => p.groupId === group.id)
                  const groupTotalShare = groupPartners.reduce((sum, p) => sum + p.share, 0)
                  
                  return (
                    <div key={group.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{group.name}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteGroup(group.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {group.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{group.description}</p>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{groupPartners.length} شريك</span>
                        <span className="font-medium text-green-600">{groupTotalShare.toFixed(1)}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Partners List */}
        {filteredPartners.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                لا يوجد شركاء
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm ? 'لم يتم العثور على شركاء يطابقون البحث' : 'ابدأ بإضافة شريك جديد'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowAddForm(true)} className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة أول شريك
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPartners.map((partner) => (
              <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {partner.name}
                        </h3>
                        {partner.groupName && (
                          <p className="text-sm text-indigo-600">{partner.groupName}</p>
                        )}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${getShareColor(partner.share)}`}>
                      <Percent className="h-3 w-3" />
                      {partner.share}%
                    </div>
                  </div>

                  <div className="space-y-3">
                    {partner.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="h-4 w-4" />
                        <span>{partner.phone}</span>
                      </div>
                    )}

                    {partner.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="h-4 w-4" />
                        <span>{partner.email}</span>
                      </div>
                    )}

                    {partner.address && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4" />
                        <span>{partner.address}</span>
                      </div>
                    )}

                    {partner.notes && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <strong>ملاحظات:</strong> {partner.notes}
                        </p>
                      </div>
                    )}

                    <div className="text-xs text-gray-500 pt-2 border-t">
                      تم الإضافة: {partner.createdAt.toLocaleDateString('ar-EG')}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 ml-1" />
                      تعديل
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Building2 className="h-4 w-4 ml-1" />
                      الوحدات
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeletePartner(partner.id)}
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
      </div>
    </div>
  )
}