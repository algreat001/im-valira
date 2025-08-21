<script lang="ts" setup>
import { ref } from "vue";

import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

const email = ref("");
const password = ref("");
const showPass = ref(false);
const error = ref<string | null>(null);

async function onSubmit() {
  error.value = null;
  try {
    await auth.login({ email: email.value, password: password.value });
    const redirect = (new URLSearchParams(location.search).get("redirect")) || "/";
    location.assign(redirect);
  } catch (e: any) {
    error.value = e?.message || "Ошибка входа";
  }
}
</script>

<template>
  <v-container class="d-flex align-center justify-center" style="min-height: 100vh">
    <v-card max-width="420" class="w-100">
      <v-card-title>Вход в админку</v-card-title>
      <v-card-text>
        <v-alert v-if="error" type="error" variant="tonal" class="mb-3">{{ error }}</v-alert>
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          autocomplete="username"
        />
        <v-text-field
          v-model="password"
          label="Пароль"
          :type="showPass ? 'text' : 'password'"
          :append-inner-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPass = !showPass"
          autocomplete="current-password"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          :loading="auth.loading"
          :disabled="!email || !password"
          @click="onSubmit"
        >
          Войти
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style lang="sass">
</style>
