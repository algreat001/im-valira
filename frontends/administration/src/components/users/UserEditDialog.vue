<script lang="ts" setup>
import { ref, watch } from "vue";

import type { User } from "@/interfaces/user";
import UserForm from "@/components/users/UserForm.vue";

const open = defineModel<boolean>({ required: true });

interface Props {
  loading: boolean;
  user: User | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  submit: [ payload: Partial<User> ];
}>();

function toForm(u: User | null): Partial<User> {
  return {
    user_id: u?.user_id,
    email: u?.email ?? "",
    name: u?.name ?? "",
    firstName: u?.firstName ?? "",
    middleName: u?.middleName ?? "",
    lastName: u?.lastName ?? "",
    phone: u?.phone ?? "",
    postalCode: u?.postalCode ?? "",
    deliveryCity: u?.deliveryCity ?? "",
    deliveryAddress: u?.deliveryAddress ?? ""
  };
}

const form = ref<Partial<User>>(toForm(props.user ?? null));

function onCancel() {
  open.value = false;
}

function onSubmit() {
  if (!form.value.user_id) {
    return;
  }
  emit("submit", { ...form.value });
}

watch(() => props.user, (u) => {
  form.value = toForm(u ?? null);
}, { immediate: true });

watch(open, (v) => {
  if (!v) {
    form.value = toForm(props.user ?? null);
  }
});
</script>

<template>
  <v-dialog v-model="open" max-width="720">
    <v-card>
      <v-card-title>Редактирование пользователя</v-card-title>
      <v-card-text>
        <user-form v-model="form" :loading="props.loading" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="onCancel">Отмена</v-btn>
        <v-btn color="primary" :loading="props.loading" :disabled="!form.user_id" @click="onSubmit">
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="sass">
.v-card-title
  font-weight: 600

.v-card-text
  padding-top: 8px
</style>
