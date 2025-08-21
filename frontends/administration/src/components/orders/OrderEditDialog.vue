<script lang="ts" setup>
import { ref, watch } from "vue";

import type { OrderDto } from "@/interfaces/order";
import OrderForm from "@/components/orders/OrderForm.vue";

const open = defineModel<boolean>({ required: true });

interface Props {
  loading: boolean;
  order: OrderDto | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  submit: [ payload: Partial<OrderDto> ];
}>();

function toForm(o: OrderDto | null): OrderDto {
  return {
    order_id: o?.order_id,
    items: o?.items ?? [],
    is_completed: o?.is_completed ?? false,
    is_paid: o?.is_paid ?? false,
    number: o?.number ?? "",
    status: o?.status ?? "pending",
    meta: {
      ...o?.meta,
      payment_method: (o?.meta as any)?.payment_method ?? "cash",
      total_price: (o?.meta as any)?.total_price ?? 0,
      description: (o?.meta as any)?.description ?? ""
    }
  };
}

const form = ref<OrderDto>(toForm(props.order ?? null));

function onCancel() {
  open.value = false;
}

function onSubmit() {
  emit("submit", { ...form.value });
}

watch(() => props.order, (o) => {
  form.value = toForm(o ?? null);
}, { immediate: true });

watch(open, (v) => {
  if (!v) {
    form.value = toForm(props.order ?? null);
  }
});
</script>

<template>
  <v-dialog v-model="open" max-width="720">
    <v-card>
      <v-card-title>Редактирование заказа</v-card-title>
      <v-card-text>
        <order-form v-model="form" :loading="props.loading" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="onCancel">Отмена</v-btn>
        <v-btn color="primary" :loading="props.loading" @click="onSubmit">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="sass">
.v-card-title
  font-weight: 600
</style>
