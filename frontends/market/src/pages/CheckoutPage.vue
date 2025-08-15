<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

import DeliveryInfoCard from "@/components/Checkout/DeliveryInfoCard.vue";
import OrderItemsCard from "@/components/Checkout/OrderItemsCard.vue";
import OrderSummaryCard from "@/components/Checkout/OrderSummaryCard.vue";
import OrderPaymentCard from "@/components/Checkout/OrderPaymentCard.vue";
import { useCheckoutStore } from "@/stores/checkout";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const checkout = useCheckoutStore();
const auth = useAuthStore();

onMounted(async () => {
  await checkout.ensureAuthOrRedirect();
});
</script>

<template>
  <v-container class="payment-container fade-in">
    <h1 class="mb-6 w-100">Оформление заказа</h1>

    <template v-if="auth.user">
      <order-payment-card
        class="mb-6 w-100"
        v-model="checkout.paymentMethod"
      />

      <delivery-info-card
        class="mb-6 w-100"
        :full-name="checkout.fullName"
        :postal-code="checkout.postalCode"
        :delivery-city="checkout.deliveryCity"
        :delivery-address="checkout.deliveryAddress"
      />
      <order-items-card
        class="mb-6 w-100"
        :items="checkout.items"
      />
      <order-summary-card
        class="my-6 w-100"
        :items-count="checkout.totalCount"
        :positions-count="checkout.items.length"
        :total-price="checkout.totalPrice"
      />
      <v-btn class="submit-button"
             color="primary"
             size="large"
             :disabled="!checkout.items.length"
             @click="checkout.submitOrder(router)"
      >
        Подтвердить заказ
      </v-btn>

    </template>

    <template v-else>
      <v-alert type="info" variant="tonal">Загрузка…</v-alert>
    </template>
  </v-container>
</template>

<style scoped lang="sass">
.payment-container
  display: flex
  flex-direction: column
  align-items: flex-end
  gap: 16px
  max-width: 900px

.submit-button
  right: 0
</style>

