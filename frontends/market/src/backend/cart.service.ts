import { apiFetch } from "./request.service";
import type { CartItem } from "@/interfaces/cartItem.ts";

export type AddCartItemPayload = {
  product_id: string | number;
  variant_id?: string | number | null;
  quantity: number;
};

export type UpdateCartItemPayload = {
  quantity: number;
};

export async function getCart(): Promise<CartItem[]> {
  try {
    return await apiFetch<CartItem[]>("/cart", { method: "GET" });
  } catch (e: any) {
    if (/404/.test(e?.message || "")) {
      return [];
    }
  }
  return [];
}

export async function addItem(payload: AddCartItemPayload): Promise<CartItem> {
  return apiFetch<CartItem>("/cart/items", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function updateItem(cartItemId: number, payload: UpdateCartItemPayload): Promise<CartItem> {
  return apiFetch<CartItem>(`/cart/${encodeURIComponent(cartItemId)}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export async function removeItem(cartItemId: number): Promise<void> {
  await apiFetch<void>(`/cart/${encodeURIComponent(cartItemId)}`, {
    method: "DELETE"
  });
}

export async function clearCart(): Promise<void> {
  await apiFetch<void>("/cart/all", { method: "DELETE" });
}
