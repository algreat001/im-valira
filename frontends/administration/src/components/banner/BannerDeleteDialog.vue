<script lang="ts" setup>
import type { Banner } from "@/interfaces/banner";

const open = defineModel<boolean>({ required: true });

interface Props {
  loading?: boolean;
  banner?: Banner | null;
}

const props = withDefaults(defineProps<Props>(), { loading: false, banner: null });

const emit = defineEmits<{ confirm: [] }>();

function onClose() { open.value = false; }

function onConfirm() { emit("confirm"); }
</script>

<template>
  <v-dialog v-model="open" max-width="520">
    <v-card>
      <v-card-title class="text-error">Удаление баннера</v-card-title>
      <v-card-text>
        <div v-if="props.banner">
          Вы уверены, что хотите удалить баннер <strong>#{{ props.banner.id }}</strong>
          <span v-if="props.banner.title">«{{ props.banner.title }}»</span>?
        </div>
        <div v-else>Нет выбранного баннера.</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="onClose">Отмена</v-btn>
        <v-btn color="error" :loading="props.loading" @click="onConfirm">Удалить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

