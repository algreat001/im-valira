import { defineStore } from "pinia";
import { type Ref, ref } from "vue";
import { Product } from "@/helpers/product";
import type { Category } from "@/stores/categories";

import { constants } from "@/constants";
import { getProducts } from "@/backend/product.service";
import { getProductsByTag } from "@/backend/tag.service";

const ALL = constants.catalog.ALL;


export const useProductsStore = defineStore("products", () => {
  const products: Ref<Product[]> = ref([]);
  const tagProducts: Ref<Map<string, Product[]>> = ref(new Map());

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

  function getFilteredProduct(search: string, selectedCategory?: Category, tag?: string, sort?: string) {
    let arr = getProductsByCategory(selectedCategory);

    if (tag) {
      arr = arr.filter(p => p.tags.includes(tag));
    }

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

  function getTagProducts(tag: string): Product[] {
    if (!tagProducts.value.has(tag)) {
      tagProducts.value.set(tag, []);
    }
    if (tagProducts.value.get(tag)!.length === 0) {
      getProductsByTag(tag).then(productsData => {
        const mapped = productsData.map(p => new Product(p));
        tagProducts.value.set(tag, mapped);
      });
    }
    return tagProducts.value.get(tag)!;
  }

  return {
    products,
    loadProducts,
    getProductById,
    getProductsByCategory,
    getFilteredProduct,
    searchProducts,
    getTagProducts
  };
});
