<script lang="ts" setup>
import { computed, ref, onMounted } from "vue";

import type { ProductDto } from "@/interfaces/product";

import SpecsForm from "@/components/products/SpecsForm.vue";
import GalleryForm from "@/components/gallery/GalleryForm.vue";
import type { ProductMeta, SpecMeta } from "@/interfaces/meta";
import type { Category } from "@/interfaces/category";
import type { Tag } from "@/interfaces/tag";
import { listCategories } from "@/backend/category.service";
import { listTags } from "@/backend/tag.service";

const model = defineModel<ProductDto>({ required: true });

interface Props {
  loading: boolean;
  productId?: number | string;
}

const props = defineProps<Props>();

const categoriesOptions = ref<Category[]>([]);
const categoriesLoading = ref(false);
const categoriesError = ref<string | null>(null);

const tagsOptions = ref<Tag[]>([]);
const tagsLoading = ref(false);
const tagsError = ref<string | null>(null);

const categories = computed<number[]>({
  get: () => (model.value.categories as number[]) || [],
  set: (val) => {
    model.value.categories = val || [];
  }
});

// Теги (массив строк-имен) добавлено
const tags = computed<string[]>({
  get: () => (model.value.tags as string[]) || [],
  set: (val) => {
    model.value.tags = val || [];
  }
});

const gallery = computed<string[]>({
  get: () => (model.value.meta?.gallery as string[]) || [],
  set: (val) => {
    if (!model.value.meta) {
      model.value.meta = {} as ProductMeta;
    }
    model.value.meta.image = val[0];
    model.value.meta.gallery = val;
  }
});

const specs = computed<Record<string, string>>({
  get: () => {
    return (model.value.meta?.specs as SpecMeta) || {};
  },
  set: (val) => {
    if (!model.value.meta) {
      model.value.meta = {} as ProductMeta;
    }
    model.value.meta.specs = val;
  }
});

async function loadCategories() {
  categoriesLoading.value = true;
  categoriesError.value = null;
  try {
    categoriesOptions.value = await listCategories();
  } catch (e: any) {
    categoriesError.value = e?.message || "Не удалось загрузить категории";
  } finally {
    categoriesLoading.value = false;
  }
}

async function loadTags() {
  tagsLoading.value = true;
  tagsError.value = null;
  try {
    tagsOptions.value = await listTags();
  } catch (e: any) {
    tagsError.value = e?.message || "Не удалось загрузить теги";
  } finally {
    tagsLoading.value = false;
  }
}

onMounted(() => {
  loadCategories();
  loadTags();
});
</script>

<template>
  <v-row dense>
    <v-col cols="12" md="6">
      <v-text-field v-model="model.name"
                    label="Название"
                    density="comfortable"
                    hide-details
                    clearable
                    autofocus
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field v-model.number="model.meta.price"
                    label="Цена"
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

    <v-col cols="12">
      <v-autocomplete
        v-model="categories"
        :items="categoriesOptions"
        :loading="categoriesLoading"
        item-title="name"
        item-value="category_id"
        label="Категории"
        multiple
        chips
        closable-chips
        density="comfortable"
        hide-details
        clearable
      />
      <v-alert v-if="categoriesError" type="error" variant="tonal" class="mt-2">{{ categoriesError }}</v-alert>
    </v-col>

    <v-col cols="12">
      <v-autocomplete
        v-model="tags"
        :items="tagsOptions"
        :loading="tagsLoading"
        item-title="name"
        item-value="link"
        label="Теги"
        multiple
        chips
        closable-chips
        density="comfortable"
        hide-details
        clearable
        hint="Выберите или начните вводить тег"
        persistent-hint
      />
      <v-alert v-if="tagsError" type="error" variant="tonal" class="mt-2">{{ tagsError }}</v-alert>
    </v-col>
    <v-col cols="12">
      <gallery-form v-model="gallery" title="Галерея товара" />
    </v-col>

    <v-col cols="12">
      <v-card variant="tonal">
        <v-card-subtitle>Характеристики</v-card-subtitle>
        <v-card-text>
          <specs-form v-model="specs" :loading="props.loading" />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style lang="sass">
</style>
