<template>
  <Teleport to="body">
    <transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content quit-modal">
          <div class="quit-icon">😢</div>
          <h3 class="modal-title">{{ title }}</h3>
          <p class="quit-message">{{ message }}</p>
          <div class="modal-buttons">
            <button class="continue-btn" @click="$emit('close')">
              💪 {{ continueText }}
            </button>
            <button class="quit-confirm-btn" @click="$emit('confirm')">
              🏠 {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, required: true },
  message: { type: String, required: true },
  continueText: { type: String, required: true },
  confirmText: { type: String, required: true }
})

defineEmits(['close', 'confirm'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  background: linear-gradient(135deg, #fff 0%, #FFF5F8 100%);
  border-radius: 24px;
  padding: 30px;
  max-width: 340px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(255, 182, 193, 0.3);
}

.quit-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--primary-color, #FF69B4);
  margin: 0 0 12px;
}

.quit-message {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 24px;
}

.modal-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.continue-btn, .quit-confirm-btn {
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.continue-btn {
  background: linear-gradient(135deg, var(--primary-color, #FF69B4), var(--accent-color, #FF1493));
  color: white;
}

.continue-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 105, 180, 0.4);
}

.quit-confirm-btn {
  background: #f5f5f5;
  color: #666;
}

.quit-confirm-btn:hover {
  background: #eee;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}
</style>
