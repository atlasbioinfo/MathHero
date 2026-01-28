<template>
  <div v-if="rewards && rewards.total > 0" class="coin-rewards">
    <h3 class="coin-title">
      <span class="coin-icon">🪙</span>
      {{ earnedText }}
    </h3>
    <div class="coin-breakdown">
      <div class="coin-row" v-if="rewards.correctAnswers > 0">
        <span>{{ correctAnswersText }}</span>
        <span class="coin-value">+{{ rewards.correctAnswers }}</span>
      </div>
      <div class="coin-row" v-if="rewards.levelCompletion > 0">
        <span>{{ levelBonusText }}</span>
        <span class="coin-value">+{{ rewards.levelCompletion }}</span>
      </div>
      <div class="coin-row highlight" v-if="rewards.perfectScore > 0">
        <span>{{ perfectBonusText }}</span>
        <span class="coin-value">+{{ rewards.perfectScore }}</span>
      </div>
      <div class="coin-row highlight" v-if="rewards.noRetryBonus > 0">
        <span>{{ noRetryBonusText }}</span>
        <span class="coin-value">+{{ rewards.noRetryBonus }}</span>
      </div>
      <div class="coin-total">
        <span>{{ totalText }}</span>
        <span class="total-value">🪙 {{ rewards.total }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  rewards: { type: Object, default: null },
  earnedText: { type: String, required: true },
  correctAnswersText: { type: String, required: true },
  levelBonusText: { type: String, required: true },
  perfectBonusText: { type: String, required: true },
  noRetryBonusText: { type: String, required: true },
  totalText: { type: String, required: true }
})
</script>

<style scoped>
.coin-rewards {
  background: linear-gradient(135deg, #FFF9E6, #FFE4B5);
  border: 2px solid #FFD700;
  border-radius: 16px;
  padding: 15px;
  margin-bottom: 20px;
}

.coin-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  color: #B8860B;
  margin-bottom: 12px;
}

.coin-icon {
  font-size: 20px;
}

.coin-breakdown {
  font-size: 14px;
}

.coin-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  color: #666;
}

.coin-row.highlight {
  color: #B8860B;
  font-weight: 600;
}

.coin-value {
  color: #52C41A;
  font-weight: 600;
}

.coin-total {
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
  margin-top: 8px;
  border-top: 1px dashed #FFD700;
  font-weight: 700;
  color: #B8860B;
}

.total-value {
  font-size: 18px;
}
</style>
