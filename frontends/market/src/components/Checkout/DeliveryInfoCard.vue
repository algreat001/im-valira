<script setup lang="ts">
interface Props {
  fullName: string;
  postalCode: string;
  deliveryCity: string;
  deliveryAddress: string;
}

defineProps<Props>();
</script>

<template>
  <v-card>
    <v-card-title class="d-flex align-center ga-2">
      Данные о доставке
      <v-tooltip text="Чтобы изменить адрес доставки, обновите данные в профиле пользователя.">
        <template #activator="{ props }">
          <v-icon v-bind="props" icon="mdi-information-outline" size="18" class="ml-2" />
        </template>
      </v-tooltip>
    </v-card-title>
    <v-divider />
    <v-card-text>
      <v-list lines="two" density="comfortable">
        <v-list-item>
          <v-list-item-title>Полное имя</v-list-item-title>
          <v-list-item-subtitle>{{ fullName }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Индекс</v-list-item-title>
          <v-list-item-subtitle>{{ postalCode }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Город</v-list-item-title>
          <v-list-item-subtitle>{{ deliveryCity }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Адрес доставки</v-list-item-title>
          <v-list-item-subtitle>{{ deliveryAddress }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
