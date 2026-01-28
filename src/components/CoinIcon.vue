<template>
  <img :src="coinIconSrc" class="coin-icon-img" :style="iconStyle" alt="coin" />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: [Number, String],
    default: 20
  }
})

const baseUrl = import.meta.env.BASE_URL
const coinIconSrc = computed(() => `${baseUrl}coin.svg`)

const iconStyle = computed(() => {
  const size = typeof props.size === 'number' ? `${props.size}px` : props.size
  return {
    width: size,
    height: size
  }
})
</script>

<style scoped>
.coin-icon-img {
  display: inline-block;
  vertical-align: middle;
  filter: drop-shadow(0 0 2px #FFD700);
}
</style>
