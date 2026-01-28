<template>
  <Teleport to="body">
    <transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content confirm-modal">
          <h3 class="modal-title">{{ title }}</h3>
          <p class="modal-message">{{ message }}</p>
          <div class="modal-buttons">
            <button class="cancel-btn" @click="$emit('close')">
              {{ cancelText }}
            </button>
            <button class="confirm-btn" :class="type" @click="$emit('confirm')">
              {{ confirmText }}
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
  cancelText: { type: String, required: true },
  confirmText: { type: String, required: true },
  type: { type: String, default: 'danger' }
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
  border-radius: 20px;
  padding: 24px;
  max-width: 320px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(255, 182, 193, 0.3);
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-color, #FF69B4);
  margin: 0 0 12px;
  text-align: center;
}

.modal-message {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
  text-align: center;
}

.modal-buttons {
  display: flex;
  gap: 12px;
}

.cancel-btn, .confirm-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: #eee;
  color: #666;
}

.cancel-btn:hover {
  background: #ddd;
}

.confirm-btn.danger {
  background: #e74c3c;
  color: white;
}

.confirm-btn.danger:hover {
  background: #c0392b;
}

.confirm-btn.primary {
  background: linear-gradient(135deg, var(--primary-color, #FF69B4), var(--accent-color, #FF1493));
  color: white;
}

.confirm-btn.primary:hover {
  box-shadow: 0 6px 20px rgba(255, 105, 180, 0.4);
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
