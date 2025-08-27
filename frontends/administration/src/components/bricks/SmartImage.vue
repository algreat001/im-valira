<script setup lang="ts">
import { computed, ref } from "vue";
import { getImagesBase } from "@/backend/request.service.ts";

type Props = {
  src: string;
  alt: string;
  height?: string | number;
  width?: string | number;
  loaderHeight?: string | number;
  loaderWidth?: string | number;
  fallbackIcon?: string;
};

const props = defineProps<Props>();
const imageError = ref(false);
const imageLoading = ref(false);

function handleImageError() {
  imageError.value = true;
  imageLoading.value = false;
}

function handleImageLoad() {
  imageLoading.value = false;
}

function handleImageLoadStart() {
  imageLoading.value = true;
}

const srcImage = computed(() => {
    if (props.src.startsWith("http")) {
      return props.src;
    }
    return `${getImagesBase()}${props.src}`;
  }
);

</script>

<template>
  <div class="smart-image-wrap"
       :style="{ height: props.height ? props.height + 'px' : '320px', width: props.width ? props.width + 'px' : '100%' }"
  >
    <template v-if="!imageError">
      <v-img
        :src="srcImage"
        :alt="props.alt"
        :height="props.height"
        :width="props.width"
        cover
        @error="handleImageError"
        @loadstart="handleImageLoadStart"
        @load="handleImageLoad"
        v-show="!imageLoading"
      />
      <div v-if="imageLoading" class="smart-image-loader">
        <v-progress-circular indeterminate color="primary" :size="props.loaderHeight || 48" />
      </div>
    </template>
    <template v-else>
      <div class="smart-image-fallback">
        <v-icon :size="props.width ?? 96" color="primary">{{ props.fallbackIcon || "mdi-image-off" }}</v-icon>
      </div>
    </template>
  </div>
</template>

<style scoped lang="sass">

.smart-image-wrap
  position: relative
  display: flex
  align-items: center
  justify-content: center
  overflow: hidden

.smart-image-loader
  display: flex
  align-items: center
  justify-content: center
  width: 100%
  height: 100%

.smart-image-fallback
  display: flex
  align-items: center
  justify-content: center
  width: 100%
  height: 100%
</style>
