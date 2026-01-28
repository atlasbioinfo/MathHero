<template>
  <div v-if="theme" class="theme-particles" :class="theme.id">
    <!-- Particles for all themes -->
    <span
      v-for="particle in particles"
      :key="particle.id"
      class="particle"
      :class="[`particle-${particle.type}`, theme.id]"
      :style="particle.style"
    >
      {{ particle.emoji }}
    </span>

    <!-- Special effects for specific themes -->
    <!-- Ocean: Waves at bottom -->
    <div v-if="theme.id === 'bg_ocean'" class="ocean-waves">
      <div class="wave wave-1"></div>
      <div class="wave wave-2"></div>
      <div class="wave wave-3"></div>
    </div>

    <!-- Ocean: Bubbles -->
    <div v-if="theme.id === 'bg_ocean'" class="bubbles">
      <span v-for="i in 15" :key="'bubble-'+i" class="bubble" :style="getBubbleStyle(i)"></span>
    </div>

    <!-- Space/Galaxy: Twinkling stars background -->
    <div v-if="theme.id === 'bg_space' || theme.id === 'bg_galaxy'" class="stars-container">
      <span v-for="i in 30" :key="'star-'+i" class="star" :style="getStarStyle(i)"></span>
    </div>

    <!-- Aurora: Northern lights effect -->
    <div v-if="theme.id === 'bg_aurora'" class="aurora-container">
      <div class="aurora aurora-1"></div>
      <div class="aurora aurora-2"></div>
      <div class="aurora aurora-3"></div>
    </div>

    <!-- Forest: Fireflies -->
    <div v-if="theme.id === 'bg_forest'" class="fireflies">
      <span v-for="i in 12" :key="'firefly-'+i" class="firefly" :style="getFireflyStyle(i)"></span>
    </div>

    <!-- Sakura/Candy: Extra falling petals -->
    <div v-if="theme.id === 'bg_sakura' || theme.id === 'bg_candy'" class="falling-items">
      <span
        v-for="i in 20"
        :key="'fall-'+i"
        class="falling-item"
        :style="getFallingStyle(i)"
      >
        {{ theme.id === 'bg_sakura' ? (i % 3 === 0 ? '🌸' : '💮') : (i % 2 === 0 ? '🍬' : '🍭') }}
      </span>
    </div>

    <!-- Sunset: Floating clouds -->
    <div v-if="theme.id === 'bg_sunset'" class="clouds">
      <span v-for="i in 5" :key="'cloud-'+i" class="cloud" :style="getCloudStyle(i)">☁️</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useCoinsStore } from '../stores/coins'
import { backgroundThemes } from '../config/shop'

const coinsStore = useCoinsStore()

const theme = computed(() => {
  if (!coinsStore.equippedBackground) return null
  return backgroundThemes.find(bg => bg.id === coinsStore.equippedBackground)
})

const particles = ref([])

function generateParticles() {
  if (!theme.value) {
    particles.value = []
    return
  }

  const items = []
  const themeParticles = theme.value.particles || []
  const count = getParticleCount(theme.value.id)

  for (let i = 0; i < count; i++) {
    const emoji = themeParticles[i % themeParticles.length]
    items.push({
      id: i,
      emoji,
      type: getParticleType(theme.value.id, i),
      style: getParticleStyle(theme.value.id, i)
    })
  }

  particles.value = items
}

function getParticleCount(themeId) {
  const counts = {
    'bg_space': 15,
    'bg_ocean': 12,
    'bg_forest': 10,
    'bg_candy': 12,
    'bg_sunset': 8,
    'bg_aurora': 10,
    'bg_sakura': 12,
    'bg_galaxy': 15
  }
  return counts[themeId] || 10
}

function getParticleType(themeId, index) {
  // Different particle behaviors based on theme
  const types = {
    'bg_space': 'twinkle',
    'bg_ocean': index % 3 === 0 ? 'swim' : 'drift',
    'bg_forest': index % 2 === 0 ? 'fall' : 'flutter',
    'bg_candy': 'fall-spin',
    'bg_sunset': 'float',
    'bg_aurora': 'shimmer',
    'bg_sakura': 'fall-sway',
    'bg_galaxy': 'twinkle'
  }
  return types[themeId] || 'float'
}

function getParticleStyle(themeId, index) {
  const baseDelay = (index * 0.8) % 10
  const baseDuration = 8 + (index % 5) * 2

  const baseStyle = {
    left: `${5 + (index * 7) % 90}%`,
    top: `${5 + (index * 11) % 85}%`,
    fontSize: `${20 + (index % 4) * 6}px`,
    animationDelay: `${baseDelay}s`,
    animationDuration: `${baseDuration}s`,
    opacity: 0.7 + (index % 3) * 0.1
  }

  // Theme-specific adjustments
  if (themeId === 'bg_ocean') {
    baseStyle.top = `${20 + (index * 13) % 50}%`
  } else if (themeId === 'bg_forest') {
    baseStyle.top = `${-5 - (index % 10) * 5}%`
  } else if (themeId === 'bg_sakura' || themeId === 'bg_candy') {
    baseStyle.top = `${-10 - (index % 8) * 8}%`
  }

  return baseStyle
}

