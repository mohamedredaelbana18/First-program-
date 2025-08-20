import { NextResponse } from 'next/server'

// API endpoint للتحقق من إعدادات NextAuth
export async function GET() {
  const config = {
    nextAuthUrl: process.env.NEXTAUTH_URL,
    hasSecret: !!process.env.NEXTAUTH_SECRET,
    hasGitHub: !!(process.env.GITHUB_ID && process.env.GITHUB_SECRET),
    hasGoogle: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    nodeEnv: process.env.NODE_ENV,
    databaseConnected: !!process.env.DATABASE_URL,
  }

  return NextResponse.json({
    status: 'NextAuth Configuration Check',
    ...config,
    timestamp: new Date().toISOString(),
  })
}