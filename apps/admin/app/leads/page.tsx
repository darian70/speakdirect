import 'server-only'

async function getLeads() {
  const apiBase = process.env.API_BASE_URL
  const adminToken = process.env.API_ADMIN_TOKEN
  if (!apiBase || !adminToken) return { ok: false, error: 'server_not_configured' } as const
  const res = await fetch(`${apiBase.replace(/\/$/, '')}/admin/leads`, {
    headers: { Authorization: `Bearer ${adminToken}` },
    cache: 'no-store',
  })
  const data = await res.json().catch(() => ({}))
  return res.ok ? { ok: true as const, leads: data.leads || [] } : { ok: false as const, error: data?.error || 'api_error' }
}

export default async function LeadsPage() {
  const r = await getLeads()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Leads</h1>
        <p className="text-gray-600 text-sm">Inbound website leads (pending/confirmed)</p>
      </div>
      {!r.ok ? (
        <div className="card text-sm text-red-600">{r.error === 'server_not_configured' ? 'Set API_BASE_URL and API_ADMIN_TOKEN in apps/admin/.env.local' : `Error: ${r.error}`}</div>
      ) : (
        <div className="grid gap-3">
          {r.leads.length === 0 ? (
            <div className="text-sm text-gray-500">No leads yet.</div>
          ) : r.leads.map((l: any) => (
            <div key={l.id} className="card flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{l.name} <span className="text-gray-500">{`<${l.email}>`}</span></div>
                <div className="text-xs text-gray-500">Status: {l.status} · {new Date(l.ts).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
