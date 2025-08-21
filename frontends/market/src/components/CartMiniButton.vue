<script setup lang="ts">
import { computed } from "vue";

import { useCartStore } from "@/stores/cart";

const cart = useCartStore();

const cartCount = computed(() => cart.totalCount);
const showCount = computed(() => cartCount.value > 0);
</script>

<template>
  <v-menu offset-y>
    <template #activator="{ props }">
      <v-btn icon class="mr-2" v-bind="props">
        <v-badge :content="cartCount" color="accent" v-if="showCount" overlap>
          <v-icon icon="mdi-cart" />
        </v-badge>
        <v-icon icon="mdi-cart" v-else />
      </v-btn>
    </template>
    <template #default>
      <v-card min-width="320">
        <v-card-title class="font-weight-bold">Корзина</v-card-title>
        <v-divider />
        <cart-mini no-increment />
        <v-divider />
        <v-card-actions class="d-flex justify-space-between">
          <div class="font-weight-bold">Итого: {{ cart.totalPrice.toLocaleString() }} ₽</div>
          <router-link to="/cart">
            <v-btn color="primary" variant="flat">Перейти</v-btn>
          </router-link>
        </v-card-actions>
      </v-card>
    </template>
  </v-menu>
</template>

<style scoped lang="sass">
.font-weight-bold
  font-weight: 700
</style>
