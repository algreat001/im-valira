<script lang="ts" setup>
import { ref, watch } from "vue";

import type { ProductDto } from "@/interfaces/product";
import ProductForm from "@/components/products/ProductForm.vue";

const open = defineModel<boolean>({ required: true });

interface Props {
  loading: boolean;
  product: ProductDto | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  submit: [ payload: Partial<ProductDto> ];
}>();

function toForm(p: ProductDto | null): Partial<ProductDto> {
  return {
    name: p?.name ?? "",
    categories: p?.categories ?? [],
    meta: {
      article: p?.meta.article ?? "",
      price: p?.meta.price ?? 0,
      description: p?.meta.description ?? "",
      image: p?.meta.image ?? "",
      gallery: p?.meta.gallery ?? [],
      specs: p?.meta.specs ?? {}
    }
  };
}

const form = ref<Partial<ProductDto>>(toForm(props.product ?? null));

function onCancel() {
  open.value = false;
}

function onSubmit() {
  emit("submit", { ...form.value });
}

watch(() => props.product, (p) => {
  form.value = toForm(p ?? null);
}, { immediate: true });

watch(open, (v) => {
  if (!v) {
    form.value = toForm(props.product ?? null);
  }
});
</script>

<template>
  <v-dialog v-model="open" max-width="720">
    <v-card>
      <v-card-title>Редактирование товара</v-card-title>
      <v-card-text>
        <product-form v-model="form" :loading="props.loading" :product-id="props.product?.product_id" />
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
