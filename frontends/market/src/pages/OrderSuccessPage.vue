<script setup lang="ts">
import { computed } from "vue";
import { type RouteLocationRaw, useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const orderId = computed(() => {
  const val = route.query.number;
  return (Array.isArray(val) ? val[0] : val) ?? null;
});

function goMyOrders() {
  router.push({ name: "Orders" } as unknown as RouteLocationRaw);
}

function goHome() {
  router.push({ name: "Home" } as unknown as RouteLocationRaw);
}
</script>

<template>
  <v-container class="py-10" style="max-width: 720px;">
    <v-card>
      <v-card-title class="text-h6">Заказ оформлен</v-card-title>
      <v-divider />
      <v-card-text>
        <p class="mb-4">
          Спасибо! Ваш заказ успешно оформлен.
        </p>
        <p v-if="orderId" class="mb-4">
          Номер заказа: <strong>№ {{ orderId }}</strong>
        </p>
        <v-alert class="mb-4" type="info" variant="tonal">
          Вы можете управлять своими заказами в соответствующем разделе сайта.
        </v-alert>
        <v-alert type="warning" variant="tonal">
          Если вы оплатили заказ онлайн, подтверждение придет на вашу почту. В случае вопросов — свяжитесь с нами.
        </v-alert>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="primary" @click="goMyOrders">Мои заказы</v-btn>
        <v-btn color="primary" variant="flat" @click="goHome">На главную</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style scoped lang="sass">
</style>
