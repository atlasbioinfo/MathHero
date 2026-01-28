<template>
  <div class="sticker-showcase">
    <div class="showcase-stickers">
      <span
        v-for="(sticker, index) in displayStickers"
        :key="sticker?.id || 'empty-' + index"
        class="showcase-sticker"
        :class="{ empty: !sticker, bounce: sticker }"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        {{ sticker?.icon || '' }}
      </span>
    </div>
    <button class="edit-btn" @click="showEditor = true" :title="t.stickerShowcase?.edit || 'Edit'">
      <span class="edit-icon">✏️</span>
    </button>

    <!-- Editor Modal -->
    <n-modal v-model:show="showEditor" preset="card" style="max-width: 400px">
      <template #header>
        <span>{{ t.stickerShowcase?.title || 'My Favorite Stickers' }}</span>
      </template>
      <div class="editor-content">
        <p class="editor-desc">{{ t.stickerShowcase?.desc || 'Select up to 5 stickers to display' }}</p>

        <!-- Current Selection -->
        <div class="current-selection">
          <div
            v-for="index in 5"
            :key="'slot-' + index"
            class="selection-slot"
            :class="{ filled: selectedStickers[index - 1] }"
            @click="removeSticker(index - 1)"
          >
            <span v-if="selectedStickers[index - 1]" class="slot-sticker">
              {{ selectedStickers[index - 1].icon }}
              <span class="remove-badge">×</span>
            </span>
            <span v-else class="slot-empty">+</span>
          </div>
        </div>

        <!-- Available Stickers -->
        <div class="available-stickers">
          <div class="sticker-category" v-if="ownedStickers.length > 0">
            <h4>{{ t.stickerShowcase?.owned || 'Your Stickers' }}</h4>
            <div class="sticker-grid">
              <button
                v-for="sticker in ownedStickers"
                :key="sticker.id"
                class="sticker-option"
                :class="{ selected: isSelected(sticker) }"
                :disabled="isSelected(sticker) || selectedStickers.length >= 5"
                @click="addSticker(sticker)"
              >
                {{ sticker.icon }}
              </button>
            </div>
          </div>

          <div class="sticker-category" v-if="earnedStickers.length > 0">
            <h4>{{ t.stickerShowcase?.earned || 'Achievement Stickers' }}</h4>
            <div class="sticker-grid">
              <button
                v-for="sticker in earnedStickers"
                :key="sticker.id"
                class="sticker-option"
                :class="{ selected: isSelected(sticker) }"
                :disabled="isSelected(sticker) || selectedStickers.length >= 5"
                @click="addSticker(sticker)"
              >
                {{ sticker.icon }}
              </button>
            </div>
          </div>

          <div v-if="ownedStickers.length === 0 && earnedStickers.length === 0" class="empty-state">
            <span class="empty-icon">🎁</span>
            <p>{{ t.stickerShowcase?.empty || 'Earn stickers by completing levels or buy them in the shop!' }}</p>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="editor-actions">
          <n-button @click="clearAll">{{ t.stickerShowcase?.clear || 'Clear All' }}</n-button>
          <n-button type="primary" @click="saveAndClose">{{ t.common?.save || 'Save' }}</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { NModal, NButton } from 'naive-ui'
import { useCoinsStore } from '../stores/coins'
import { useStickersStore } from '../stores/stickers'
import { useLocaleStore } from '../stores/locale'
import { allPurchasableStickers } from '../config/shop'

const coinsStore = useCoinsStore()
const stickersStore = useStickersStore()
const localeStore = useLocaleStore()

const t = computed(() => localeStore.t)

const showEditor = ref(false)
const selectedStickers = ref([])

// Get owned purchasable stickers
const ownedStickers = computed(() => {
  return allPurchasableStickers.filter(s => coinsStore.hasPurchasedItem(s.id))
})

// Get earned achievement stickers
const earnedStickers = computed(() => {
  return stickersStore.allStickers.filter(s => stickersStore.hasSticker(s.id))
})

// Combined display stickers (padded to 5)
const displayStickers = computed(() => {
  const stickers = [...selectedStickers.value]
  while (stickers.length < 5) {
    stickers.push(null)
  }
  return stickers.slice(0, 5)
})

function isSelected(sticker) {
  return selectedStickers.value.some(s => s?.id === sticker.id)
}

