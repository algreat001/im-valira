<script lang="ts" setup>
import { ref } from "vue";
import GallerySelectDialog from "@/components/gallery/GallerySelectDialog.vue";
import SmartImage from "@/components/bricks/SmartImage.vue";

interface Props {
  title?: string;
  multiple?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Галерея",
  multiple: true
});

// v-model: список URL изображений
const model = defineModel<string[]>({ default: [] });

const showGalleryDialog = ref(false);

function onGallerySelect(urls: string[]) {
  model.value = Array.from(new Set([ ...(model.value || []), ...urls ]));
}

function onRemove(img: string) {
  model.value = (model.value || []).filter((g) => g !== img);
}
</script>

<template>
  <v-card variant="tonal">
    <v-card-subtitle>{{ props.title }}</v-card-subtitle>
    <v-card-text>
      <v-btn
        color="primary"
        variant="tonal"
        prepend-icon="mdi-image-multiple-outline"
        @click="showGalleryDialog = true"
      >
        Выбрать из галереи
      </v-btn>

      <v-list v-if="(model?.length || 0) > 0" density="compact" class="mt-3">
        <v-list-item
          v-for="img in model"
          :key="img"
        >
          <template #prepend>
            <v-avatar size="40">
              <smart-image :height="40" :width="40" :src="img" alt="thumb" />
            </v-avatar>
          </template>
          <v-list-item-title>
            <a :href="img" target="_blank" rel="noopener">{{ img }}</a>
          </v-list-item-title>
          <template #append>
            <v-btn icon="mdi-delete" variant="text" color="error" @click="onRemove(img)" />
          </template>
        </v-list-item>
      </v-list>
      <div v-else class="text-medium-emphasis mt-3">Нет изображений</div>

      <GallerySelectDialog
        v-model="showGalleryDialog"
        :multiple="props.multiple"
        :initial-selected="model || []"
        :title="`Выбор изображений`"
        @select="onGallerySelect"
      />
    </v-card-text>
  </v-card>
</template>

<style lang="sass">
</style>
