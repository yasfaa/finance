<!-- Login Page -->
<!-- Simple login form with auto-redirect to splash screen on success -->
<template>
  <div class="login-page">
    <!-- Background Pattern -->
    <div class="login-bg" />

    <!-- Login Card -->
    <div class="login-card">
      <!-- Login Header with Official Brand Logo -->
      <div class="login-header">
        <CommonAppLogo size="lg" layout="vertical" subtitle="Sistem Digitalisasi Penerimaan Kredit Kendaraan" />
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="username" class="form-label">Username / Email</label>
          <input
            id="username"
            v-model="formData.username"
            type="text"
            placeholder="budi.santoso@ntj.com"
            :class="{ 'has-error': errors.username }"
            autocomplete="username"
          />
          <span v-if="errors.username" class="form-error">{{ errors.username }}</span>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            placeholder="••••••••"
            :class="{ 'has-error': errors.password }"
            autocomplete="current-password"
          />
          <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="btn btn-primary btn-full" :disabled="isSubmitting">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
          <span v-if="!isSubmitting">Login</span>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spinner">
            <circle cx="12" cy="12" r="10" stroke-dasharray="31.4 31.4" stroke-dashoffset="8" />
          </svg>
        </button>

        <!-- Demo Login Hint -->
        <div class="login-hint">
          <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem;">
            For demo purposes, use any credentials
          </p>
          <button type="button" class="btn btn-ghost btn-sm" @click="fillDemoCredentials">
            Use Demo Credentials
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="login-error-message">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {{ errorMessage }}
        </div>
      </form>

      <!-- Footer -->
      <div class="login-footer">
        <p style="font-size: 0.7rem; color: var(--text-muted); text-align: center;">
          © 2026 PT. JKL AutoCredit. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login, isLoading, showSplash, isAuthenticated } = useAuth()

// Auto-redirect if already logged in
onMounted(() => {
  if (isAuthenticated.value) {
    router.replace('/')
  }
})

// Form State
const formData = ref({
  username: '',
  password: ''
})

const errors = ref({
  username: '',
  password: ''
})

const errorMessage = ref('')
const isSubmitting = ref(false)

// Validation
function validate() {
  let valid = true

  if (!formData.value.username.trim()) {
    errors.value.username = 'Username tidak boleh kosong'
    valid = false
  } else {
    errors.value.username = ''
  }

  if (!formData.value.password) {
    errors.value.password = 'Password tidak boleh kosong'
    valid = false
  } else {
    errors.value.password = ''
  }

  return valid
}

// Handle form submission
async function handleSubmit() {
  errorMessage.value = ''

  if (!validate()) {
    return
  }

  isSubmitting.value = true

  try {
    await login(formData.value.username, formData.value.password)
    showSplash.value = true
    await router.push('/')
  } catch (error: any) {
    errorMessage.value = error.message || 'Gagal login. Sila coba lagi.'
  } finally {
    isSubmitting.value = false
  }
}

// Fill demo credentials
function fillDemoCredentials() {
  formData.value.username = 'budi.santoso'
  formData.value.password = 'password123'
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  background-color: var(--bg-app);
}

/* Background: Subtle corporate grid pattern (Calm Enterprise, no neon gradient slop) */
.login-bg {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--border-strong) 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.35;
  pointer-events: none;
}

/* Card Container */
.login-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 2.5rem;
  width: 100%;
  max-width: 440px;
  box-shadow: var(--shadow-modal);
  position: relative;
  z-index: 1;
}

/* Header */
.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-secondary);
}

input[type="text"],
input[type="password"] {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  color: var(--text-primary);
  background-color: var(--bg-surface);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  font-family: inherit;
}

input[type="text"]:focus,
input[type="password"]:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

input.has-error {
  border-color: var(--status-rejected-border);
}

.form-error {
  font-size: 0.72rem;
  color: var(--status-rejected-text);
  font-weight: 500;
}

/* Buttons */
.btn-full {
  width: 100%;
  padding: 0.85rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-ghost {
  background-color: transparent;
  border: none;
  color: var(--primary);
  padding: 0.4rem 0.75rem;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background-color: var(--primary-light);
}

/* Spinner */
.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Hint */
.login-hint {
  text-align: center;
  margin-top: 0.5rem;
}

/* Semantic Status Error Message */
.login-error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: var(--status-rejected-bg);
  border: 1px solid var(--status-rejected-border);
  border-radius: var(--radius-sm);
  color: var(--status-rejected-text);
  font-size: 0.82rem;
  font-weight: 500;
}

/* Footer */
.login-footer {
  margin-top: 1.5rem;
}
</style>