<script lang="ts" setup>
import { computed } from "vue";

import type { Category } from "@/interfaces/category";

const model = defineModel<Category>({ required: true });

interface Props {
  loading: boolean;
}

const props = defineProps<Props>();

const iconValue = computed(() => String((((model.value as any)?.meta)?.icon ?? "")).trim());

function isImageLink(val: string): boolean {
  return /^(https?:\/\/|\/|\.{1,2}\/)/.test(val);
}

function isIconName(val: string): boolean {
  return /^mdi-/.test(val);
}
</script>

<template>
  <v-row dense>
    <v-col cols="12">
      <v-text-field v-model="model.name"
                    label="Название"
                    density="comfortable"
                    hide-details
                    clearable
                    autofocus
      />
    </v-col>

    <v-col cols="12" md="6">
      <v-text-field v-model.number="model.parent"
                    label="Родитель (ID)"
                    type="number"
                    density="comfortable"
                    hide-details
                    clearable
      />
    </v-col>

    <v-col cols="12">
      <v-textarea v-model="model.meta.description"
                  label="Описание"
                  rows="3"
                  density="comfortable"
                  hide-details
                  auto-grow
      />
    </v-col>

    <v-col cols="12" md="6">
      <v-text-field v-model="model.meta.icon"
                    label="Иконка (URL или имя)"
                    density="comfortable"
                    hide-details
                    clearable
      />
    </v-col>

    <v-col cols="12" class="d-flex align-center">
      <div class="mr-3 text-caption">Предпросмотр иконки:</div>
      <v-icon v-if="isIconName(iconValue)" :icon="iconValue" size="36" />
      <v-avatar v-else-if="isImageLink(iconValue)" size="36">
        <v-img :src="iconValue" />
      </v-avatar>
      <div v-else class="text-disabled">нет</div>
    </v-col>

    <v-col cols="12" md="6">
      <v-text-field v-model="model.meta.images"
                    label="Изображения (строка/JSON)"
                    density="comfortable"
                    hide-details
                    clearable
      />
    </v-col>

    <v-col cols="12">
      <v-combobox
        v-model="model.meta.params"
        :items="model.meta.params || []"
        label="Параметры"
        multiple
        chips
        clearable
        density="comfortable"
        hide-details
      />
    </v-col>
  </v-row>
</template>

<style lang="sass">
</style>
