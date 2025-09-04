<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useTagStore } from "@/stores/tag";
import type { Tag } from "@/interfaces/tag";
import TagCreateDialog from "@/components/tag/TagCreateDialog.vue";
import TagEditDialog from "@/components/tag/TagEditDialog.vue";
import TagDeleteDialog from "@/components/tag/TagDeleteDialog.vue";

const tagStore = useTagStore();

const createDialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);

function openCreate() { createDialog.value = true; }

function openEdit(tag: Tag) {
  tagStore.editing = tag;
  editDialog.value = true;
}

function openDelete(tag: Tag) {
  tagStore.removing = tag;
  deleteDialog.value = true;
}

async function submitCreate(payload: Partial<Tag>) {
  await tagStore.create(payload);
  createDialog.value = false;
}

async function submitEdit(payload: Partial<Tag>) {
  await tagStore.update(payload);
  editDialog.value = false;
}

async function confirmDelete() {
  await tagStore.remove();
  deleteDialog.value = false;
}

onMounted(tagStore.load);
</script>

<template>
  <v-container>
    <v-toolbar flat>
      <v-toolbar-title>Теги</v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" :loading="tagStore.loading" @click="openCreate">Добавить</v-btn>
    </v-toolbar>

    <v-alert v-if="tagStore.error" type="error" variant="tonal" class="mb-3">{{ tagStore.error }}</v-alert>

    <v-data-table
      :headers="[
        { title: 'ID', key: 'tag_id', width: 80 },
        { title: 'Название', key: 'name' },
        { title: 'Ссылка', key: 'link' },
        { title: 'Иконка', key: 'icon', width: 100 },
        { title: 'Действия', key: 'actions', sortable: false, width: 140 }
      ]"
      :items="tagStore.items"
      :loading="tagStore.loading"
      item-key="tag_id"
      hover
      class="elevation-1"
    >
      <template #item.icon="{ item }">
        <v-avatar size="32" rounded="lg">
          <v-icon v-if="item.icon" :icon="item.icon" />
        </v-avatar>
      </template>
      <template #item.actions="{ item }">
        <v-btn icon="mdi-pencil-outline" size="small" variant="text" @click.stop="openEdit(item)" />
        <v-btn icon="mdi-delete-outline" size="small" variant="text" color="error" @click.stop="openDelete(item)" />
      </template>
    </v-data-table>

    <tag-create-dialog v-model="createDialog" :loading="tagStore.loading" @submit="submitCreate" />
    <tag-edit-dialog v-model="editDialog" :loading="tagStore.loading" :tag="tagStore.editing" @submit="submitEdit" />
    <tag-delete-dialog v-model="deleteDialog"
                       :loading="tagStore.loading"
                       :tag="tagStore.removing"
                       @confirm="confirmDelete"
    />
  </v-container>
</template>

<style scoped>
</style>

