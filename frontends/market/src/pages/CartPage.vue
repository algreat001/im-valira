<script setup lang="ts">
import { computed } from "vue";

import { useCartStore } from "@/stores/cart";

import CartTable from "@/components/CartTable.vue";
import { useUIStore } from "@/stores/ui.ts";

const cart = useCartStore();
const cartItems = computed(() => cart.items);
const totalPrice = computed(() => cart.totalPrice);
const hasItems = computed(() => cartItems.value.length > 0);

function clearCart() {
  cart.clearCart();
}

</script>

<template>
  <v-container class="py-8 fade-in" :class="{'pa-4': !useUIStore().isMobile, 'pa-2': useUIStore().isMobile}">
    <h1 class="mb-6">Корзина</h1>
    <v-row v-if="hasItems" justify="end">
      <v-col cols="12" md="12">
        <v-card elevation="2" :class="{'pa-4': !useUIStore().isMobile, 'pa-2': useUIStore().isMobile}">

          <cart-mini v-if="useUIStore().isMobile" is-editable />
          <cart-table v-else />
          <div class="d-flex justify-end mt-4">
            <v-btn color="accent" variant="text" @click="clearCart">Очистить корзину</v-btn>
          </div>
        </v-card>

      </v-col>
      <v-col cols="12" md="4">
        <v-card elevation="2" class="pa-4">
          <div class="text-h6 mb-2">Итого: <b>{{ totalPrice.toLocaleString() }} ₽</b></div>
          <router-link to="/checkout">
            <v-btn color="primary" block size="large">Оформить заказ</v-btn>
          </router-link>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <v-card elevation="2" class="pa-8 text-center">
          <h2>Ваша корзина пуста</h2>
          <router-link to="/catalog">
            <v-btn color="primary" size="large" class="mt-4">Перейти в каталог</v-btn>
          </router-link>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="sass">
</style>
