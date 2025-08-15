<script setup lang="ts">
import { useRouter } from "vue-router";
import type { CategoryDto } from "@/interfaces/categoryDto.ts";

type Props = {
  categories: CategoryDto[];
};

const props = defineProps<Props>();
const router = useRouter();

function handleCategoryClick(categoryId: number) {
  router.push({ path: "/catalog", query: { category: categoryId } });
}
</script>

<template>
  <div v-if="props.categories && props.categories.length > 0">
    <h3 class="font-weight-medium">Категории</h3>
    <v-chip-group>
      <v-chip
        v-for="cat in props.categories"
        :key="cat.category_id"
        class="ma-1"
        color="primary"
        text-color="white"
        @click="handleCategoryClick(cat.category_id)"
        style="cursor:pointer"
      >
        {{ cat.name }}
      </v-chip>
    </v-chip-group>
  </div>
</template>

<style scoped lang="sass">
.v-chip-group
  margin-bottom: 8px
</style>

