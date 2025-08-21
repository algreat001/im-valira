<script lang="ts" setup>
import { ref, watch } from "vue";

import type { Category } from "@/interfaces/category";
import CategoryForm from "@/components/categories/CategoryForm.vue";

const open = defineModel<boolean>({ required: true });

interface Props {
  loading: boolean;
  category: Category | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  submit: [ payload: Partial<Category> ];
}>();

function toForm(c: Category | null): Category {
  const meta = c?.meta ?? { description: "", images: "", icon: "", params: [] };
  return {
    category_id: c?.category_id,
    name: c?.name ?? "",
    parent: c?.parent,
    meta: {
      description: meta.description ?? "",
      images: meta.images ?? "",
      icon: meta.icon ?? "",
      params: Array.isArray(meta.params) ? meta.params : []
    }
  };
}

const form = ref<Category>(toForm(props.category ?? null));

function onCancel() {
  open.value = false;
}

function onSubmit() {
  emit("submit", { ...form.value });
}

watch(() => props.category, (c) => {
  form.value = toForm(c ?? null);
}, { immediate: true });

watch(open, (v) => {
  if (!v) {
    form.value = toForm(props.category ?? null);
  }
});
</script>

<template>
  <v-dialog v-model="open" max-width="560">
    <v-card>
      <v-card-title>Редактирование категории</v-card-title>
      <v-card-text>
        <category-form v-model="form" :loading="props.loading" />
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
