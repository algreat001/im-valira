<script lang="ts" setup>
import { ref, watch } from "vue";

import type { Category } from "@/interfaces/category";
import CategoryForm from "@/components/categories/CategoryForm.vue";

const open = defineModel<boolean>({ required: true });

interface Props {
  loading: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  submit: [ payload: Partial<Category> ];
}>();

function getDefaultForm(): Category {
  return {
    name: "",
    parent: undefined,
    meta: {
      description: "",
      images: "",
      icon: "",
      params: []
    }
  };
}

const form = ref<Category>(getDefaultForm());

function onCancel() {
  open.value = false;
}

function onSubmit() {
  if (!form.value.name) {
    return;
  }
  emit("submit", { ...form.value });
}

function resetForm() {
  form.value = getDefaultForm();
}

watch(open, (v) => {
  if (!v) {
    resetForm();
  }
});
</script>

<template>
  <v-dialog v-model="open" max-width="560">
    <v-card>
      <v-card-title>Создание категории</v-card-title>
      <v-card-text>
        <category-form v-model="form" :loading="props.loading" />
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
