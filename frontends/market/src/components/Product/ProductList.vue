<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";

import type { Product } from "@/helpers/product";

import ProductMiniCard from "@/components/Product/ProductMiniCard.vue";

const props = defineProps<{
  products: Product[];
  width: number;
  height: number;
  page?: number;
}>();

const emit = defineEmits([ "update:page" ]);

const router = useRouter();

const page = ref(props.page || 1);

watch(page, (newValue) => {
  emit("update:page", newValue);
});

const productsPerPage = computed(() => props.width * props.height);

const pageCount = computed(() => {
  const length = props.products?.length ?? 0;
  if (length === 0 || !props.width || !props.height) {
    return 1;
  }
  const perPage = props.width * props.height;
  return Math.max(1, Math.ceil(length / perPage));
});

const paginatedProducts = computed(() => props.products.slice(
  (page.value - 1) * productsPerPage.value,
  page.value * productsPerPage.value
));

// Определяем col-span для Vuetify в зависимости от ширины экрана
const getColSpan = computed(() => {
  // На мобильных всегда 12 (1 в ряд), на sm 6 (2 в ряд), на md 4 (3 в ряд), на lg 12/width
  return {
    cols: 12,
    sm: 6,
    md: Math.max(12 / props.width, 3),
    lg: Math.max(12 / props.width, 2),
    xl: Math.max(12 / props.width, 2)
  };
});

function handleProductClick(productId: number) {
  router.push({ path: `/product/${productId}` });
}
</script>

<template>
  <div class="product-list">
    <v-row justify="space-around">
      <v-col
        v-for="product in paginatedProducts"
        :key="product.product_id"
        v-bind="getColSpan"
        class="product-list-col"
      >
        <div class="product-list-card-wrap" @click="handleProductClick(product.product_id)">
          <product-mini-card :product="product" />
        </div>
      </v-col>
    </v-row>
    <v-pagination
      v-if="pageCount > 1"
      v-model="page"
      :length="pageCount"
      class="mt-6"
      color="primary"
      size="large"
      density="compact"
    />
  </div>
</template>

<style scoped lang="sass">
.product-list
  width: 100%

.product-list-col
  min-width: 220px
  max-width: 100%
  display: flex
  flex-direction: column
  align-items: stretch

.product-list-card-wrap
  cursor: pointer
  transition: transform 0.2s

  &:hover
    transform: translateY(-2px) scale(1.02)

.v-row
  margin-left: 0
  margin-right: 0

.v-col
  padding-left: 8px
  padding-right: 8px

.v-pagination
  margin-top: 24px
</style>
