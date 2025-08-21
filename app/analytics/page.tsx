import Analytics from '../components/Analytics';

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">لوحة التحليلات</h1>
        <p className="text-gray-600 mt-2">
          عرض شامل للإحصائيات والأداء المالي للمشروع العقاري
        </p>
      </div>
      
      <Analytics />
    </div>
  );
}