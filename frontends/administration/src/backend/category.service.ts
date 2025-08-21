import { apiFetch } from "@/backend/request.service";
import type { Category } from "@/interfaces/category.ts";

export async function listCategories(): Promise<any[]> {
  return apiFetch<any[]>("/category/all", { method: "GET" });
}

export async function createCategory(payload: any): Promise<Category> {
  return apiFetch<any>("/category/save", { method: "POST", body: JSON.stringify(payload) });
}

export async function updateCategory(categoryId: number | string, payload: any): Promise<Category> {
  return apiFetch<any>("/category/save", { method: "POST", body: JSON.stringify(payload) });
}

export async function deleteCategory(categoryId: number | string): Promise<void> {
  await apiFetch(`/category/${encodeURIComponent(categoryId)}`, { method: "DELETE" });
}
