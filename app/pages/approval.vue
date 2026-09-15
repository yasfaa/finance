<template>
  <div class="app-container">
    <!-- Header Modul 2 -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
      <div>
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
          <span class="badge badge-pending" style="font-size: 0.72rem;">MODUL 2</span>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Sistem Digitalisasi PT. JKL</span>
        </div>
        <h1 style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary);">
          Dashboard Approval Pengajuan Kredit
        </h1>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 0.2rem;">
          Portal Atasan Marketing (Credit Supervisor) untuk verifikasi kelayakan debitur dan otomatisasi penerbitan PO & Kontrak.
        </p>
      </div>

      <!-- Quick Action Buttons -->
      <div style="display: flex; gap: 0.5rem;">
        <button 
          type="button" 
          class="btn btn-secondary"
          style="min-height: 38px; padding: 0.4rem 0.85rem; font-size: 0.82rem;"
          title="Reset ke data awal pengujian"
          @click="resetDemoData"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
          </svg>
          Reset Data Demo
        </button>

        <NuxtLink 
          to="/" 
          class="btn btn-primary"
          style="min-height: 38px; padding: 0.4rem 0.85rem; font-size: 0.82rem;"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Buat Pengajuan Baru (Modul 1)
        </NuxtLink>
      </div>
    </div>

    <!-- Metrik KPI Cards -->
    <ApprovalMetricCards 
      :applications="applications" 
      :active-filter="currentFilter"
      @filter="currentFilter = $event"
    />

    <!-- Tabel Daftar Pengajuan Pending & Riwayat -->
    <ApprovalTable 
      :applications="applications"
      :current-filter="currentFilter"
      @update:filter="currentFilter = $event"
      @review="openReviewModal"
      @view-doc="openDocModal"
    />

    <!-- Modal 1: Review Detail Pengajuan & Eksekusi Keputusan -->
    <ApprovalApplicationReviewModal 
      v-if="selectedAppForReview"
      :application="selectedAppForReview"
      @close="selectedAppForReview = null"
      @decided="handleSupervisorDecision"
    />

    <!-- Modal 2: Modul Document Generator (Preview PDF PO & Kontrak) -->
    <GeneratorDocumentGeneratorModal 
      v-if="selectedAppForDoc"
      :application="selectedAppForDoc"
      @close="selectedAppForDoc = null"
    />
  </div>
</template>

<script setup lang="ts">
import type { CreditApplication } from '~/composables/useApplications'
import { useApplications } from '~/composables/useApplications'

const { applications, decideApplication, resetDemoData } = useApplications()
const currentFilter = ref('ALL')

const selectedAppForReview = ref<CreditApplication | null>(null)
const selectedAppForDoc = ref<CreditApplication | null>(null)

const openReviewModal = (app: CreditApplication) => {
  selectedAppForReview.value = app
}

const openDocModal = (app: CreditApplication) => {
  selectedAppForDoc.value = app
}

const handleSupervisorDecision = (payload: { action: 'APPROVE' | 'REJECT' | 'REVISE'; notes: string }) => {
  if (!selectedAppForReview.value) return

  const targetId = selectedAppForReview.value.id
  decideApplication(targetId, payload.action, payload.notes, 'Bambang Sudarmono (Credit Supervisor)')

  // Temukan data yang telah diupdate
  const updated = applications.value.find(a => a.id === targetId)
  selectedAppForReview.value = null

  // Jika disetujui (Approved), otomatis tampilkan preview dokumen PO & Kontrak (Modul Document Generator)
  if (payload.action === 'APPROVE' && updated) {
    selectedAppForDoc.value = updated
  }
}
</script>
