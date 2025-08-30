import { apiFetch } from "@/backend/request.service";
import type { Banner } from "@/interfaces/banner";

// Список баннеров
export async function listBanners(): Promise<Banner[]> {
  return apiFetch<Banner[]>("/admin/banners/list", { method: "GET" });
}

// Создать баннер
export async function createBanner(payload: Banner): Promise<Banner> {
  return apiFetch<Banner>("/admin/banners", { method: "POST", body: JSON.stringify(payload) });
}

// Обновить баннер
export async function updateBanner(bannerId: number | string, payload: Partial<Banner>): Promise<Banner> {
  return apiFetch<Banner>(
    `/admin/banners/${encodeURIComponent(bannerId)}`,
    { method: "PATCH", body: JSON.stringify(payload) }
  );
}

// Удалить баннер
export async function deleteBanner(bannerId: number | string): Promise<void> {
  await apiFetch(`/admin/banners/${encodeURIComponent(bannerId)}`, { method: "DELETE" });
}

// Засидить (посеять) моковые данные (доступно только для Admin и при наличии эндпоинта)
export async function seedBanners(force = false): Promise<{ inserted: number }> {
  return apiFetch<{ inserted: number }>(`/admin/banners/seed?force=${force}`, { method: "POST" });
}
