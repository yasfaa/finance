<template>
  <div 
    class="brand-logo" 
    :class="[
      `size-${size}`, 
      { 'layout-vertical': layout === 'vertical', 'layout-horizontal': layout === 'horizontal' }
    ]"
  >
    <!-- Vector Emblem Mark -->
    <div class="logo-mark" :style="{ width: `${markSize}px`, height: `${markSize}px` }">
      <svg 
        :width="markSize" 
        :height="markSize" 
        viewBox="0 0 64 64" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        class="logo-svg"
      >
        <defs>
          <linearGradient id="logoShieldGrad" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#1e40af" />
            <stop offset="100%" stop-color="#1d4ed8" />
          </linearGradient>
          <linearGradient id="logoAccentGrad" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#60a5fa" />
            <stop offset="100%" stop-color="#38bdf8" />
          </linearGradient>
          <filter id="logoShadow" x="0" y="2" width="64" height="62" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#0f172a" flood-opacity="0.2" />
          </filter>
        </defs>

        <!-- Protective Corporate Shield -->
        <path 
          d="M32 4L10 13.5V29.5C10 43.8 19.4 55.4 32 59.5C44.6 55.4 54 43.8 54 29.5V13.5L32 4Z" 
          fill="url(#logoShieldGrad)" 
          filter="url(#logoShadow)"
        />
        
        <!-- Subtle Inner Contour Line -->
        <path 
          d="M32 7.5L13.5 15.5V29.5C13.5 41.8 21.4 52 32 55.5C42.6 52 50.5 41.8 50.5 29.5V15.5L32 7.5Z" 
          stroke="#ffffff" 
          stroke-opacity="0.2" 
          stroke-width="1.5" 
          fill="none"
        />

        <!-- Automotive Velocity Chevron & Financial Stability Wings -->
        <path d="M22 22L32 16L42 22L32 28L22 22Z" fill="#ffffff" fill-opacity="0.95" />
        <path d="M22 30L32 24L42 30L32 36L22 30Z" fill="url(#logoAccentGrad)" />

        <!-- Center Node & Baseline Anchor -->
        <circle cx="32" cy="42" r="3.5" fill="#ffffff" />
        <path d="M28 42H36" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </div>

    <!-- Typography Brand Label -->
    <div v-if="showText" class="logo-text">
      <div class="logo-title-row">
        <span class="company-name">PT. JKL</span>
        <span class="product-badge">AutoCredit</span>
      </div>
      <p v-if="subtitle" class="logo-subtitle">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  layout?: 'horizontal' | 'vertical'
  showText?: boolean
  subtitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  layout: 'horizontal',
  showText: true,
  subtitle: 'Sistem Digitalisasi Penerimaan Kredit Kendaraan'
})

const markSize = computed(() => {
  switch (props.size) {
    case 'sm': return 30
    case 'md': return 38
    case 'lg': return 52
    case 'xl': return 68
    default: return 38
  }
})
</script>

<style scoped>
.brand-logo {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  user-select: none;
}

.brand-logo.layout-horizontal {
  flex-direction: row;
  gap: 0.75rem;
}

.brand-logo.layout-vertical {
  flex-direction: column;
  text-align: center;
  gap: 0.65rem;
}

.logo-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-svg {
  display: block;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  line-height: 1.2;
}

.layout-vertical .logo-title-row {
  justify-content: center;
}

.company-name {
  font-weight: 800;
  color: var(--primary);
  letter-spacing: -0.02em;
}

.product-badge {
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.logo-subtitle {
  font-size: 0.72rem;
  color: var(--text-secondary);
  margin-top: 0.15rem;
  font-weight: 400;
  line-height: 1.3;
}

/* Sizing Adjustments */
.size-sm .company-name,
.size-sm .product-badge {
  font-size: 1rem;
}
.size-sm .logo-subtitle {
  font-size: 0.68rem;
}

.size-md .company-name,
.size-md .product-badge {
  font-size: 1.15rem;
}
.size-md .logo-subtitle {
  font-size: 0.73rem;
}

.size-lg .company-name,
.size-lg .product-badge {
  font-size: 1.45rem;
}
.size-lg .logo-subtitle {
  font-size: 0.82rem;
}

.size-xl .company-name,
.size-xl .product-badge {
  font-size: 1.75rem;
}
.size-xl .logo-subtitle {
  font-size: 0.9rem;
}
</style>
