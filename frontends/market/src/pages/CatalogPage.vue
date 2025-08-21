<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, computed, watch } from "vue";

import { constants } from "../constants";
import { type Category, useCategoriesStore } from "@/stores/categories";

import ProductList from "@/components/Product/ProductList.vue";
import ProductFilter from "@/components/Product/ProductFilter.vue";
import { useProductsStore } from "@/stores/products";

const ALL = constants.catalog.ALL;

const route = useRoute();
const router = useRouter();

const width = constants.ui.productList.width;
const height = constants.ui.productList.height;
const page = ref(1);


const categoryIdFromQuery = computed(() => {
  const cat = route.query.category as string | undefined;
  if (!cat || cat === ALL.toFixed()) {
    return ALL;
  }
  return Number.parseInt(cat);
});


const search = ref<string>(route.query.q as string || "");
const selectedCategory = ref<Category | undefined>(undefined);
const sort = ref(constants.catalog.sortOptions[0]);

watch(
  [ () => categoryIdFromQuery.value, () => useCategoriesStore().categories ],
  ([ catId ]) => {
    if (catId === ALL) {
      selectedCategory.value = constants.catalog.defaultCategory;
    } else {
      const found = useCategoriesStore().categories.find(c => c.category_id === catId);
      selectedCategory.value = found || constants.catalog.defaultCategory;
    }
  },
  { immediate: true }
);

watch(selectedCategory, (cat) => {
  if (!cat || cat.category_id === ALL) {
    router.replace({ query: { ...route.query, category: undefined } });
    return;
  }
  router.replace({ query: { ...route.query, category: cat.category_id } });
});


watch([ search, selectedCategory, sort ], () => { page.value = 1; });
watch(page, () => { router.replace({ query: { ...route.query, page: page.value } }); });

</script>

<template>
  <v-container class="py-8 fade-in">
    <product-filter
      :categories="useCategoriesStore().categories"
      v-model:selected-category="selectedCategory"
      v-model:sort="sort"
      v-model:search="search"
    />
    <product-list
      :products="useProductsStore().getFilteredProduct(search, selectedCategory, sort)"
      :width="width"
      :height="height"
      v-model:page="page"
    />
  </v-container>
</template>
