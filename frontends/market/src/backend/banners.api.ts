import type { BannerItem } from "@/interfaces/banner";
import { apiFetch } from "@/backend/request.service";

export async function fetchBanners(): Promise<BannerItem[]> {
  return apiFetch<BannerItem[]>("/banners");
}

