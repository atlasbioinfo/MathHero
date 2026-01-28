<template>
  <div
    class="background-shop-card"
    :class="{
      owned: isOwned,
      equipped: isEquipped,
      affordable: canAfford && !isOwned
    }"
    @click="handleClick"
  >
    <div class="bg-preview" :class="bg.id" :style="{ background: bg.gradient }">
      <!-- Theme-specific effects -->
      <!-- Ocean: waves and bubbles -->
      <div v-if="bg.id === 'bg_ocean'" class="ocean-effect">
        <div class="wave"></div>
        <span v-for="i in 5" :key="'b'+i" class="mini-bubble" :style="{ left: (i * 18) + '%', animationDelay: (i * 0.3) + 's' }"></span>
      </div>

      <!-- Space/Galaxy: twinkling stars -->
      <div v-if="bg.id === 'bg_space' || bg.id === 'bg_galaxy'" class="stars-effect">
        <span v-for="i in 8" :key="'s'+i" class="mini-star" :style="{ left: (i * 12) + '%', top: (10 + (i * 10) % 70) + '%', animationDelay: (i * 0.2) + 's' }"></span>
      </div>

      <!-- Forest: fireflies -->
      <div v-if="bg.id === 'bg_forest'" class="forest-effect">
        <span v-for="i in 4" :key="'f'+i" class="mini-firefly" :style="{ left: (15 + i * 20) + '%', top: (20 + i * 15) + '%', animationDelay: (i * 0.5) + 's' }"></span>
      </div>

      <!-- Aurora: light bands -->
      <div v-if="bg.id === 'bg_aurora'" class="aurora-effect">
        <div class="aurora-band aurora-band-1"></div>
        <div class="aurora-band aurora-band-2"></div>
      </div>

      <!-- Sakura/Candy: falling items -->
      <div v-if="bg.id === 'bg_sakura' || bg.id === 'bg_candy'" class="falling-effect">
        <span v-for="i in 6" :key="'fall'+i" class="mini-fall" :style="{ left: (i * 15) + '%', animationDelay: (i * 0.4) + 's' }">
          {{ bg.id === 'bg_sakura' ? '🌸' : '🍬' }}
        </span>
      </div>

      <!-- Sunset: floating clouds -->
      <div v-if="bg.id === 'bg_sunset'" class="sunset-effect">
        <span class="mini-cloud mini-cloud-1">☁️</span>
        <span class="mini-cloud mini-cloud-2">☁️</span>
      </div>

      <div class="particles">
        <span
          v-for="(particle, i) in bg.particles.slice(0, 4)"
          :key="i"
          class="particle"
          :class="'particle-' + bg.id"
          :style="{ animationDelay: `${i * 0.5}s` }"
        >
          {{ particle }}
        </span>
      </div>
      <div class="preview-icon">{{ bg.preview }}</div>
    </div>

    <div class="bg-info">
      <div class="bg-name">{{ getBgName() }}</div>
      <div class="bg-desc">{{ getBgDesc() }}</div>
    </div>

    <div class="bg-action">
      <div v-if="isEquipped" class="equipped-badge">
        <span>✓</span> {{ t.shop.equipped }}
      </div>
      <div v-else-if="isOwned" class="owned-badge">
        {{ t.shop.tapToEquip }}
      </div>
      <div v-else class="price-badge" :class="{ unaffordable: !canAfford }">
        <CoinIcon :size="14" />
        {{ bg.price }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCoinsStore } from '../../stores/coins'
import { useLocaleStore } from '../../stores/locale'
import CoinIcon from '../CoinIcon.vue'

const props = defineProps({
  bg: { type: Object, required: true }
})

const emit = defineEmits(['purchase', 'equip'])

const coinsStore = useCoinsStore()
const localeStore = useLocaleStore()

const t = computed(() => localeStore.t)
const canAfford = computed(() => coinsStore.canAfford(props.bg.price))
const isOwned = computed(() => coinsStore.hasPurchasedItem(props.bg.id))
const isEquipped = computed(() => coinsStore.equippedBackground === props.bg.id)

