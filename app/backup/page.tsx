import AutoBackup from '../components/AutoBackup';

export default function BackupPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">النسخ الاحتياطي</h1>
        <p className="text-gray-600 mt-2">
          إدارة النسخ الاحتياطية التلقائية واليدوية لحماية بياناتك
        </p>
      </div>
      
      <AutoBackup />
    </div>
  );
}