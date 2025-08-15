<script setup lang="ts">
import ArticleList from "@/components/ArticleList.vue";
import { constants } from "@/constants.ts";
import palette from "@/palette.ts";
</script>

<template>
  <v-container :style="{ backgroundColor: palette.primary, color: palette.background }" class="footer">
    <v-row>
      <v-col cols="12" md="4" class="mb-4 mb-md-0">
        <v-img src="@/assets/images/logo.png" alt="Логотип" max-width="300" class="mb-2" />
        <div class="text-muted">{{ constants.app.copyright }}</div>
      </v-col>
      <v-col cols="12" md="4">
        <div class="font-weight-bold mb-2">Информация</div>
        <div>
          <router-link to="/catalog">Каталог</router-link>
        </div>
        <div>
          <router-link to="/about">О магазине</router-link>
        </div>
        <div>
          <router-link to="/delivery">Доставка</router-link>
        </div>
        <div>
          <router-link to="/contacts">Контакты</router-link>
        </div>
        <article-list />
      </v-col>
      <v-col cols="12" md="4" class="mb-4 mb-md-0">
        <div class="font-weight-bold mb-2">Контакты</div>
        <div class="mb-1">Телефон: <a href="tel:+79999999999">+7 (999) 999-99-99</a></div>
        <div class="mb-1">Email: <a href="mailto:info@im-valira.ru">info@im-valira.ru</a></div>
        <div class="d-flex mt-2">
          <a href="https://facebook.com" class="mr-2" target="_blank">
            <v-img src="@/assets/images/facebook.svg" alt="Facebook" max-width="24" width="24" height="24" />
          </a>
          <a href="https://vk.com" class="mr-2" target="_blank">
            <v-img src="@/assets/images/vk.svg" alt="VK" max-width="24" width="24" height="24" />
          </a>
          <a href="https://t.me/imvalira" class="mr-2" target="_blank">
            <v-img src="@/assets/images/telegram.svg" alt="Telegram" max-width="24" width="24" height="24" />
          </a>
          <a href="https://wa.me/79999999999" class="mr-2" target="_blank">
            <v-img src="@/assets/images/whatsapp.svg" alt="WhatsApp" max-width="24" width="24" height="24" />
          </a>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="sass">
.footer
  width: 100%
  max-width: 100%
  left: 0
  right: 0
  padding: 24px

.text-muted
  color: var(--color-muted)
  font-size: 0.95em

.font-weight-bold
  font-weight: 700
</style>
