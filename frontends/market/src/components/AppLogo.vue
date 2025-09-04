<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDisplay } from "vuetify";
import { constants } from "@/constants";
import { useRouter } from "vue-router";

interface Props {
  to?: string;
  size?: number | string;
  showTitleOnDesktop?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  to: "/",
  size: 40,
  showTitleOnDesktop: true
});

const { mdAndUp } = useDisplay();
const animate = ref(false);
const router = useRouter();

function handleClick(e: MouseEvent) {
  e.preventDefault();
  router.push({ path: props.to });
}

onMounted(() => {
  requestAnimationFrame(() => {
    if (mdAndUp.value) {
      animate.value = true;
    }
  });
});
</script>

<template>
  <div class="app-logo" :class="{ animate: animate && mdAndUp }" @click="handleClick">
    <v-avatar class="app-logo__avatar" image="@/assets/logo256.png" :size="props.size" />
    <transition name="fade-slide">
      <span v-if="mdAndUp && props.showTitleOnDesktop" class="app-logo__title">{{ constants.app.name }}</span>
    </transition>
  </div>
</template>

<style scoped lang="sass">
@use "@/assets/mixin" as *

.app-logo
  display: flex
  align-items: center
  cursor: pointer
  user-select: none
  position: relative

  .app-logo__avatar
    transform: rotate(0deg)
    transition: transform .8s ease

  .app-logo__title
    font-size: 1.1rem
    font-weight: 600
    letter-spacing: .5px
    text-transform: uppercase
    color: $background-color
    margin-left: 0
    opacity: 0
    transform: translateX(-8px)
    transition: opacity .6s ease .25s, transform .6s ease .25s, margin-left .6s ease .25s
    white-space: nowrap

.app-logo.animate
  .app-logo__avatar
    transform: rotate(360deg)

  .app-logo__title
    opacity: 1
    transform: translateX(8px)
    margin-left: 4px

.fade-slide-enter-active, .fade-slide-leave-active
  transition: opacity .4s ease, transform .4s ease

.fade-slide-enter-from, .fade-slide-leave-to
  opacity: 0
  transform: translateX(-6px)
</style>

