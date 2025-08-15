<script setup lang="ts">
import SvgIcon from "@/components/Bricks/SvgIcon.vue";
</script>

<template>
  <v-container class="py-8 fade-in" style="max-width: 800px;">
    <h1 class="mb-4">Контакты</h1>
    <v-row>
      <v-col cols="12" md="6">
        <h2 class="mb-2">Связаться с нами</h2>
        <p>Вы можете связаться с нашей службой поддержки по следующим каналам:</p>
        <ul>
          <li>Телефон: <a href="tel:+79999999999">+7 (999) 999-99-99</a></li>
          <li>Электронная почта: <a href="mailto:office@energy-soft.ru">office@energy-soft.ru</a></li>
          <li>Telegram: <a href="https://t.me/imvalira" target="_blank">@imvalira</a></li>
        </ul>
        <p>Мы работаем ежедневно с 9:00 до 21:00.</p>
      </v-col>
      <v-col cols="12" md="6">
        <h2 class="mb-2">Социальные сети</h2>
        <div class="d-flex align-center">
          <a href="viber://chat?number=%2B79082101138/" class="mr-3">
            <svg-icon name="viber" width="32" color="primary" />
          </a>
          <a href="tg://resolve?domain=valira76/" class="mr-3">
            <svg-icon name="telegram" width="32" color="primary" />
          </a>
          <a href="whatsapp://send?phone=79082101138&text= /" class="mr-3">
            <svg-icon name="whatsapp" width="32" color="primary" />
          </a>
        </div>
      </v-col>
    </v-row>
    <v-divider class="my-6" />
    <h2>Юридическая информация</h2>
    <p>ООО «IM Valira», ОГРН 1234567890123, ИНН 1234567890, г. Москва, ул. Примерная, д. 1</p>
  </v-container>
</template>
