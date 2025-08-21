<script lang="ts" setup>
import { computed } from "vue";

import type { ProductVariantDto } from "@/interfaces/product";

import SpecsForm from "@/components/products/SpecsForm.vue";
import GalleryForm from "@/components/gallery/GalleryForm.vue";
import type { ProductMeta } from "@/interfaces/meta";

const model = defineModel<Partial<ProductVariantDto>>({ required: true });

interface Props {
  loading: boolean;
}

const props = defineProps<Props>();

const gallery = computed<string[]>({
  get: () => (model.value.meta?.gallery as string[]) || [],
  set: (val) => {
    if (!model.value.meta) {
      model.value.meta = {} as Partial<ProductMeta>;
    }
    model.value.meta.gallery = val;
    model.value.meta.image = val[0];
  }
});

const specs = computed<Record<string, string>>({
  get: () => ((model.value.meta as any)?.specs as Record<string, string>) || {},
  set: (val) => {
    if (!model.value.meta) {
      model.value.meta = {} as Partial<ProductMeta>;
    }
    model.value.meta.specs = val;
  }
});
</script>

<template>
  <v-row dense>
    <v-col cols="12" md="8">
      <v-text-field v-model="model.name"
                    label="Название варианта"
                    density="comfortable"
                    hide-details
                    clearable
                    autofocus
      />
    </v-col>
    <v-col cols="12" md="4">
      <v-text-field v-model.number="(model.meta as any).price"
                    label="Цена"
                    type="number"
                    density="comfortable"
                    hide-details
                    clear-details="true"
                    clearable
      />
    </v-col>

    <v-col cols="12">
      <gallery-form v-model="gallery" title="Галерея варианта" />
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
