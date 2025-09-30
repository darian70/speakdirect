import { NextRequest, NextResponse } from 'next/server'
import { tenantHeaders } from '../../../../lib/tenant'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const apiBase = process.env.API_BASE_URL
    if (!apiBase) return NextResponse.json({ ok: false, error: 'server_not_configured' }, { status: 500 })
    const id = params.id
    const res = await fetch(`${apiBase.replace(/\/$/, '')}/calls/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json', ...(await tenantHeaders()) },
      cache: 'no-store',
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return NextResponse.json(data || { ok: false, error: 'proxy_error' }, { status: res.status })
    return NextResponse.json(data)
  } catch (err) {
    const message = (err as any)?.message || String(err)
    return NextResponse.json({ ok: false, error: 'unexpected', message }, { status: 500 })
  }
}
