<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import UserForm from "@/components/UserForm.vue";
import { initUser } from "@/bootstrap.ts";

const router = useRouter();
const auth = useAuthStore();
initUser();


async function onSubmit(payload: any) {
  try {
    await auth.register(payload);
    router.replace("/profile");
  } catch {
    // ошибка уже будет доступна в auth.error и показана формой
  }
}

function onCancel() {
  router.push("/");
}

</script>

<template>
  <v-container class="py-10" style="max-width: 640px;">
    <v-card>
      <v-card-title class="text-h6">Регистрация</v-card-title>
      <v-divider />
      <v-card-text>
        <user-form
          mode="register"
          :submitting="auth.loading"
          :error="auth.error"
          @submit="onSubmit"
          @cancel="onCancel"
        />
        <div class="mt-4">
          Уже есть аккаунт?
          <router-link to="/login">Войти</router-link>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>