function getBubbleStyle(index) {
  return {
    left: `${5 + (index * 6.5) % 90}%`,
    animationDelay: `${(index * 0.7) % 8}s`,
    animationDuration: `${4 + (index % 4) * 2}s`,
    '--size': `${6 + (index % 4) * 4}px`
  }
}

function getStarStyle(index) {
  return {
    left: `${(index * 3.3) % 100}%`,
    top: `${(index * 3.7) % 100}%`,
    animationDelay: `${(index * 0.3) % 5}s`,
    animationDuration: `${1 + (index % 3)}s`,
    '--size': `${2 + (index % 3)}px`
  }
}

function getFireflyStyle(index) {
  return {
    left: `${10 + (index * 7) % 80}%`,
    top: `${20 + (index * 8) % 60}%`,
    animationDelay: `${(index * 0.5) % 6}s`,
    animationDuration: `${3 + (index % 4)}s`
  }
}

function getFallingStyle(index) {
  return {
    left: `${(index * 5) % 100}%`,
    animationDelay: `${(index * 0.6) % 12}s`,
    animationDuration: `${8 + (index % 6) * 2}s`,
    fontSize: `${16 + (index % 4) * 4}px`
  }
}

function getCloudStyle(index) {
  return {
    top: `${10 + index * 15}%`,
    animationDelay: `${index * 3}s`,
    animationDuration: `${20 + index * 5}s`,
    fontSize: `${30 + index * 10}px`,
    opacity: 0.4 + index * 0.1
  }
}

watch(theme, generateParticles, { immediate: true })

onMounted(generateParticles)
</script>

<style scoped>
.theme-particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.particle {
  position: absolute;
  user-select: none;
  will-change: transform, opacity;
}

/* ========== OCEAN THEME ========== */
.particle.bg_ocean.particle-swim {
  animation: swimAround 12s infinite ease-in-out;
}

.particle.bg_ocean.particle-drift {
  animation: oceanDrift 15s infinite ease-in-out;
}

@keyframes swimAround {
  0%, 100% {
    transform: translateX(0) translateY(0) scaleX(1);
  }
  25% {
    transform: translateX(50px) translateY(-20px) scaleX(1);
  }
  50% {
    transform: translateX(100px) translateY(10px) scaleX(-1);
  }
  75% {
    transform: translateX(50px) translateY(-10px) scaleX(-1);
  }
}

@keyframes oceanDrift {
  0%, 100% {
    transform: translateX(0) translateY(0) rotate(0deg);
  }
  33% {
    transform: translateX(30px) translateY(-15px) rotate(10deg);
  }
  66% {
    transform: translateX(-20px) translateY(10px) rotate(-10deg);
  }
}

/* Ocean waves */
.ocean-waves {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  overflow: hidden;
}

.wave {
  position: absolute;
  bottom: 0;
  left: -50%;
  width: 200%;
  height: 100%;
  background: linear-gradient(transparent, rgba(144, 224, 239, 0.3));
  border-radius: 50% 50% 0 0;
  animation: waveMotion 8s infinite ease-in-out;
}

.wave-1 { animation-delay: 0s; opacity: 0.4; }
.wave-2 { animation-delay: -2s; opacity: 0.3; height: 80%; }
.wave-3 { animation-delay: -4s; opacity: 0.2; height: 60%; }

@keyframes waveMotion {
  0%, 100% { transform: translateX(0) translateY(0); }
  50% { transform: translateX(2%) translateY(-10px); }
}

/* Ocean bubbles */
.bubbles {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.bubble {
  position: absolute;
  bottom: -20px;
  width: var(--size, 8px);
  height: var(--size, 8px);
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.2));
  border-radius: 50%;
  animation: bubbleRise 6s infinite ease-in;
}

@keyframes bubbleRise {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-50vh) translateX(20px) scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: translateY(-100vh) translateX(-10px) scale(0.8);
    opacity: 0;
  }
}

/* ========== SPACE/GALAXY THEME ========== */
.particle.bg_space.particle-twinkle,
.particle.bg_galaxy.particle-twinkle {
  animation: twinkle 3s infinite ease-in-out, floatSlow 20s infinite ease-in-out;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}

@keyframes floatSlow {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-20px) translateX(15px); }
}

/* Stars */
.stars-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.star {
  position: absolute;
  width: var(--size, 3px);
  height: var(--size, 3px);
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 6px 2px rgba(255,255,255,0.5);
  animation: starTwinkle 2s infinite ease-in-out;
}

@keyframes starTwinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
}

/* ========== FOREST THEME ========== */
.particle.bg_forest.particle-fall {
  animation: leafFall 12s infinite linear;
}

.particle.bg_forest.particle-flutter {
  animation: butterflyFlutter 8s infinite ease-in-out;
}

@keyframes leafFall {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 0.8;
  }
  25% {
    transform: translateY(25vh) translateX(30px) rotate(90deg);
  }
  50% {
    transform: translateY(50vh) translateX(-20px) rotate(180deg);
  }
  75% {
    transform: translateY(75vh) translateX(40px) rotate(270deg);
  }
  100% {
    transform: translateY(110vh) translateX(10px) rotate(360deg);
    opacity: 0.3;
  }
}

