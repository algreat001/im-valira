<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { User } from "@/interfaces/user";

type Mode = "register" | "edit";

type SubmitPayload = {
  email: string;
  password?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phone?: string;
  postalCode?: string;
  deliveryCity?: string;
  deliveryAddress?: string;
  name?: string;
};

interface Props {
  mode: Mode;
  initial?: Partial<User> | null;
  submitting?: boolean;
  error?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  initial: null,
  submitting: false,
  error: null
});

const emit = defineEmits<{
  (e: "submit", payload: SubmitPayload): void;
  (e: "cancel"): void;
}>();

const formRef = ref();
const email = ref(props.initial?.email ?? "");
const password = ref("");
const showPassword = ref(false);
const firstName = ref(props.initial?.firstName ?? "");
const middleName = ref(props.initial?.middleName ?? "");
const lastName = ref(props.initial?.lastName ?? "");
const phone = ref(props.initial?.phone ?? "");
const postalCode = ref(props.initial?.postalCode ?? "");
const deliveryCity = ref((props.initial as any)?.deliveryCity ?? "");
const deliveryAddress = ref(props.initial?.deliveryAddress ?? "");

watch(
  () => props.initial,
  (val) => {
    email.value = val?.email ?? "";
    firstName.value = val?.firstName ?? "";
    middleName.value = val?.middleName ?? "";
    lastName.value = val?.lastName ?? "";
    phone.value = val?.phone ?? "";
    postalCode.value = (val as any)?.postalCode ?? "";
    deliveryCity.value = (val as any)?.deliveryCity ?? "";
    deliveryAddress.value = val?.deliveryAddress ?? "";
  },
  { deep: true }
);

const title = computed(() => (props.mode === "register" ? "Регистрация" : "Профиль пользователя"));
const submitLabel = computed(() => (props.mode === "register" ? "Создать аккаунт" : "Сохранить"));

const emailRules = [ (v: string) => !!v || "Укажите email" ];
const passwordRules = [ (v: string) => (props.mode === "register" ? !!v || "Укажите пароль" : true) ];

function onSubmit() {
  const name = [ firstName.value, lastName.value ].filter(Boolean).join(" ").trim() || undefined;
  emit("submit", {
    email: email.value.trim(),
    password: props.mode === "register" ? password.value : undefined,
    firstName: firstName.value || undefined,
    middleName: middleName.value || undefined,
    lastName: lastName.value || undefined,
    phone: phone.value || undefined,
    postalCode: postalCode.value || undefined,
    deliveryCity: deliveryCity.value || undefined,
    deliveryAddress: deliveryAddress.value || undefined,
    name
  });
}

function cancel() {
  emit("cancel");
}
</script>

<template>
  <v-form ref="formRef" @submit.prevent="onSubmit">
    <v-text-field
      v-model="lastName"
      label="Фамилия"
      autocomplete="family-name"
      prepend-inner-icon="mdi-account"
    />
    <v-text-field
      v-model="firstName"
      label="Имя"
      autocomplete="given-name"
      prepend-inner-icon="mdi-account"
    />
    <v-text-field
      v-model="middleName"
      label="Отчество"
      autocomplete="additional-name"
      prepend-inner-icon="mdi-account"
    />
    <v-text-field
      v-model="phone"
      label="Телефон"
      type="tel"
      autocomplete="tel"
      prepend-inner-icon="mdi-phone"
    />
    <v-text-field
      v-model="email"
      label="Email"
      type="email"
      autocomplete="email"
      prepend-inner-icon="mdi-email"
      :rules="emailRules"
      required
    />
    <v-text-field
      v-model="postalCode"
      label="Индекс"
      autocomplete="postal-code"
      prepend-inner-icon="mdi-numeric"
    />
    <v-text-field
      v-model="deliveryCity"
      label="Город доставки"
      autocomplete="address-level2"
      prepend-inner-icon="mdi-city"
    />
    <v-textarea
      v-model="deliveryAddress"
      label="Адрес доставки"
      auto-grow
      rows="3"
      prepend-inner-icon="mdi-home-map-marker"
    />
    <v-text-field
      v-if="props.mode === 'register'"
      v-model="password"
      :type="showPassword ? 'text' : 'password'"
      label="Пароль"
      autocomplete="new-password"
      prepend-inner-icon="mdi-lock"
      :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="showPassword = !showPassword"
      :rules="passwordRules"
      required
    />
    <div v-if="props.error" class="text-error mb-3">{{ props.error }}</div>
    <div class="form-actions">
      <v-btn color="primary" variant="text" @click="cancel">Отмена</v-btn>
      <v-btn color="primary" type="submit" :loading="props.submitting" :text="submitLabel" />
    </div>
  </v-form>

</template>

<style scoped lang="sass">
.form-actions
  display: flex
  justify-content: flex-end
  gap: 10px

.text-error
  color: rgb(var(--v-theme-error))
</style>
