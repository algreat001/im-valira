<script setup lang="ts">
interface CartItem {
  id?: string | number;
  cart_item_id?: string | number;
  product_id?: string | number;
  name: string;
  price: number;
  quantity: number;
}

defineProps<{
  items: CartItem[];
}>();
</script>

<template>
  <v-card>
    <v-card-title>Заказ</v-card-title>
    <v-divider />
    <v-card-text>
      <template v-if="items.length">
        <v-list lines="one">
          <v-list-item v-for="(it, idx) in items" :key="it.cart_item_id || it.product_id || it.id || idx">
            <template #prepend>
              <v-avatar size="24" color="primary" class="mr-2" variant="tonal">{{ idx + 1 }}</v-avatar>
            </template>
            <template #title>
              {{ it.name }}
            </template>
            <template #subtitle>
              Количество: {{ it.quantity }} • Цена за единицу: {{ it.price.toLocaleString() }} ₽
            </template>
            <template #append>
              <div class="font-weight-bold">
                {{ (it.price * it.quantity).toLocaleString() }} ₽
              </div>
            </template>
          </v-list-item>
        </v-list>
      </template>
      <template v-else>
        <v-alert type="info" variant="tonal">Корзина пуста</v-alert>
      </template>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="sass">
.font-weight-bold
  font-weight: 700
</style>
