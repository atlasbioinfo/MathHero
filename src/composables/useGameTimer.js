import { onMounted, onUnmounted } from 'vue'

export function useGameTimer(gameStore, onTimeUp) {
  let timer = null

  function startTimer() {
    timer = setInterval(() => {
      gameStore.tick()
      if (gameStore.timeLeft <= 0) {
        onTimeUp()
      }
    }, 1000)
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  onMounted(() => {
    startTimer()
  })

  onUnmounted(() => {
    stopTimer()
  })

  return {
    startTimer,
    stopTimer
  }
}
