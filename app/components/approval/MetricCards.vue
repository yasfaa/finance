<template>
  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
    <!-- Metrik 1: Total Pengajuan -->
    <div class="card" style="padding: 1.1rem; margin-bottom: 0;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <span style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">
            Total Pengajuan
          </span>
          <div class="tabular-nums" style="font-size: 1.6rem; font-weight: 700; color: var(--text-primary); margin-top: 0.25rem;">
            {{ totalCount }}
          </div>
        </div>
        <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background-color: #f1f5f9; display: flex; align-items: center; justify-content: center; color: var(--text-secondary);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
        </div>
      </div>
      <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;">
        Seluruh berkas masuk dari sales
      </div>
    </div>

    <!-- Metrik 2: Menunggu Persetujuan (Pending) -->
    <div 
      class="card" 
      style="padding: 1.1rem; margin-bottom: 0; cursor: pointer; transition: border-color 150ms ease;"
      :style="activeFilter === 'PENDING_APPROVAL' ? 'border-color: #f59e0b; background-color: #fffdfa;' : ''"
      @click="emit('filter', 'PENDING_APPROVAL')"
    >
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <span style="font-size: 0.78rem; font-weight: 600; color: #b45309; text-transform: uppercase; letter-spacing: 0.5px;">
            Perlu Tindakan (Pending)
          </span>
          <div class="tabular-nums" style="font-size: 1.6rem; font-weight: 700; color: #b45309; margin-top: 0.25rem;">
            {{ pendingCount }}
          </div>
        </div>
        <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background-color: #fef3c7; display: flex; align-items: center; justify-content: center; color: #b45309;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
      </div>
      <div style="font-size: 0.75rem; color: #b45309; margin-top: 0.5rem; font-weight: 500;">
        Prioritas review Atasan Marketing
      </div>
    </div>

    <!-- Metrik 3: Disetujui (Approved) -->
    <div 
      class="card" 
      style="padding: 1.1rem; margin-bottom: 0; cursor: pointer; transition: border-color 150ms ease;"
      :style="activeFilter === 'APPROVED' ? 'border-color: #10b981; background-color: #f6fdf9;' : ''"
      @click="emit('filter', 'APPROVED')"
    >
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <span style="font-size: 0.78rem; font-weight: 600; color: #047857; text-transform: uppercase; letter-spacing: 0.5px;">
            Disetujui (Approved)
          </span>
          <div class="tabular-nums" style="font-size: 1.6rem; font-weight: 700; color: #047857; margin-top: 0.25rem;">
            {{ approvedCount }}
          </div>
        </div>
        <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background-color: #d1fae5; display: flex; align-items: center; justify-content: center; color: #047857;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
      </div>
      <div style="font-size: 0.75rem; color: #047857; margin-top: 0.5rem;">
        Siap cetak PO & Kontrak PDF
      </div>
    </div>

    <!-- Metrik 4: Ditolak / Revisi -->
    <div 
      class="card" 
      style="padding: 1.1rem; margin-bottom: 0; cursor: pointer; transition: border-color 150ms ease;"
      :style="activeFilter === 'REJECTED' ? 'border-color: #f43f5e; background-color: #fff8f9;' : ''"
      @click="emit('filter', 'REJECTED')"
    >
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <span style="font-size: 0.78rem; font-weight: 600; color: #b91c1c; text-transform: uppercase; letter-spacing: 0.5px;">
            Ditolak / Revisi
          </span>
          <div class="tabular-nums" style="font-size: 1.6rem; font-weight: 700; color: #b91c1c; margin-top: 0.25rem;">
            {{ rejectedOrReviseCount }}
          </div>
        </div>
        <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background-color: #ffe4e6; display: flex; align-items: center; justify-content: center; color: #b91c1c;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
      </div>
      <div style="font-size: 0.75rem; color: #b91c1c; margin-top: 0.5rem;">
        Tidak memenuhi kriteria / berkas kurang
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CreditApplication } from '~/composables/useApplications'

const props = defineProps<{
  applications: CreditApplication[]
  activeFilter: string
}>()

const emit = defineEmits<{
  (e: 'filter', status: string): void
}>()

const totalCount = computed(() => props.applications.length)
const pendingCount = computed(() => props.applications.filter(a => a.status === 'PENDING_APPROVAL').length)
const approvedCount = computed(() => props.applications.filter(a => a.status === 'APPROVED').length)
const rejectedOrReviseCount = computed(() => props.applications.filter(a => a.status === 'REJECTED' || a.status === 'REVISION_REQUIRED').length)
</script>

<style scoped>
@media (max-width: 900px) {
  div[style*="grid-template-columns: repeat(4, 1fr)"] {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
@media (max-width: 500px) {
  div[style*="grid-template-columns: repeat(4, 1fr)"] {
    grid-template-columns: 1fr !important;
  }
}
</style>
