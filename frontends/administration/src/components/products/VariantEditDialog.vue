<script lang="ts" setup>
import { ref, watch } from "vue";

import type { ProductVariantDto } from "@/interfaces/product";
import VariantForm from "@/components/products/VariantForm.vue";

const open = defineModel<boolean>({ required: true });

interface Props {
  loading: boolean;
  variant: ProductVariantDto | null;
  productId?: number | string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  submit: [ payload: Partial<ProductVariantDto> ];
}>();

function toForm(v: ProductVariantDto | null): Partial<ProductVariantDto> {
  return {
    name: v?.name ?? "",
    meta: {
      article: v?.meta.article ?? "",
      price: v?.meta.price ?? 0,
      description: v?.meta.description ?? "",
      image: v?.meta.image ?? "",
      gallery: v?.meta.gallery ?? [],
      specs: v?.meta.specs ?? {}
    } as any
  };
}

const form = ref<Partial<ProductVariantDto>>(toForm(props.variant ?? null));

function onCancel() {
  open.value = false;
}

function onSubmit() {
  emit("submit", { ...form.value });
}

watch(() => props.variant, (v) => {
  form.value = toForm(v ?? null);
}, { immediate: true });

watch(open, (val) => {
  if (!val) {
    form.value = toForm(props.variant ?? null);
  }
});
</script>

<template>
  <v-dialog v-model="open" max-width="560">
    <v-card>
      <v-card-title>Редактирование варианта</v-card-title>
      <v-card-text>
        <variant-form
          v-model="form"
          :loading="props.loading"
          :product-id="props.productId"
          :variant-id="props.variant?.product_variant_id"
        />
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
