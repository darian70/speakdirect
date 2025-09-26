export async function submitLead(apiBase: string, payload: any) {
  const res = await fetch(`${apiBase}/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("submitLead failed");
  return res.json().catch(() => ({}));
}
