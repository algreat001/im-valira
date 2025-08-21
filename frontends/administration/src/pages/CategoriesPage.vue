<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";

import { useCategoryStore } from "@/stores/category";

import type { Category } from "@/interfaces/category";

import CategoryCreateDialog from "@/components/categories/CategoryCreateDialog.vue";
import CategoryEditDialog from "@/components/categories/CategoryEditDialog.vue";

const categoryStore = useCategoryStore();
const { categories, loading, error } = storeToRefs(categoryStore);

const createDialog = ref(false);
const editDialog = ref(false);

const editCategoryRef = ref<Category | null>(null);

function openCreateDialog() {
  createDialog.value = true;
}

async function submitCreate(payload: Partial<Category>) {
  await categoryStore.create(payload);
  createDialog.value = false;
}

function openEditDialog(c: Category) {
  editCategoryRef.value = c;
  editDialog.value = true;
}

async function confirmEdit(payload: Partial<Category>) {
  if (!editCategoryRef.value) {
    return;
  }
  if (!editCategoryRef.value.category_id) {
    return;
  }
  await categoryStore.update(editCategoryRef.value.category_id, payload);
  editDialog.value = false;
}

async function onDelete(c: Category) {
  if (!c.category_id) {
    return;
  }
  await categoryStore.remove(c.category_id);
}

watch(editDialog, (v) => {
  if (!v) {
    editCategoryRef.value = null;
  }
});

onMounted(categoryStore.load);
</script>

<template>
  <v-container>
    <v-toolbar flat>
      <v-toolbar-title>Категории</v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" :loading="loading" @click="openCreateDialog">Добавить категорию</v-btn>
    </v-toolbar>

    <v-alert v-if="error" type="error" variant="tonal" class="mb-3">{{ error }}</v-alert>

    <v-data-table
      :items="categories"
      :headers="[
        { title: 'ID', key: 'category_id' },
        { title: 'Название', key: 'name' },
        { title: 'Действия', key: 'actions', sortable: false, align: 'center' }
      ]"
      :loading="loading"
      item-key="category_id"
      class="mb-6"
    >
      <template #item.actions="{ item }">
        <v-btn :icon="'mdi-pencil-outline'" size="small" variant="text" @click="openEditDialog(item)" />
        <v-btn :icon="'mdi-delete-outline'" size="small" variant="text" color="error" @click="onDelete(item)" />
      </template>
    </v-data-table>

    <category-create-dialog
      v-model="createDialog"
      :loading="loading"
      @submit="submitCreate"
    />

    <category-edit-dialog
      v-model="editDialog"
      :loading="loading"
      :category="editCategoryRef"
      @submit="confirmEdit"
    />
  </v-container>
</template>

<style lang="sass">
</style>
