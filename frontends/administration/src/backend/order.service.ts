import { apiFetch } from "@/backend/request.service";

export async function listOrders(): Promise<any[]> {
  return apiFetch<any[]>("/order/admin/list", { method: "GET" });
}

export async function createOrder(payload: any): Promise<any> {
  return apiFetch<any>("/order/admin", { method: "POST", body: JSON.stringify(payload) });
}

export async function updateOrder(orderId: number | string, payload: any): Promise<any> {
  return apiFetch<any>(
    `/order/admin/${encodeURIComponent(orderId)}`,
    { method: "PATCH", body: JSON.stringify(payload) }
  );
}

export async function deleteOrder(orderId: number | string): Promise<void> {
  await apiFetch(`order/admin/${encodeURIComponent(orderId)}`, { method: "DELETE" });
}
