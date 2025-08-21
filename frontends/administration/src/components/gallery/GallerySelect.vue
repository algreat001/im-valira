<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useGalleryStore } from "@/stores/gallery";

interface Props {
  multiple?: boolean;
  dense?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  multiple: true,
  dense: false
});

// v-model: список выбранных изображений (ссылки)
const selected = defineModel<string[]>({ default: [] });

const gallery = useGalleryStore();
const { sortedImages, loading, error } = storeToRefs(gallery);

const query = ref("");

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return sortedImages.value;
  return sortedImages.value.filter((x) => x.toLowerCase().includes(q));
});

function toggle(img: string) {
  const exists = selected.value.includes(img);
  if (exists) {
    selected.value = selected.value.filter((i) => i !== img);
  } else {
    if (props.multiple === false) {
      selected.value = [ img ];
    } else {
      selected.value = [ ...selected.value, img ];
    }
  }
}

function isSelected(img: string): boolean {
  return selected.value.includes(img);
}

onMounted(() => {
  if (!sortedImages.value.length) {
    gallery.load();
  }
});
</script>

<template>
  <div>
    <v-alert v-if="error" type="error" variant="tonal" class="mb-2">{{ error }}</v-alert>

    <div class="d-flex ga-2 align-center mb-2">
      <v-text-field
        v-model="query"
        :density="props.dense ? 'compact' : undefined"
        clearable
        hide-details
        label="Поиск по имени"
        prepend-inner-icon="mdi-magnify"
        class="flex-1-1"
      />
      <v-btn
        :density="props.dense ? 'comfortable' : undefined"
        :loading="loading"
        color="primary"
        variant="text"
        prepend-icon="mdi-refresh"
        @click="gallery.load"
      >
        Обновить
      </v-btn>
    </div>

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-2" />

    <v-row dense>
      <v-col
        v-for="img in filtered"
        :key="img"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          class="gallery-card"
          :class="{ 'gallery-card--selected': isSelected(img) }"
          elevation="1"
          @click="toggle(img)"
        >
          <v-img :src="img" aspect-ratio="1" cover />
          <div class="gallery-card__footer d-flex align-center px-3 py-2">
            <v-icon
              :icon="isSelected(img) ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline'"
              :color="isSelected(img) ? 'primary' : undefined"
              size="small"
              class="mr-2"
            />
            <div class="text-truncate" :title="img">{{ img }}</div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style lang="sass">
.gallery-card
  cursor: pointer
  border: 1px solid transparent
  transition: border-color .15s ease, box-shadow .15s ease
  &__footer
    background: rgba(var(--v-theme-surface-variant), .5)
  &--selected
    border-color: rgb(var(--v-theme-primary))
</style>
