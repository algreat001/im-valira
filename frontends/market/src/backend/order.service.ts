import { apiFetch } from "@/backend/request.service";
import type { Order, OrderItem } from "@/stores/order.ts";

export async function fetchOrders(mode: "completed" | "active"): Promise<Order[]> {
  return apiFetch<Order[]>(`/order/list/${encodeURIComponent(mode)}`, { method: "GET" });
}

export async function fetchOrderItems(orderId: string | number): Promise<OrderItem[]> {
  return apiFetch<OrderItem[]>(`/order/items/${encodeURIComponent(orderId)}`, { method: "GET" });
}

export async function cancelOrder(orderId: number): Promise<Order> {
  return apiFetch<Order>(`/order/cancel/${encodeURIComponent(orderId)}`, { method: "POST" });
}
