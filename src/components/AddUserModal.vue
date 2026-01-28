<template>
  <Teleport to="body">
    <transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content add-user-modal">
          <button class="close-btn" @click="$emit('close')">✕</button>

          <h3 class="modal-title">{{ title }}</h3>

          <div class="input-group">
            <label>{{ nameLabel }}</label>
            <input
              v-model="name"
              type="text"
              :placeholder="namePlaceholder"
              maxlength="20"
              class="name-input"
            />
          </div>

          <div class="gender-selection">
            <label>{{ genderLabel }}</label>
            <div class="gender-options">
              <div
                class="gender-option"
                :class="{ selected: gender === 'princess' }"
                @click="gender = 'princess'"
              >
                <img :src="`${baseUrl}math_princess.png`" alt="Princess" class="gender-avatar" />
                <span>{{ princessText }}</span>
              </div>
              <div
                class="gender-option"
                :class="{ selected: gender === 'prince' }"
                @click="gender = 'prince'"
              >
                <img :src="`${baseUrl}math_prince.png`" alt="Prince" class="gender-avatar" />
                <span>{{ princeText }}</span>
              </div>
            </div>
          </div>

          <button
            class="confirm-btn"
            :disabled="!gender"
            @click="handleConfirm"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, required: true },
  nameLabel: { type: String, required: true },
  namePlaceholder: { type: String, default: '' },
  genderLabel: { type: String, required: true },
  princessText: { type: String, required: true },
  princeText: { type: String, required: true },
  confirmText: { type: String, required: true }
})

const emit = defineEmits(['close', 'confirm'])

const baseUrl = import.meta.env.BASE_URL
const name = ref('')
const gender = ref(null)

watch(() => props.show, (newVal) => {
  if (!newVal) {
    name.value = ''
    gender.value = null
  }
})

function handleConfirm() {
  if (!gender.value) return
  emit('confirm', { name: name.value, gender: gender.value })
}
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
  max-width: 360px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(255, 182, 193, 0.3);
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 105, 180, 0.1);
  color: var(--primary-color, #FF69B4);
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--primary-color, #FF69B4);
  color: white;
  transform: rotate(90deg);
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-color, #FF69B4);
  margin: 0 0 20px;
  text-align: center;
}

.input-group {
  margin-bottom: 16px;
}

.input-group label {
  display: block;
  font-size: 12px;
  color: #888;
  margin-bottom: 6px;
}

.name-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--secondary-color, #FFB6C1);
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.name-input:focus {
  border-color: var(--primary-color, #FF69B4);
}

.gender-selection {
  margin-bottom: 20px;
}

.gender-selection label {
  display: block;
  font-size: 12px;
  color: #888;
  margin-bottom: 10px;
}

.gender-options {
  display: flex;
  gap: 12px;
}

.gender-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  border: 2px solid #eee;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.gender-option:hover {
  border-color: var(--secondary-color, #FFB6C1);
  background: var(--light-color, #FFF5F8);
}

.gender-option.selected {
  border-color: var(--primary-color, #FF69B4);
  background: var(--light-color, #FFF5F8);
}

.gender-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
}

.gender-option span {
  font-size: 13px;
  font-weight: 500;
  color: #666;
}

.gender-option.selected span {
  color: var(--primary-color, #FF69B4);
}

.confirm-btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary-color, #FF69B4), var(--accent-color, #FF1493));
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.confirm-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 105, 180, 0.4);
}

.confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

@media (max-width: 500px) {
  .modal-content {
    padding: 20px;
  }

  .gender-avatar {
    width: 48px;
    height: 48px;
  }
}
</style>