@keyframes butterflyFlutter {
  0%, 100% {
    transform: translateY(0) translateX(0) rotate(0deg);
  }
  20% {
    transform: translateY(-30px) translateX(40px) rotate(10deg);
  }
  40% {
    transform: translateY(-10px) translateX(80px) rotate(-5deg);
  }
  60% {
    transform: translateY(-40px) translateX(50px) rotate(15deg);
  }
  80% {
    transform: translateY(-20px) translateX(20px) rotate(-10deg);
  }
}

/* Fireflies */
.fireflies {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.firefly {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #ffff88;
  border-radius: 50%;
  box-shadow: 0 0 10px 4px rgba(255, 255, 136, 0.6), 0 0 20px 8px rgba(255, 255, 136, 0.3);
  animation: fireflyGlow 4s infinite ease-in-out, fireflyMove 10s infinite ease-in-out;
}

@keyframes fireflyGlow {
  0%, 100% { opacity: 0.2; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

@keyframes fireflyMove {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(30px, -20px); }
  50% { transform: translate(-20px, -40px); }
  75% { transform: translate(40px, -10px); }
}

/* ========== CANDY THEME ========== */
.particle.bg_candy.particle-fall-spin {
  animation: candyFall 10s infinite linear;
}

@keyframes candyFall {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(1);
    opacity: 0.9;
  }
  100% {
    transform: translateY(120vh) translateX(50px) rotate(720deg) scale(0.8);
    opacity: 0.5;
  }
}

/* ========== SUNSET THEME ========== */
.particle.bg_sunset.particle-float {
  animation: sunsetFloat 15s infinite ease-in-out;
}

@keyframes sunsetFloat {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-30px) translateX(40px);
    opacity: 0.9;
  }
}

/* Clouds */
.clouds {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.cloud {
  position: absolute;
  left: -100px;
  animation: cloudDrift 30s infinite linear;
  filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.1));
}

@keyframes cloudDrift {
  0% { transform: translateX(-100px); }
  100% { transform: translateX(calc(100vw + 100px)); }
}

/* ========== AURORA THEME ========== */
.particle.bg_aurora.particle-shimmer {
  animation: auroraShimmer 5s infinite ease-in-out, floatSlow 20s infinite ease-in-out;
}

@keyframes auroraShimmer {
  0%, 100% { opacity: 0.4; filter: brightness(1); }
  50% { opacity: 1; filter: brightness(1.5); }
}

/* Aurora lights */
.aurora-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60%;
  overflow: hidden;
}

.aurora {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(28, 181, 224, 0.15) 20%,
    rgba(100, 255, 218, 0.2) 40%,
    rgba(155, 89, 182, 0.15) 60%,
    transparent 80%
  );
  animation: auroraSway 15s infinite ease-in-out;
  transform-origin: center top;
}

.aurora-1 { animation-delay: 0s; }
.aurora-2 { animation-delay: -5s; opacity: 0.7; }
.aurora-3 { animation-delay: -10s; opacity: 0.5; }

@keyframes auroraSway {
  0%, 100% {
    transform: skewX(0deg) translateX(0);
  }
  25% {
    transform: skewX(5deg) translateX(5%);
  }
  75% {
    transform: skewX(-5deg) translateX(-5%);
  }
}

/* ========== SAKURA THEME ========== */
.particle.bg_sakura.particle-fall-sway {
  animation: sakuraFall 12s infinite linear;
}

@keyframes sakuraFall {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 0.9;
  }
  25% {
    transform: translateY(25vh) translateX(30px) rotate(45deg);
  }
  50% {
    transform: translateY(50vh) translateX(-20px) rotate(90deg);
  }
  75% {
    transform: translateY(75vh) translateX(40px) rotate(135deg);
  }
  100% {
    transform: translateY(110vh) translateX(10px) rotate(180deg);
    opacity: 0.4;
  }
}

/* Falling items (sakura petals, candy) */
.falling-items {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.falling-item {
  position: absolute;
  top: -50px;
  animation: fallingItem 12s infinite linear;
}

@keyframes fallingItem {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
    opacity: 0.8;
  }
  25% {
    transform: translateY(25vh) translateX(40px) rotate(90deg);
  }
  50% {
    transform: translateY(50vh) translateX(-30px) rotate(180deg);
  }
  75% {
    transform: translateY(75vh) translateX(50px) rotate(270deg);
  }
  100% {
    transform: translateY(calc(100vh + 50px)) translateX(0) rotate(360deg);
    opacity: 0.3;
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .particle,
  .wave,
  .bubble,
  .star,
  .firefly,
  .cloud,
  .aurora,
  .falling-item {
    animation: none !important;
  }
}

/* Performance optimization for mobile */
@media (max-width: 768px) {
  .stars-container .star:nth-child(n+15),
  .bubbles .bubble:nth-child(n+8),
  .fireflies .firefly:nth-child(n+6),
  .falling-items .falling-item:nth-child(n+10) {
    display: none;
  }
}
</style>
