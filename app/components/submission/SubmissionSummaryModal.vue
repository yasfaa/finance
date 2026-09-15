<template>
  <div class="modal-overlay" @keydown.esc="onClose" tabindex="-1">
    <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <!-- State 1: Konfirmasi Ringkasan Sebelum Submit -->
      <template v-if="!isSubmitted">
        <div class="modal-header">
          <div>
            <h3 id="modal-title">Konfirmasi & Ringkasan Pengajuan Kredit</h3>
            <p style="font-size: 0.8rem; color: var(--text-muted);">
              Periksa kembali kelengkapan seluruh data sebelum dikirimkan ke Atasan Marketing.
            </p>
          </div>
          <button type="button" class="btn-icon-danger" @click="onClose" title="Tutup Modal" style="font-size: 1.25rem;">
            ✕
          </button>
        </div>

        <div class="modal-body">
          <!-- Ringkasan Konsumen -->
          <div style="margin-bottom: 1.25rem;">
            <h4 style="font-size: 0.9rem; color: var(--primary); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
              <span>👤</span> 1. Data Pemohon / Konsumen
            </h4>
            <div style="background-color: #f8fafc; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.75rem 1rem; font-size: 0.85rem;">
              <div style="display: grid; grid-template-columns: 140px 1fr; gap: 0.35rem;">
                <span style="color: var(--text-muted);">Nama Lengkap:</span>
                <strong>{{ customer.fullName }}</strong>

                <span style="color: var(--text-muted);">NIK Pemohon:</span>
                <span class="tabular-nums">{{ customer.nik }}</span>

                <span style="color: var(--text-muted);">Tanggal Lahir:</span>
                <span>{{ customer.birthDate }}</span>

                <span style="color: var(--text-muted);">Status Kawin:</span>
                <span>{{ customer.maritalStatus }}</span>

                <template v-if="customer.maritalStatus === 'KAWIN'">
                  <span style="color: var(--text-muted);">Pasangan:</span>
                  <span>{{ customer.spouseName }} (NIK: {{ customer.spouseNik }})</span>
                </template>

                <span style="color: var(--text-muted);">Kontak / HP:</span>
                <span>+62 {{ customer.phoneNumber }}</span>

                <span style="color: var(--text-muted);">Alamat Domisili:</span>
                <span>{{ customer.address }}</span>
              </div>
            </div>
          </div>

          <!-- Ringkasan Kendaraan -->
          <div style="margin-bottom: 1.25rem;">
            <h4 style="font-size: 0.9rem; color: var(--primary); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
              <span>🏍️</span> 2. Data Unit Kendaraan
            </h4>
            <div style="background-color: #f8fafc; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.75rem 1rem; font-size: 0.85rem;">
              <div style="display: grid; grid-template-columns: 140px 1fr; gap: 0.35rem;">
                <span style="color: var(--text-muted);">Dealer Rekanan:</span>
                <strong>{{ vehicle.dealerName }}</strong>

                <span style="color: var(--text-muted);">Merk & Model:</span>
                <span>{{ vehicle.brand }} {{ vehicle.model }} ({{ vehicle.variantType }})</span>

                <span style="color: var(--text-muted);">Pilihan Warna:</span>
                <span>{{ vehicle.color }}</span>

                <span style="color: var(--text-muted);">Harga OTR:</span>
                <strong class="tabular-nums" style="color: var(--primary);">{{ formatRupiah(vehicle.otrPrice) }}</strong>
              </div>
            </div>
          </div>

          <!-- Ringkasan Finansial -->
          <div style="margin-bottom: 1.25rem;">
            <h4 style="font-size: 0.9rem; color: var(--primary); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
              <span>💳</span> 3. Skema Pembiayaan
            </h4>
            <div style="background-color: #eff6ff; border: 1px solid var(--primary-border); border-radius: var(--radius-sm); padding: 0.85rem 1rem; font-size: 0.85rem;">
              <div style="display: grid; grid-template-columns: 140px 1fr; gap: 0.4rem;">
                <span style="color: var(--text-muted);">Uang Muka (DP):</span>
                <strong class="tabular-nums">{{ formatRupiah(loan.dpAmount) }} ({{ loan.dpPercentage }}%)</strong>

                <span style="color: var(--text-muted);">Pokok Hutang:</span>
                <span class="tabular-nums">{{ formatRupiah(loan.loanPrincipal) }}</span>

                <span style="color: var(--text-muted);">Tenor / Asuransi:</span>
                <span>{{ loan.tenorMonths }} Bulan | {{ loan.insuranceType }}</span>

                <span style="color: var(--text-muted); font-weight: 700;">Angsuran / Bln:</span>
                <strong class="tabular-nums" style="font-size: 1.15rem; color: var(--primary);">
                  {{ formatRupiah(loan.monthlyInstallment) }}
                </strong>
              </div>
            </div>
          </div>

          <!-- Berkas Terunggah -->
          <div>
            <h4 style="font-size: 0.9rem; color: var(--primary); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
              <span>📁</span> 4. Dokumen Persyaratan ({{ documents.length }} Berkas)
            </h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
              <span v-for="doc in documents" :key="doc.type" class="badge badge-approved">
                ✓ {{ doc.title }}: {{ doc.fileName }}
              </span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="onClose" :disabled="isSubmitting">
            Periksa Kembali
          </button>
          <button type="button" class="btn btn-primary" @click="executeSubmit" :disabled="isSubmitting">
            <span v-if="isSubmitting">Mengirimkan Berkas...</span>
            <span v-else>Konfirmasi & Kirim Pengajuan</span>
          </button>
        </div>
      </template>

      <!-- State 2: Sukses Terkirim (Feedback Real-time) -->
      <template v-else>
        <div class="modal-body" style="text-align: center; padding: 2.5rem 1.5rem;">
          <div style="width: 56px; height: 56px; border-radius: 50%; background-color: var(--status-approved-bg); border: 2px solid var(--status-approved-border); color: var(--status-approved-text); display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 1rem auto;">
            ✓
          </div>

          <h3 style="font-size: 1.3rem; margin-bottom: 0.35rem;">Pengajuan Berhasil Dikirimkan!</h3>
          <p style="font-size: 0.88rem; color: var(--text-secondary); max-width: 480px; margin: 0 auto 1.25rem auto;">
            Berkas aplikasi pembiayaan telah masuk ke dalam antrean sistem dan siap untuk ditinjau oleh Atasan Marketing.
          </p>

          <div style="background-color: #f8fafc; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 1rem; display: inline-block; margin-bottom: 1.5rem;">
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Nomor Pengajuan Resmi:</div>
            <div class="tabular-nums" style="font-size: 1.35rem; font-weight: 700; color: var(--primary);">
              {{ generatedAppNo }}
            </div>
            <div style="margin-top: 0.35rem;">
              <span class="badge badge-pending">PENDING_APPROVAL</span>
            </div>
          </div>

          <div style="display: flex; justify-content: center; gap: 0.75rem;">
            <button type="button" class="btn btn-secondary" @click="onReset">
              Buat Pengajuan Baru
            </button>
            <NuxtLink to="/approval" class="btn btn-primary">
              Buka Dashboard Approval (Atasan)
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </NuxtLink>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CustomerData, VehicleData, LoanData, DocumentAttachment } from '~/composables/useApplications'
import { useCreditCalculator } from '~/composables/useCreditCalculator'

const props = defineProps<{
  customer: CustomerData
  vehicle: VehicleData
  loan: LoanData
  documents: DocumentAttachment[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submitted'): void
  (e: 'reset'): void
}>()

const { formatRupiah } = useCreditCalculator()
const { submitNewApplication } = useApplications()

const isSubmitting = ref(false)
const isSubmitted = ref(false)
const generatedAppNo = ref('')

const onClose = () => {
  if (!isSubmitting.value) {
    emit('close')
  }
}

const executeSubmit = () => {
  isSubmitting.value = true
  setTimeout(() => {
    const createdApp = submitNewApplication({
      customer: props.customer,
      vehicle: props.vehicle,
      loan: props.loan,
      documents: props.documents
    })
    generatedAppNo.value = createdApp.applicationNo
    isSubmitting.value = false
    isSubmitted.value = true
    emit('submitted')
  }, 600)
}

const onReset = () => {
  emit('reset')
}
</script>
