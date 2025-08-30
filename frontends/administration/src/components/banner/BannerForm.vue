<script lang="ts" setup>
import { ref, watch } from "vue";
import GallerySelectDialog from "@/components/gallery/GallerySelectDialog.vue";
import SmartImage from "@/components/bricks/SmartImage.vue";
import type { Banner } from "@/interfaces/banner";

const model = defineModel<Banner>({ required: true });

interface Props {loading?: boolean;}

const props = withDefaults(defineProps<Props>(), { loading: false });

const showGallery = ref(false);

function selectImages(urls: string[]) {
  if (!urls || urls.length === 0) {
    return;
  }
  // Берём первое изображение
  model.value.image = urls[0];
}

function clearImage() {
  model.value.image = "" as any;
}

watch(showGallery, (v) => { if (!v) {/* noop */} });
</script>

<template>
  <v-row dense>
    <v-col cols="12" md="4">
      <div class="d-flex flex-column align-center">
        <v-avatar size="180" variant="tonal" class="mb-2" rounded>
          <smart-image v-if="model.image" :src="model.image" :alt="model.image" :width="180" :height="180" />
          <v-icon v-else icon="mdi-image-off" size="64" />
        </v-avatar>
        <div class="d-flex gap-2">
          <v-btn size="small" variant="tonal" color="primary" prepend-icon="mdi-image" @click="showGallery = true">
            Изображение
          </v-btn>
          <v-btn size="small" variant="text" color="error" :disabled="!model.image" @click="clearImage">Сброс</v-btn>
        </div>
      </div>
    </v-col>
    <v-col cols="12" md="8">
      <v-text-field v-model="model.title" label="Заголовок" :disabled="props.loading" hide-details="auto" />
      <v-textarea v-model="model.message" label="Сообщение" :disabled="props.loading" auto-grow hide-details="auto" />
      <v-text-field v-model="model.link" label="Ссылка" :disabled="props.loading" hide-details="auto" />
      <v-text-field v-model="model.alt" label="Alt" :disabled="props.loading" hide-details="auto" />
    </v-col>
  </v-row>
  <GallerySelectDialog v-model="showGallery"
                       :multiple="false"
                       :initial-selected="model.image ? [model.image] : []"
                       title="Выбор изображения"
                       @select="selectImages"
  />
</template>

<style scoped>
.gap-2 {
  gap: .5rem;
}
</style>

