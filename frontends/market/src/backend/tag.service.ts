import { apiFetch } from "@/backend/request.service";
import type { ProductDto } from "@/interfaces/productDto.ts";
import type { Tag } from "@/interfaces/tag";

export async function getProductsByTag(tag: string): Promise<ProductDto[]> {
  try {
    return await apiFetch<ProductDto[]>(`/tag/products/${encodeURIComponent(tag)}`, { method: "GET" });
  } catch (e: any) {
    if (/404/.test(e?.message || "")) {
      return [];
    }
    throw e;
  }
}

export async function getTags(): Promise<Tag[]> {
  try {
    return await apiFetch<Tag[]>("/tag/list", { method: "GET" });
  } catch (e: any) {
    if (/404/.test(e?.message || "")) {
      return [];
    }
    throw e;
  }
}
