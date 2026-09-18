<template>
  <header class="app-header">
    <div class="header-inner">
      <NuxtLink to="/" class="brand-link" style="text-decoration: none;">
        <CommonAppLogo size="sm" subtitle="Sistem Digitalisasi Penerimaan Kredit" />
      </NuxtLink>

      <nav class="nav-links">
        <NuxtLink 
          to="/" 
          class="nav-item" 
          :class="{ active: currentRoute === '/' }"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
          Modul 1: Form Pengajuan (Marketing)
        </NuxtLink>

        <NuxtLink 
          to="/approval" 
          class="nav-item"
          :class="{ active: currentRoute.startsWith('/approval') }"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 11l3 3L22 4"></path>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
          Modul 2: Dashboard Approval (Atasan)
          <span v-if="pendingCount > 0" class="badge badge-pending" style="padding: 0.15rem 0.4rem; font-size: 0.7rem;">
            {{ pendingCount }}
          </span>
        </NuxtLink>
      </nav>

      <div class="user-profile-badge">
        <div style="display: flex; flex-direction: column; text-align: right;">
          <strong style="font-size: 0.82rem; color: var(--text-primary);">{{ user?.username || 'Budi Santoso' }}</strong>
          <span style="font-size: 0.72rem; color: var(--text-muted);">PT Nusantara Jaya Motor</span>
        </div>
        <span class="user-role">{{ user?.role || 'Marketing' }}</span>
        <button 
          type="button" 
          class="btn-logout" 
          title="Keluar dari sistem" 
          @click="handleLogout"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useApplications } from '@/composables/useApplications'

const route = useRoute()
const router = useRouter()
const currentRoute = computed(() => route.path)

const { user, logout } = useAuth()
const { applications } = useApplications()

const pendingCount = computed(() => {
  return applications.value.filter(app => app.status === 'PENDING_APPROVAL').length
})

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>

<style scoped>
.btn-logout {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-left: 0.5rem;
  padding: 0.3rem 0.65rem;
  background-color: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-logout:hover {
  background-color: #fee2e2;
  border-color: #fca5a5;
  color: #dc2626;
}
</style>
