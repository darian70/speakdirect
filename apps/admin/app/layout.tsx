import type { ReactNode } from 'react'
import './globals.css'
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export const metadata = {
  title: 'SpeakDirect Admin',
  description: 'Internal backoffice for operations',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const clerkPk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const content = (
    <>
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="font-semibold">SpeakDirect Admin</div>
          <nav className="text-sm text-gray-600 flex items-center gap-4">
            <a href="/" className="hover:text-black">Dashboard</a>
            <a href="/leads" className="hover:text-black">Leads</a>
            <a href="/tenants" className="hover:text-black">Tenants</a>
            <a href="/agents" className="hover:text-black">Agents</a>
            <a href="/usage" className="hover:text-black">Usage</a>
            <a href="/flags" className="hover:text-black">Flags</a>
          </nav>
          <div className="flex items-center gap-3">
            {clerkPk ? (
              <>
                <SignedIn>
                  <UserButton appearance={{ elements: { userButtonAvatarBox: 'h-7 w-7' } }} />
                </SignedIn>
                <SignedOut>
                  <a href="/sign-in" className="text-sm text-gray-600 hover:text-black">Sign in</a>
                </SignedOut>
              </>
            ) : (
              <a href="/sign-in" className="text-sm text-gray-600 hover:text-black">Sign in</a>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </>
  )
  return (
    <html lang="en">
      <body>
        {clerkPk ? (
          <ClerkProvider publishableKey={clerkPk}>{content}</ClerkProvider>
        ) : (
          content
        )}
      </body>
    </html>
  )
}
