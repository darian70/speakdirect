export const dynamic = 'force-dynamic';

export async function GET() {
  const hasPk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.trim());
  const hasSk = Boolean(process.env.CLERK_SECRET_KEY && process.env.CLERK_SECRET_KEY.trim());
  const data = {
    hasNEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: hasPk,
    hasCLERK_SECRET_KEY: hasSk,
    nodeEnv: process.env.NODE_ENV || 'unknown',
  };
  return new Response(JSON.stringify(data, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
