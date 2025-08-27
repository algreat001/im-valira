<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useGalleryStore } from "@/stores/gallery";
import { getImagesBase } from "@/backend/request.service.ts";

const gallery = useGalleryStore();
const { sortedImages, loading, error } = storeToRefs(gallery);

const uploadFiles = ref<File[] | null>(null);

const deleteDialog = ref(false);
const renameDialog = ref(false);
const selectedImage = ref<string | null>(null);
const newFileName = ref<string>("");

const selectedBaseName = computed(() => {
  if (!selectedImage.value) {
    return "";
  }
  try {
    const url = new URL(selectedImage.value, window.location.origin);
    const pathname = url.pathname;
    return pathname.substring(pathname.lastIndexOf("/") + 1);
  } catch {
    // если это не URL, а относительный путь
    const s = selectedImage.value;
    return s.substring(s.lastIndexOf("/") + 1);
  }
});

function openDelete(img: string) {
  selectedImage.value = img;
  deleteDialog.value = true;
}

function openRename(img: string) {
  selectedImage.value = img;
  newFileName.value = selectedBaseName.value;
  renameDialog.value = true;
}

async function confirmDelete() {
  if (!selectedImage.value) {
    return;
  }
  await gallery.remove(selectedImage.value);
  deleteDialog.value = false;
  selectedImage.value = null;
}

async function confirmRename() {
  if (!selectedImage.value || !newFileName.value) {
    return;
  }
  await gallery.rename(selectedImage.value, newFileName.value);
  renameDialog.value = false;
  selectedImage.value = null;
  newFileName.value = "";
}

async function doUpload() {
  if (!uploadFiles.value || uploadFiles.value.length === 0) {
    return;
  }
  await gallery.upload(uploadFiles.value);
  uploadFiles.value = null;
}

function copyToClipboard(text: string) {
  navigator.clipboard?.writeText(text);
}

function srcPath(src: string) {
  if (src.startsWith("http")) {
    return src;
  }
  return `${getImagesBase()}${src}`;
}


onMounted(gallery.load);
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-toolbar flat>
            <v-toolbar-title>Галерея</v-toolbar-title>
            <v-spacer />
            <v-btn :loading="loading" color="primary" @click="gallery.load" variant="text" prepend-icon="mdi-refresh">
              Обновить
            </v-btn>
          </v-toolbar>

          <v-alert v-if="error" type="error" variant="tonal" class="ma-4">{{ error }}</v-alert>

          <v-card-text>
            <v-file-input
              v-model="uploadFiles"
              label="Загрузить изображения"
              accept="image/*"
              prepend-icon="mdi-upload"
              multiple
              show-size
              counter
              :disabled="loading"
            />
            <v-btn color="primary"
                   class="mt-2"
                   @click="doUpload"
                   :disabled="loading || !uploadFiles || uploadFiles.length === 0"
            >
              Загрузить
            </v-btn>
          </v-card-text>

          <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-2" />

          <v-divider />

          <v-card-text>
            <v-row>
              <v-col
                v-for="img in sortedImages"
                :key="img"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <v-card>
                  <smart-image :src="img" :alt="img" />
                  <v-card-subtitle class="text-truncate" :title="img">
                    {{ img }}
                  </v-card-subtitle>
                  <v-card-actions>
                    <v-btn icon="mdi-rename" variant="text" @click="openRename(img)" :disabled="loading" />
                    <v-btn icon="mdi-delete"
                           variant="text"
                           color="error"
                           @click="openDelete(img)"
                           :disabled="loading"
                    />
                    <v-spacer />
                    <v-btn icon="mdi-open-in-new" variant="text" :href="srcPath(img)" target="_blank" />
                    <v-btn
                      icon="mdi-content-copy"
                      variant="text"
                      @click="() => copyToClipboard(img)"
                    />
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Delete confirm dialog -->
    <v-dialog v-model="deleteDialog" max-width="480">
      <v-card>
        <v-card-title>Удалить изображение?</v-card-title>
        <v-card-text>
          Вы действительно хотите удалить это изображение?
          <div class="text-caption mt-2">{{ selectedImage }}</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Отмена</v-btn>
          <v-btn color="error" @click="confirmDelete" :loading="loading">Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Rename dialog -->
    <v-dialog v-model="renameDialog" max-width="520">
      <v-card>
        <v-card-title>Переименовать изображение</v-card-title>
        <v-card-text>
          <div class="mb-2 text-caption">Текущее имя: {{ selectedBaseName }}</div>
          <v-text-field
            v-model="newFileName"
            label="Новое имя файла"
            :disabled="loading"
            clearable
            autofocus
            @keyup.enter="confirmRename"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="renameDialog = false">Отмена</v-btn>
          <v-btn color="primary" @click="confirmRename" :loading="loading" :disabled="!newFileName">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style lang="sass">
</style>
