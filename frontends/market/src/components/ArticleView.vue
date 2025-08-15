<script setup lang="ts">
import type { Article } from "@/interfaces/article";
import palette from "@/palette.ts";

interface ArticleProps {
  article: Article;
}

const theme = {
  text: palette.text
};


const props = defineProps<ArticleProps>();
</script>

<template>
  <v-container class="article-view" max-width="md">
    <v-row>
      <v-col cols="12">
        <h1 class="article-title">{{ props.article.title }}</h1>
      </v-col>
      <v-col cols="12">
        <div class="article-content" v-html="props.article.html"></div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="sass">
.article-view
  max-width: 1280px
  margin: 0 auto
  background: transparent
  box-shadow: none
  padding: 0

.article-title
  font-size: 2rem
  font-weight: 700
  margin-bottom: 1rem

.article-content
  font-size: 1.1rem
  line-height: 1.7
  color: v-bind('theme.text')
  text-align: justify
</style>
