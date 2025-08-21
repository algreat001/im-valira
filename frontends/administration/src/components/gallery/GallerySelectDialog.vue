<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import GallerySelect from "./GallerySelect.vue";

interface Props {
  modelValue: boolean; // управление открытием диалога
  multiple?: boolean;
  title?: string;
  initialSelected?: string[];
  dense?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  multiple: true,
  title: "Выбор изображений",
  initialSelected: () => [],
  dense: false
});

const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void;
  (e: "select", images: string[]): void;
}>();

const opened = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit("update:modelValue", v)
});

const selected = ref<string[]>([]);

watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      selected.value = [ ...props.initialSelected ];
    }
  },
  { immediate: true }
);

function onCancel() {
  opened.value = false;
}

function onOk() {
  emit("select", selected.value);
  opened.value = false;
}
</script>

<template>
  <v-dialog v-model="opened" max-width="1200">
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="onCancel" />
      </v-toolbar>

      <v-card-text>
        <gallery-select v-model="selected" :multiple="multiple" :dense="dense" />
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="onCancel">Отмена</v-btn>
        <v-btn color="primary" @click="onOk">ОК</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="sass">
</style>
