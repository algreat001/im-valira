<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import UserForm from "@/components/UserForm.vue";
import { initUser } from "@/bootstrap.ts";

const router = useRouter();
const auth = useAuthStore();

onMounted(async () => {
  await initUser();
  await auth.testAuthenticated("/profile");
});

async function onSubmit(payload: any) {
  await auth.updateProfile(payload);
}

function goToMain() {
  router.push("/");
}
</script>

<template>
  <v-container class="py-10" style="max-width: 720px;">
    <v-card>
      <v-card-title class="text-h6">Профиль</v-card-title>
      <v-divider />
      <v-card-text>
        <template v-if="auth.user">
          <user-form
            mode="edit"
            :initial="auth.user"
            :submitting="auth.loading"
            :error="auth.error"
            @submit="onSubmit"
            @cancel="goToMain"
          />
        </template>
        <template v-else>
          <div>Загрузка…</div>
        </template>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped lang="sass">
</style>
