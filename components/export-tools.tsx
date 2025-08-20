'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Download,
  FileText,
  FileSpreadsheet,
  Calendar,
  Filter,
  Loader2
} from 'lucide-react'

interface ExportToolsProps {
  data: any[]
  filename: string
  title: string
  className?: string
}

export function ExportTools({ data, filename, title, className }: ExportToolsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel'>('pdf')

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // في التطبيق الحقيقي سيتم استخدام jsPDF
      const content = `
تقرير: ${title}
تاريخ التصدير: ${new Date().toLocaleDateString('ar-EG')}
عدد السجلات: ${data.length}

${data.map((item, index) => 
  `${index + 1}. ${JSON.stringify(item, null, 2)}`
).join('\n\n')}
      `
      
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      alert('تم تصدير التقرير بنجاح!')
    } catch (error) {
      alert('فشل في تصدير التقرير')
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportExcel = async () => {
    setIsExporting(true)
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // في التطبيق الحقيقي سيتم استخدام xlsx
      const csvContent = [
        Object.keys(data[0] || {}).join(','),
        ...data.map(item => Object.values(item).join(','))
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      alert('تم تصدير البيانات بنجاح!')
    } catch (error) {
      alert('فشل في تصدير البيانات')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-green-600" />
          تصدير البيانات
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>تنسيق التصدير</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button
                variant={exportFormat === 'pdf' ? 'default' : 'outline'}
                onClick={() => setExportFormat('pdf')}
                className="justify-start"
              >
                <FileText className="h-4 w-4 ml-2" />
                PDF
              </Button>
              <Button
                variant={exportFormat === 'excel' ? 'default' : 'outline'}
                onClick={() => setExportFormat('excel')}
                className="justify-start"
              >
                <FileSpreadsheet className="h-4 w-4 ml-2" />
                Excel
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex gap-2">
              <Button
                onClick={exportFormat === 'pdf' ? handleExportPDF : handleExportExcel}
                disabled={isExporting || data.length === 0}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 ml-2" />
                )}
                {isExporting ? 'جاري التصدير...' : `تصدير ${exportFormat.toUpperCase()}`}
              </Button>
            </div>
            
            {data.length === 0 && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                لا توجد بيانات للتصدير
              </p>
            )}
            
            <div className="text-xs text-gray-500 mt-2 text-center">
              سيتم تصدير {data.length} سجل
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}