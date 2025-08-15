<script setup lang="ts">
const props = defineProps<{
  positionsCount: number;
  itemsCount: number;
  totalPrice: number;
}>();

</script>

<template>
  <v-card>
    <v-card-title>Итоговая информация</v-card-title>
    <v-divider />
    <v-card-text class="d-flex flex-column align-end">
      <div>Позиции (наименований): <strong>{{ positionsCount }}</strong></div>
      <div>Единиц товара: <strong>{{ itemsCount }}</strong></div>
      <div class="mt-2">Итого: <strong>{{ totalPrice.toLocaleString() }} ₽</strong></div>
    </v-card-text>
  </v-card>
</template>
