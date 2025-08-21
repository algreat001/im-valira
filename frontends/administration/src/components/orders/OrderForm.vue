<script lang="ts" setup>
import { computed } from "vue";

import type { OrderDto, OrderStatus } from "@/interfaces/order";
import { getOrderStatusMeta } from "@/helpers/format.ts";

const model = defineModel<OrderDto>({ required: true });

interface Props {
  loading?: boolean;
}

const props = defineProps<Props>();

const statuses: OrderStatus[] = [
  "pending",
  "processing",
  "completed",
  "cancelled",
  "failed",
  "refunded",
  "delivered",
  "shipped",
  "unknown"
];

const delivery = computed<any | undefined>(() => (model.value as any)?.meta?.delivery);
</script>

<template>
  <v-row dense>
    <v-col cols="12" md="12">
      <v-text-field
        v-model="model.number"
        label="Номер заказа"
        density="comfortable"
        hide-details
        clearable
        autofocus
      />
    </v-col>
    <v-col cols="12" md="12">
      <v-select
        v-model="model.status"
        :items="statuses"
        label="Статус"
        density="comfortable"
        hide-details
        clearable
      >
        <template v-slot:item="{ props: itemProps, item }">
          <v-list-item v-bind="itemProps"
                       :title="getOrderStatusMeta(item.props.value).text"
                       :color="getOrderStatusMeta(item.raw).color"
                       :prepend-icon="getOrderStatusMeta(item.raw).icon"
          />
        </template>
        <template #selection="{ item }">
          <v-chip :prepend-icon="getOrderStatusMeta(item.props.value).icon"
                  :color="getOrderStatusMeta(item.props.value).color"
                  variant="tonal"
                  size="small"
          >
            {{ getOrderStatusMeta(item.props.value).text }}
          </v-chip>
        </template>
      </v-select>
    </v-col>

    <v-col cols="12" md="6">
      <v-checkbox
        v-model="model.is_completed"
        label="Выполнен"
        density="comfortable"
        hide-details
        class="mt-2"
      />
    </v-col>

    <v-col cols="12" md="6">
      <v-checkbox
        v-model="model.is_paid"
        label="Оплачен"
        density="comfortable"
        hide-details
        class="mt-2"
      />
    </v-col>

    <v-col cols="12" md="12">
      <v-text-field
        v-model.number="model.meta.total_price"
        label="Сумма"
        type="number"
        density="comfortable"
        hide-details
        clearable
      />
    </v-col>

    <v-col cols="12">
      <v-textarea
        v-model="model.meta.description"
        label="Описание"
        rows="3"
        density="comfortable"
        hide-details
        auto-grow
      />
    </v-col>

    <v-col cols="12" v-if="model.items">
      <v-card variant="tonal">
        <v-card-subtitle>Позиции заказа {{ model.items.length }}</v-card-subtitle>
        <v-card-text>
          <v-data-table
            :items="model.items"
            item-key="order_item_id"
            :headers="[
              { title: 'Товар', key: 'name' },
              { title: 'Кол-во', key: 'quantity' },
              { title: 'Цена', key: 'price' }
            ]"
            density="compact"
          />
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" v-if="delivery">
      <v-card variant="tonal">
        <v-card-subtitle>Адрес доставки</v-card-subtitle>
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field :model-value="delivery?.name"
                            label="Получатель"
                            density="comfortable"
                            hide-details
                            readonly
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field :model-value="delivery?.phone"
                            label="Телефон"
                            density="comfortable"
                            hide-details
                            readonly
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field :model-value="delivery?.city" label="Город" density="comfortable" hide-details readonly />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field :model-value="delivery?.postal_code"
                            label="Индекс"
                            density="comfortable"
                            hide-details
                            readonly
              />
            </v-col>
            <v-col cols="12">
              <v-text-field :model-value="delivery?.address"
                            label="Адрес"
                            density="comfortable"
                            hide-details
                            readonly
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field :model-value="delivery?.tracking_number"
                            label="Трек-номер"
                            density="comfortable"
                            hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field :model-value="delivery?.tracking_link"
                            label="Трек-ссылка"
                            density="comfortable"
                            hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style lang="sass">
</style>
