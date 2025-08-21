import { apiFetch } from "@/backend/request.service";

export async function listProducts(): Promise<any[]> {
  return apiFetch<any[]>("/admin/products/list", { method: "GET" });
}

export async function createProduct(payload: any): Promise<any> {
  return apiFetch<any>("/admin/products", { method: "POST", body: JSON.stringify(payload) });
}

export async function updateProduct(productId: number | string, payload: any): Promise<any> {
  return apiFetch<any>(
    `/admin/products/${encodeURIComponent(productId)}`,
    { method: "PATCH", body: JSON.stringify(payload) }
  );
}

export async function deleteProduct(productId: number | string): Promise<void> {
  await apiFetch(`/admin/products/${encodeURIComponent(productId)}`, { method: "DELETE" });
}

export async function listVariants(productId: number | string): Promise<any[]> {
  return apiFetch<any[]>(`/admin/products/${encodeURIComponent(productId)}/variants`, { method: "GET" });
}

export async function createVariant(productId: number | string, payload: any): Promise<any> {
  return apiFetch<any>(
    `/admin/products/${encodeURIComponent(productId)}/variants`,
    { method: "POST", body: JSON.stringify(payload) }
  );
}

export async function updateVariant(
  productId: number | string,
  variantId: number | string,
  payload: any
): Promise<any> {
  return apiFetch<any>(`/admin/products/${encodeURIComponent(productId)}/variants/${encodeURIComponent(variantId)}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export async function deleteVariant(productId: number | string, variantId: number | string): Promise<void> {
  await apiFetch(
    `/admin/products/${encodeURIComponent(productId)}/variants/${encodeURIComponent(variantId)}`,
    { method: "DELETE" }
  );
}
