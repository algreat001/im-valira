<script lang="ts" setup>
import { ref, watch } from "vue";
import type { Banner } from "@/interfaces/banner";
import BannerForm from "@/components/banner/BannerForm.vue";

const open = defineModel<boolean>({ required: true });

interface Props {loading?: boolean;}

const props = withDefaults(defineProps<Props>(), { loading: false });

const emit = defineEmits<{
  submit: [ payload: Banner ];
}>();

function defaultBanner(): Banner {
  return { image: "", title: "", message: "", link: "", alt: "" };
}

const form = ref<Banner>(defaultBanner());

function onCancel() { open.value = false; }

function onSubmit() { emit("submit", { ...form.value }); }

watch(open, (v) => {
  if (!v) {
    form.value = defaultBanner();
  }
});
</script>

<template>
  <v-dialog v-model="open" max-width="720">
    <v-card>
      <v-card-title>Создание баннера</v-card-title>
      <v-card-text>
        <banner-form v-model="form" :loading="props.loading" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="onCancel">Отмена</v-btn>
        <v-btn color="primary" :disabled="!form.image" :loading="props.loading" @click="onSubmit">Создать</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

