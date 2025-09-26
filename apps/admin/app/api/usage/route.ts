import { NextResponse } from 'next/server'

export async function GET() {
  const apiBase = process.env.API_BASE_URL
  const adminToken = process.env.API_ADMIN_TOKEN
  if (!apiBase || !adminToken) return NextResponse.json({ ok: false, error: 'server_not_configured' }, { status: 500 })
  const res = await fetch(`${apiBase.replace(/\/$/, '')}/admin/usage`, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${adminToken}` },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) return NextResponse.json(data || { ok: false, error: 'proxy_error' }, { status: res.status })
  return NextResponse.json(data)
}
