import { createPinia } from 'pinia'

const pinia = createPinia()

// Stores that should be persisted per-user
const userSpecificStores = ['user', 'progress', 'stats', 'stickers', 'coins', 'wrongQuestions']

// Stores that are global (not per-user)
const globalStores = ['locale', 'game']

// Get current profile ID from profiles store data
function getCurrentProfileId() {
  const profilesData = localStorage.getItem('mathGame_profiles')
  if (profilesData) {
    try {
      const data = JSON.parse(profilesData)
      return data.currentProfileId
    } catch (e) {
      return null
    }
  }
  return null
}

// Persist state to localStorage
pinia.use(({ store }) => {
  const storeId = store.$id

  // Profiles store has its own special persistence
  if (storeId === 'profiles') {
    // Load initial state
    const saved = localStorage.getItem('mathGame_profiles')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        store.$patch({
          profiles: data.profiles || [],
          currentProfileId: data.currentProfileId || null
        })
      } catch (e) {
        console.warn('Failed to load profiles:', e)
      }
    }

    // Save on changes
    store.$subscribe((mutation, state) => {
      localStorage.setItem('mathGame_profiles', JSON.stringify({
        profiles: state.profiles,
        currentProfileId: state.currentProfileId
      }))
    })
    return
  }

  // For user-specific stores, use profile ID in key
  if (userSpecificStores.includes(storeId)) {
    const profileId = getCurrentProfileId()
    const key = profileId ? `mathGame_${profileId}_${storeId}` : `mathGame_${storeId}`

    // Load initial state
    const savedState = localStorage.getItem(key)
    if (savedState) {
      try {
        store.$patch(JSON.parse(savedState))
      } catch (e) {
        console.warn(`Failed to load state for ${storeId}:`, e)
      }
    }

    // For user store, sync from profiles if no saved state exists
    if (storeId === 'user' && profileId) {
      const currentState = store.$state
      // If username/gender is null, try to get from profiles
      if (!currentState.username || !currentState.gender) {
        const profilesData = localStorage.getItem('mathGame_profiles')
        if (profilesData) {
          try {
            const data = JSON.parse(profilesData)
            const profile = data.profiles?.find(p => p.id === profileId)
            if (profile) {
              store.$patch({
                username: profile.name || currentState.username,
                gender: profile.gender || currentState.gender,
                createdAt: profile.createdAt || currentState.createdAt
              })
            }
          } catch (e) {
            console.warn('Failed to sync user from profiles:', e)
          }
        }
      }
    }

    // Save on changes
    store.$subscribe((mutation, state) => {
      const currentProfileId = getCurrentProfileId()
      const saveKey = currentProfileId ? `mathGame_${currentProfileId}_${storeId}` : `mathGame_${storeId}`
      localStorage.setItem(saveKey, JSON.stringify(state))
    })
    return
  }

  // For global stores, use simple key
  const key = `mathGame_${storeId}`

  const savedState = localStorage.getItem(key)
  if (savedState) {
    try {
      store.$patch(JSON.parse(savedState))
    } catch (e) {
      console.warn(`Failed to load state for ${storeId}:`, e)
    }
  }

  store.$subscribe((mutation, state) => {
    localStorage.setItem(key, JSON.stringify(state))
  })
})

// Helper function to reload user-specific stores when switching profiles
export function reloadUserStores(profileId) {
  userSpecificStores.forEach(storeId => {
    const key = profileId ? `mathGame_${profileId}_${storeId}` : `mathGame_${storeId}`
    const savedState = localStorage.getItem(key)

    // Get the store instance
    const store = pinia.state.value[storeId]
    if (store) {
      // Reset to default state first
      const storeInstance = pinia._s.get(storeId)
      if (storeInstance && storeInstance.reset) {
        storeInstance.reset()
      }

      // Then load saved state if exists
      if (savedState) {
        try {
          storeInstance.$patch(JSON.parse(savedState))
        } catch (e) {
          console.warn(`Failed to reload state for ${storeId}:`, e)
        }
      }
    }
  })
}

export default pinia
