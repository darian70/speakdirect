// Server-only helpers to derive tenant from Clerk (if configured)
export async function tenantHeaders() {
  try {
    const { auth } = await import('@clerk/nextjs/server')
    const { orgId, userId } = auth()
    const tenantId = orgId || userId || 'default'
    return { 'X-Tenant-Id': tenantId }
  } catch {
    return { 'X-Tenant-Id': 'default' }
  }
}
