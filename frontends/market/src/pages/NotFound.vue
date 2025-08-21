<script setup lang="ts">
import palette from "@/palette.ts";
</script>

<template>
  <v-container class="not-found-page d-flex flex-column align-center justify-center"
               :style="{minHeight: '70vh',background: palette.background,color: palette.text}"
  >
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <v-icon size="96" :color="palette.error" class="mb-4">mdi-emoticon-sad-outline</v-icon>
        <h1 class="not-found-title">404</h1>
        <h2 class="not-found-subtitle mb-4">Страница не найдена</h2>
        <p class="not-found-text mb-6">Извините, страница, которую вы ищете, не существует или была удалена.</p>
        <v-btn :color="palette.primary" variant="flat" to="/">
          На главную
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="sass">
.not-found-page
  min-height: 70vh
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center

.not-found-title
  font-size: 5rem
  font-weight: 900
  color: v-bind('palette.error')
  margin-bottom: 0.5rem

.not-found-subtitle
  font-size: 2rem
  font-weight: 600
  color: v-bind('palette.text')

.not-found-text
  font-size: 1.2rem
  color: #666
</style>
