<script lang="ts" setup>
import { computed, ref } from "vue";

const model = defineModel<Record<string, string>>({ required: true });

interface Props {
  loading?: boolean;
}

const props = defineProps<Props>();

const newKey = ref<string>("");
const newValue = ref<string>("");

const entries = computed<[ string, string ][]>(() => {
  const obj = model.value || {};
  return Object.entries(obj);
});

function ensureModel() {
  if (!model.value) {
    model.value = {};
  }
}

function onAdd() {
  const key = newKey.value?.trim();
  if (!key) {
    return;
  }
  ensureModel();
  model.value = { ...model.value, [key]: newValue.value ?? "" };
  newKey.value = "";
  newValue.value = "";
}

function onRemove(key: string) {
  ensureModel();
  const { [key]: _, ...rest } = model.value;
  model.value = rest;
}

function onChangeKey(oldKey: string, nextKey: string) {
  const key = nextKey.trim();
  if (!key || key === oldKey) {
    return;
  }
  ensureModel();
  const value = model.value[oldKey];
  const { [oldKey]: _, ...rest } = model.value;
  model.value = { ...rest, [key]: value };
}

function onChangeValue(key: string, val: string) {
  ensureModel();
  model.value = { ...model.value, [key]: val };
}
</script>

<template>
  <div>
    <v-row v-for="[k, v] in entries" :key="k" dense class="mb-1">
      <v-col cols="12" md="5">
        <v-text-field
          :model-value="k"
          label="Ключ"
          density="compact"
          hide-details
          clearable
          @update:model-value="val => onChangeKey(k, val)"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :model-value="v"
          label="Значение"
          density="compact"
          hide-details
          clearable
          @update:model-value="val => onChangeValue(k, val)"
        />
      </v-col>
      <v-col cols="12" md="1" class="d-flex align-center">
        <v-btn :icon="'mdi-delete-outline'"
               size="small"
               variant="text"
               color="error"
               :disabled="props.loading"
               @click="onRemove(k)"
        />
      </v-col>
    </v-row>

    <v-divider class="my-2" />

    <v-row dense>
      <v-col cols="12" md="5">
        <v-text-field v-model="newKey" label="Новый ключ" density="compact" hide-details clearable />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model="newValue" label="Новое значение" density="compact" hide-details clearable />
      </v-col>
      <v-col cols="12" md="1" class="d-flex align-center">
        <v-btn :icon="'mdi-plus-circle-outline'"
               size="small"
               variant="text"
               color="primary"
               :disabled="!newKey"
               @click="onAdd"
        />
      </v-col>
    </v-row>
  </div>
</template>

<style lang="sass">
</style>
