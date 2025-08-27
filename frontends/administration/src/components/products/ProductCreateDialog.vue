<script lang="ts" setup>
import { ref, watch } from "vue";

import type { ProductDto } from "@/interfaces/product";
import ProductForm from "@/components/products/ProductForm.vue";

const open = defineModel<boolean>({ required: true });

interface Props {
  loading: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  submit: [ payload: ProductDto ];
}>();

function getDefaultForm(): ProductDto {
  return {
    name: "",
    categories: [],
    meta: {
      article: "",
      price: 0,
      description: "",
      image: "",
      gallery: [],
      specs: {}
    }
  };
}

const form = ref<ProductDto>(getDefaultForm());

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
  <v-dialog v-model="open" max-width="720">
    <v-card>
      <v-card-title>Создание товара</v-card-title>
      <v-card-text>
        <product-form v-model="form" :loading="props.loading" />
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
