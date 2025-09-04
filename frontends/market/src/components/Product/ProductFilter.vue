<script setup lang="ts">
import { onMounted, computed } from "vue";
import { constants } from "@/constants";
import { type Category, useCategoriesStore } from "@/stores/categories.ts";

interface ProductFilterProps {
}

const searchCategory = defineModel<Category>("selected-category");
const sort = defineModel<string>("sort");
const search = defineModel<string>("search");

const props = defineProps<ProductFilterProps>();

const catStore = useCategoriesStore();

onMounted(() => {
  catStore.loadCategories();
});

const categoryOptions = computed(() => catStore.categories);

</script>

<template>
  <v-row class="mb-4" dense>
    <v-col cols="12" md="3">
      <v-select
        v-model="searchCategory"
        :items="[constants.catalog.defaultCategory, ...categoryOptions]"
        item-title="name"
        item-value="category_id"
        label="Категория"
        density="compact"
        return-object
        hide-details
      />
    </v-col>
    <v-col cols="12" md="3">
      <v-select
        v-model="sort"
        :items="constants.catalog.sortOptions"
        label="Сортировка"
        density="compact"
        hide-details
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        v-model="search"
        label="Поиск"
        density="compact"
        clearable
        hide-details
      />
    </v-col>
  </v-row>
</template>

<style scoped lang="sass">
// ...existing code...
</style>
