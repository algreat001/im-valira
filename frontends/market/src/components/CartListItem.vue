<script setup lang="ts">
import { ref } from "vue";
import type { CartItem } from "@/interfaces/cartItem";
import { useCartStore } from "@/stores/cart.ts";

interface Props {
  item: CartItem;
  isEditable?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits([ "remove" ]);

const isVisible = ref(true);

function handleRemove() {
  isVisible.value = false;
  setTimeout(() => {
    emit("remove");
    isVisible.value = true;
  }, 350);
}

function updateQuantity(id: number, quantity: number) {
  useCartStore().updateQuantity(id, quantity);
}

</script>

<template>
  <v-scroll-y-transition>
    <template v-if="isVisible">
      <template v-if="!isEditable">
        <v-list-item :key="props.item.cart_item_id">
          <template #prepend>
            <v-avatar size="40">
              <smart-image :width="40" :height="40" :src="props.item.image" :alt="props.item.name" />
            </v-avatar>
          </template>
          <template #title>
            {{ props.item.name }}
          </template>
          <template #subtitle>
            {{ props.item.price.toLocaleString() }} ₽ × {{ props.item.quantity }} =
            {{ (props.item.price * props.item.quantity).toLocaleString() }} ₽
          </template>
          <template #append>
            <v-btn icon flat size="small" @click.stop="handleRemove">
              <v-icon color="accent" icon="mdi-delete"></v-icon>
            </v-btn>
          </template>
        </v-list-item>
      </template>
      <template v-else>
        <v-list-group :key="'lg' + props.item.cart_item_id">
          <template #activator="{ props }">
            <v-list-item class="cart-list-item-group" v-bind="props" :key="item.cart_item_id">
              <template #prepend>
                <v-avatar size="40">
                  <v-img :src="item.image" :alt="item.name" />
                </v-avatar>
              </template>
              <template #title>
                {{ item.name }}
              </template>
              <template #subtitle>
                {{ item.price.toLocaleString() }} ₽ × {{ item.quantity }} =
                {{ (item.price * item.quantity).toLocaleString() }} ₽
              </template>
            </v-list-item>
          </template>
          <v-list-item :key="'li' + props.item.cart_item_id" style="padding-inline-start: 16px !important;">
            <template #prepend>
              <v-btn icon :to="`/product/${props.item.product_id}`" size="small" flat>
                <v-icon icon="mdi-eye" />
              </v-btn>
            </template>
            <template #title>
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
            <template #append>
              <v-btn icon flat size="small" @click.stop="handleRemove">
                <v-icon color="accent" icon="mdi-delete"></v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list-group>
      </template>
    </template>
  </v-scroll-y-transition>
</template>

<style lang="sass">
.cart-list-item-group
  padding: 4px
  padding-inline: 0 !important

  .v-list-item__prepend
    width: 48px

  .v-list-item__append
    width: 24px
</style>
