<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";

import { useAuthStore } from "@/stores/auth";

import { useDashboardStore } from "@/stores/dashboard";

import DashboardStatCard from "@/components/dashboard/DashboardStatCard.vue";

const auth = useAuthStore();

const dashboard = useDashboardStore();
const { groupedTiles, loading, error } = storeToRefs(dashboard);

const panelsOpen = ref<number[]>([ 0, 1, 2, 3 ]);

onMounted(dashboard.load);
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-toolbar flat>
            <v-toolbar-title>Админ-панель</v-toolbar-title>
          </v-toolbar>

          <v-alert v-if="error" type="error" variant="tonal" class="ma-4">{{ error }}</v-alert>

          <v-card-text>
            Добро пожаловать, {{ auth.userName || "Администратор" }}.
          </v-card-text>

          <v-divider />

          <v-card-text>
            <v-row>
              <v-col cols="15" md="3">
                <v-btn block color="primary" to="/users">Пользователи</v-btn>
              </v-col>
              <v-col cols="15" md="3">
                <v-btn block color="primary" to="/categories">Категории</v-btn>
              </v-col>
              <v-col cols="15" md="3">
                <v-btn block color="primary" to="/products">Товары</v-btn>
              </v-col>
              <v-col cols="15" md="3">
                <v-btn block color="primary" to="/orders">Заказы</v-btn>
              </v-col>
              <v-col cols="15" md="3">
                <v-btn block color="primary" to="/gallery">Галерея</v-btn>
              </v-col>
            </v-row>
          </v-card-text>

          <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-2" />

          <v-divider />

          <v-card-text>
            <v-expansion-panels multiple v-model="panelsOpen">
              <v-expansion-panel v-for="(g, gi) in groupedTiles" :key="g.title" :value="gi">
                <v-expansion-panel-title>{{ g.title }}</v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-row justify="center" align="center" class="mb-4">
                    <v-col v-for="t in g.items" :key="t.title" cols="12" sm="6" md="4" lg="3">
                      <dashboard-stat-card :title="t.title"
                                           :value="t.value"
                                           :icon="t.icon"
                                           :color="t.color"
                                           :format="t.format"
                      />
                    </v-col>
                  </v-row>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="sass">
</style>
