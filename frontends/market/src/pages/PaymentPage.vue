<script setup lang="ts">
import { computed } from "vue";
import { type RouteLocationRaw, useRoute, useRouter } from "vue-router";
import SbpPayment from "@/components/Payment/SbpPayment.vue";

const route = useRoute();
const router = useRouter();

// Ожидаем параметры в query: order_id и token
const orderId = computed(() => {
  const val = route.query.order_id;
  return (Array.isArray(val) ? val[0] : val) ?? null;
});
const method = computed(() => {
  const val = route.query.method;
  return (Array.isArray(val) ? val[0] : val) ?? "";
});
const token = computed(() => {
  const val = route.query.token;
  return (Array.isArray(val) ? val[0] : val) ?? "";
});

function goHome() {
  router.push({ name: "Home" } as unknown as RouteLocationRaw);
}
</script>

<template>
  <v-container class="py-10" style="max-width: 900px;">
    <h1 class="mb-6">Оплата заказа</h1>

    <template v-if="method === 'sbp' && token && orderId">
      <sbp-payment :token="token" :order-id="orderId ?? undefined" />
    </template>
    <template v-else>
      <v-card class="mb-6">
        <v-card-title class="text-h6">Данные для оплаты отсутствуют</v-card-title>
        <v-divider />
        <v-card-text>
          Не удалось получить параметры оплаты. Проверьте ссылку или начните оформление заказа заново.
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="primary" variant="flat" @click="goHome">На главную</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-container>
</template>
