<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  token: string;
  orderId?: string | number | null;
}>();

// Формируем deeplink/URL для оплаты по СБП.
// Если backend уже отдаёт полный URL — можно передавать его вместо token.
const sbpUrl = computed(() => {
  const t = props.token?.toString() || "";
  // Пробуем использовать как полный URL, иначе собираем простой deeplink
  if (/^https?:\/\//i.test(t)) return t;
  return `sbp://pay?token=${encodeURIComponent(t)}`;
});

// Генерация QR через публичный сервис (демо-вариант)
const qrSrc = computed(
  () => `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(sbpUrl.value)}`
);

function openPayment() {
  window.open(sbpUrl.value, "_blank");
}

async function copyToken() {
  try {
    await navigator.clipboard.writeText(props.token);
  } catch {
    // ignore
  }
}
</script>

<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      Оплата по СБП
      <v-chip v-if="orderId" class="ml-3" size="small" color="primary" variant="tonal">#{{ orderId }}</v-chip>
    </v-card-title>
    <v-divider />
    <v-card-text>
      <div class="d-flex flex-column flex-sm-row align-center ga-6">
        <v-img :src="qrSrc" width="220" height="220" class="rounded" />
        <div class="d-flex flex-column ga-3">
          <div class="text-body-2 text-medium-emphasis">
            Отсканируйте QR-код в приложении вашего банка или нажмите кнопку ниже для открытия приложения оплаты.
          </div>
          <div class="d-flex ga-2">
            <v-btn color="primary" variant="flat" @click="openPayment">
              Открыть оплату
            </v-btn>
            <v-btn color="secondary" variant="tonal" @click="copyToken">
              Скопировать токен
            </v-btn>
          </div>
          <div class="text-caption text-medium-emphasis word-break mt-2">
            Токен: {{ token }}
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="sass">
.word-break
  word-break: break-all
</style>
