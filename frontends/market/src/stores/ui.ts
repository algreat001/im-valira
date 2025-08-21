import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useUIStore = defineStore("ui", () => {
  const currentWidth = computed(() => window.innerWidth);
  const isMobile = computed(() => currentWidth.value < 600);

  const isLoading = ref(false);

  async function load(cb: () => Promise<void>) {
    isLoading.value = true;
    try {
      await cb();
    } catch (error) {
      console.error("Error during loading:", error);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    currentWidth,
    isMobile,
    isLoading,
    load
  };
});
