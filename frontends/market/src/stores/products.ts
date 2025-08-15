import { defineStore } from "pinia";
import { computed, type Ref, ref } from "vue";
import { Product } from "@/helpers/product";
import type { Category } from "@/stores/categories";

import { newProduct } from "@/data/products";
import { constants } from "@/constants";
import { getProducts } from "@/backend/product.service";

const ALL = constants.catalog.ALL;
const NEW_PRODUCTS = newProduct;


export const useProductsStore = defineStore("products", () => {
  const products: Ref<Product[]> = ref([]);

  async function loadProducts() {
    const productsData = await getProducts();
    products.value = productsData.map(p => new Product(p));
  }

  function getProductById(productId: number): Product | undefined {
    return products.value.find(p => p.product_id === productId);
  }

  function getProductsByCategory(category?: Category): Product[] {
    if (!category || category.category_id === ALL) {
      return products.value;
    }
    return products.value.filter(p => p.categories.includes(category.category_id));
  }

  function searchProducts(query: string): Product[] {
    const searchQuery = query.toLowerCase().trim();
    if (!searchQuery) {
      return products.value;
    }

    return products.value.filter(p => {
      return (
        p.name.toLowerCase().includes(searchQuery) ||
        p.description.toLowerCase().includes(searchQuery) ||
        p.article?.toLowerCase().includes(searchQuery)
      );
    });
  }

  const newProducts = computed(() => {
    return products.value.filter(p => NEW_PRODUCTS.includes(p.product_id));
  });

  function getFilteredProduct(search: string, selectedCategory?: Category, sort?: string) {
    let arr = getProductsByCategory(selectedCategory);

    if (search && search.trim().length > 3) {
      arr = arr.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    switch (sort) {
      case "Сначала дешевые":
        arr = arr.toSorted((a, b) => a.currentPrice - b.currentPrice);
        break;
      case "Сначала дорогие":
        arr = arr.toSorted((a, b) => b.currentPrice - a.currentPrice);
        break;
      case "По алфавиту":
        arr = arr.toSorted((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        arr = arr.toSorted((a, b) => a.product_id.toFixed().localeCompare(b.product_id.toFixed()));
    }
    return arr;
  }

  return {
    products,
    loadProducts,
    getProductById,
    getProductsByCategory,
    getFilteredProduct,
    searchProducts,
    newProducts
  };
});
