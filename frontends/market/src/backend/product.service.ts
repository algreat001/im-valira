import { apiFetch } from "@/backend/request.service";
import type { ProductDto } from "@/interfaces/productDto.ts";

export async function getProducts(): Promise<ProductDto[]> {
  try {
    return await apiFetch<ProductDto[]>("/product/all", { method: "GET" });
  } catch (e: any) {
    if (/404/.test(e?.message || "")) {
      return [];
    }
  }
  return [];
}