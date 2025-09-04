import { defineStore } from "pinia";
import { ref } from "vue";
import type { Tag } from "@/interfaces/tag";
import { listTags, createTag, updateTag, deleteTag } from "@/backend/tag.service";

export const useTagStore = defineStore("tag", () => {
  const items = ref<Tag[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const editing = ref<Tag | null>(null);
  const removing = ref<Tag | null>(null);

  async function load() {
    loading.value = true;
    error.value = null;
    try {
      items.value = await listTags();
    } catch (e: any) {
      error.value = e?.message || "Не удалось загрузить теги";
    } finally { loading.value = false; }
  }

  async function create(payload: Partial<Tag>) {
    loading.value = true;
    try {
      await createTag(payload);
      await load();
    } finally { loading.value = false; }
  }

  async function update(payload: Partial<Tag>) {
    if (!editing.value?.tag_id) {
      return;
    }
    loading.value = true;
    try {
      await updateTag(editing.value.tag_id, payload);
      editing.value = null;
      await load();
    } finally { loading.value = false; }
  }

  async function remove() {
    if (!removing.value?.tag_id) {
      return;
    }
    loading.value = true;
    try {
      await deleteTag(removing.value.tag_id);
      removing.value = null;
      await load();
    } finally { loading.value = false; }
  }

  return { items, loading, error, editing, removing, load, create, update, remove };
});

