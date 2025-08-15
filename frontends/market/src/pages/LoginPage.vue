<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { afterLogin, initUser } from "@/bootstrap.ts";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
initUser();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

async function onSubmit() {
  error.value = null;
  loading.value = true;
  try {
    await auth.login({ email: email.value.trim(), password: password.value });
    afterLogin();
    const redirect = (route.query.redirect as string) || "/";
    router.replace(redirect);
  } catch (e: any) {
    error.value = e?.message || "Неверный логин или пароль";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-container class="py-10" style="max-width: 520px;">
    <v-card>
      <v-card-title class="text-h6">Вход</v-card-title>
      <v-divider />
      <v-card-text>
        <v-form @submit.prevent="onSubmit">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            autocomplete="email"
            prepend-inner-icon="mdi-email"
            required
          />
          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Пароль"
            autocomplete="current-password"
            prepend-inner-icon="mdi-lock"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            required
          />
          <div v-if="error" class="text-error mb-3">{{ error }}</div>
          <v-btn :loading="loading" color="primary" type="submit" block>Войти</v-btn>
        </v-form>
        <div class="mt-4">
          Нет аккаунта?
          <router-link :to="{ name: 'Register' }">Зарегистрироваться</router-link>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped lang="sass">
.text-error
  color: rgb(var(--v-theme-error))
</style>
