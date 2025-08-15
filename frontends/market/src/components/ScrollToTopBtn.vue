<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const showButton = ref(false);

function handleScroll() {
  showButton.value = window.scrollY > window.innerHeight * 0.5;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <v-fab-transition>
    <v-btn
      v-if="showButton"
      class="scroll-top-btn"
      color="primary"
      icon
      size="large"
      @click="scrollToTop"
      aria-label="Наверх"
    >
      <v-icon>mdi-arrow-up</v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<style scoped lang="sass">
.scroll-top-btn
  position: fixed
  right: 32px
  bottom: 32px
  z-index: 1000
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18)
</style>
