import { defineStore } from "pinia";
import { ref } from "vue";
import type { Banner } from "@/interfaces/banner";
import { listBanners, createBanner, updateBanner, deleteBanner, seedBanners } from "@/backend/banner.service";

export const useBannerStore = defineStore("banner", () => {
  const items = ref<Banner[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Selected refs for dialogs (page can bind directly)
  const editing = ref<Banner | null>(null);
  const removing = ref<Banner | null>(null);

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      items.value = await listBanners();
    } catch (e: any) {
      error.value = e?.message || "Не удалось загрузить баннеры";
    } finally {
      loading.value = false;
    }
  }

  async function create(payload: Banner) {
    loading.value = true;
    try {
      await createBanner(payload);
      await load();
    } finally { loading.value = false; }
  }

  async function update(payload: Partial<Banner>) {
    if (!editing.value?.id) {
      return;
    }
    loading.value = true;
    try {
      await updateBanner(editing.value.id, payload);
      editing.value = null;
      await load();
    } finally { loading.value = false; }
  }

  async function remove() {
    if (!removing.value?.id) {
      return;
    }
    loading.value = true;
    try {
      await deleteBanner(removing.value.id);
      removing.value = null;
      await load();
    } finally { loading.value = false; }
  }

  async function seed(force = false) {
    loading.value = true;
    try {
      await seedBanners(force);
      await load();
    } finally { loading.value = false; }
  }

  return {
    items,
    loading,
    error,
    editing,
    removing,
    load,
    create,
    update,
    remove,
    seed
  };
});

