<script lang="ts" setup>
import { ref, onMounted } from "vue";
import type { Banner } from "@/interfaces/banner";
import SmartImage from "@/components/bricks/SmartImage.vue";
import BannerCreateDialog from "@/components/banner/BannerCreateDialog.vue";
import BannerEditDialog from "@/components/banner/BannerEditDialog.vue";
import BannerDeleteDialog from "@/components/banner/BannerDeleteDialog.vue";
import { useBannerStore } from "@/stores/banner";

const bannerStore = useBannerStore();

const createDialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);

function openCreate() { createDialog.value = true; }

function openEdit(b: Banner) {
  bannerStore.editing = b;
  editDialog.value = true;
}

function openDelete(b: Banner) {
  bannerStore.removing = b;
  deleteDialog.value = true;
}

async function submitCreate(payload: Banner) {
  await bannerStore.create(payload);
  createDialog.value = false;
}

async function submitEdit(payload: Partial<Banner>) {
  await bannerStore.update(payload);
  editDialog.value = false;
}

async function confirmDelete() {
  await bannerStore.remove();
  deleteDialog.value = false;
}

onMounted(bannerStore.load);
</script>

<template>
  <v-container>
    <v-toolbar flat>
      <v-toolbar-title>Баннеры</v-toolbar-title>
      <v-spacer />
      <v-btn color="primary" :loading="bannerStore.loading" @click="openCreate">Добавить</v-btn>
    </v-toolbar>

    <v-alert v-if="bannerStore.error" type="error" variant="tonal" class="mb-3">{{ bannerStore.error }}</v-alert>

    <v-data-table
      :headers="[
        { title: 'ID', key: 'id', width: 70 },
        { title: 'Изобр.', key: 'image', sortable: false },
        { title: 'Заголовок', key: 'title' },
        { title: 'Сообщение', key: 'message' },
        { title: 'Ссылка', key: 'link' },
        { title: 'Действия', key: 'actions', sortable: false, width: 140 }
      ]"
      :items="bannerStore.items"
      :loading="bannerStore.loading"
      item-key="id"
      hover
      class="elevation-1"
    >
      <template #item.image="{ item }">
        <v-avatar size="56" rounded="lg">
          <smart-image v-if="item.image" :src="item.image" :alt="item.image" :width="56" :height="56" />
          <v-icon v-else icon="mdi-image-off" />
        </v-avatar>
      </template>
      <template #item.link="{ item }">
        <a v-if="item.link"
           :href="item.link"
           target="_blank"
           rel="noopener"
           class="text-truncate"
           style="max-width:140px;display:inline-block;"
        >{{ item.link }}</a>
      </template>
      <template #item.actions="{ item }">
        <v-btn icon="mdi-pencil-outline" size="small" variant="text" @click.stop="openEdit(item)" />
        <v-btn icon="mdi-delete-outline" size="small" variant="text" color="error" @click.stop="openDelete(item)" />
      </template>
    </v-data-table>

    <banner-create-dialog
      v-model="createDialog"
      :loading="bannerStore.loading"
      @submit="submitCreate"
    />
    <banner-edit-dialog
      v-model="editDialog"
      :loading="bannerStore.loading"
      :banner="bannerStore.editing"
      @submit="submitEdit"
    />
    <banner-delete-dialog
      v-model="deleteDialog"
      :loading="bannerStore.loading"
      :banner="bannerStore.removing"
      @confirm="confirmDelete"
    />
  </v-container>
</template>

<style scoped>
</style>
