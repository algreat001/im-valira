<script setup lang="ts">
import { watch } from "vue";
import { useRoute } from "vue-router";

import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";

const route = useRoute();
watch(() => route.fullPath, () => { window.scrollTo(0, 0); });


</script>

<template>
  <v-app>
    <v-container>
      <app-header />
      <router-view v-slot="{ Component }">
        <transition name="fade-in" mode="out-in">
          <v-main class="d-flex justify-center">
            <component :is="Component" />
          </v-main>
        </transition>
      </router-view>
    </v-container>
  </v-app>
  <app-footer />
</template>

<style>
/* fade-in анимация уже в main.css */
</style>
