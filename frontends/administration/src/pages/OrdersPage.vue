<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";

import { listOrders, updateOrder, createOrder, deleteOrder } from "@/backend/order.service";
import { formatCurrency, formatDate, getOrderStatusMeta } from "@/helpers/format";

import OrderCreateDialog from "@/components/orders/OrderCreateDialog.vue";
import OrderEditDialog from "@/components/orders/OrderEditDialog.vue";
import OrderFilterDialog from "@/components/orders/OrderFilterDialog.vue";

import type { OrderDto, OrderStatus } from "@/interfaces/order";

const loading = ref(false);
const error = ref<string | null>(null);
const orders = ref<OrderDto[]>([]);

const createDialog = ref(false);
const editDialog = ref(false);

const editOrderRef = ref<OrderDto | null>(null);

const filterDialog = ref(false);
const filterStatus = ref<OrderStatus | null>(null);
const filterIsComplete = ref<boolean | null>(null);
const filterIsPaid = ref<boolean | null>(null);
const statuses: OrderStatus[] = [ "pending", "processing", "completed", "cancelled", "failed", "refunded", "delivered", "shipped", "unknown" ];

const filteredOrders = computed(() => {
  let result = orders.value;
  if (filterStatus.value) {
    result = result.filter(o => o.status === filterStatus.value);
  }
  if (filterIsComplete.value !== null) {
    result = result.filter(o => o.is_completed === filterIsComplete.value);
  }
  if (filterIsPaid.value !== null) {
    result = result.filter(o => o.is_paid === filterIsPaid.value);
  }
  return result;
});

function openFilterDialog() {
  filterDialog.value = true;
}

async function load() {
  loading.value = true;
  error.value = null;
  try {
    orders.value = (await listOrders()) as any;
  } catch (e: any) {
    error.value = e?.message || "Не удалось загрузить заказы";
  } finally {
    loading.value = false;
  }
}

function openCreateDialog() {
  createDialog.value = true;
}

async function submitCreate(payload: Partial<OrderDto>) {
  await createOrder(payload);
  createDialog.value = false;
  await load();
}

function openEditDialog(o: OrderDto) {
  editOrderRef.value = o;
  editDialog.value = true;
}

async function confirmEdit(payload: Partial<OrderDto>) {
  if (!editOrderRef.value || !editOrderRef.value.order_id) {
    return;
  }
  await updateOrder(editOrderRef.value.order_id, payload);
  editDialog.value = false;
  await load();
}

async function onDelete(o: OrderDto) {
  if (!o.order_id) {
    return;
  }
  await deleteOrder(o.order_id);
  await load();
}

onMounted(load);
</script>

<template>
  <v-container>
    <v-toolbar flat>
      <v-toolbar-title>Заказы</v-toolbar-title>
      <v-spacer />
      <v-btn :icon="'mdi-filter-variant'" variant="text" @click="openFilterDialog" />
      <v-btn color="primary" :loading="loading" @click="openCreateDialog">Добавить заказ</v-btn>
    </v-toolbar>

    <v-alert v-if="error" type="error" variant="tonal" class="mb-3">{{ error }}</v-alert>

    <v-data-table
      hover
      :items="filteredOrders"
      item-value="order_id"
      :headers="[
        { title: 'ID', key: 'order_id' },
        { title: 'Номер', key: 'number' },
        { title: 'Статус', key: 'status' },
        { title: 'Выполнен', key: 'is_completed', align: 'center' },
        { title: 'Оплачен', key: 'is_paid', align: 'center' },
        { title: 'Сумма', key: 'sum' },
        { title: 'Создан', key: 'created_at' },
        { title: 'Действия', key: 'actions', sortable: false }
      ]"
      :loading="loading"
    >
      <template #item.status="{ item }">
        <v-chip
          size="small"
          :color="getOrderStatusMeta(item.status).color"
          :prepend-icon="getOrderStatusMeta(item.status).icon"
          variant="tonal"
        >
          {{ getOrderStatusMeta(item.status).text }}
        </v-chip>
      </template>
      <template #item.is_completed="{ item }">
        <v-checkbox
          v-model="item.is_completed"
          density="compact"
          hide-details
          readonly
        />
      </template>
      <template #item.is_paid="{ item }">
        <v-checkbox
          v-model="item.is_paid"
          density="compact"
          hide-details
          readonly
        />
      </template>
      <template #item.sum="{ item }">
        {{ formatCurrency(item.meta?.total_price || 0) }}
      </template>
      <template #item.created_at="{ item }">
        {{ formatDate(item.created_at) }}
      </template>
      <template #item.actions="{ item }">
        <v-btn :icon="'mdi-pencil-outline'" size="small" variant="text" @click="openEditDialog(item)" />
        <v-btn :icon="'mdi-delete-outline'" size="small" variant="text" color="error" @click="onDelete(item)" />
      </template>
    </v-data-table>

    <order-filter-dialog
      v-model="filterDialog"
      v-model:status="filterStatus"
      v-model:is_complete="filterIsComplete"
      v-model:is_paid="filterIsPaid"
      :statuses="statuses"
    />

    <order-create-dialog
      v-model="createDialog"
      :loading="loading"
      @submit="submitCreate"
    />

    <order-edit-dialog
      v-model="editDialog"
      :loading="loading"
      :order="editOrderRef"
      @submit="confirmEdit"
    />
  </v-container>
</template>

<style lang="sass">
</style>
