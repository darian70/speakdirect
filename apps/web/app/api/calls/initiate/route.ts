import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { clientNumber, technicianNumber, record = true, statusCallbackUrl } = body || {}

    // Basic validation
    const e164 = /^\+\d{7,15}$/
    if (!e164.test(String(clientNumber || ''))) {
      return NextResponse.json({ ok: false, error: 'invalid_client_number' }, { status: 400 })
    }
    if (technicianNumber && !e164.test(String(technicianNumber))) {
      return NextResponse.json({ ok: false, error: 'invalid_technician_number' }, { status: 400 })
    }

    const apiBase = process.env.API_BASE_URL
    const adminToken = process.env.API_ADMIN_TOKEN
    if (!apiBase || !adminToken) {
      return NextResponse.json({ ok: false, error: 'server_not_configured' }, { status: 500 })
    }

    const res = await fetch(`${apiBase.replace(/\/$/, '')}/calls/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ clientNumber, technicianNumber, record, statusCallbackUrl }),
      // Ensure server-side fetch
      cache: 'no-store',
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return NextResponse.json(data || { ok: false, error: 'proxy_error' }, { status: res.status })
    }
    return NextResponse.json(data)
  } catch (err) {
    const message = (err as any)?.message || String(err)
    return NextResponse.json({ ok: false, error: 'unexpected', message }, { status: 500 })
  }
}
