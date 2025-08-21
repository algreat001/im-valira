import { ref } from "vue";
import { defineStore } from "pinia";

import { listCategories, createCategory, updateCategory, deleteCategory } from "@/backend/category.service";

import type { Category } from "@/interfaces/category";

export const useCategoryStore = defineStore("category", () => {
  const categories = ref<Category[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function load(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      categories.value = (await listCategories()) as unknown as Category[];
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось загрузить категории";
    } finally {
      loading.value = false;
    }
  }

  async function create(payload: Partial<Category>): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await createCategory(payload);
      await load();
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось создать категорию";
    } finally {
      loading.value = false;
    }
  }

  async function update(categoryId: number | string, payload: Partial<Category>): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await updateCategory(categoryId, payload);
      await load();
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось обновить категорию";
    } finally {
      loading.value = false;
    }
  }

  async function remove(categoryId: number | string): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await deleteCategory(categoryId);
      await load();
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось удалить категорию";
    } finally {
      loading.value = false;
    }
  }

  return {
    categories,
    loading,
    error,
    load,
    create,
    update,
    remove,
  };
});
