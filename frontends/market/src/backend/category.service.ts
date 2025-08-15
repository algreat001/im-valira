import { apiFetch } from "@/backend/request.service.ts";
import type { CategoryDto } from "@/interfaces/categoryDto.ts";

export async function getCategories(): Promise<CategoryDto[]> {
  try {
    return await apiFetch<CategoryDto[]>("/category/all", { method: "GET" });
  } catch (e: any) {
    if (/404/.test(e?.message || "")) {
      return [];
    }
  }
  return [];
}