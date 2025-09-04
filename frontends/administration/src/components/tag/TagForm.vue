<script lang="ts" setup>
import { computed } from "vue";
import type { Tag } from "@/interfaces/tag";

const props = defineProps<{ modelValue: Partial<Tag> }>();
const emit = defineEmits<{ (e: "update:modelValue", v: Partial<Tag>): void }>();

function update<K extends keyof Tag>(key: K, value: Tag[K]) {
  const next = { ...props.modelValue, [key]: value };
  emit("update:modelValue", next);
}

const nameRules = [ (v: string) => !!v?.trim() || "Введите название" ];
const linkRules = [ (v: string) => !!v?.trim() || "Введите короткую ссылку" ];
const iconRules = [ (v: string) => !!v?.trim() || "Введите наименование иконки тега" ];

const valid = computed(() => !!props.modelValue.name && props.modelValue.name.trim().length > 0);

defineExpose({ valid });
</script>

<template>
  <v-form @submit.prevent>
    <v-text-field
      label="Название"
      :model-value="modelValue.name"
      :rules="nameRules"
      required
      density="comfortable"
      @update:model-value="v => update('name', v)"
    />
    <v-text-field
      label="Ссылка"
      :model-value="modelValue.link"
      :rules="linkRules"
      required
      density="comfortable"
      @update:model-value="v => update('link', v)"
    />
    <v-row dense>
      <v-col cols="12" md="4">
        <v-icon :icon="modelValue.icon" size="64" />
      </v-col>
      <v-col cols="12" md="8">
        <v-text-field
          label="Иконка"
          :model-value="modelValue.icon"
          :rules="iconRules"
          required
          density="comfortable"
          @update:model-value="v => update('icon', v)"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<style scoped>
</style>

