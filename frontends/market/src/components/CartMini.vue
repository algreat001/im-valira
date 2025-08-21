<script setup lang="ts">

import { useCartStore } from "@/stores/cart";

import CartListItem from "@/components/CartListItem.vue";

interface CartMiniProps {
  isEditable?: boolean;
}

const props = defineProps<CartMiniProps>();

const cart = useCartStore();

function handleRemove(id: number) {
  cart.removeFromCart(id);
}

</script>

<template>
  <v-list max-height="395">
    <transition-group name="fade" tag="div">
      <cart-list-item
        v-if="cart.items.length > 0"
        v-for="item in cart.items"
        :key="item.cart_item_id"
        :item="item"
        :is-editable="props.isEditable"
        @remove="handleRemove(item.cart_item_id)"
      />
      <v-list-item v-else>
        <v-list-item-title>Корзина пуста</v-list-item-title>
      </v-list-item>
    </transition-group>
  </v-list>
</template>

<style scoped lang="sass">
.font-weight-bold
  font-weight: 700
</style>
