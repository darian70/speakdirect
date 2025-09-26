import 'server-only'

type UsageEvt = { id: string; tenantId: string; type: string; amount: number; ts: string; meta?: any }

async function getUsage(): Promise<{ ok: boolean; events?: UsageEvt[]; error?: string }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/usage`, { cache: 'no-store' })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return { ok: false, error: data?.error || 'api_error' }
    return { ok: true, events: data.events || [] }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
}

export default async function UsagePage() {
  const r = await getUsage()
  const rows = r.ok ? (r.events || []) : []
  const total = rows.reduce((acc, e) => acc + (e.amount || 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Usage</h1>
        <p className="text-gray-600 text-sm">Monitor chargeable events and consumption</p>
      </div>

      {!r.ok ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{r.error === 'server_not_configured' ? 'Set API_BASE_URL and API_ADMIN_TOKEN in apps/admin/.env.local' : `Error: ${r.error}`}</div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-black/10 bg-white p-4">
            <div className="text-sm text-gray-600">Total units (last 200 events)</div>
            <div className="text-2xl font-semibold">{total.toLocaleString()}</div>
          </div>
          <div className="overflow-x-auto rounded-lg border border-black/10 bg-white">
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-2 text-left">Time</th>
                  <th className="px-3 py-2 text-left">Tenant</th>
                  <th className="px-3 py-2 text-left">Type</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td className="px-3 py-3 text-gray-500" colSpan={4}>No usage events yet.</td>
                  </tr>
                ) : rows.map((e) => (
                  <tr key={e.id} className="odd:bg-white even:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap">{new Date(e.ts).toLocaleString()}</td>
                    <td className="px-3 py-2">{e.tenantId}</td>
                    <td className="px-3 py-2">{e.type}</td>
                    <td className="px-3 py-2 text-right">{e.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
