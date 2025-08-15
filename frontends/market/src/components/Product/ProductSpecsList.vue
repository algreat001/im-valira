<script setup lang="ts">
import type { ProductParameter, ProductParameterId } from "@/interfaces/productParameter.ts";
import type { Product } from "@/helpers/product.ts";
import { productParameters } from "@/data/products.ts";

interface Props {
  specs: Product["specs"];
}

const props = defineProps<Props>();

function getParameterName(id: ProductParameterId): string {
  const param = productParameters.find((p: ProductParameter) => p.product_parameter_id === id);
  return param ? param.name : id;
}
</script>

<template>
  <v-list dense>
    <v-list-item v-for="(val, key) in props.specs" :key="key">
      <v-list-item-title>
        <b>{{ getParameterName(key) }}:</b> {{ val }}
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<style scoped lang="sass">
.v-list
  margin-bottom: 16px
</style>
