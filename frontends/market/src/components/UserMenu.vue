<script setup lang="ts">
import { computed } from "vue";
import { type RouteLocationRaw, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { initUser, logout } from "@/bootstrap.ts";

const router = useRouter();
initUser();
const auth = useAuthStore();

const isAuth = computed(() => auth.isAuthenticated);
const userName = computed(() => auth.userName || "Профиль");

function goLogin() {
  router.push({ name: "Login" } as unknown as RouteLocationRaw);
}

function goRegister() {
  router.push({ name: "Register" } as unknown as RouteLocationRaw);
}

function goOrders() {
  router.push({ name: "Orders" } as unknown as RouteLocationRaw);
}

function goProfile() {
  router.push({ name: "Profile" } as unknown as RouteLocationRaw);
}

async function doLogout() {
  await logout();
  router.push({ name: "Home" } as unknown as RouteLocationRaw);
}
</script>

<template>
  <div>
    <template v-if="!isAuth">
      <v-menu>
        <template #activator="{ props }">
          <v-btn icon class="mr-2" v-bind="props">
            <v-icon icon="mdi-account" />
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="goLogin">
            <v-list-item-title>Войти</v-list-item-title>
          </v-list-item>
          <v-list-item @click="goRegister">
            <v-list-item-title>Регистрация</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    <template v-else>
      <v-menu>
        <template #activator="{ props }">
          <v-btn icon class="mr-2" v-bind="props">
            <v-icon icon="mdi-account" />
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>{{ userName }}</v-list-item-title>
          </v-list-item>
          <v-divider />
          <v-list-item @click="goProfile">
            <v-list-item-title>Профиль</v-list-item-title>
          </v-list-item>
          <v-list-item @click="goOrders">
            <v-list-item-title>Мои заказы</v-list-item-title>
          </v-list-item>
          <v-list-item @click="doLogout">
            <v-list-item-title>Выйти</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </div>
</template>

<style scoped lang="sass">
</style>
