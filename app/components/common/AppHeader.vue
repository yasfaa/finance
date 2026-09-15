<template>
  <header class="app-header">
    <div class="header-inner">
      <NuxtLink to="/" class="brand-wrapper">
        <span class="brand-badge">PT. JKL</span>
        <div class="brand-info">
          <h1>AutoCredit Web Portal</h1>
          <span>Sistem Digitalisasi Penerimaan Kredit Kendaraan</span>
        </div>
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
          <strong style="font-size: 0.82rem; color: var(--text-primary);">Budi Santoso</strong>
          <span style="font-size: 0.72rem; color: var(--text-muted);">PT Nusantara Jaya Motor</span>
        </div>
        <span class="user-role">Marketing</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const currentRoute = computed(() => route.path)

const { applications } = useApplications()
const pendingCount = computed(() => {
  return applications.value.filter(app => app.status === 'PENDING_APPROVAL').length
})
</script>
