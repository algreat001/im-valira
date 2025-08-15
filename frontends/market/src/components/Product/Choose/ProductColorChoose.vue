<script lang="ts" setup>
import type { ProductVariantOption } from "@/interfaces/productVariantOption";
import { PRODUCT_VARIANT_COLORS } from "@/constants.ts";

interface ProductColorChooseProps {
  option: ProductVariantOption;
}

const props = defineProps<ProductColorChooseProps>();
const emit = defineEmits<{
  (e: "color-changed", option: ProductVariantOption, color: string): void;
}>();

function getColorFromName(colorName: string) {
  return PRODUCT_VARIANT_COLORS[colorName] || "#cccccc";
}

// Проверка активности цвета
function isColorActive(option: ProductVariantOption, value: string) {
  return option.selectedValue === value;
}

function isDisableColor(value: string) {
  return props.option.enableValues?.includes(value) === false;
}


</script>

<template>
  <div class="variant-option-group">
    <h3 class="variant-option-title">{{ option.name }}</h3>
    <div class="color-buttons">
      <v-btn
        v-for="color in option.values"
        :key="color"
        :disabled="isDisableColor(color)"
        rounded
        flat
        :class="{ 'color-button-active': isColorActive(option, color) }"
        :style="{ backgroundColor: getColorFromName(color) }"
        @click="emit('color-changed', option, color)"
        :title="color"
      >
        <v-icon
          v-if="isColorActive(option, color)"
          class="check-icon"
          :color="getColorFromName(color) === '#ffffff' ? 'black' : 'white'"
          icon="mdi-check"
        />
      </v-btn>
    </div>
  </div>
</template>

<style lang="sass">
@use "@/assets/mixins" as *

.variant-option-group
  margin-bottom: 16px

.variant-option-title
  font-size: $font-size-lg
  font-weight: 500
  margin-bottom: 8px

.color-buttons
  display: flex
  align-items: center
  justify-content: flex-start
  flex-wrap: wrap
  gap: 8px

.color-button-active
  border: 2px solid $primary-color

.check-icon
  font-size: 18px
</style>

