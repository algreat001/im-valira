<script setup lang="ts">
import { computed } from "vue";

import { text } from "@/data/text";

const articles = computed(() => text());
</script>

<template>
  <div class="list-article">
    <div v-for="article in articles" :key="article.name">
      <router-link :to="`/article/${article.name}`">{{ article.title }}</router-link>
    </div>
  </div>
</template>

<style scoped lang="sass">
.list-article
  padding: 0
  margin: 0
  list-style: none

.list-article-item
  margin-bottom: 8px

  a
    color: #1976d2
    text-decoration: none

    &:hover
      text-decoration: underline
</style>
