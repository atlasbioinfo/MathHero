/**
 * Play time tracking store for screen time management
 * @module stores/playTime
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePlayTimeStore = defineStore('playTime', () => {
  // Settings
  const dailyLimitMinutes = ref(15) // Default 15 minutes
  const isLimitEnabled = ref(true)

  // Tracking
  const todayPlayTimeSeconds = ref(0)
  const lastPlayDate = ref(null)
  const isPlaying = ref(false)
  const sessionStartTime = ref(null)

  // Computed
  const today = computed(() => new Date().toISOString().split('T')[0])

  const todayPlayTimeMinutes = computed(() =>
    Math.floor(todayPlayTimeSeconds.value / 60)
  )

  const remainingMinutes = computed(() =>
    Math.max(0, dailyLimitMinutes.value - todayPlayTimeMinutes.value)
  )

  const isLimitReached = computed(() =>
    isLimitEnabled.value && todayPlayTimeMinutes.value >= dailyLimitMinutes.value
  )

  const progressPercent = computed(() =>
    Math.min(100, (todayPlayTimeMinutes.value / dailyLimitMinutes.value) * 100)
  )

  // Initialize from localStorage
  function init() {
    const saved = localStorage.getItem('mathGame_playTime')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        dailyLimitMinutes.value = data.dailyLimitMinutes ?? 15
        isLimitEnabled.value = data.isLimitEnabled ?? true
        lastPlayDate.value = data.lastPlayDate

        // Reset if it's a new day
        if (lastPlayDate.value === today.value) {
          todayPlayTimeSeconds.value = data.todayPlayTimeSeconds ?? 0
        } else {
          todayPlayTimeSeconds.value = 0
        }
      } catch (e) {
        console.error('Failed to load play time data:', e)
      }
    }
  }

  // Save to localStorage
  function save() {
    localStorage.setItem('mathGame_playTime', JSON.stringify({
      dailyLimitMinutes: dailyLimitMinutes.value,
      isLimitEnabled: isLimitEnabled.value,
      todayPlayTimeSeconds: todayPlayTimeSeconds.value,
      lastPlayDate: today.value
    }))
  }

  // Start tracking play time
  function startPlaying() {
    // Check if it's a new day
    if (lastPlayDate.value !== today.value) {
      todayPlayTimeSeconds.value = 0
      lastPlayDate.value = today.value
    }

    isPlaying.value = true
    sessionStartTime.value = Date.now()
  }

  // Stop tracking and add elapsed time
  function stopPlaying() {
    if (isPlaying.value && sessionStartTime.value) {
      const elapsed = Math.floor((Date.now() - sessionStartTime.value) / 1000)
      todayPlayTimeSeconds.value += elapsed
      lastPlayDate.value = today.value
      save()
    }
    isPlaying.value = false
    sessionStartTime.value = null
  }

  // Add time manually (called periodically during gameplay)
  function addPlayTime(seconds) {
    if (lastPlayDate.value !== today.value) {
      todayPlayTimeSeconds.value = 0
      lastPlayDate.value = today.value
    }
    todayPlayTimeSeconds.value += seconds
    save()
  }

  // Update settings
  function setDailyLimit(minutes) {
    dailyLimitMinutes.value = Math.max(5, Math.min(60, minutes))
    save()
  }

  function setLimitEnabled(enabled) {
    isLimitEnabled.value = enabled
    save()
  }

  // Reset daily time (for testing or manual reset)
  function resetDailyTime() {
    todayPlayTimeSeconds.value = 0
    lastPlayDate.value = today.value
    save()
  }

  // Format time for display
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Initialize on creation
  init()

  return {
    // State
    dailyLimitMinutes,
    isLimitEnabled,
    todayPlayTimeSeconds,
    isPlaying,
    // Computed
    todayPlayTimeMinutes,
    remainingMinutes,
    isLimitReached,
    progressPercent,
    // Actions
    startPlaying,
    stopPlaying,
    addPlayTime,
    setDailyLimit,
    setLimitEnabled,
    resetDailyTime,
    formatTime,
    init,
    save
  }
})
