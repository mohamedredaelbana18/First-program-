'use client';

import { useState, useEffect } from 'react';
import { Download, Upload, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

interface BackupInfo {
  id: string;
  timestamp: Date;
  size: number;
  type: 'auto' | 'manual';
  status: 'success' | 'error';
}

export default function AutoBackup() {
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [lastBackup, setLastBackup] = useState<Date | null>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);

  useEffect(() => {
    // Load backup history from localStorage
    const saved = localStorage.getItem('backupHistory');
    if (saved) {
      const parsed = JSON.parse(saved).map((b: any) => ({
        ...b,
        timestamp: new Date(b.timestamp)
      }));
      setBackups(parsed);
      if (parsed.length > 0) {
        setLastBackup(parsed[0].timestamp);
      }
    }

    // Auto backup every 24 hours
    if (autoBackupEnabled) {
      const interval = setInterval(() => {
        const now = new Date();
        const last = lastBackup ? new Date(lastBackup) : null;
        
        if (!last || (now.getTime() - last.getTime()) > 24 * 60 * 60 * 1000) {
          performAutoBackup();
        }
      }, 60 * 60 * 1000); // Check every hour

      return () => clearInterval(interval);
    }
  }, [autoBackupEnabled, lastBackup]);

  const performAutoBackup = async () => {
    setIsBackingUp(true);
    
    try {
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const backup: BackupInfo = {
        id: Date.now().toString(),
        timestamp: new Date(),
        size: Math.floor(Math.random() * 1000000) + 500000, // 500KB - 1.5MB
        type: 'auto',
        status: 'success'
      };

      setBackups(prev => {
        const updated = [backup, ...prev].slice(0, 10); // Keep only last 10 backups
        localStorage.setItem('backupHistory', JSON.stringify(updated));
        return updated;
      });
      
      setLastBackup(backup.timestamp);
      
      // Save backup file
      const data = {
        timestamp: backup.timestamp.toISOString(),
        data: 'Simulated backup data...',
        version: '1.0.0'
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${backup.timestamp.toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Backup failed:', error);
      const failedBackup: BackupInfo = {
        id: Date.now().toString(),
        timestamp: new Date(),
        size: 0,
        type: 'auto',
        status: 'error'
      };
      
      setBackups(prev => {
        const updated = [failedBackup, ...prev].slice(0, 10);
        localStorage.setItem('backupHistory', JSON.stringify(updated));
        return updated;
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  const performManualBackup = async () => {
    setIsBackingUp(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const backup: BackupInfo = {
        id: Date.now().toString(),
        timestamp: new Date(),
        size: Math.floor(Math.random() * 1000000) + 500000,
        type: 'manual',
        status: 'success'
      };

      setBackups(prev => {
        const updated = [backup, ...prev].slice(0, 10);
        localStorage.setItem('backupHistory', JSON.stringify(updated));
        return updated;
      });
      
      setLastBackup(backup.timestamp);
      
      // Save backup file
      const data = {
        timestamp: backup.timestamp.toISOString(),
        data: 'Manual backup data...',
        version: '1.0.0'
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `manual-backup-${backup.timestamp.toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Manual backup failed:', error);
    } finally {
      setIsBackingUp(false);
    }
  };

  const restoreBackup = async (backup: BackupInfo) => {
    if (backup.status === 'error') {
      alert('لا يمكن استعادة نسخة احتياطية فاشلة');
      return;
    }

    if (confirm('هل أنت متأكد من استعادة هذه النسخة الاحتياطية؟ سيتم استبدال جميع البيانات الحالية.')) {
      try {
        // Simulate restore process
        await new Promise(resolve => setTimeout(resolve, 3000));
        alert('تم استعادة النسخة الاحتياطية بنجاح');
      } catch (error) {
        alert('فشل في استعادة النسخة الاحتياطية');
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `منذ ${days} يوم`;
    if (hours > 0) return `منذ ${hours} ساعة`;
    if (minutes > 0) return `منذ ${minutes} دقيقة`;
    return 'الآن';
  };

  return (
    <div className="space-y-6">
      {/* Backup Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            حالة النسخ الاحتياطي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {lastBackup ? formatTimeAgo(lastBackup) : 'لا يوجد'}
              </div>
              <p className="text-sm text-gray-600">آخر نسخة احتياطية</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {backups.filter(b => b.status === 'success').length}
              </div>
              <p className="text-sm text-gray-600">النسخ الناجحة</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {autoBackupEnabled ? 'مفعل' : 'معطل'}
              </div>
              <p className="text-sm text-gray-600">النسخ التلقائي</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات النسخ الاحتياطي</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={performManualBackup}
              disabled={isBackingUp}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {isBackingUp ? 'جاري النسخ...' : 'نسخة احتياطية يدوية'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setAutoBackupEnabled(!autoBackupEnabled)}
              className="flex items-center gap-2"
            >
              {autoBackupEnabled ? 'إيقاف النسخ التلقائي' : 'تفعيل النسخ التلقائي'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <CardTitle>سجل النسخ الاحتياطية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {backups.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                لا توجد نسخ احتياطية
              </div>
            ) : (
              backups.map((backup) => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    {backup.status === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {backup.type === 'auto' ? 'نسخة تلقائية' : 'نسخة يدوية'}
                        </span>
                        <Badge variant={backup.type === 'auto' ? 'secondary' : 'default'}>
                          {backup.type === 'auto' ? 'تلقائي' : 'يدوي'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {backup.timestamp.toLocaleString('ar-EG')} • {formatFileSize(backup.size)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => restoreBackup(backup)}
                      disabled={backup.status === 'error'}
                    >
                      <Upload className="w-4 h-4" />
                      استعادة
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}