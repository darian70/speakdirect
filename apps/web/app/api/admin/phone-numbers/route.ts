import { NextRequest, NextResponse } from 'next/server'
import { tenantHeaders } from '../../../../lib/tenant'

export async function GET() {
  try {
    const apiBase = process.env.API_BASE_URL
    const adminToken = process.env.API_ADMIN_TOKEN
    if (!apiBase || !adminToken) return NextResponse.json({ ok: false, error: 'server_not_configured' }, { status: 500 })
    const res = await fetch(`${apiBase.replace(/\/$/, '')}/admin/phone-numbers`, {
      method: 'GET',
      headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${adminToken}`, ...(await tenantHeaders()) },
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

export async function POST(req: NextRequest) {
  try {
    const apiBase = process.env.API_BASE_URL
    const adminToken = process.env.API_ADMIN_TOKEN
    if (!apiBase || !adminToken) return NextResponse.json({ ok: false, error: 'server_not_configured' }, { status: 500 })
    const body = await req.json().catch(() => ({}))
    const res = await fetch(`${apiBase.replace(/\/$/, '')}/admin/phone-numbers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}`, ...(await tenantHeaders()) },
      body: JSON.stringify(body || {}),
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
