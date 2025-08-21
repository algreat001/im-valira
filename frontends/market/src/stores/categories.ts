import { defineStore } from "pinia";
import { type Ref, ref } from "vue";
import type { CategoryDto } from "@/interfaces/categoryDto.ts";
import { getCategories } from "@/backend/category.service.ts";

export type Category = CategoryDto;

export const useCategoriesStore = defineStore("categories", () => {
  const categories: Ref<Category[]> = ref([]);

  async function loadCategories() {
    if (categories.value.length > 0) {
      return;
    }
    categories.value = await getCategories();
  }

  function getCategoryById(categoryId: number): Category | undefined {
    return categories.value.find(cat => cat.category_id === categoryId);
  }

  return {
    categories,
    loadCategories,
    getCategoryById
  };
});
