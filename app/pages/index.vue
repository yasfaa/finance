<template>
  <div class="app-container">
    <!-- Header Modul 1 -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
      <div>
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
          <span class="badge badge-approved" style="font-size: 0.72rem;">MODUL 1</span>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Sistem Digitalisasi PT. JKL</span>
        </div>
        <h1 style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary);">
          Form Input Pengajuan Kredit Kendaraan
        </h1>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 0.2rem;">
          Pengganti formulir fisik manual untuk Marketing & Sales Dealer dalam menghimpun data calon debitur.
        </p>
      </div>

      <!-- Tombol Isi Cepat Demo 1-Klik -->
      <div style="display: flex; gap: 0.5rem;">
        <button 
          type="button" 
          class="btn btn-secondary"
          style="min-height: 38px; padding: 0.4rem 0.85rem; font-size: 0.82rem;"
          @click="fillDemoData"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Isi Cepat Data Demo (1-Klik)
        </button>

        <NuxtLink 
          to="/approval" 
          class="btn btn-secondary"
          style="min-height: 38px; padding: 0.4rem 0.85rem; font-size: 0.82rem;"
        >
          Lihat Antrean Approval ({{ pendingCount }})
        </NuxtLink>
      </div>
    </div>

    <!-- Wizard Navigasi Langkah -->
    <SubmissionStepWizard 
      :current-step="currentStep" 
      @change-step="currentStep = $event" 
    />

    <!-- Langkah 1: Data Konsumen -->
    <SubmissionCustomerForm 
      v-if="currentStep === 1"
      v-model="formData.customer"
      @next="currentStep = 2"
    />

    <!-- Langkah 2: Data Kendaraan -->
    <SubmissionVehicleForm 
      v-else-if="currentStep === 2"
      v-model="formData.vehicle"
      @next="currentStep = 3"
      @back="currentStep = 1"
    />

    <!-- Langkah 3: Skema Pinjaman -->
    <SubmissionLoanForm 
      v-else-if="currentStep === 3"
      v-model="formData.loan"
      :otr-price="formData.vehicle.otrPrice"
      @next="currentStep = 4"
      @back="currentStep = 2"
    />

    <!-- Langkah 4: Unggah Berkas & Dokumen -->
    <SubmissionDocumentUploader 
      v-else-if="currentStep === 4"
      v-model="formData.documents"
      @review="isReviewModalOpen = true"
      @back="currentStep = 3"
    />

    <!-- Modal Konfirmasi & Pengiriman Berkas -->
    <SubmissionSummaryModal 
      v-if="isReviewModalOpen"
      :customer="formData.customer"
      :vehicle="formData.vehicle"
      :loan="formData.loan"
      :documents="formData.documents"
      @close="isReviewModalOpen = false"
      @reset="resetForm"
    />
  </div>
</template>

<script setup lang="ts">
import type { CustomerData, VehicleData, LoanData, DocumentAttachment } from '~/composables/useApplications'

const { applications } = useApplications()
const currentStep = ref(1)
const isReviewModalOpen = ref(false)

const pendingCount = computed(() => {
  return applications.value.filter(app => app.status === 'PENDING_APPROVAL').length
})

// State form pengajuan
const createEmptyForm = () => ({
  customer: {
    nik: '',
    fullName: '',
    birthDate: '',
    maritalStatus: 'BELUM_KAWIN' as const,
    spouseName: '',
    spouseNik: '',
    phoneNumber: '',
    address: ''
  },
  vehicle: {
    dealerName: 'PT Nusantara Jaya Motor Sudirman',
    brand: 'Honda',
    model: 'Vario 160',
    variantType: 'CBS',
    color: 'Matte Black',
    otrPrice: 27500000
  },
  loan: {
    dpAmount: 5500000,
    dpPercentage: 20,
    tenorMonths: 36,
    insuranceType: 'ALL_RISK' as const,
    interestRate: 0.08,
    loanPrincipal: 22000000,
    monthlyInstallment: 757778
  },
  documents: [] as DocumentAttachment[]
})

const formData = reactive(createEmptyForm())

// Fungsi demo untuk mengisi formulir lengkap 1-klik
const fillDemoData = () => {
  formData.customer = {
    nik: '3201121908950004',
    fullName: 'Bambang Triatmojo',
    birthDate: '1995-08-19',
    maritalStatus: 'KAWIN',
    spouseName: 'Ratna Wulandari',
    spouseNik: '3201125203970002',
    phoneNumber: '081377889900',
    address: 'Jl. Kemang Timur No. 24, Mampang Prapatan, Jakarta Selatan'
  }
  formData.vehicle = {
    dealerName: 'PT Astra Motor Jakarta Barat',
    brand: 'Honda',
    model: 'PCX 160',
    variantType: 'ABS',
    color: 'Imperial Matte Blue',
    otrPrice: 36800000
  }
  formData.loan = {
    dpAmount: 7360000,
    dpPercentage: 20,
    tenorMonths: 36,
    insuranceType: 'ALL_RISK',
    interestRate: 0.08,
    loanPrincipal: 29440000,
    monthlyInstallment: 1014044
  }
  formData.documents = [
    { type: 'KTP', title: 'KTP Pemohon', fileName: 'ktp_bambang_triatmojo.jpg', fileSize: '1.45 MB', fileType: 'image/jpeg', uploadedAt: '2026-09-15 10:20' },
    { type: 'KK', title: 'Kartu Keluarga', fileName: 'kk_bambang_ratna.pdf', fileSize: '2.30 MB', fileType: 'application/pdf', uploadedAt: '2026-09-15 10:22' },
    { type: 'SPK', title: 'Surat Pesanan Kendaraan', fileName: 'spk_honda_pcx160_astra.pdf', fileSize: '980 KB', fileType: 'application/pdf', uploadedAt: '2026-09-15 10:25' },
    { type: 'BUKTI_BAYAR', title: 'Bukti Bayar Tanda Jadi', fileName: 'bukti_transfer_dp_tanda_jadi.jpg', fileSize: '1.10 MB', fileType: 'image/jpeg', uploadedAt: '2026-09-15 10:28' }
  ]
  currentStep.value = 4
}

const resetForm = () => {
  const empty = createEmptyForm()
  formData.customer = empty.customer
  formData.vehicle = empty.vehicle
  formData.loan = empty.loan
  formData.documents = empty.documents
  currentStep.value = 1
  isReviewModalOpen.value = false
}
</script>
