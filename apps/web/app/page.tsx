import { redirect } from 'next/navigation'

export default function Page() {
  // Server-side redirect to the Console dashboard
  redirect('/dashboard')
}
