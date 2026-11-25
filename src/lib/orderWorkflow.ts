export type OrderWorkflow = "PENDING" | "PAID" | "DELIVERED" | "CANCELLED";

export function workflowOf(status?: string | null, paymentStatus?: string | null): OrderWorkflow {
  const s = (status ?? "").trim().toLowerCase();
  const p = (paymentStatus ?? "").trim().toLowerCase();
  if (s === "cancelled" || s === "canceled") return "CANCELLED";
  if (s === "done" || s === "delivered" || s === "livree" || s === "livrée") return "DELIVERED";
  if (p === "paid" || p === "payee" || p === "payée" || p === "auto" || s === "paid") return "PAID";
  return "PENDING";
}

/** Valeurs réellement stockées : `done` = livrée, `paid` = payée, `pending` = en attente. */
export function patchForWorkflow(workflow: OrderWorkflow): { status: string; payment_status: string } {
  if (workflow === "PENDING") return { status: "pending", payment_status: "manual" };
  if (workflow === "PAID") return { status: "pending", payment_status: "paid" };
  if (workflow === "DELIVERED") return { status: "done", payment_status: "paid" };
  return { status: "cancelled", payment_status: "manual" };
}
