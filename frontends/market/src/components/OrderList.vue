<script lang="ts" setup>
import { computed } from "vue";

import { formatDate, formatCurrency, getOrderStatusMeta } from "@/helpers/format";
import type { Order } from "@/stores/order.ts";

interface OrderListProps {
  orders: Order[] | null | undefined;
  loading: boolean;
  error: string | null;
}

const props = defineProps<OrderListProps>();
const selectedId = defineModel<number | null>("selectedId");

const hasOrders = computed(() => (props.orders?.length || 0) > 0);

function onSelect(id: number) {
  selectedId.value = id;
}
</script>

<template>
  <v-card variant="elevated">
    <v-progress-linear v-if="props.loading" indeterminate color="primary" />
    <v-alert v-else-if="props.error" type="error" variant="tonal" class="ma-3">
      {{ props.error }}
    </v-alert>
    <template v-else>
      <v-list v-if="hasOrders" lines="two" density="comfortable" nav>
        <v-list-item
          v-for="o in props.orders"
          :key="o.order_id"
          rounded="none"
          :active="(o.order_id) === selectedId"
          @click="onSelect(o.order_id)"
        >
          <template #title>
            Заказ № {{ o.number }}
          </template>
          <template #subtitle>
            {{ formatDate(o.created_at) }}
            •
            {{ formatCurrency(o.meta.total_price) }}
          </template>
          <template #append>
            <v-chip size="small" :color="getOrderStatusMeta(o.status).color" variant="tonal">
              <v-icon :icon="getOrderStatusMeta(o.status).icon" size="18" start class="mr-1" />
              {{ getOrderStatusMeta(o.status).text }}
            </v-chip>
          </template>
        </v-list-item>
      </v-list>
      <v-card-text v-else class="text-medium-emphasis">
        Заказов нет
      </v-card-text>
    </template>
  </v-card>
</template>

<style lang="sass">
@use "@/assets/mixin.sass"
</style>
