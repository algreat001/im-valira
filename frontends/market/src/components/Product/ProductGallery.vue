<script setup lang="ts">
import { computed } from "vue";

import { constants } from "@/constants.ts";

import type { CategoryDto } from "@/interfaces/categoryDto.ts";

type Props = {
  images: string[];
  mainImage: string;
  alt: string;
  categories?: CategoryDto[];
};

const props = defineProps<Props>();

const hasImages = computed(() => props.images && props.images.length > 0 && props.images[0]);
const firstCategoryIcon = props.categories && props.categories.length > 0
  ? props.categories[0].meta.icon
  : "mdi-image-off";

</script>

<template>
  <div>
    <template v-if="hasImages">
      <v-carousel hide-delimiters :height="constants.ui.imageHeight" v-if="props.images.length > 1">
        <v-carousel-item v-for="(img, i) in props.images" :key="i">
          <smart-image :src="img"
                       :alt="props.alt"
                       :height="constants.ui.imageHeight"
                       :fallback-icon="firstCategoryIcon"
          />
        </v-carousel-item>
      </v-carousel>
      <smart-image v-else
                   :src="props.mainImage"
                   :alt="props.alt"
                   :height="constants.ui.imageHeight"
                   :fallback-icon="firstCategoryIcon"
      />
    </template>
    <template v-else>
      <div class="gallery-fallback">
        <v-icon size="96" color="primary" :icon="firstCategoryIcon" />
      </div>
    </template>
  </div>
</template>

<style scoped lang="sass">
@use "@/assets/mixin" as mixin

.v-carousel
  border-radius: mixin.$card-radius
  overflow: hidden

.v-img
  border-radius: mixin.$card-radius

.gallery-fallback
  display: flex
  align-items: center
  justify-content: center
  height: v-bind('constants.ui.imageHeight')
  background: mixin.$card-bg
  border-radius: mixin.$card-radius
</style>
