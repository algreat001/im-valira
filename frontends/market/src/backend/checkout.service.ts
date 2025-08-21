import { apiFetch } from "./request.service";
import type { CreateOrderDto, OrderDto } from "@/interfaces/order.ts";


export async function createOrder(payload: CreateOrderDto): Promise<OrderDto> {
  return apiFetch<OrderDto>("/order/create/cart", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
