<script lang="ts" setup>
import { ref, watch } from "vue";
import type { Banner } from "@/interfaces/banner";
import BannerForm from "@/components/banner/BannerForm.vue";

const open = defineModel<boolean>({ required: true });

interface Props {
  loading?: boolean;
  banner?: Banner | null;
}

const props = withDefaults(defineProps<Props>(), { loading: false, banner: null });

const emit = defineEmits<{ submit: [ payload: Partial<Banner> ] }>();

const form = ref<Banner | null>(null);

watch(() => props.banner, (b) => {
  if (b && open.value) {
    form.value = { ...b };
  }
});
watch(open, (v) => {
  if (!v) {
    form.value = props.banner ? { ...props.banner } : null;
  } else if (props.banner) {
    form.value = { ...props.banner };
  }
});

function onCancel() { open.value = false; }

function onSubmit() {
  if (form.value) {
    emit("submit", { ...form.value });
  }
}
</script>

<template>
  <v-dialog v-model="open" max-width="720">
    <v-card>
      <v-card-title>Редактирование баннера</v-card-title>
      <v-card-text>
        <banner-form v-if="form" v-model="form" :loading="props.loading" />
        <div v-else class="text-medium-emphasis">Нет данных</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="onCancel">Отмена</v-btn>
        <v-btn color="primary" :disabled="!form?.image" :loading="props.loading" @click="onSubmit">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

