<script setup lang="ts">
import { useRouter } from "vue-router";
import type { Tag } from "@/interfaces/tag.ts";
import { hashToColor } from "@/helpers/hashColor.ts";

interface Props {
  hideTitle?: boolean;
  tags: Tag[] | undefined;
}

const props = defineProps<Props>();
const router = useRouter();


function handleTagClick(tag: string) {
  router.push({ path: "/catalog", query: { tag } });
}
</script>

<template>
  <div v-if="props.tags && props.tags.length">
    <h3 class="font-weight-medium" v-if="!hideTitle">Теги</h3>
    <v-chip-group class="mb-2">
      <v-chip
        v-for="t in props.tags"
        :key="t.link"
        class="ma-1 text-white"
        :style="{ backgroundColor: hashToColor(t.link) }"
        :prepend-icon="t?.icon"
        size="small"
        label
        @click="handleTagClick(t.link)"
      >
        {{ t?.name ?? "" }}
      </v-chip>
    </v-chip-group>
  </div>
</template>

<style scoped lang="sass">
.v-chip
  cursor: pointer
  font-weight: 500
  text-transform: lowercase
</style>
