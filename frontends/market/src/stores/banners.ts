import { defineStore } from "pinia";
import { ref } from "vue";
import type { BannerItem } from "@/interfaces/banner";
import { fetchBanners } from "@/backend/banners.api";

export const useBannersStore = defineStore("banners", () => {
  const banners = ref<BannerItem[]>([]);

  async function refresh(): Promise<void> {
    try {
      banners.value = await fetchBanners();
    } catch (e) {
      console.warn("Banner API fallback to mock:", (e as any).message);
      banners.value = [];
    }
  }

  return { banners, refresh };
});
