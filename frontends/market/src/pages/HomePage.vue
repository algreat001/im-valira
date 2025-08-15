<script setup lang="ts">
import { ref } from "vue";

import { constants } from "@/constants";

import BannerCarousel from "../components/BannerCarousel.vue";
import CategoryList from "../components/CategoryList.vue";
import ProductList from "@/components/Product/ProductList.vue";
import { useProductsStore } from "@/stores/products.ts";
import { useCategoriesStore } from "@/stores/categories.ts";

const newProducts = useProductsStore().newProducts;
const page = ref(1);


</script>

<template>
  <v-container class="py-8 fade-in">
    <v-row>
      <v-col cols="12" md="12">
        <banner-carousel />
      </v-col>
      <v-divider class="my-6" />
      <v-col cols="12" md="12">
        <h2 class="mb-4">Категории</h2>
        <category-list :categories="useCategoriesStore().categories" />
      </v-col>
      <v-divider class="my-6" />
      <v-col cols="12" md="12">
        <h2 class="mt-8 mb-4">Новые товары</h2>
        <product-list
          :products="newProducts"
          :width="constants.ui.productList.width"
          :height="constants.ui.productList.height"
          v-model:page="page"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
