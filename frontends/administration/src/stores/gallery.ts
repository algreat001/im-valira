import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { listGallery, uploadGalleryImage, deleteGalleryImage, renameGalleryImage } from "@/backend/gallery.service";

export const useGalleryStore = defineStore("gallery", () => {
  const images = ref<string[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const sortedImages = computed(() => {
    return [ ...images.value ].sort((a, b) => a.localeCompare(b, "ru"));
  });

  async function load(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      images.value = (await listGallery()) ?? [];
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось загрузить галерею";
    } finally {
      loading.value = false;
    }
  }

  async function upload(files: File | File[]): Promise<void> {
    const arr = Array.isArray(files) ? files : [ files ];
    loading.value = true;
    error.value = null;
    try {
      for (const f of arr) {
        await uploadGalleryImage(f);
      }
      await load();
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось загрузить изображение(я)";
    } finally {
      loading.value = false;
    }
  }

  async function remove(image: string): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await deleteGalleryImage(image);
      await load();
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось удалить изображение";
    } finally {
      loading.value = false;
    }
  }

  async function rename(oldName: string, newName: string): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await renameGalleryImage(oldName, newName);
      await load();
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось переименовать изображение";
    } finally {
      loading.value = false;
    }
  }

  return {
    images,
    sortedImages,
    loading,
    error,
    load,
    upload,
    remove,
    rename
  };
});
