<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{ expandedWidth?: number; collapsedWidth?: number }>();
const emit = defineEmits([ "search" ]);

const search = ref("");
const searchFocused = ref(false);

const SEARCH_EXPANDED_WIDTH = props.expandedWidth ?? 260;
const SEARCH_COLLAPSED_WIDTH = props.collapsedWidth ?? 44;

const visibleSearch = computed(() => searchFocused.value || search.value.length > 0);

function onSearch() {
  if (search.value.trim()) {
    emit("search", search.value);
    searchFocused.value = false;
  }
}

function onBlur() {
  searchFocused.value = false;
}

function onFocus() {
  searchFocused.value = true;
}

function onMouseEnter() {
  searchFocused.value = true;
}

function onMouseLeave() {
  if (!document.activeElement || (document.activeElement as HTMLElement).id !== "header-search-input") {
    searchFocused.value = false;
  }
}
</script>

<template>
  <div
    class="search-anim-wrap"
    :class="{ expanded: visibleSearch }"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <v-text-field
      variant="solo"
      rounded
      id="header-search-input"
      v-model="search"
      placeholder="Поиск товаров..."
      hide-details
      density="compact"
      prepend-inner-icon="mdi-magnify"
      :style="{
        width: visibleSearch ? `${SEARCH_EXPANDED_WIDTH}px` : `${SEARCH_COLLAPSED_WIDTH}px`,
        transition: 'width 0.3s cubic-bezier(.4,0,.2,1)',
        minWidth: '44px',
        maxWidth: `${SEARCH_EXPANDED_WIDTH}px`,
        paddingLeft: '0',
        paddingRight: '0',
      }"
      :flat="!visibleSearch"
      bg-color="transparent"
      class="mx-4"
      @focus="onFocus"
      @blur="onBlur"
      @keyup.enter="onSearch"
    />
  </div>
</template>

<style scoped lang="sass">
.search-anim-wrap
  display: flex
  align-items: center

  .v-text-field
    border-radius: 24px
    transition: width 0.3s cubic-bezier(.4, 0, .2, 1)
    min-width: 44px
    max-width: 260px
    padding-left: 0
    padding-right: 0
</style>

