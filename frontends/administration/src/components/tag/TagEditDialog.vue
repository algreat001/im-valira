<script lang="ts" setup>
import { ref, watch } from "vue";
import type { Tag } from "@/interfaces/tag";
import TagForm from "./TagForm.vue";

const props = defineProps<{ modelValue: boolean; loading?: boolean; tag: Tag | null }>();
const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "submit", v: Partial<Tag>): void;
}>();

const open = ref(props.modelValue);
watch(() => props.modelValue, v => open.value = v);
watch(open, v => emit("update:modelValue", v));

const formModel = ref<Partial<Tag>>({ name: "", link: "", icon: "" });
const formRef = ref<InstanceType<typeof TagForm> | null>(null);

watch(() => props.tag, (t) => {
  formModel.value = t ? { tag_id: t.tag_id, link: t.link, name: t.name, icon: t.icon } : { name: "", link: "" };
}, { immediate: true });

function onSubmit() {
  if (!formRef.value?.valid) {
    return;
  }
  emit("submit", { ...formModel.value });
}
</script>

<template>
  <v-dialog v-model="open" max-width="480">
    <v-card>
      <v-toolbar flat density="comfortable">
        <v-toolbar-title>Редактировать тег</v-toolbar-title>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="open=false" />
      </v-toolbar>
      <v-card-text>
        <tag-form ref="formRef" v-model="formModel" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="open=false">Отмена</v-btn>
        <v-btn color="primary" :loading="loading" @click="onSubmit">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
</style>

