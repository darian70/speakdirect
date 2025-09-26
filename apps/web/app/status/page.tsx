import { redirect } from 'next/navigation';
export const metadata = { title: "Status" };

export default function StatusPage() {
  const statusUrl = process.env.NEXT_PUBLIC_STATUS_URL;
  if (statusUrl) {
    // Server-side redirect
    redirect(statusUrl);
  }
  return (
    <main style={{ padding: 24 }}>
      <h1>Status</h1>
      <p>Status page coming soon.</p>
    </main>
  );
}
