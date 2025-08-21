import { computed, ref } from "vue";
import { defineStore } from "pinia";

import type { CartItem } from "@/interfaces/cartItem";
import type { Product } from "@/helpers/product";
import { useAuthStore } from "@/stores/auth";
import type { AddCartItemPayload } from "@/backend/cart.service";
import * as cartApi from "@/backend/cart.service";

export const useCartStore = defineStore("cart", () => {
  const items = ref<CartItem[]>([]);

  const totalCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0));
  const totalPrice = computed(() => items.value.reduce((sum, item) => sum + item.price * item.quantity, 0));


  async function addToCart(product: Product, quantity = 1) {
    useAuthStore().testAuthenticated(location.pathname + location.search);

    const existing = items.value.find(
      i => i.product_id === product.product_id && i.variant_id === product.selectedVariant?.product_variant_id
    );

    if (existing) {
      await updateQuantity(existing.cart_item_id, quantity + existing.quantity);
    } else {
      const newItem: AddCartItemPayload = {
        product_id: product.product_id,
        variant_id: product.selectedVariant?.product_variant_id,
        quantity
      };
      try {
        const created = await cartApi.addItem(newItem);
        items.value.push(created);
      } catch {
        // при ошибке можно сообщить об этом
      }
    }
  }

  async function removeFromCart(id: number) {
    try {
      await cartApi.removeItem(id);
      items.value = items.value.filter(i => i.cart_item_id !== id);
    } catch {
      // при ошибке можно сообщить об этом
    }
  }

  async function updateQuantity(id: number, quantity: number) {
    const item = items.value.find(i => i.cart_item_id === id);
    if (!item) {
      return;
    }

    try {
      const result = await cartApi.updateItem(id, { quantity });
      item.quantity = result.quantity;
    } catch {
      // при ошибке можно сообщить об этом
    }
  }

  function forceClearCart() {
    items.value = [];
  }

  async function clearCart() {
    try {
      await cartApi.clearCart();
      items.value = [];
    } catch {
      // при ошибке можно сообщить об этом
    }
  }

  async function loadCart() {
    try {
      items.value = await cartApi.getCart();
    } catch {
      // ignore errors silently
    }
  }

  return {
    items,
    totalCount,
    totalPrice,
    forceClearCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCart
  };
});
