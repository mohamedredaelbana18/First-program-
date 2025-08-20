// منسقات البيانات للعرض العربي

/**
 * تنسيق المبالغ المالية بالأرقام العربية
 */
export function formatMoneyEGP(value: number): string {
  if (!isFinite(value)) return '—'
  
  // تحويل الأرقام الإنجليزية إلى عربية
  const arabicNumbers = (num: string) => {
    const arabicDigits = '٠١٢٣٤٥٦٧٨٩'
    return num.replace(/[0-9]/g, (digit) => arabicDigits[parseInt(digit)])
  }
  
  // تنسيق الرقم مع فواصل
  const formatted = new Intl.NumberFormat('ar-EG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
  
  // استبدال الفواصل الإنجليزية بالعربية
  const arabicFormatted = formatted
    .replace(/,/g, '٬') // فاصلة الآلاف العربية
    .replace(/\./g, '٫') // علامة عشرية عربية
  
  return arabicNumbers(arabicFormatted) + ' ج.م'
}

/**
 * تنسيق التاريخ بالأرقام العربية
 */
export function formatDateArabic(date: string | Date): string {
  if (!date) return '—'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  if (!dateObj || isNaN(dateObj.getTime())) return '—'
  
  // تنسيق التاريخ
  const year = dateObj.getFullYear().toString()
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const day = dateObj.getDate().toString().padStart(2, '0')
  
  const formatted = `${year}/${month}/${day}`
  
  // تحويل إلى أرقام عربية
  const arabicNumbers = (num: string) => {
    const arabicDigits = '٠١٢٣٤٥٦٧٨٩'
    return num.replace(/[0-9]/g, (digit) => arabicDigits[parseInt(digit)])
  }
  
  return arabicNumbers(formatted)
}

/**
 * ملخص الشركاء للعرض في العنوان
 */
export function partnersSummary(
  partners?: Array<{ name: string; sharePercent?: number }>
): { text: string; tooltip: string } {
  if (!partners || partners.length === 0) {
    return { text: 'الشركاء: —', tooltip: 'لا يوجد شركاء' }
  }
  
  const count = partners.length
  
  if (count === 1) {
    const partner = partners[0]
    const shareText = partner.sharePercent ? ` (${partner.sharePercent}%)` : ''
    return {
      text: `الشركاء: ${partner.name}${shareText}`,
      tooltip: `شريك واحد: ${partner.name}${shareText}`
    }
  }
  
  if (count === 2) {
    const names = partners.map(p => {
      const shareText = p.sharePercent ? ` (${p.sharePercent}%)` : ''
      return `${p.name}${shareText}`
    }).join('، ')
    
    return {
      text: `الشركاء: ${names}`,
      tooltip: `شريكان: ${names}`
    }
  }
  
  // أكثر من 2 شركاء
  const firstTwo = partners.slice(0, 2)
  const remaining = count - 2
  
  const firstTwoNames = firstTwo.map(p => p.name).join('، ')
  const remainingText = `+${convertToArabicNumbers(remaining.toString())}`
  
  const fullList = partners.map(p => {
    const shareText = p.sharePercent ? ` (${p.sharePercent}%)` : ''
    return `${p.name}${shareText}`
  }).join('، ')
  
  return {
    text: `الشركاء: ${firstTwoNames} ${remainingText}`,
    tooltip: `جميع الشركاء (${convertToArabicNumbers(count.toString())}): ${fullList}`
  }
}

/**
 * تحويل الأرقام الإنجليزية إلى عربية
 */
export function convertToArabicNumbers(num: string | number): string {
  const arabicDigits = '٠١٢٣٤٥٦٧٨٩'
  return num.toString().replace(/[0-9]/g, (digit) => arabicDigits[parseInt(digit)])
}

/**
 * تنسيق النسبة المئوية
 */
export function formatPercentage(value?: number): string {
  if (value === undefined || value === null || !isFinite(value)) return '—'
  
  const formatted = value.toFixed(1) + '%'
  return convertToArabicNumbers(formatted)
}

/**
 * تنسيق العدد بالأرقام العربية
 */
export function formatNumber(value: number): string {
  if (!isFinite(value)) return '—'
  return convertToArabicNumbers(value.toString())
}