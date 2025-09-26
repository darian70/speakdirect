export type Plan = "basic_answer" | "assistant_calendar" | "assistant_outbound" | "service_shop";

const FEATURES_BY_PLAN: Record<Plan, Set<string>> = {
  basic_answer: new Set(["inbound_answer", "call_logs"]),
  assistant_calendar: new Set(["inbound_answer", "call_logs", "appointments"]),
  assistant_outbound: new Set(["inbound_answer", "call_logs", "appointments", "outbound_reminders"]),
  service_shop: new Set([
    "inbound_answer",
    "call_logs",
    "appointments",
    "outbound_reminders",
    "job_update_calls",
    "technician_ui",
  ]),
};

export function hasFeature(plan: string | undefined | null, feature: string): boolean {
  const p = (plan as Plan) || "basic_answer";
  const set = FEATURES_BY_PLAN[p] || new Set<string>();
  return set.has(feature);
}
