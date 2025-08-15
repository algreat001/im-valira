<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";

import { text } from "@/data/text";
import ArticleView from "@/components/ArticleView.vue";
import NotFound from "@/pages/NotFound.vue";
import ScrollToTopBtn from "@/components/ScrollToTopBtn.vue";

interface ArticleParams {
  name: string;
}

const route = useRoute();
const name = computed(() => (route.params as ArticleParams).name as string);
const article = computed(() => text().find(a => a.name === name.value));


</script>

<template>
  <v-container v-if="article" class="py-8 fade-in">
    <article-view :article="article" />
    <v-container class="mt-8 mb-4 text-right">
      <v-btn color="primary" variant="flat" to="/">
        На главную
      </v-btn>
    </v-container>
  </v-container>
  <not-found v-else />
  <scroll-to-top-btn />
</template>

<style scoped>
</style>
