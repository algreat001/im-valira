<script setup lang="ts">
import { useUIStore } from "@/stores/ui.ts";
import SmartImage from "@/components/Bricks/SmartImage.vue";
import { computed, onMounted, ref } from "vue";
import { useBannersStore } from "@/stores/banners";

const height = computed(() => useUIStore().isMobile ? 450 : 720);
const slide = ref(0);

onMounted(async () => {
  await useBannersStore().refresh();
  slide.value = 0;
});
</script>

<template>
  <v-carousel
    v-model="slide"
    show-arrows="hover"
    cycle
    hide-delimiter-background
    :height="height"
  >
    <v-carousel-item v-for="b in useBannersStore().banners" :key="b.id">
      <div class="banner-slide">
        <smart-image :src="b.image"
                     :alt="b.alt || b.image"
                     :height="height"
                     class="banner-img"
        />
        <div class="banner-overlay">
          <div class="banner-text">
            <h2 v-if="b.title" class="banner-title">{{ b.title }}</h2>
            <p v-if="b.message" class="banner-message">{{ b.message }}</p>
            <router-link v-if="b.link" :to="b.link" class="banner-link v-btn v-btn--elevated">
              <span>Перейти</span>
            </router-link>
          </div>
        </div>
      </div>
    </v-carousel-item>
  </v-carousel>
</template>

<style scoped>
.banner-slide {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.banner-img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0.55) 85%);
  padding: clamp(16px, 4vw, 64px);
}

.banner-text {
  max-width: 640px;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, .55);
  animation: fadeUp .9s ease both .15s;
}

.banner-title {
  margin: 0 0 .5rem;
  font-weight: 600;
  font-size: clamp(1.5rem, 3vw, 3rem);
  line-height: 1.1;
  letter-spacing: .5px;
}

.banner-message {
  margin: 0 0 1.25rem;
  font-size: clamp(.95rem, 1.2vw, 1.25rem);
  line-height: 1.35;
  opacity: .92;
}

.banner-link {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .75rem 1.5rem;
  border-radius: 999px;
  font-weight: 500;
  font-size: .95rem;
  text-decoration: none;
  background: linear-gradient(135deg, #ffcf71, #ff8a3d);
  color: #222;
  box-shadow: 0 4px 18px -4px rgba(0, 0, 0, .35);
  transition: .35s cubic-bezier(.4, .2, .2, 1);
}

.banner-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 26px -6px rgba(0, 0, 0, .45);
}

.banner-link:active {
  transform: translateY(0);
  box-shadow: 0 4px 14px -4px rgba(0, 0, 0, .4);
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .banner-overlay {
    padding: 20px;
    align-items: flex-end;
  }

  .banner-text {
    max-width: 100%;
  }
}
</style>
