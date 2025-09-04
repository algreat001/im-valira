<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref, computed, watch } from "vue";

import { constants } from "@/constants";
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


const search = computed({
  get: () => (route.query.q as string) || "",
  set: (val: string) => {
    const current = (route.query.q as string) || "";
    const next = (val || "").trim();
    if (current === next) {
      return;
    } // избегаем лишнего replace
    const newQuery: Record<string, any> = { ...route.query };
    if (next) {
      newQuery.q = next;
    } else {
      delete newQuery.q;
    }
    // при смене поиска сбрасываем страницу на 1 (page watcher уже это сделает, но можно явно)
    delete newQuery.page; // убрать старую страницу
    router.replace({ query: newQuery });
  }
});
const selectedCategory = ref<Category | undefined>(undefined);
const sort = ref(constants.catalog.sortOptions[0]);

const tagFromQuery = computed(() => {
  const t = route.query.tag as string | undefined;
  return (t && t.trim().length > 0) ? t : undefined;
});


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


watch([ search, selectedCategory, tagFromQuery, sort ], () => { page.value = 1; });
watch([ search, selectedCategory, sort ], () => { router.replace({ query: { ...route.query, tag: undefined } }); });
watch(page, () => { router.replace({ query: { ...route.query, page: page.value } }); });

</script>

<template>
  <v-container class="py-8 fade-in">
    <product-filter
      v-model:selected-category="selectedCategory"
      v-model:sort="sort"
      v-model:search="search"
    />
    <v-divider class="my-6" />
    <product-list
      :products="useProductsStore().getFilteredProduct(search, selectedCategory, tagFromQuery, sort)"
      :width="width"
      :height="height"
      v-model:page="page"
    />
  </v-container>
</template>
