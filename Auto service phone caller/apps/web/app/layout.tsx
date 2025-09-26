import './globals.css'
import React from 'react'

export const metadata = {
  title: 'Auto Service Caller Dashboard',
  description: 'Phone-first AI calling dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
