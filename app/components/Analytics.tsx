'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsData {
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  unitStatus: Array<{ status: string; count: number }>;
  customerActivity: Array<{ customer: string; contracts: number; totalPaid: number }>;
  partnerPerformance: Array<{ partner: string; income: number; expenses: number; profit: number }>;
  brokerCommissions: Array<{ broker: string; pending: number; paid: number }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setData({
        monthlyRevenue: [
          { month: 'يناير', revenue: 450000 },
          { month: 'فبراير', revenue: 520000 },
          { month: 'مارس', revenue: 480000 },
          { month: 'أبريل', revenue: 610000 },
          { month: 'مايو', revenue: 550000 },
          { month: 'يونيو', revenue: 680000 },
        ],
        unitStatus: [
          { status: 'متاح', count: 15 },
          { status: 'مباع', count: 28 },
          { status: 'محجوز', count: 8 },
          { status: 'قيد الإنشاء', count: 12 },
        ],
        customerActivity: [
          { customer: 'أحمد محمد', contracts: 3, totalPaid: 850000 },
          { customer: 'فاطمة علي', contracts: 2, totalPaid: 620000 },
          { customer: 'محمد حسن', contracts: 1, totalPaid: 450000 },
          { customer: 'سارة أحمد', contracts: 2, totalPaid: 580000 },
        ],
        partnerPerformance: [
          { partner: 'شركة النور', income: 1200000, expenses: 300000, profit: 900000 },
          { partner: 'مجموعة الأمانة', income: 980000, expenses: 250000, profit: 730000 },
          { partner: 'استثمارات المستقبل', income: 750000, expenses: 180000, profit: 570000 },
        ],
        brokerCommissions: [
          { broker: 'محمد السمسار', pending: 45000, paid: 120000 },
          { broker: 'أحمد الوكيل', pending: 32000, paid: 85000 },
          { broker: 'فاطمة الوسيط', pending: 28000, paid: 95000 },
        ],
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* الإيرادات الشهرية */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">الإيرادات الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} ج.م`, 'الإيرادات']} />
                <Bar dataKey="revenue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* حالة الوحدات */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">حالة الوحدات</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.unitStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.unitStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* أداء الشركاء */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">أداء الشركاء</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.partnerPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="partner" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} ج.م`, 'المبلغ']} />
                <Bar dataKey="income" fill="#10B981" name="الإيرادات" />
                <Bar dataKey="expenses" fill="#EF4444" name="المصروفات" />
                <Bar dataKey="profit" fill="#3B82F6" name="الربح" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* عمولات السماسرة */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">عمولات السماسرة</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.brokerCommissions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="broker" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} ج.م`, 'المبلغ']} />
                <Bar dataKey="pending" fill="#F59E0B" name="مستحق" />
                <Bar dataKey="paid" fill="#10B981" name="مدفوع" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* نشاط العملاء */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">نشاط العملاء</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.customerActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="customer" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}`, 'القيمة']} />
                <Line type="monotone" dataKey="contracts" stroke="#3B82F6" name="عدد العقود" />
                <Line type="monotone" dataKey="totalPaid" stroke="#10B981" name="إجمالي المدفوع" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ملخص سريع */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {data.monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()} ج.م
            </div>
            <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {data.unitStatus.find(u => u.status === 'مباع')?.count || 0}
            </div>
            <p className="text-sm text-gray-600">الوحدات المباعة</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {data.brokerCommissions.reduce((sum, b) => sum + b.pending, 0).toLocaleString()} ج.م
            </div>
            <p className="text-sm text-gray-600">العمولات المستحقة</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {data.partnerPerformance.reduce((sum, p) => sum + p.profit, 0).toLocaleString()} ج.م
            </div>
            <p className="text-sm text-gray-600">إجمالي أرباح الشركاء</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}