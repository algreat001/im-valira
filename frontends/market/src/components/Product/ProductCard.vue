<script setup lang="ts">
import { computed } from "vue";

import { useCartStore } from "@/stores/cart.ts";
import { Product } from "@/helpers/product.ts";

import ProductSpecsList from "./ProductSpecsList.vue";
import ProductGallery from "./ProductGallery.vue";
import ProductCategoryList from "./ProductCategoryList.vue";
import ProductChooseList from "./ProductChooseList.vue";
import ProductTagList from "./ProductTagList.vue";
import { useCategoriesStore } from "@/stores/categories.ts";
import type { Tag } from "@/interfaces/tag.ts";
import { useTagsStore } from "@/stores/tag.ts";

interface ProductProps {
}

const props = defineProps<ProductProps>();
const product = defineModel<Product>("product", { type: Product, required: true });

const cart = useCartStore();

const productCategories = computed(() =>
  useCategoriesStore().categories.filter(cat => product.value?.categories.includes(cat.category_id))
);

function handleAddToCart(event?: MouseEvent) {
  if (!product.value) {
    return;
  }
  if (event) {
    event.stopPropagation();
  }
  cart.addToCart(product.value, 1);
}

function getTags(tags: undefined | string[]): undefined | Tag[] {
  if (!tags) {
    return;
  }
  return tags.map(link => useTagsStore().getTagByLink(link)).filter(Boolean) as Tag[];
}

</script>

<template>
  <v-row>
    <v-col cols="12" md="6">
      <product-gallery :images="product.displayGallery" :main-image="product.displayImage" :alt="product.displayName" />
    </v-col>
    <v-col cols="12" md="6">
      <h1>{{ product.displayName }}</h1>
      <div class="mb-2 text-subtitle-2">Артикул: {{ product.displayArticle }}</div>
      <div class="mb-4 text-subtitle-1">{{ product.description }}</div>
      <product-choose-list v-if="product.hasVariants" v-model="product" />

      <div class="d-sm-flex flex-row justify-end ga-2">
        <div class="price-label">Цена:</div>
        <div class="price-value">{{ product.formatPrice() }}</div>
      </div>

      <v-btn color="primary" size="large" class="my-4" block @click="handleAddToCart($event)">Добавить в корзину</v-btn>

      <div class="d-sm-flex flex-column ga-2">
        <span class="price-label">Характеристики</span>
        <product-specs-list :specs="product.displaySpecs" />
      </div>
      <v-divider class="my-4"></v-divider>
      <product-category-list :categories="productCategories" />
      <product-tag-list v-if="product.tags?.length" :tags="getTags(product.tags)" class="mt-4" />
    </v-col>
  </v-row>
</template>

<style scoped lang="sass">
@use "@/assets/mixins" as *


.price-label
  font-size: $font-size-lg
  font-weight: $font-weight-medium

.price-value
  font-size: $font-size-lg
  font-weight: $font-weight-bold

.no-variants-message
  color: rgba(0, 0, 0, 0.6)
  font-style: italic

.fade-in
  animation: fadeIn 0.5s

@keyframes fadeIn
  from
    opacity: 0
  to
    opacity: 1
</style>
