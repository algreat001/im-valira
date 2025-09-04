<script lang="ts" setup>
import { computed } from "vue";

import { useAuthStore } from "@/stores/auth";
import { type RouteLocationRaw, useRoute, useRouter } from "vue-router";

const auth = useAuthStore();

const router = useRouter();
const route = useRoute();

const items = computed(() => [
  { title: "Панель", to: { name: "Dashboard" }, icon: "mdi-view-dashboard-outline" },
  { title: "Пользователи", to: { name: "Users" }, icon: "mdi-account-multiple-outline" },
  { title: "Категории", to: { name: "Categories" }, icon: "mdi-format-list-bulleted" },
  { title: "Товары", to: { name: "Products" }, icon: "mdi-cube-outline" },
  { title: "Баннеры", to: { name: "Banners" }, icon: "mdi-view-carousel" },
  { title: "Теги", to: { name: "Tags" }, icon: "mdi-tag-multiple-outline" },
  { title: "Галерея", to: { name: "Gallery" }, icon: "mdi-image-multiple-outline" },
  { title: "Заказы", to: { name: "Orders" }, icon: "mdi-receipt-text-outline" }
]);

async function onLogout() {
  await auth.logout();
  await router.push({ name: "Login" } as unknown as RouteLocationRaw);
}


</script>

<template>
  <v-app>
    <v-app-bar v-if="route.name as string !== 'Login'" flat>
      <v-app-bar-title>Админка</v-app-bar-title>
      <v-spacer />
      <v-btn variant="text" prepend-icon="mdi-logout" @click="onLogout">Выйти</v-btn>
    </v-app-bar>
    <v-navigation-drawer v-if="route.name as string !== 'Login'" permanent rail>
      <v-list density="compact" nav>
        <v-list-item
          v-for="it in items"
          :key="it.title"
          :to="it.to"
          :prepend-icon="it.icon"
          :title="it.title"
        />
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style lang="sass">
</style>
