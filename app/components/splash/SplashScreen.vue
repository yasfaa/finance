<!-- Splash Screen Component -->
<!-- Shows briefly after successful login, then navigates to main page -->
<template>
  <div class="splash-screen">
    <!-- Subtle Corporate Backdrop Pattern -->
    <div class="splash-bg" />

    <!-- Splash Card -->
    <div class="splash-card">
      <!-- Official Brand Logo -->
      <div class="splash-brand-wrapper">
        <CommonAppLogo 
          size="xl" 
          layout="vertical" 
          subtitle="Sistem Digitalisasi Penerimaan Kredit Kendaraan" 
        />
      </div>

      <!-- Linear Corporate Progress Bar -->
      <div class="splash-progress-container">
        <div class="splash-progress-bar" :style="{ width: `${progress}%` }" />
      </div>
      
      <div class="splash-status-row">
        <span class="splash-status-text">Menyiapkan Dashboard Operasional...</span>
        <span class="splash-status-percentage tabular-nums">{{ Math.round(progress) }}%</span>
      </div>

      <!-- Skip Button -->
      <div style="margin-top: 1.5rem;">
        <button type="button" class="btn-skip" @click="skipSplash">
          Lewati &rarr;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits<{
  (e: 'done'): void
}>()

const progress = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const skipSplash = () => {
  if (timer) clearInterval(timer)
  emit('done')
}

onMounted(() => {
  // Smooth corporate linear loading progress
  let current = 0
  timer = setInterval(() => {
    current += Math.random() * 25 + 15
    if (current >= 100) {
      current = 100
      if (timer) clearInterval(timer)
      progress.value = 100
      setTimeout(() => {
        emit('done')
      }, 250)
    } else {
      progress.value = current
    }
  }, 100)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.splash-screen {
  position: fixed;
  inset: 0;
  background-color: var(--bg-app);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1.5rem;
}

/* Subtle Corporate Pattern */
.splash-bg {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--border-strong) 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.35;
  pointer-events: none;
}

/* Splash Card */
.splash-card {
  position: relative;
  z-index: 2;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-modal);
  padding: 2.75rem 2.25rem;
  max-width: 460px;
  width: 100%;
  text-align: center;
}

.splash-brand-wrapper {
  margin-bottom: 2rem;
}

/* Progress Bar */
.splash-progress-container {
  width: 100%;
  height: 6px;
  background-color: var(--border-subtle);
  border-radius: var(--radius-sm);
  overflow: hidden;
  margin-bottom: 0.65rem;
}

.splash-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), #2563eb);
  border-radius: var(--radius-sm);
  transition: width 0.12s ease-out;
}

.splash-status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.splash-status-percentage {
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--primary);
}

/* Skip Action */
.btn-skip {
  background: transparent;
  border: 1px solid var(--border-strong);
  color: var(--text-secondary);
  font-size: 0.78rem;
  font-weight: 500;
  padding: 0.35rem 0.9rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-skip:hover {
  background-color: var(--bg-surface-hover);
  color: var(--text-primary);
  border-color: var(--border-focus);
}
</style>