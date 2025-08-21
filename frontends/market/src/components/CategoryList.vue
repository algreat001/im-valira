<script setup lang="ts">
import { type Category, useCategoriesStore } from "@/stores/categories";

const props = defineProps<{ categories: Category[] }>();
</script>

<template>
  <div class="category-list-scroll">
    <div class="category-list-row">
      <template v-for="cat in useCategoriesStore().categories" :key="cat.category_id">
        <v-tooltip
          :key="cat.category_id"
          v-if="cat.meta.description"
          location="bottom"
          :open-delay="200"
          class="category-tooltip"
        >
          <template #activator="{ props }">
            <v-btn
              stacked
              v-bind="props"
              class="category-square"
              variant="outlined"
              color="primary"
              :to="{ path: '/catalog', query: { category: cat.category_id } }"
              router
            >
              <v-icon size="48" class="mb-1">{{ cat.meta.icon }}</v-icon>
              <div class="category-name">{{ cat.name }}</div>
            </v-btn>
          </template>
          <span>{{ cat.meta.description }}</span>
        </v-tooltip>
        <template v-else>
          <v-btn
            class="category-square"
            variant="outlined"
            color="primary"
            :to="{ path: '/catalog', query: { category: cat.category_id } }"
            router
          >
            <v-icon size="48" class="mb-1">{{ cat.meta.icon }}</v-icon>
            <div class="category-name">{{ cat.name }}</div>
          </v-btn>
        </template>
      </template>
    </div>
  </div>
</template>

<style lang="sass">
@use "@/assets/mixin.sass"

.category-list-scroll
  overflow-x: auto
  padding-bottom: 8px

.category-list-row
  display: flex
  flex-direction: row
  gap: 20px
  min-width: 100%
  width: max-content
  align-items: center
  justify-content: center

.category-square
  display: flex
  flex-direction: column !important
  align-items: center
  justify-content: center
  width: 110px
  height: 110px
  min-width: 110px
  min-height: 110px
  border-radius: mixin.$card-radius
  margin: 0
  font-size: 15px
  text-transform: none
  background: mixin.$card-bg
  cursor: pointer
  @include mixin.card-shadow

  .v-btn__content
    display: flex
    flex-direction: column !important
    align-items: center
    justify-content: center

.category-name
  margin-top: 4px
  text-align: center
  font-weight: 500
  font-size: 15px
  color: #222
</style>
