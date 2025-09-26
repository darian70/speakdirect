export default function AdminHome() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-gray-600 text-sm">Internal backoffice for leads, tenants, usage, and flags.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <a className="rounded-lg border border-black/10 p-4 hover:bg-black/5" href="/leads">
          <div className="text-sm font-medium">Leads</div>
          <div className="text-xs text-gray-600">Review and manage inbound leads</div>
        </a>
        <a className="rounded-lg border border-black/10 p-4 hover:bg-black/5" href="/tenants">
          <div className="text-sm font-medium">Tenants</div>
          <div className="text-xs text-gray-600">Companies, org settings and status</div>
        </a>
        <a className="rounded-lg border border-black/10 p-4 hover:bg-black/5" href="/usage">
          <div className="text-sm font-medium">Usage</div>
          <div className="text-xs text-gray-600">Monitor chargeable events</div>
        </a>
      </div>
    </div>
  )
}
