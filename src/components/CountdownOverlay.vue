<template>
  <Teleport to="body">
    <div v-if="show" class="countdown-overlay">
      <div class="countdown-content">
        <div class="countdown-number" :class="{ 'go': currentCount === 0 }">
          {{ currentCount > 0 ? currentCount : goText }}
        </div>
        <div class="countdown-ring" :style="{ '--progress': ringProgress }"></div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  goText: {
    type: String,
    default: 'GO!'
  }
})

const emit = defineEmits(['complete'])

const currentCount = ref(3)
const ringProgress = computed(() => {
  if (currentCount.value === 0) return 1
  return (3 - currentCount.value) / 3
})

watch(() => props.show, (newValue) => {
  if (newValue) {
    startCountdown()
  }
})

function startCountdown() {
  currentCount.value = 3

  const countdown = setInterval(() => {
    currentCount.value--

    if (currentCount.value < 0) {
      clearInterval(countdown)
      emit('complete')
    }
  }, 800)
}
</script>

<style scoped>
.countdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.countdown-content {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.countdown-number {
  font-size: 100px;
  font-weight: 900;
  color: white;
  text-shadow: 0 0 40px rgba(255, 105, 180, 0.8), 0 0 80px rgba(255, 105, 180, 0.4);
  animation: numberPop 0.8s ease-out;
  z-index: 2;
}

.countdown-number.go {
  font-size: 72px;
  color: #FFD700;
  text-shadow: 0 0 40px rgba(255, 215, 0, 0.8), 0 0 80px rgba(255, 215, 0, 0.4);
  animation: goPop 0.8s ease-out;
}

@keyframes numberPop {
  0% {
    transform: scale(2);
    opacity: 0;
  }
  30% {
    transform: scale(0.8);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes goPop {
  0% {
    transform: scale(0.3) rotate(-10deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.3) rotate(5deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.countdown-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 6px solid rgba(255, 255, 255, 0.2);
  border-top-color: var(--primary-color, #FF69B4);
  animation: ringRotate 0.8s linear;
  transform: rotate(calc(var(--progress) * 360deg));
}

@keyframes ringRotate {
  from {
    transform: rotate(0deg);
  }
}

/* Mobile */
@media (max-width: 500px) {
  .countdown-content {
    width: 150px;
    height: 150px;
  }

  .countdown-number {
    font-size: 80px;
  }

  .countdown-number.go {
    font-size: 56px;
  }

  .countdown-ring {
    border-width: 5px;
  }
}
</style>
