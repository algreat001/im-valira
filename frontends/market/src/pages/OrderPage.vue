<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";

import { useOrderStore } from "@/stores/order";

import OrderList from "@/components/OrderList.vue";
import OrderDetails from "@/components/OrderDetails.vue";

type OrdersMode = "active" | "completed";

const store = useOrderStore();

const mode = ref<OrdersMode>("active");
const selectedId = ref<number | null | undefined>(null);

const orders = computed(() => store.ordersArray || []);
const selectedOrder = computed(() => {
  if (!selectedId.value) {
    return null;
  }
  return orders.value.find((o: any) => ((o.order_id) === selectedId.value)) || null;
});

const isLoading = computed(() => store.loading);
const isItemsLoading = computed(() => store.loadingPositions);
const error = computed(() => store.error);
const items = computed(() => store.currentPositions || []);


async function load(modeParam: OrdersMode) {
  await store.loadOrders(modeParam);
  selectedId.value = orders.value[0].order_id ?? null;
  if (selectedId.value) {
    await store.loadOrderItems(selectedId.value);
  }
}

async function onSelectOrder(id?: null | number) {
  if (!id) {
    return;
  }
  selectedId.value = id;
  await store.loadOrderItems(id);
}

async function onCancelOrder(id?: null | number) {
  if (!id) {
    return;
  }
  selectedId.value = id;
  await store.cancelOrder(id);
}

async function onReload() {
  await load(mode.value);
}

watch(mode, async (m) => {
  await load(m);
}, { immediate: true });

onMounted(async () => {
  if (!orders.value?.length) {
    await load(mode.value);
  }
});
</script>

<template>
  <v-container class="orders-page" fluid>
    <v-row class="mb-2" align="center">
      <v-col cols="12">
        <v-toolbar flat density="comfortable">
          <v-toolbar-title>Мои заказы</v-toolbar-title>
          <v-spacer />
          <v-btn
            prepend-icon="mdi-refresh"
            color="primary"
            variant="outlined"
            :loading="isLoading"
            :disabled="isLoading"
            @click="onReload"
          >
            Обновить
          </v-btn>
        </v-toolbar>
      </v-col>
      <v-col cols="12">
        <v-tabs v-model="mode" color="primary" grow>
          <v-tab value="active">Активные</v-tab>
          <v-tab value="completed">Завершенные</v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="5">
        <order-list
          :orders="orders"
          :loading="isLoading"
          :error="error"
          v-model:selected-id="selectedId"
          @update:selected-id="onSelectOrder"
        />
      </v-col>

      <v-col cols="12" md="7">
        <order-details
          :order="selectedOrder"
          :items="items"
          :loading-items="isItemsLoading"
          @cancel="onCancelOrder"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="sass">
@use "@/assets/mixin.sass"

.mr-2
  margin-right: 8px

.mr-3
  margin-right: 12px
</style>
