<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";

import { useProductsStore } from "@/stores/products";

import ProductCard from "@/components/Product/ProductCard.vue";

const route = useRoute();
const productsStore = useProductsStore();

interface ProductParams {
  id: string;
}

const productId = computed(() => (route.params as ProductParams).id);
const product = computed(() => productsStore.getProductById(Number.parseInt(productId.value)));

</script>

<template>
  <v-container class="py-8 fade-in">
    <v-row v-if="!product" class="fade-in"></v-row>
    <product-card v-else v-model:product="product" />
  </v-container>
</template>
