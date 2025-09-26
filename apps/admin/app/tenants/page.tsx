import 'server-only'

async function getTenants() {
  const apiBase = process.env.API_BASE_URL
  const adminToken = process.env.API_ADMIN_TOKEN
  if (!apiBase || !adminToken) return { ok: false, error: 'server_not_configured' } as const
  const res = await fetch(`${apiBase.replace(/\/$/, '')}/admin/tenants`, {
    headers: { Authorization: `Bearer ${adminToken}` },
    cache: 'no-store',
  })
  const data = await res.json().catch(() => ({}))
  return res.ok ? { ok: true as const, tenants: data.tenants || [] } : { ok: false as const, error: data?.error || 'api_error' }
}

export default async function TenantsPage() {
  const r = await getTenants()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Tenants</h1>
        <p className="text-gray-600 text-sm">Companies and org settings</p>
      </div>
      {!r.ok ? (
        <div className="rounded-lg border border-black/10 bg-white p-4 text-sm text-gray-800">{r.error === 'server_not_configured' ? 'Set API_BASE_URL and API_ADMIN_TOKEN in apps/admin/.env.local' : `Error: ${r.error}`}</div>
      ) : (
        <div className="grid gap-3">
          {r.tenants.length === 0 ? (
            <div className="text-sm text-gray-500">No tenants yet.</div>
          ) : r.tenants.map((t: any) => (
            <div key={t.id} className="rounded-lg border border-black/10 bg-white p-4">
              <div className="text-sm font-medium">{t.name} <span className="text-gray-500">({t.slug})</span></div>
              <div className="text-xs text-gray-600">Created: {new Date(t.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
