<script lang="ts" setup>
import type { User } from "@/interfaces/user";

const open = defineModel<boolean>({ required: true });

interface Props {
  loading: boolean;
  user: User | null;
}
const props = defineProps<Props>();

const emit = defineEmits<{
  confirm: [];
}>();

function onCancel() {
  open.value = false;
}

function onConfirm() {
  emit("confirm");
}
</script>

<template>
  <v-dialog v-model="open" max-width="520">
    <v-card>
      <v-card-title>Сброс пароля</v-card-title>
      <v-card-text>
        <div v-if="props.user">
          Сбросить пароль пользователю {{ props.user.email }}?
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="onCancel">Отмена</v-btn>
        <v-btn color="primary" :loading="props.loading" @click="onConfirm">Сбросить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="sass">
</style>
