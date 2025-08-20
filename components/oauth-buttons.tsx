'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Github } from 'lucide-react'

interface OAuthButtonsProps {
  isLoading?: boolean
}

export function OAuthButtons({ isLoading = false }: OAuthButtonsProps) {
  // التحقق من وجود متغيرات البيئة من جانب العميل
  const hasGoogle = typeof window !== 'undefined' && 
    (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 
     document.cookie.includes('next-auth.session-token'))
  
  const hasGitHub = typeof window !== 'undefined' && 
    (process.env.NEXT_PUBLIC_GITHUB_ID || 
     document.cookie.includes('next-auth.session-token'))

  // إذا لم تكن هناك OAuth providers متاحة
  if (!hasGoogle && !hasGitHub) {
    return (
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          تسجيل الدخول بالبريد الإلكتروني متاح
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          لتفعيل Google/GitHub، أضف متغيرات البيئة المطلوبة
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <Button
        variant="outline"
        onClick={() => signIn('google')}
        disabled={isLoading}
        className="w-full"
      >
        تسجيل الدخول بـ Google
      </Button>
      
      <Button
        variant="outline"
        onClick={() => signIn('github')}
        disabled={isLoading}
        className="w-full"
      >
        <Github className="mr-2 h-4 w-4" />
        تسجيل الدخول بـ GitHub
      </Button>
    </div>
  )
}