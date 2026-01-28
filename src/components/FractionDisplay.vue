<template>
  <div class="fraction-display">
    <div class="fraction">
      <span class="numerator">{{ numerator }}</span>
      <span class="fraction-line"></span>
      <span class="denominator">{{ denominator }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  numerator: { type: Number, required: true },
  denominator: { type: Number, required: true }
})
</script>

<style scoped>
.fraction-display {
  display: inline-block;
}

.fraction {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f5f5f5;
  padding: 10px 20px;
  border-radius: 12px;
}

.numerator, .denominator {
  font-size: 28px;
  color: #333;
}

.fraction-line {
  width: 100%;
  height: 3px;
  background: #333;
  margin: 5px 0;
}

@media (max-width: 500px) {
  .fraction {
    padding: 8px 14px;
  }

  .numerator, .denominator {
    font-size: 20px;
  }
}
</style>
