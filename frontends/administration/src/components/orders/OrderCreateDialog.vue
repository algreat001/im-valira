<script lang="ts" setup>
import { ref, watch } from "vue";

import type { OrderDto } from "@/interfaces/order";
import OrderForm from "@/components/orders/OrderForm.vue";

const open = defineModel<boolean>({ required: true });

interface Props {
  loading: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  submit: [ payload: Partial<OrderDto> ];
}>();

function getDefaultForm(): OrderDto {
  return {
    number: "",
    status: "pending",
    items: [],
    is_completed: false,
    is_paid: false,
    meta: {
      total_price: 0,
      description: "",
      payment_method: "cash"
    }
  };
}

const form = ref<OrderDto>(getDefaultForm());

function onCancel() {
  open.value = false;
}

function onSubmit() {
  if (!form.value.number) {
    return;
  }
  emit("submit", { ...form.value });
}

watch(open, (v) => {
  if (!v) {
    form.value = getDefaultForm();
  }
});
</script>

<template>
  <v-dialog v-model="open" max-width="720">
    <v-card>
      <v-card-title>Создание заказа</v-card-title>
      <v-card-text>
        <order-form v-model="form" :loading="props.loading" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="onCancel">Отмена</v-btn>
        <v-btn color="primary" :loading="props.loading" :disabled="!form.number" @click="onSubmit">Создать</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="sass">
.v-card-title
  font-weight: 600
</style>
