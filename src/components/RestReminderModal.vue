<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="rest-modal-overlay" @click.self="$emit('close')">
        <div class="rest-modal" :class="userStore.gender">
          <div class="rest-icon">😴</div>
          <h2 class="rest-title">{{ t.restReminder?.title || 'Time to Rest!' }}</h2>
          <p class="rest-message">
            {{ (t.restReminder?.message || "You've played for {minutes} minutes today.").replace('{minutes}', playedMinutes) }}
          </p>
          <div class="rest-stats">
            <div class="stat">
              <span class="stat-icon">⏱️</span>
              <span class="stat-label">{{ t.restReminder?.playedTime || 'Played today' }}</span>
              <span class="stat-value">{{ playedMinutes }} {{ t.customDifficulty?.minutes || 'min' }}</span>
            </div>
          </div>
          <button class="rest-btn" :class="userStore.gender" @click="$emit('close')">
            {{ t.restReminder?.ok || "OK, I'll rest" }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/user'
import { useLocaleStore } from '../stores/locale'

defineProps({
  show: Boolean,
  playedMinutes: {
    type: Number,
    default: 0
  }
})

defineEmits(['close'])

const userStore = useUserStore()
const localeStore = useLocaleStore()
const t = computed(() => localeStore.t)
</script>

<style scoped>
.rest-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.rest-modal {
  background: white;
  border-radius: 28px;
  padding: 32px;
  max-width: 340px;
  width: 100%;
  text-align: center;
  animation: bounceIn 0.5s ease;
}

.rest-modal.princess {
  border: 3px solid #FFB6C1;
  background: linear-gradient(180deg, white 0%, #FFF5F8 100%);
}

.rest-modal.prince {
  border: 3px solid #87CEEB;
  background: linear-gradient(180deg, white 0%, #F0F8FF 100%);
}

@keyframes bounceIn {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.rest-icon {
  font-size: 64px;
  margin-bottom: 16px;
  animation: float 2s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.rest-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
}

.rest-modal.princess .rest-title {
  color: #FF69B4;
}

.rest-modal.prince .rest-title {
  color: #4A90D9;
}

.rest-message {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.rest-stats {
  background: rgba(0, 0, 0, 0.03);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 24px;
}

.stat {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.stat-icon {
  font-size: 20px;
}

.stat-label {
  font-size: 13px;
  color: #888;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
}

.rest-modal.princess .stat-value {
  color: #FF69B4;
}

.rest-modal.prince .stat-value {
  color: #4A90D9;
}

.rest-btn {
  width: 100%;
  padding: 16px 24px;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.rest-btn.princess {
  background: linear-gradient(135deg, #FF69B4, #FF1493);
  box-shadow: 0 4px 16px rgba(255, 105, 180, 0.4);
}

.rest-btn.prince {
  background: linear-gradient(135deg, #4A90D9, #1E90FF);
  box-shadow: 0 4px 16px rgba(74, 144, 217, 0.4);
}

.rest-btn:hover {
  transform: translateY(-2px);
}

.rest-btn:active {
  transform: translateY(0);
}

/* Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .rest-modal,
.modal-leave-active .rest-modal {
  transition: transform 0.3s;
}

.modal-enter-from .rest-modal,
.modal-leave-to .rest-modal {
  transform: scale(0.9);
}
</style>
