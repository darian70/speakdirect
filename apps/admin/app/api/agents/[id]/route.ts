import { NextRequest, NextResponse } from 'next/server'

function tenantFrom(req: NextRequest): string {
  const { searchParams } = new URL(req.url)
  const t = searchParams.get('tenantId') || 'default'
  return t
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const apiBase = process.env.API_BASE_URL
  const adminToken = process.env.API_ADMIN_TOKEN
  if (!apiBase || !adminToken) return NextResponse.json({ ok: false, error: 'server_not_configured' }, { status: 500 })
  const tenantId = tenantFrom(req)
  const res = await fetch(`${apiBase.replace(/\/$/, '')}/agents/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${adminToken}`, 'X-Tenant-Id': tenantId },
    cache: 'no-store',
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) return NextResponse.json(data || { ok: false, error: 'proxy_error' }, { status: res.status })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const apiBase = process.env.API_BASE_URL
    const adminToken = process.env.API_ADMIN_TOKEN
    if (!apiBase || !adminToken) return NextResponse.json({ ok: false, error: 'server_not_configured' }, { status: 500 })
    const body = await req.json().catch(() => ({} as any))
    const tenantId = (body?.tenantId as string) || 'default'
    const res = await fetch(`${apiBase.replace(/\/$/, '')}/agents/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}`, 'X-Tenant-Id': tenantId },
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
