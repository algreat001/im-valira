<script setup lang="ts">
import { useRouter } from "vue-router";
import { hashToColor } from "@/helpers/hashColor";
import { useTagsStore } from "@/stores/tag";
import type { Tag } from "@/interfaces/tag";

interface ProductTagIconsProps {
  tags?: string[];
}

const props = defineProps<ProductTagIconsProps>();
const router = useRouter();

function resolveMeta(tag: string): undefined | Tag {
  return useTagsStore().getTagByLink(tag);
}

function go(tag: string) {
  router.push({ path: "/catalog", query: { tag } });
}
</script>

<template>
  <div v-if="tags && tags.length" class="tag-icons">
    <v-tooltip
      v-for="t in tags"
      :key="t"
      location="bottom"
      :text="resolveMeta(t)?.name"
    >
      <template #activator="{ props: act }">
        <v-btn
          v-bind="act"
          class="tag-icons__btn"
          :style="{ backgroundColor: hashToColor(t), color: '#fff' }"
          :icon="resolveMeta(t)?.icon"
          size="default"
          density="comfortable"
          @click.stop="go(t)"
        />
      </template>
    </v-tooltip>
  </div>
</template>

<style scoped lang="sass">
.tag-icons
  position: absolute
  top: 6px
  right: 6px
  display: flex
  flex-direction: row
  gap: 6px
  z-index: 2

</style>

