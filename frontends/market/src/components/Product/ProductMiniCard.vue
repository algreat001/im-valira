<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";

import { useCartStore } from "@/stores/cart";
import { Product } from "@/helpers/product";

import SmartImage from "@/components/Bricks/SmartImage.vue";
import ProductTagIcons from "./ProductTagIcons.vue";

const props = defineProps<{ product: Product }>();

const cart = useCartStore();
const router = useRouter();

function handleAddToCart(event: MouseEvent) {
  if ((props.product.hasVariants)) {
    handleCardClick();
    return;
  }
  event.stopPropagation();
  cart.addToCart(props.product);
}

function handleCardClick() {
  router.push({ path: `/product/${props.product.product_id}` });
}

const price = computed(() => {
  if (props.product.hasVariants) {
    return `от ${props.product.formatPrice()}`;
  }
  return props.product.formatPrice();
});
</script>

<template>
  <v-card class="product-mini-card" elevation="2" @click="handleCardClick">
    <product-tag-icons :tags="product.tags" />
    <smart-image :src="product.displayImage" :alt="product.displayName" :height="180" />
    <v-card-title class="product-mini-card__title text-truncate">{{ product.displayName }}</v-card-title>
    <v-card-subtitle class="product-mini-card__price text-h6 font-weight-bold">
      {{ price }}
    </v-card-subtitle>
    <v-card-text class="product-mini-card__desc text-truncate">{{ product.description }}</v-card-text>
    <v-card-actions>
      <v-btn color="primary" block @click="handleAddToCart">В корзину</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped lang="sass">
@use "@/assets/mixin" as mixin

.product-mini-card
  position: relative
  display: flex
  flex-direction: column
  align-items: stretch
  justify-content: flex-start
  min-width: 220px
  max-width: 260px
  min-height: 340px
  border-radius: mixin.$card-radius
  overflow: hidden
  @include mixin.card-shadow

  &__image
    border-radius: 0
    object-fit: cover
    min-height: 180px
    max-height: 180px

  &__title
    font-size: 1.1rem
    font-weight: 600
    margin-bottom: 0
    margin-top: 8px
    color: var(--v-theme-on-surface)
    text-align: left
    min-height: 32px

  &__price
    color: var(--v-theme-primary)
    margin-bottom: 0
    margin-top: 0
    text-align: left

  &__desc
    font-size: 0.95rem
    color: var(--v-theme-on-surface)
    margin-bottom: 0
    margin-top: 4px
    min-height: 32px
    text-align: left
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis

  .v-card-actions
    margin-top: auto
    padding: 12px
</style>
