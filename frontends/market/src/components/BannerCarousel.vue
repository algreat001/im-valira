<script setup lang="ts">
import { useUIStore } from "@/stores/ui.ts";
</script>

<template>
  <v-carousel hide-delimiters :height="useUIStore().isMobile ? 450 : 720">
    <v-carousel-item v-for="n in 6" :key="n">
      <v-img :src="`/images/banners/${n}.jpg`" cover />
    </v-carousel-item>
  </v-carousel>
</template>


