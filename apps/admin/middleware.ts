import { NextResponse } from 'next/server'
import { clerkMiddleware } from '@clerk/nextjs/server'

// Only enable Clerk when keys are configured to keep local QA unblocked.
const useClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

export default useClerk
  ? clerkMiddleware({ signInUrl: '/sign-in' })
  : function middleware() {
      return NextResponse.next()
    }

export const config = {
  matcher: ['/', '/leads/:path*', '/tenants/:path*', '/usage/:path*', '/flags/:path*'],
}