function getBgName() {
  return t.value.shop.backgrounds[props.bg.nameKey] || props.bg.nameKey
}

function getBgDesc() {
  return t.value.shop.backgrounds[props.bg.description] || ''
}

function handleClick() {
  if (isOwned.value) {
    emit('equip', props.bg)
  } else if (canAfford.value) {
    emit('purchase', props.bg)
  }
}
</script>

<style scoped>
.background-shop-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid #f0f0f0;
  transition: all 0.3s;
  cursor: default;
}

.background-shop-card.affordable,
.background-shop-card.owned {
  cursor: pointer;
}

.background-shop-card.affordable {
  border-color: var(--secondary-color, #FFB6C1);
}

.background-shop-card.affordable:hover,
.background-shop-card.owned:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.background-shop-card.affordable:hover {
  border-color: var(--primary-color, #FF69B4);
}

.background-shop-card.equipped {
  border-color: #81C784;
  border-width: 3px;
}

.bg-preview {
  height: 100px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  font-size: 16px;
  opacity: 0.7;
  animation: float 3s ease-in-out infinite;
}

.particle:nth-child(1) { top: 20%; left: 15%; }
.particle:nth-child(2) { top: 60%; left: 75%; }
.particle:nth-child(3) { top: 30%; left: 80%; }
.particle:nth-child(4) { top: 70%; left: 25%; }

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(10deg); }
}

/* Ocean theme particles swim */
.particle-bg_ocean {
  animation: swim 3s ease-in-out infinite !important;
}

@keyframes swim {
  0%, 100% { transform: translateX(0) translateY(0) scaleX(1); }
  50% { transform: translateX(15px) translateY(-5px) scaleX(-1); }
}

/* Space/Galaxy theme particles twinkle */
.particle-bg_space,
.particle-bg_galaxy {
  animation: twinkle 2s ease-in-out infinite !important;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

/* Forest theme particles flutter */
.particle-bg_forest {
  animation: flutter 3s ease-in-out infinite !important;
}

@keyframes flutter {
  0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
  25% { transform: translateY(-8px) translateX(5px) rotate(10deg); }
  75% { transform: translateY(-5px) translateX(-5px) rotate(-10deg); }
}

/* Sakura theme particles fall */
.particle-bg_sakura {
  animation: fall 4s linear infinite !important;
}

@keyframes fall {
  0% { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
  10% { opacity: 0.8; }
  100% { transform: translateY(30px) translateX(10px) rotate(180deg); opacity: 0.3; }
}

/* Candy theme particles spin-fall */
.particle-bg_candy {
  animation: spinFall 3s linear infinite !important;
}

@keyframes spinFall {
  0% { transform: translateY(-15px) rotate(0deg); opacity: 0; }
  10% { opacity: 0.8; }
  100% { transform: translateY(25px) rotate(360deg); opacity: 0.4; }
}

/* Aurora theme particles shimmer */
.particle-bg_aurora {
  animation: shimmer 3s ease-in-out infinite !important;
}

@keyframes shimmer {
  0%, 100% { opacity: 0.4; filter: brightness(1); }
  50% { opacity: 1; filter: brightness(1.5); }
}

/* ========== OCEAN EFFECTS ========== */
.ocean-effect {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  overflow: hidden;
}

.ocean-effect .wave {
  position: absolute;
  bottom: 0;
  left: -50%;
  width: 200%;
  height: 25px;
  background: linear-gradient(transparent, rgba(144, 224, 239, 0.4));
  border-radius: 50% 50% 0 0;
  animation: waveMove 3s infinite ease-in-out;
}

@keyframes waveMove {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(3%); }
}

.mini-bubble {
  position: absolute;
  bottom: 5px;
  width: 6px;
  height: 6px;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.3));
  border-radius: 50%;
  animation: bubbleUp 2.5s infinite ease-in;
}

