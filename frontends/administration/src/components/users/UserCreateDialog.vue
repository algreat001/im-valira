<script lang="ts" setup>
import { ref, watch } from "vue";

import type { User } from "@/interfaces/user";
import UserForm from "@/components/users/UserForm.vue";

const open = defineModel<boolean>({ required: true });

interface Props {
  loading: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  submit: [ payload: Partial<User> ];
}>();

function getDefaultForm(): Partial<User> {
  return {
    email: "",
    name: "",
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    postalCode: "",
    deliveryCity: "",
    deliveryAddress: "",
    password: ""
  };
}

const form = ref<Partial<User>>(getDefaultForm());

function onCancel() {
  open.value = false;
}

function onSubmit() {
  if (!form.value.email) {
    return;
  }
  emit("submit", { ...form.value });
}

function resetForm() {
  form.value = getDefaultForm();
}

watch(open, (v) => {
  if (!v) {
    resetForm();
  }
});
</script>

<template>
  <v-dialog v-model="open" persistent max-width="720">
    <v-card>
      <v-card-title>Создание пользователя</v-card-title>
      <v-card-text>
        <user-form v-model="form" :loading="props.loading" :show-password="true" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="onCancel">Отмена</v-btn>
        <v-btn color="primary"
               :loading="props.loading"
               :disabled="!form.email"
               @click="onSubmit"
        >
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
