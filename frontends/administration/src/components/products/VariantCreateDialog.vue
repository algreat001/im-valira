<script lang="ts" setup>
import { ref, watch } from "vue";

import type { ProductVariantDto } from "@/interfaces/product";
import VariantForm from "@/components/products/VariantForm.vue";

const open = defineModel<boolean>({ required: true });

interface Props {
  loading: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  submit: [ payload: Partial<ProductVariantDto> ];
}>();

function getDefaultForm(): Partial<ProductVariantDto> {
  return {
    name: "",
    meta: { price: 0, specs: {}, description: "", image: "", gallery: [], article: "" }
  };
}

const form = ref<Partial<ProductVariantDto>>(getDefaultForm());

function onCancel() {
  open.value = false;
}

function onSubmit() {
  if (!form.value.name) {
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
  <v-dialog v-model="open" max-width="560">
    <v-card>
      <v-card-title>Создание варианта</v-card-title>
      <v-card-text>
        <variant-form v-model="form" :loading="props.loading" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="onCancel">Отмена</v-btn>
        <v-btn color="primary" :loading="props.loading" :disabled="!form.name" @click="onSubmit">Создать</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="sass">
.v-card-title
  font-weight: 600
</style>