@keyframes bubbleUp {
  0% { transform: translateY(0) scale(1); opacity: 0.6; }
  100% { transform: translateY(-70px) scale(0.5); opacity: 0; }
}

/* ========== STARS EFFECTS ========== */
.stars-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.mini-star {
  position: absolute;
  width: 3px;
  height: 3px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 4px 1px rgba(255,255,255,0.6);
  animation: starBlink 1.5s infinite ease-in-out;
}

@keyframes starBlink {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.3); }
}

/* ========== FOREST EFFECTS ========== */
.forest-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.mini-firefly {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #ffff88;
  border-radius: 50%;
  box-shadow: 0 0 6px 2px rgba(255, 255, 136, 0.7);
  animation: fireflyBlink 2s infinite ease-in-out, fireflyFloat 4s infinite ease-in-out;
}

@keyframes fireflyBlink {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

@keyframes fireflyFloat {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(8px, -8px); }
}

/* ========== AURORA EFFECTS ========== */
.aurora-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60%;
  overflow: hidden;
}

.aurora-band {
  position: absolute;
  top: 0;
  left: -20%;
  width: 140%;
  height: 100%;
  background: linear-gradient(180deg, transparent 0%, rgba(100, 255, 218, 0.2) 50%, transparent 100%);
  animation: auroraSway 4s infinite ease-in-out;
}

.aurora-band-2 {
  background: linear-gradient(180deg, transparent 0%, rgba(155, 89, 182, 0.15) 50%, transparent 100%);
  animation-delay: -2s;
}

@keyframes auroraSway {
  0%, 100% { transform: skewX(0deg) translateX(0); }
  50% { transform: skewX(5deg) translateX(5%); }
}

/* ========== FALLING EFFECTS (Sakura/Candy) ========== */
.falling-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.mini-fall {
  position: absolute;
  top: -10px;
  font-size: 10px;
  animation: miniFall 3s infinite linear;
}

@keyframes miniFall {
  0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
  10% { opacity: 0.8; }
  100% { transform: translateY(110px) translateX(15px) rotate(180deg); opacity: 0; }
}

/* ========== SUNSET EFFECTS ========== */
.sunset-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.mini-cloud {
  position: absolute;
  font-size: 16px;
  opacity: 0.5;
  animation: cloudMove 6s infinite linear;
}

.mini-cloud-1 { top: 15%; left: -20px; }
.mini-cloud-2 { top: 45%; left: -30px; animation-delay: -3s; font-size: 12px; opacity: 0.4; }

@keyframes cloudMove {
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(100% + 60px)); }
}

.preview-icon {
  font-size: 36px;
  z-index: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.bg-info {
  padding: 12px 16px;
}

.bg-name {
  font-size: 15px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.bg-desc {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.bg-action {
  padding: 0 16px 12px;
}

.equipped-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #81C784;
  color: white;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
}

.owned-badge {
  display: inline-block;
  background: var(--light-color, #FFF0F5);
  color: var(--primary-color, #FF69B4);
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.price-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #FFF9E6, #FFE4B5);
  border: 2px solid #FFD700;
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  color: #B8860B;
}

.price-badge.unaffordable {
  opacity: 0.5;
  border-color: #ccc;
  background: #f5f5f5;
  color: #999;
}

.coin-icon {
  font-size: 14px;
}

/* Mobile */
@media (max-width: 500px) {
  .bg-preview {
    height: 80px;
  }

  .particle {
    font-size: 14px;
  }

  .preview-icon {
    font-size: 28px;
  }

  .bg-info {
    padding: 10px 12px;
  }

  .bg-name {
    font-size: 13px;
  }

  .bg-desc {
    font-size: 11px;
  }

  .bg-action {
    padding: 0 12px 10px;
  }

  .price-badge,
  .owned-badge,
  .equipped-badge {
    font-size: 12px;
    padding: 5px 10px;
  }
}
</style>
