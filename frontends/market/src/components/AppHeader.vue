<script setup lang="ts">
import { useRouter } from "vue-router";

import SearchField from "@/components/SearchField.vue";
import UserMenu from "@/components/UserMenu.vue";
import CartMiniButton from "@/components/CartMiniButton.vue";

const router = useRouter();
</script>

<template>
  <v-app-bar color="primary" dark :elevation="2">
    <v-container class="d-flex align-center justify-space-between">
      <router-link to="/">
        <v-avatar image="@/assets/logo256.png" size="40" />
      </router-link>
      <div class="d-flex align-center">
        <search-field @search="val => router.push({ path: '/catalog', query: { q: val } })" />
        <user-menu class="ml-2" />
        <cart-mini-button />
      </div>
    </v-container>
  </v-app-bar>
</template>

<style scoped lang="sass">

</style>
