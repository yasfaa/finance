<!-- Main Application Layout -->
<template>
  <div class="app-root">
    <!-- Splash Screen (shown after login) -->
    <SplashScreen v-if="showSplash" @done="hideSplash" />

    <!-- Initial Auth Session Loading State -->
    <div v-else-if="!isInitialized" class="auth-loading">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="auth-spinner">
        <circle cx="12" cy="12" r="10" stroke-dasharray="31.4 31.4" stroke-dashoffset="8" />
      </svg>
    </div>

    <!-- Main Content -->
    <div v-else class="app-content">
      <CommonAppHeader v-if="isAuthenticated && route.path !== '/login'" />
      <main>
        <NuxtPage />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import CommonAppHeader from '@/components/common/AppHeader.vue'
import SplashScreen from '@/components/splash/SplashScreen.vue'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { isAuthenticated, isInitialized, showSplash, checkSession } = useAuth()

// Check session on mount
onMounted(() => {
  checkSession()

  // Guard initial route
  if (!isAuthenticated.value && route.path !== '/login') {
    router.replace('/login')
  } else if (isAuthenticated.value && route.path === '/login') {
    router.replace('/')
  }
})

// Route guard watcher for subsequent route changes
watch(
  [() => route.path, isAuthenticated, isInitialized],
  ([newPath, authed, initialized]) => {
    if (!initialized) return

    if (!authed && newPath !== '/login') {
      router.replace('/login')
    } else if (authed && newPath === '/login') {
      router.replace('/')
    }
  }
)

// Hide splash screen
const hideSplash = () => {
  showSplash.value = false
}
</script>

<style scoped>
.app-root {
  min-height: 100vh;
}

.auth-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--bg-app);
}

.auth-spinner {
  color: var(--primary);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>