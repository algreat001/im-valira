import { apiFetch } from "@/backend/request.service";

import type { OrderItemDto } from "@/interfaces/order";

export async function listOrderItems(orderId: number | string): Promise<OrderItemDto[]> {
  return apiFetch<OrderItemDto[]>(`/admin/orders/${encodeURIComponent(orderId)}/items`, { method: "GET" });
}

export async function createOrderItem(orderId: number | string, payload: Partial<OrderItemDto>): Promise<OrderItemDto> {
  return apiFetch<OrderItemDto>(`/admin/orders/${encodeURIComponent(orderId)}/items`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateOrderItem(
  orderId: number | string,
  orderItemId: number | string,
  payload: Partial<OrderItemDto>
): Promise<OrderItemDto> {
  return apiFetch<OrderItemDto>(
    `/admin/orders/${encodeURIComponent(orderId)}/items/${encodeURIComponent(orderItemId)}`,
    { method: "PATCH", body: JSON.stringify(payload) }
  );
}

export async function deleteOrderItem(orderId: number | string, orderItemId: number | string): Promise<void> {
  await apiFetch(`/admin/orders/${encodeURIComponent(orderId)}/items/${encodeURIComponent(orderItemId)}`, {
    method: "DELETE",
  });
}
