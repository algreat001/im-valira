<script lang="ts" setup>
import { computed, ref } from "vue";

import { formatDate, formatCurrency, getOrderStatusMeta } from "@/helpers/format";
import type { Order, OrderItem } from "@/stores/order";

interface OrderDetailsProps {
  order: Order | null;
  items: OrderItem[];
  loadingItems: boolean;
}

const props = defineProps<OrderDetailsProps>();

const emit = defineEmits<{ (e: "cancel", orderId: number): void }>();

const dialogCancel = ref(false);

function onOpenCancelDialog() {
  dialogCancel.value = true;
}

function onCloseCancelDialog() {
  dialogCancel.value = false;
}

function onConfirmCancel() {
  onCancelOrder();
  dialogCancel.value = false;
}

function onCancelOrder() {
  const id = (props.order as any)?.order_id ?? (props.order as any)?.id;
  if (id != null) {
    emit("cancel", id as number);
  }
}

const isAction = computed(() =>
  props.order?.is_completed === false
  && (props.order?.status === "pending" || props.order?.meta?.delivery?.tracking_number)
);

const status = computed(() => props.order?.status ? getOrderStatusMeta(props.order?.status) : null);

</script>

<template>
  <v-card min-height="320">
    <template v-if="props.order">
      <v-card-title class="text-h6">
        Заказ № {{ props.order.number }}
      </v-card-title>
      <v-card-subtitle>
        <v-chip size="small" :color="status?.color" variant="tonal">
          <v-icon :icon="status?.icon" size="18" start class="mr-1" />
          {{ status?.text }}
        </v-chip>
        <span class="mr-3">Дата: {{ formatDate(props.order.created_at) }}</span>
        <span>Сумма: {{ formatCurrency(props.order.meta?.total_price) }}</span>
      </v-card-subtitle>

      <v-card-actions v-if="isAction" class="px-4">
        <v-spacer />
        <v-btn
          v-if="props.order?.meta?.delivery?.tracking_number"
          :href="props.order?.meta?.delivery?.tracking_link || undefined"
          target="_blank"
          rel="noopener"
          color="primary"
          variant="tonal"
          prepend-icon="mdi-truck-delivery-outline"
          :disabled="!props.order?.meta?.delivery?.tracking_link"
        >
          {{ props.order?.meta?.delivery?.tracking_number }}
        </v-btn>
        <v-btn
          v-if="props.order?.status === 'pending'"
          color="error"
          variant="tonal"
          prepend-icon="mdi-cancel"
          @click="onOpenCancelDialog"
        >
          Отменить заказ
        </v-btn>
      </v-card-actions>

      <v-dialog v-model="dialogCancel" max-width="420">
        <v-card>
          <v-card-title class="text-h6">Подтверждение</v-card-title>
          <v-card-text>
            Отменить заказ № {{ props.order?.number }}?
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn variant="text" @click="onCloseCancelDialog">Нет</v-btn>
            <v-btn color="error" variant="tonal" prepend-icon="mdi-cancel" @click="onConfirmCancel">
              Да, отменить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-divider class="my-2" />

      <v-card-text>
        <div v-if="props.loadingItems" class="d-flex justify-center my-6">
          <v-progress-circular indeterminate color="primary" />
        </div>
        <v-alert v-else-if="!props.items?.length" type="info" variant="tonal">
          Позиции отсутствуют
        </v-alert>
        <v-list v-else lines="one" density="comfortable">
          <v-list-item
            v-for="(p, idx) in props.items"
            :key="p.order_item_id ?? `${p.name}-${idx}`"
          >
            <template #prepend>
              <v-avatar color="primary" variant="tonal" size="24">
                <span class="text-caption">{{ idx + 1 }}</span>
              </v-avatar>
            </template>
            <template #title>
              {{ p.name }}
            </template>
            <template #subtitle>
              {{ formatCurrency(p.price) }} × {{ p.quantity }}
            </template>
            <template #append>
              <span class="font-weight-medium">
                {{ formatCurrency(p.price * p.quantity) }}
              </span>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </template>

    <template v-else>
      <v-card-text class="text-medium-emphasis text-center">
        Выберите заказ из списка слева, чтобы посмотреть детали.
      </v-card-text>
    </template>
  </v-card>
</template>

<style lang="sass">
@use "@/assets/mixin.sass"

.mr-2
  margin-right: 8px

.mr-3
  margin-right: 12px
</style>
