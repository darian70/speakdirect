import { NextResponse } from 'next/server'
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware({
  signInUrl: '/sign-in',
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/agents/:path*',
    '/analytics/:path*',
    '/settings/:path*',
    '/billing/:path*',
    '/console/:path*',
    '/(api|trpc)(.*)',
  ],
}
