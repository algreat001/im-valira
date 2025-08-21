<script setup lang="ts">
import { computed } from "vue";

import * as telegram from "@/assets/images/telegram.svg";
import * as whatsapp from "@/assets/images/whatsapp.svg";
import * as vk from "@/assets/images/vk.svg";
import * as facebook from "@/assets/images/facebook.svg";
import * as linkIcon from "@/assets/images/link.svg";
import * as viber from "@/assets/images/viber.svg";

import palette from "@/palette.ts";

interface SvgIconProps {
  name: "telegram" | "whatsapp" | "vk" | "facebook" | "link" | "viber";
  width?: string | number;
  height?: string | number;
  color?: string;
}

const width = computed(() => props.width ?? 32);
const height = computed(() => props.height ?? props.width ?? 32);

const color = computed(() => {
  const key = props.color as keyof typeof palette;
  return palette[key || "primary"];
});

const style = computed(() => ({
  maxWidth: width.value + "px",
  width: width.value + "px",
  height: height.value + "px"
}));

const props = defineProps<SvgIconProps>();
</script>

<template>
  <div class="svg-color" :style="style">
    <telegram v-if="name === 'telegram'" />
    <whatsapp v-else-if="name === 'whatsapp'" />
    <vk v-else-if="name === 'vk'" />
    <facebook v-else-if="name === 'facebook'" />
    <link-icon v-else-if="name === 'link'" />
    <viber v-else-if="name === 'viber'" />
  </div>
</template>

<style scoped lang="sass">
$svg-color: v-bind('color')

.svg-color
  color: $svg-color !important

  svg
    fill: $svg-color !important
    stroke: $svg-color !important
</style>
