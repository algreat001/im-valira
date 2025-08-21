<script lang="ts" setup>
import type { User } from "@/interfaces/user";

const model = defineModel<Partial<User>>({ required: true });

interface Props {
  loading: boolean;
  showPassword?: boolean;
}

const props = defineProps<Props>();
</script>

<template>
  <v-row dense>
    <v-col cols="12" md="6">
      <v-text-field v-model="model.email"
                    label="Email"
                    type="email"
                    density="comfortable"
                    hide-details
                    clearable
                    autofocus
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field v-model="model.name"
                    label="Имя (отображаемое)"
                    density="comfortable"
                    hide-details
                    clearable
      />
    </v-col>

    <v-col cols="12" md="4">
      <v-text-field v-model="model.lastName"
                    label="Фамилия"
                    density="comfortable"
                    hide-details
                    clearable
      />
    </v-col>
    <v-col cols="12" md="4">
      <v-text-field v-model="model.firstName"
                    label="Имя"
                    density="comfortable"
                    hide-details
                    clearable
      />
    </v-col>
    <v-col cols="12" md="4">
      <v-text-field v-model="model.middleName"
                    label="Отчество"
                    density="comfortable"
                    hide-details
                    clearable
      />
    </v-col>

    <v-col cols="12" md="6">
      <v-text-field v-model="model.phone"
                    label="Телефон"
                    density="comfortable"
                    hide-details
                    clearable
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field v-model="model.postalCode"
                    label="Почтовый индекс"
                    density="comfortable"
                    hide-details
                    clearable
      />
    </v-col>

    <v-col cols="12" md="6">
      <v-text-field v-model="model.deliveryCity"
                    label="Город доставки"
                    density="comfortable"
                    hide-details
                    clearable
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field v-model="model.deliveryAddress"
                    label="Адрес доставки"
                    density="comfortable"
                    hide-details
                    clearable
      />
    </v-col>

    <v-col v-if="props.showPassword" cols="12">
      <v-text-field v-model="model.password"
                    label="Пароль"
                    type="password"
                    density="comfortable"
                    hide-details
                    clearable
      />
    </v-col>
  </v-row>
</template>

<style lang="sass">
</style>
