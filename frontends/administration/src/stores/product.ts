import { ref } from "vue";
import { defineStore } from "pinia";

import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  listVariants,
  createVariant,
  updateVariant,
  deleteVariant
} from "@/backend/product.service";

import type { ProductDto, ProductVariantDto } from "@/interfaces/product";

export const useProductStore = defineStore("product", () => {
  const products = ref<ProductDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function load(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      products.value = (await listProducts()) as unknown as ProductDto[];
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось загрузить товары";
    } finally {
      loading.value = false;
    }
  }

  async function create(payload: Partial<ProductDto>): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await createProduct(payload);
      await load();
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось создать товар";
    } finally {
      loading.value = false;
    }
  }

  async function update(productId: number | string, payload: Partial<ProductDto>): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await updateProduct(productId, payload);
      await load();
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось обновить товар";
    } finally {
      loading.value = false;
    }
  }

  async function remove(productId: number | string): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await deleteProduct(productId);
      await load();
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось удалить товар";
    } finally {
      loading.value = false;
    }
  }

  async function loadVariants(productId: number | string): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const variants = (await listVariants(productId)) as unknown as ProductVariantDto[];
      products.value = products.value.map((p) =>
        p.product_id === Number(productId) || p.product_id === productId
          ? { ...p, variants }
          : p
      );
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось загрузить варианты";
    } finally {
      loading.value = false;
    }
  }

  async function createVariantItem(productId: number | string, payload: Partial<ProductVariantDto>): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await createVariant(productId, payload);
      await loadVariants(productId);
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось создать вариант";
    } finally {
      loading.value = false;
    }
  }

  async function updateVariantItem(
    productId: number | string,
    variantId: number | string,
    payload: Partial<ProductVariantDto>
  ): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await updateVariant(productId, variantId, payload);
      await loadVariants(productId);
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось обновить вариант";
    } finally {
      loading.value = false;
    }
  }

  async function removeVariantItem(productId: number | string, variantId: number | string): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      await deleteVariant(productId, variantId);
      await loadVariants(productId);
    } catch (e: any) {
      error.value = e?.message ?? "Не удалось удалить вариант";
    } finally {
      loading.value = false;
    }
  }


  return {
    products,
    loading,
    error,
    load,
    create,
    update,
    remove,
    loadVariants,
    createVariant: createVariantItem,
    updateVariant: updateVariantItem,
    removeVariant: removeVariantItem
  };
});
