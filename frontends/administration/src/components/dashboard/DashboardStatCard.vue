<script lang="ts" setup>
import { computed } from "vue";

type Format = "currency" | "number" | "text";

interface Props {
  title: string;
  value: number | string;
  icon: string;
  color?: string;
  format?: Format;
}

const props = defineProps<Props>();

const displayValue = computed(() => {
  const format = props.format;
  const raw = props.value;

  const toNumber = (v: number | string): number | null => {
    if (typeof v === "number") {
      return Number.isFinite(v) ? v : null;
    }
    if (typeof v === "string") {
      const normalized = v.replace(/\s+/g, "").replace(",", ".");
      const n = Number(normalized);
      return Number.isFinite(n) ? n : null;
    }
    return null;
  };

  const num = toNumber(raw);

  switch (format) {
    case "currency":
      if (num === null) {
        return String(raw);
      }
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(num);
    case "number":
      if (num === null) {
        return String(raw);
      }
      return new Intl.NumberFormat("ru-RU", {
        maximumFractionDigits: 20
      }).format(num);
    case "text":
    default:
      return String(raw);
  }
});
</script>

<template>
  <v-card variant="tonal">
    <v-card-text class="d-flex align-center">
      <v-avatar color="white" class="mr-3">
        <v-icon :icon="props.icon" :color="props.color || 'primary'" />
      </v-avatar>
      <div>
        <div class="text-caption text-medium-emphasis">{{ props.title }}</div>
        <div class="text-h5">{{ displayValue }}</div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style lang="sass">
</style>
