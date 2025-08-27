<script setup lang="ts">
import { computed } from "vue";

import { useCartStore } from "@/stores/cart";
import type { TableHeader } from "@/interfaces/tableHeader";

interface Props {
}

const cart = useCartStore();
const cartItems = computed(() => cart.items);


const headers: TableHeader[] = [
  { title: "", key: "image", width: 56, sortable: false },
  { title: "Артикул", key: "article", align: "start", minWidth: 130, nowrap: true },
  { title: "Товар", key: "name", align: "start", minWidth: 180 },
  { title: "Цена", key: "price", align: "end", minWidth: 90, nowrap: true },
  { title: "Кол-во", key: "quantity", align: "center", minWidth: 160, nowrap: true },
  { title: "Сумма", key: "sum", align: "end", minWidth: 90, nowrap: true },
  { title: "", key: "actions", align: "end", minWidth: 20, sortable: false }
];

function updateQuantity(id: number, quantity: number) {
  cart.updateQuantity(id, quantity);
}

function remove(id: number) {
  cart.removeFromCart(id);
}


const props = defineProps<Props>();

</script>

<template>
  <v-data-table
    :headers="headers"
    :items="cartItems"
    item-key="id"
    hide-default-footer
    :items-per-page="cartItems.length"

  >
    <template #item.image="{ item }">
      <smart-image class="mr-2" :width="48" :height="48" :src="item.image" :alt="item.name" />
    </template>
    <template #item.article="{ item }">
      {{ item.article }}
    </template>
    <template #item.name="{ item }">
      <router-link :to="`/product/${item.product_id}`">{{ item.name }}</router-link>
    </template>
    <template #item.price="{ item }">
      {{ item.price.toLocaleString() }} ₽
    </template>
    <template #item.quantity="{ item }">
      <div class="d-flex ga-2 align-center">
        <v-number-input
          v-model.number="item.quantity"
          flat
          :min="1"
          :max="99"
          density="compact"
          controlVariant="split"
          variant="solo"
          inset
          hide-details
          @update:model-value="updateQuantity(item.cart_item_id, item.quantity)"
        />
      </div>
    </template>
    <template #item.sum="{ item }">
      {{ (item.price * item.quantity).toLocaleString() }} ₽
    </template>
    <template #item.actions="{ item }">
      <div class="d-flex ga-2 justify-end">
        <v-icon color="accent" icon="mdi-delete" size="small" @click="remove(item.cart_item_id)" />
      </div>
    </template>
  </v-data-table>
</template>

<style scoped lang="sass">
</style>

