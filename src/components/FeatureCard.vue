<template>
  <div class="feature-card" :class="type" @click="$emit('click')">
    <div class="feature-icon">{{ icon }}</div>
    <div class="feature-content">
      <h3 class="feature-title">{{ title }}</h3>
      <slot>
        <p v-if="description" class="feature-desc">{{ description }}</p>
      </slot>
    </div>
    <span class="feature-arrow">→</span>
  </div>
</template>

<script setup>
defineProps({
  type: { type: String, default: '' },
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' }
})

defineEmits(['click'])
</script>

<style scoped>
.feature-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.feature-card.sticker {
  border-color: #FFE0B2;
}

.feature-card.sticker:hover {
  border-color: #FFB74D;
}

.feature-card.stats {
  border-color: #C8E6C9;
}

.feature-card.stats:hover {
  border-color: #81C784;
}

.feature-icon {
  font-size: 32px;
}

.feature-content {
  flex: 1;
}

.feature-title {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.feature-desc {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.feature-arrow {
  font-size: 20px;
  color: #ccc;
  align-self: center;
}

@media (max-width: 500px) {
  .feature-card {
    padding: 16px;
    border-radius: 16px;
    flex-direction: row;
    align-items: center;
  }

  .feature-icon {
    font-size: 28px;
  }

  .feature-title {
    font-size: 15px;
    margin-bottom: 4px;
  }

  .feature-desc {
    font-size: 11px;
  }

  .feature-arrow {
    font-size: 16px;
  }
}

@media (max-width: 360px) {
  .feature-card {
    padding: 14px 12px;
  }

  .feature-icon {
    font-size: 24px;
  }

  .feature-title {
    font-size: 14px;
  }
}
</style>
