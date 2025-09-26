import { redirect } from 'next/navigation'

const CONSOLE_URL = (process.env.NEXT_PUBLIC_CONSOLE_URL || 'http://localhost:2001').replace(/\/$/, '')

export default function SignInRedirectPage() {
  redirect(`${CONSOLE_URL}/sign-in`)
}
