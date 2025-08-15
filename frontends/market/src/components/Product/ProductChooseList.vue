<script setup lang="ts">
import { ref, watch } from "vue";

import { Product } from "@/helpers/product";
import type { ProductVariantOption } from "@/interfaces/productVariantOption";

import ProductColorChoose from "@/components/Product/Choose/ProductColorChoose.vue";
import ProductSizeChoose from "@/components/Product/Choose/ProductSizeChoose.vue";

const product = defineModel<Product>({
  type: Product,
  required: true
});
const emit = defineEmits([ "variant-changed" ]);

const variantOptions = ref<ProductVariantOption[]>([]);

watch(() => product.value, () => {
  if (product.value) {
    initVariantOptions();
  }
}, { immediate: true });

function initVariantOptions() {
  variantOptions.value = product.value.getVariantOptions();
  setAvailableOptions();

  if (!product.value.selectedVariant && product.value.hasVariants) {
    product.value.setSelectedVariant(product.value.variants![0]);
  }
  initSelectedValues();

}

function initSelectedValues() {
  if (!product.value.selectedVariant) {
    return;
  }
  for (const option of variantOptions.value) {
    if (typeof option.type !== "string") {
      continue;
    }
    option.selectedValue = product.value.selectedVariant.meta.specs?.[option.type] as string;
  }
}

function setAvailableOptions() {
  const availableVariants = product.value.calcAvailableVariantsForCurrentVariant();
  for (const option of variantOptions.value) {
    option.enableValues = option.values.filter(
      value => availableVariants.some(variant => variant.meta.specs?.[option.type] === value)
    );
  }
}

function handleOptionValueUpdate(option: ProductVariantOption, value: string) {
  option.selectedValue = value;

  product.value?.setSelectedVariant(product.value?.findMatchingVariant(variantOptions.value));
  setAvailableOptions();
  emit("variant-changed");
}
</script>

<template>
  <div class="product-choose-list">
    <template v-for="option in variantOptions" :key="option.paramId">
      <product-color-choose v-if="option.type === 'color'" :option="option" @color-changed="handleOptionValueUpdate" />
      <product-size-choose v-else-if="option.type === 'size'"
                           :option="option"
                           @size-changed="handleOptionValueUpdate"
      />
      <div v-else class="variant-option-group no-variants-message">
        unknown option type: {{ option.type }}
      </div>
    </template>
  </div>
</template>

<style scoped lang="sass">
.product-choose-list
  margin-bottom: 16px

.no-variants-message
  color: rgba(0, 0, 0, 0.6)
  font-style: italic
</style>
