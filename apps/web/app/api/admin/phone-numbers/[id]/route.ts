import { NextRequest, NextResponse } from 'next/server'
import { tenantHeaders } from '../../../../../lib/tenant'

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const apiBase = process.env.API_BASE_URL
    const adminToken = process.env.API_ADMIN_TOKEN
    if (!apiBase || !adminToken) return NextResponse.json({ ok: false, error: 'server_not_configured' }, { status: 500 })
    const id = params.id
    const res = await fetch(`${apiBase.replace(/\/$/, '')}/admin/phone-numbers/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}`, ...(await tenantHeaders()) },
      cache: 'no-store',
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      return NextResponse.json(data || { ok: false, error: 'proxy_error' }, { status: res.status })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = (err as any)?.message || String(err)
    return NextResponse.json({ ok: false, error: 'unexpected', message }, { status: 500 })
  }
}
