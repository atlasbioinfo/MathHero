<template>
  <div class="stat-card" :class="type">
    <div class="stat-icon-wrapper">
      <span class="stat-emoji">{{ icon }}</span>
    </div>
    <div class="stat-info">
      <span class="stat-value">{{ value }}</span>
      <span class="stat-label">{{ label }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  type: { type: String, default: '' },
  icon: { type: String, required: true },
  value: { type: [String, Number], required: true },
  label: { type: String, required: true }
})
</script>

<style scoped>
.stat-card {
  background: white;
  border-radius: 16px;
  padding: 16px 8px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 2px solid #f0f0f0;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.stat-card.flame { border-color: #FFCDD2; }
.stat-card.questions { border-color: #C8E6C9; }
.stat-card.accuracy { border-color: #BBDEFB; }
.stat-card.stickers { border-color: #FFE0B2; }

.stat-icon-wrapper {
  margin-bottom: 8px;
}

.stat-emoji {
  font-size: 28px;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.stat-label {
  font-size: 11px;
  color: #999;
}

@media (max-width: 768px) {
  .stat-card {
    padding: 14px 6px;
  }
}

@media (max-width: 500px) {
  .stat-card {
    padding: 12px 6px;
    border-radius: 14px;
  }

  .stat-icon-wrapper {
    margin-bottom: 6px;
  }

  .stat-emoji {
    font-size: 22px;
  }

  .stat-value {
    font-size: 16px;
  }

  .stat-label {
    font-size: 11px;
  }
}

@media (max-width: 360px) {
  .stat-card {
    padding: 10px 4px;
    border-radius: 12px;
  }

  .stat-emoji {
    font-size: 20px;
  }

  .stat-value {
    font-size: 14px;
  }

  .stat-label {
    font-size: 10px;
  }
}

@media (max-height: 600px) and (orientation: landscape) {
  .stat-card {
    padding: 8px 4px;
  }

  .stat-emoji {
    font-size: 18px;
  }

  .stat-value {
    font-size: 14px;
  }
}
</style>
