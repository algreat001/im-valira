<script setup lang="ts">
import { debounce } from "@/helpers/debounce";
import { constants } from "@/constants";
import type { Category } from "@/stores/categories.ts";

interface ProductFilterProps {
  categories: Category[];
}

const searchCategory = defineModel<Category>("selected-category");
const sort = defineModel<string>("sort");
const search = defineModel<string>("search");


const props = defineProps<ProductFilterProps>();


</script>

<template>
  <v-row class="mb-4">
    <v-col cols="12" md="3">
      <v-select
        v-model="searchCategory"
        :items="[constants.catalog.defaultCategory, ...props.categories]"
        item-title="name"
        item-value="id"
        label="Категория"
        density="compact"
        return-object
      />
    </v-col>
    <v-col cols="12" md="3">
      <v-select
        v-model="sort"
        :items="constants.catalog.sortOptions"
        label="Сортировка"
        density="compact"
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        v-model="search"
        label="Поиск"
        density="compact"
        clearable
      />
    </v-col>
  </v-row>
</template>

<style scoped lang="sass">
// ...existing code...
</style>
