<script lang="ts" setup>
import type { Tag } from "@/interfaces/tag";
import { ref, watch } from "vue";

const props = defineProps<{ modelValue: boolean; loading?: boolean; tag: Tag | null }>();
const emit = defineEmits<{ (e: "update:modelValue", v: boolean): void; (e: "confirm"): void }>();

const open = ref(props.modelValue);
watch(() => props.modelValue, v => open.value = v);
watch(open, v => emit("update:modelValue", v));
</script>

<template>
  <v-dialog v-model="open" max-width="420">
    <v-card>
      <v-toolbar flat density="comfortable">
        <v-toolbar-title>Удалить тег</v-toolbar-title>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="open=false" />
      </v-toolbar>
      <v-card-text>
        Вы уверены, что хотите удалить тег
        <strong>{{ props.tag?.name }}</strong>? Это действие нельзя отменить.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="open=false">Отмена</v-btn>
        <v-btn color="error" :loading="loading" @click="emit('confirm')">Удалить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
</style>

