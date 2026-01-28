<template>
  <div class="fraction-input">
    <n-input-number
      :value="modelValue.numerator"
      @update:value="updateNumerator"
      :show-button="false"
      placeholder="↑"
      size="large"
      class="fraction-input-field"
      @keyup.enter="$emit('submit')"
      ref="numeratorInput"
    />
    <div class="fraction-input-line"></div>
    <n-input-number
      :value="modelValue.denominator"
      @update:value="updateDenominator"
      :show-button="false"
      placeholder="↓"
      size="large"
      class="fraction-input-field"
      @keyup.enter="$emit('submit')"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { NInputNumber } from 'naive-ui'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ numerator: null, denominator: null })
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const numeratorInput = ref(null)

function updateNumerator(val) {
  emit('update:modelValue', { ...props.modelValue, numerator: val })
}

function updateDenominator(val) {
  emit('update:modelValue', { ...props.modelValue, denominator: val })
}

function focus() {
  const input = numeratorInput.value?.$el?.querySelector('input')
  if (input) {
    input.focus()
    input.select()
  }
}

defineExpose({ focus })
</script>

<style scoped>
.fraction-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.fraction-input-field {
  width: 100px;
}

.fraction-input-field :deep(.n-input) {
  font-size: 20px !important;
  text-align: center;
}

.fraction-input-field :deep(.n-input__input-el) {
  text-align: center !important;
}

.fraction-input-line {
  width: 80px;
  height: 3px;
  background: var(--primary-color, #FF69B4);
}

@media (max-width: 500px) {
  .fraction-input-field {
    width: 80px;
  }

  .fraction-input-field :deep(.n-input) {
    font-size: 18px !important;
  }

  .fraction-input-line {
    width: 60px;
  }
}
</style>
