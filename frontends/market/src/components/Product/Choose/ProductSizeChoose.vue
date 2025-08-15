<script lang="ts" setup>
import { computed } from "vue";

import type { ProductVariantOption } from "@/interfaces/productVariantOption";

interface ProductSizeChooseProps {
  option: ProductVariantOption;
}

const props = defineProps<ProductSizeChooseProps>();
const emit = defineEmits<{
  (e: "size-changed", option: ProductVariantOption, size: string): void;
}>();

const items = computed(() => props.option.values.map(v => ({
  disabled: props.option.enableValues?.includes(v) === false,
  title: v,
  value: v
})));

</script>

<template>
  <div class="variant-option-group">
    <h3 class="variant-option-title">{{ option.name }}</h3>
    <v-select
      v-model="option.selectedValue"
      :items="items"
      variant="outlined"
      density="compact"
      hide-details
      bg-color="white"
      class="size-select"
      @update:model-value="emit('size-changed', option, $event)"
    >
      <template v-slot:item="{ props: itemProps, item }">
        <v-list-item v-bind="itemProps" :disabled="item.raw.disabled" density="compact" />
      </template>
    </v-select>
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
</style>

