<template>
  <div class="modal-overlay" @keydown.esc="emit('close')" tabindex="-1">
    <div 
      class="modal-content" 
      style="max-width: 960px; height: 90vh;"
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="review-modal-title"
    >
      <!-- Modal Header -->
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <h3 id="review-modal-title" style="font-size: 1.15rem; font-weight: 700;">
                Review Pengajuan: {{ application.applicationNo }}
              </h3>
              <span 
                class="badge"
                :class="{
                  'badge-pending': application.status === 'PENDING_APPROVAL',
                  'badge-approved': application.status === 'APPROVED',
                  'badge-rejected': application.status === 'REJECTED',
                  'badge-revise': application.status === 'REVISION_REQUIRED'
                }"
              >
                {{ application.status === 'PENDING_APPROVAL' ? 'MENUNGGU KEPUTUSAN' : application.status }}
              </span>
            </div>
            <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">
              Pengaju: {{ application.marketingName }} | Tanggal: {{ application.submittedAt }}
            </p>
          </div>
        </div>

        <button 
          type="button" 
          class="btn-icon-danger" 
          @click="emit('close')" 
          title="Tutup (Esc)" 
          style="font-size: 1.25rem;"
        >
          ✕
        </button>
      </div>

      <!-- Modal Body (Split Screen: Data di Kiri, Dokumen di Kanan) -->
      <div class="modal-body" style="padding: 0; display: flex; flex: 1; overflow: hidden;">
        <!-- Kolom Kiri: Detail Pengajuan & Finansial -->
        <div style="flex: 1.1; padding: 1.25rem; overflow-y: auto; border-right: 1px solid var(--border-subtle);">
          <!-- Bagian 1: Data Konsumen -->
          <div style="margin-bottom: 1.25rem;">
            <h4 style="font-size: 0.88rem; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.35rem;">
              <span>👤</span> Identitas Calon Debitur
            </h4>
            <div style="background-color: #f8fafc; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.85rem; font-size: 0.82rem;">
              <div style="display: grid; grid-template-columns: 130px 1fr; gap: 0.35rem;">
                <span style="color: var(--text-muted);">Nama Lengkap:</span>
                <strong style="color: var(--text-primary);">{{ application.customer.fullName }}</strong>

                <span style="color: var(--text-muted);">NIK Pemohon:</span>
                <span class="tabular-nums" style="font-weight: 600;">{{ application.customer.nik }}</span>

                <span style="color: var(--text-muted);">Tanggal Lahir:</span>
                <span>{{ application.customer.birthDate }}</span>

                <span style="color: var(--text-muted);">Status Kawin:</span>
                <span>{{ application.customer.maritalStatus }}</span>

                <template v-if="application.customer.maritalStatus === 'KAWIN'">
                  <span style="color: var(--text-muted);">Data Pasangan:</span>
                  <span>{{ application.customer.spouseName }} (NIK: {{ application.customer.spouseNik }})</span>
                </template>

                <span style="color: var(--text-muted);">No. Telepon / WA:</span>
                <span>+62 {{ application.customer.phoneNumber }}</span>

                <span style="color: var(--text-muted);">Alamat Domisili:</span>
                <span>{{ application.customer.address }}</span>
              </div>
            </div>
          </div>

          <!-- Bagian 2: Data Kendaraan & Dealer -->
          <div style="margin-bottom: 1.25rem;">
            <h4 style="font-size: 0.88rem; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.35rem;">
              <span>🏍️</span> Unit Kendaraan & Rekanan
            </h4>
            <div style="background-color: #f8fafc; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.85rem; font-size: 0.82rem;">
              <div style="display: grid; grid-template-columns: 130px 1fr; gap: 0.35rem;">
                <span style="color: var(--text-muted);">Dealer Rekanan:</span>
                <strong style="color: var(--text-primary);">{{ application.vehicle.dealerName }}</strong>

                <span style="color: var(--text-muted);">Merk & Unit:</span>
                <span>{{ application.vehicle.brand }} {{ application.vehicle.model }} ({{ application.vehicle.variantType }})</span>

                <span style="color: var(--text-muted);">Pilihan Warna:</span>
                <span>{{ application.vehicle.color }}</span>

                <span style="color: var(--text-muted);">Harga OTR:</span>
                <strong class="tabular-nums" style="color: var(--text-primary);">{{ formatRupiah(application.vehicle.otrPrice) }}</strong>
              </div>
            </div>
          </div>

          <!-- Bagian 3: Skema Pinjaman & Angsuran -->
          <div style="margin-bottom: 1rem;">
            <h4 style="font-size: 0.88rem; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.35rem;">
              <span>💳</span> Struktur Pembiayaan
            </h4>
            <div style="background-color: #eff6ff; border: 1px solid var(--primary-border); border-radius: var(--radius-sm); padding: 0.85rem; font-size: 0.82rem;">
              <div style="display: grid; grid-template-columns: 130px 1fr; gap: 0.35rem;">
                <span style="color: var(--text-muted);">Uang Muka (DP):</span>
                <strong class="tabular-nums">{{ formatRupiah(application.loan.dpAmount) }} ({{ application.loan.dpPercentage }}%)</strong>

                <span style="color: var(--text-muted);">Pokok Pinjaman:</span>
                <span class="tabular-nums">{{ formatRupiah(application.loan.loanPrincipal) }}</span>

                <span style="color: var(--text-muted);">Tenor Kredit:</span>
                <span>{{ application.loan.tenorMonths }} Bulan ({{ application.loan.tenorMonths / 12 }} Tahun)</span>

                <span style="color: var(--text-muted);">Perlindungan:</span>
                <span>{{ application.loan.insuranceType }}</span>

                <span style="color: var(--text-muted); font-weight: 700; font-size: 0.85rem;">Cicilan Bulanan:</span>
                <strong class="tabular-nums" style="font-size: 1.15rem; color: var(--primary);">
                  {{ formatRupiah(application.loan.monthlyInstallment) }} / bulan
                </strong>
              </div>
            </div>
          </div>

          <!-- Histori Review Jika Sudah Pernah Diproses -->
          <div v-if="application.reviewerNotes" style="margin-top: 1rem; padding: 0.75rem; background-color: #fffbeb; border: 1px solid #fde68a; border-radius: var(--radius-sm); font-size: 0.8rem;">
            <div style="font-weight: 600; color: #b45309; margin-bottom: 0.2rem;">
              Catatan Keputusan Sebelumnya ({{ application.reviewedBy }} - {{ application.reviewedAt }}):
            </div>
            <div style="color: #78350f;">"{{ application.reviewerNotes }}"</div>
          </div>
        </div>

        <!-- Kolom Kanan: Penampil Berkas Digital Asli -->
        <div style="flex: 1; padding: 1.25rem; overflow-y: auto; background-color: #fafbfc; display: flex; flex-direction: column;">
          <h4 style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
            <span>📁 Dokumen Lampiran Pemohon ({{ application.documents.length }})</span>
            <span style="font-size: 0.72rem; color: var(--text-muted);">Klik tab untuk inspeksi</span>
          </h4>

          <!-- Tab Selector Dokumen -->
          <div style="display: flex; gap: 0.35rem; margin-bottom: 0.75rem; flex-wrap: wrap;">
            <button 
              v-for="(doc, idx) in application.documents" 
              :key="doc.type"
              type="button"
              class="btn btn-secondary"
              style="min-height: 28px; padding: 0.2rem 0.55rem; font-size: 0.75rem;"
              :style="selectedDocIndex === idx ? 'background-color: var(--primary); color: #fff; border-color: var(--primary); font-weight: 600;' : ''"
              @click="selectedDocIndex = idx"
            >
              {{ doc.type }}: {{ doc.title }}
            </button>
          </div>

          <!-- Viewer Berkas Terpilih -->
          <div 
            v-if="currentDoc" 
            style="flex: 1; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); background-color: #fff; display: flex; flex-direction: column; overflow: hidden;"
          >
            <div style="padding: 0.5rem 0.75rem; background-color: #f1f5f9; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem;">
              <strong style="color: var(--text-primary);">{{ currentDoc.fileName }}</strong>
              <span class="file-badge">{{ currentDoc.fileType.includes('pdf') ? 'PDF Document' : 'Image File' }}</span>
            </div>

            <!-- Simulasi Tampilan Berkas KTP/KK/SPK/Bukti Bayar -->
            <div style="flex: 1; padding: 1.5rem; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #f8fafc;">
              <!-- Frame Dokumen Terverifikasi -->
              <div style="width: 100%; max-width: 380px; background-color: #fff; border: 2px dashed #cbd5e1; border-radius: var(--radius-sm); padding: 1.25rem; text-align: center; box-shadow: var(--shadow-sm);">
                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">
                  {{ currentDoc.type === 'KTP' ? '🪪' : currentDoc.type === 'KK' ? '📜' : currentDoc.type === 'SPK' ? '📝' : '🧾' }}
                </div>
                <div style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">
                  {{ currentDoc.title }}
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">
                  Ukuran: {{ currentDoc.fileSize }} | Diunggah: {{ currentDoc.uploadedAt }}
                </div>
                <div style="margin-top: 0.75rem; padding: 0.4rem 0.75rem; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 4px; font-size: 0.75rem; color: #047857; font-weight: 600;">
                  ✓ Status: Terverifikasi Lengkap & Terbaca Jelas
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer: Panel Keputusan Supervisor -->
      <div class="modal-footer" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
        <!-- Input Catatan Supervisor -->
        <div style="display: flex; flex-direction: column; gap: 0.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <label for="supervisorNotes" style="font-size: 0.8rem; font-weight: 600; color: var(--text-primary);">
              Catatan Atasan Marketing / Alasan Keputusan:
            </label>
            <span style="font-size: 0.72rem; color: var(--text-muted);">
              (Wajib diisi jika menolak atau meminta perbaikan berkas)
            </span>
          </div>
          <input 
            id="supervisorNotes"
            v-model="decisionNotes"
            type="text"
            placeholder="Tuliskan catatan verifikasi, alasan penolakan, atau instruksi revisi data..."
            class="form-control"
            style="min-height: 38px; font-size: 0.85rem;"
            :class="{ 'is-invalid': noteError }"
          />
          <span v-if="noteError" class="form-error" style="font-size: 0.75rem;">{{ noteError }}</span>
        </div>

        <!-- Tombol Aksi Keputusan Tiga Jalur -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <button type="button" class="btn btn-secondary" @click="emit('close')">
            Tutup
          </button>

          <div style="display: flex; gap: 0.5rem;">
            <!-- Tombol Minta Revisi -->
            <button 
              type="button" 
              class="btn"
              style="background-color: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd;"
              @click="handleDecision('REVISE')"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="1 4 1 10 7 10"></polyline>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
              </svg>
              Kembalikan / Butuh Revisi
            </button>

            <!-- Tombol Tolak -->
            <button 
              type="button" 
              class="btn"
              style="background-color: #fee2e2; color: #b91c1c; border: 1px solid #fecaca;"
              @click="handleDecision('REJECT')"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              Tolak Pengajuan
            </button>

            <!-- Tombol Setujui (Otomatis Picu Document Generator) -->
            <button 
              type="button" 
              class="btn btn-success"
              @click="handleDecision('APPROVE')"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Setujui (Approve & Terbitkan PO)
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CreditApplication } from '~/composables/useApplications'
import { useCreditCalculator } from '~/composables/useCreditCalculator'

const props = defineProps<{
  application: CreditApplication
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'decided', payload: { action: 'APPROVE' | 'REJECT' | 'REVISE'; notes: string }): void
}>()

const { formatRupiah } = useCreditCalculator()
const selectedDocIndex = ref(0)
const decisionNotes = ref(props.application.reviewerNotes || '')
const noteError = ref('')

const currentDoc = computed(() => {
  return props.application.documents[selectedDocIndex.value] || props.application.documents[0]
})

const handleDecision = (action: 'APPROVE' | 'REJECT' | 'REVISE') => {
  noteError.value = ''

  if (action === 'REJECT' && !decisionNotes.value.trim()) {
    noteError.value = 'Wajib mengisi alasan penolakan untuk evaluasi debitur.'
    return
  }

  if (action === 'REVISE' && !decisionNotes.value.trim()) {
    noteError.value = 'Wajib menuliskan instruksi berkas mana yang harus direvisi sales.'
    return
  }

  const defaultNotes = action === 'APPROVE' 
    ? (decisionNotes.value.trim() || 'Kapasitas bayar memenuhi standar DSR dan seluruh dokumen dinyatakan sah.')
    : decisionNotes.value.trim()

  emit('decided', {
    action,
    notes: defaultNotes
  })
}
</script>
