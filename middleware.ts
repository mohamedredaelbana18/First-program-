import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // إضافة أي منطق middleware إضافي هنا إذا لزم الأمر
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // السماح بالوصول للصفحات العامة
        const publicPaths = [
          '/',
          '/auth/signin',
          '/auth/signup',
          '/api/auth',
        ]
        
        const { pathname } = req.nextUrl
        
        // السماح بالوصول للصفحات العامة
        if (publicPaths.some(path => pathname.startsWith(path))) {
          return true
        }
        
        // طلب تسجيل الدخول للصفحات المحمية
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
}