function addSticker(sticker) {
  if (selectedStickers.value.length >= 5) return
  if (isSelected(sticker)) return
  selectedStickers.value.push(sticker)
  saveToStorage()
}

function removeSticker(index) {
  if (selectedStickers.value[index]) {
    selectedStickers.value.splice(index, 1)
    saveToStorage()
  }
}

function clearAll() {
  selectedStickers.value = []
  saveToStorage()
}

function saveAndClose() {
  saveToStorage()
  showEditor.value = false
}

function saveToStorage() {
  const ids = selectedStickers.value.map(s => s.id)
  localStorage.setItem('mathGame_showcaseStickers', JSON.stringify(ids))
}

function loadFromStorage() {
  const saved = localStorage.getItem('mathGame_showcaseStickers')
  if (saved) {
    try {
      const ids = JSON.parse(saved)
      selectedStickers.value = ids
        .map(id => {
          // Find in purchasable stickers
          const purchased = allPurchasableStickers.find(s => s.id === id)
          if (purchased) return purchased
          // Find in earned stickers
          const earned = stickersStore.allStickers.find(s => s.id === id)
          return earned
        })
        .filter(Boolean)
    } catch (e) {
      selectedStickers.value = []
    }
  }
}

onMounted(() => {
  loadFromStorage()
})
</script>

<style scoped>
.sticker-showcase {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

.showcase-stickers {
  display: flex;
  gap: 8px;
}

.showcase-sticker {
  font-size: 28px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  border: 2px dashed rgba(255, 105, 180, 0.3);
}

.showcase-sticker.empty {
  opacity: 0.3;
}

.showcase-sticker.bounce {
  animation: stickerBounce 2s infinite ease-in-out;
  border: 2px solid rgba(255, 105, 180, 0.5);
  background: white;
}

@keyframes stickerBounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-4px) scale(1.05); }
}

.edit-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  opacity: 0.6;
}

.edit-btn:hover {
  opacity: 1;
  transform: scale(1.1);
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.edit-icon {
  font-size: 14px;
}

/* Editor Modal */
.editor-content {
  padding: 10px 0;
}

.editor-desc {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
}

.current-selection {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 16px;
  background: var(--light-color, #FFF5F8);
  border-radius: 16px;
}

.selection-slot {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  border: 2px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.selection-slot.filled {
  border: 2px solid var(--primary-color, #FF69B4);
  background: white;
}

.selection-slot:hover {
  border-color: var(--primary-color, #FF69B4);
  transform: scale(1.05);
}

.slot-sticker {
  font-size: 28px;
  position: relative;
}

.remove-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 18px;
  height: 18px;
  background: #ff6b6b;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.selection-slot:hover .remove-badge {
  opacity: 1;
}

.slot-empty {
  font-size: 24px;
  color: #ccc;
}

.available-stickers {
  max-height: 250px;
  overflow-y: auto;
}

.sticker-category {
  margin-bottom: 16px;
}

.sticker-category h4 {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
  padding-left: 4px;
}

.sticker-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.sticker-option {
  width: 44px;
  height: 44px;
  border: 2px solid #eee;
  border-radius: 10px;
  background: white;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sticker-option:hover:not(:disabled) {
  border-color: var(--primary-color, #FF69B4);
  transform: scale(1.1);
}

.sticker-option.selected {
  border-color: #81C784;
  background: #f0fff0;
  opacity: 0.5;
}

.sticker-option:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.empty-state {
  text-align: center;
  padding: 30px 20px;
  color: #999;
}

.empty-icon {
  font-size: 40px;
  display: block;
  margin-bottom: 10px;
}

.editor-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* Mobile */
@media (max-width: 500px) {
  .sticker-showcase {
    gap: 6px;
    margin-top: 12px;
  }

  .showcase-stickers {
    gap: 6px;
  }

  .showcase-sticker {
    font-size: 22px;
    width: 34px;
    height: 34px;
    border-radius: 10px;
  }

  .edit-btn {
    width: 28px;
    height: 28px;
  }

  .edit-icon {
    font-size: 12px;
  }

  .current-selection {
    gap: 8px;
    padding: 12px;
  }

  .selection-slot {
    width: 42px;
    height: 42px;
  }

  .slot-sticker {
    font-size: 24px;
  }

  .sticker-option {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}
</style>
