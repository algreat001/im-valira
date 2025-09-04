import { defineStore } from "pinia";
import { type Ref, ref } from "vue";
import { getTags } from "@/backend/tag.service.ts";
import type { Tag } from "@/interfaces/tag.ts";


export const useTagsStore = defineStore("tags", () => {
  const tags: Ref<Tag[]> = ref([]);

  async function loadTags() {
    if (tags.value.length > 0) {
      return;
    }
    tags.value = [ { link: "", name: "Все" }, ...(await getTags()) ];
  }

  function getTagByLink(link: string): Tag | undefined {
    return tags.value.find(tag => tag.link === link);
  }

  return {
    tags,
    loadTags,
    getTagByLink
  };
});
