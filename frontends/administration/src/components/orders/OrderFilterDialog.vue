<script lang="ts" setup>
import { ref, watch } from "vue";
import { getOrderStatusMeta } from "@/helpers/format.ts";
import type { OrderStatus } from "@/interfaces/order.ts";

const open = defineModel<boolean>({ required: true });
const statusModel = defineModel<OrderStatus | null>("status");
const isCompleteModel = defineModel<boolean | null>("is_complete");
const isPaidModel = defineModel<boolean | null>("is_paid");

interface Props {
  statuses: OrderStatus[];
}

const props = defineProps<Props>();

const localStatus = ref<OrderStatus | null>(null);
const localIsComplete = ref<boolean | null>(null);
const localIsPaid = ref<boolean | null>(null);

function onCancel() {
  open.value = false;
}

function onApply() {
  statusModel.value = localStatus.value;
  isCompleteModel.value = localIsComplete.value;
  isPaidModel.value = localIsPaid.value;
  open.value = false;
}

function onClear() {
  localStatus.value = null;
  localIsComplete.value = null;
  localIsPaid.value = null;
  statusModel.value = null;
  isCompleteModel.value = null;
  isPaidModel.value = null;
  open.value = false;
}

watch(open, (v) => {
  if (v) {
    localStatus.value = statusModel.value ?? null;
    localIsComplete.value = isCompleteModel.value ?? null;
    localIsPaid.value = isPaidModel.value ?? null;
  }
});
</script>

<template>
  <v-dialog v-model="open" max-width="480">
    <v-card>
      <v-card-title>Фильтр заказов</v-card-title>
      <v-card-text>
        <v-select
          v-model="localStatus"
          :items="props.statuses"
          label="Статус заказа"
          density="comfortable"
          clearable
          hide-details
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

        <v-select
          class="mt-3"
          v-model="localIsComplete"
          :items="[
            { title: 'Любой', value: null },
            { title: 'Выполнен', value: true },
            { title: 'Не выполнен', value: false }
          ]"
          item-title="title"
          item-value="value"
          label="Состояние выполнения"
          density="comfortable"
          hide-details
          clearable
        />

        <v-select
          class="mt-3"
          v-model="localIsPaid"
          :items="[
            { title: 'Любой', value: null },
            { title: 'Оплачен', value: true },
            { title: 'Не оплачен', value: false }
          ]"
          item-title="title"
          item-value="value"
          label="Оплата"
          density="comfortable"
          hide-details
          clearable
        />
      </v-card-text>
      <v-card-actions>
        <v-btn variant="text" @click="onClear">Сбросить</v-btn>
        <v-spacer />
        <v-btn variant="text" @click="onCancel">Отмена</v-btn>
        <v-btn color="primary" @click="onApply">Применить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="sass">
</style>
