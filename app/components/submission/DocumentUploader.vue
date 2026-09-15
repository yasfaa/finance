<template>
  <div class="card">
    <div class="card-header">
      <div>
        <h2>Langkah 4: Unggah Berkas & Dokumen Persyaratan</h2>
        <p>Unggah 4 berkas wajib dalam format gambar (JPG/PNG) atau PDF (maksimal 5 MB per berkas).</p>
      </div>
      <button 
        type="button" 
        class="btn btn-secondary" 
        style="min-height: 32px; padding: 0.25rem 0.75rem; font-size: 0.78rem;"
        @click="loadDemoDocuments"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Isi Cepat Berkas Demo
      </button>
    </div>

    <!-- Upload Grid 4 Dokumen Wajib -->
    <div class="upload-card-grid">
      <div 
        v-for="docMeta in documentTypes" 
        :key="docMeta.type"
        class="upload-card"
      >
        <div class="upload-card-title">
          <h3>
            {{ docMeta.title }} <span class="required" style="color: var(--status-rejected-text);">*</span>
          </h3>
          <span 
            v-if="getDocument(docMeta.type)" 
            class="badge badge-approved"
          >
            ✓ Terunggah
          </span>
          <span v-else class="badge badge-pending">Wajib Diunggah</span>
        </div>

        <p style="font-size: 0.78rem; color: var(--text-muted);">
          {{ docMeta.description }}
        </p>

        <!-- Preview Jika Sudah Terunggah -->
        <div v-if="getDocument(docMeta.type)" class="file-preview">
          <div class="file-info">
            <span class="file-badge">
              {{ getDocument(docMeta.type)?.fileType.includes('pdf') ? 'PDF' : 'IMG' }}
            </span>
            <div>
              <div class="file-name">{{ getDocument(docMeta.type)?.fileName }}</div>
              <div class="file-size">{{ getDocument(docMeta.type)?.fileSize }}</div>
            </div>
          </div>

          <button 
            type="button" 
            class="btn-icon-danger" 
            title="Hapus Berkas"
            @click="removeDocument(docMeta.type)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>

        <!-- Dropzone Box Jika Belum Ada Berkas -->
        <div 
          v-else 
          class="dropzone-box"
          :class="{ 'is-invalid': errors[docMeta.type] }"
        >
          <input 
            type="file" 
            accept="image/jpeg,image/png,application/pdf"
            @change="handleFileUpload($event, docMeta)"
          />
          <span class="dropzone-icon">📁</span>
          <div class="dropzone-text">
            <strong>Klik untuk pilih file</strong> atau seret ke sini
          </div>
          <div class="dropzone-hint">JPG, PNG, atau PDF (Maks. 5MB)</div>
        </div>

        <span v-if="errors[docMeta.type]" class="form-error" style="font-size: 0.78rem;">
          {{ errors[docMeta.type] }}
        </span>
      </div>
    </div>

    <!-- Tombol Navigasi & Konfirmasi Review -->
    <div class="form-actions">
      <button type="button" class="btn btn-secondary" @click="emit('back')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Kembali ke Skema Pinjaman
      </button>

      <button type="button" class="btn btn-success" @click="handleReview">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Review & Kirim Pengajuan
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DocumentAttachment } from '~/composables/useApplications'

const props = defineProps<{
  modelValue: DocumentAttachment[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: DocumentAttachment[]): void
  (e: 'review'): void
  (e: 'back'): void
}>()

const documents = ref<DocumentAttachment[]>([...props.modelValue])
const errors = reactive<Record<string, string>>({})

const documentTypes: Array<{
  type: DocumentAttachment['type']
  title: string
  description: string
}> = [
  {
    type: 'KTP',
    title: 'KTP Pemohon',
    description: 'Foto e-KTP asli yang jelas, tidak buram dan tidak terpotong.'
  },
  {
    type: 'KK',
    title: 'Kartu Keluarga (KK)',
    description: 'Salinan Kartu Keluarga resmi yang memuat nama pemohon.'
  },
  {
    type: 'SPK',
    title: 'Surat Pesanan Kendaraan (SPK)',
    description: 'Dokumen SPK resmi bermaterai yang diterbitkan pihak dealer rekanan.'
  },
  {
    type: 'BUKTI_BAYAR',
    title: 'Bukti Bayar Tanda Jadi',
    description: 'Kuitansi asli dealer atau struk transfer DP tanda jadi pembelian unit.'
  }
]

watch(documents, (newDocs) => {
  emit('update:modelValue', [...newDocs])
}, { deep: true })

const getDocument = (type: DocumentAttachment['type']) => {
  return documents.value.find(doc => doc.type === type)
}

const removeDocument = (type: DocumentAttachment['type']) => {
  documents.value = documents.value.filter(doc => doc.type !== type)
}

const handleFileUpload = (e: Event, meta: typeof documentTypes[0]) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    errors[meta.type] = 'Ukuran file melebihi batas 5MB.'
    target.value = ''
    return
  }

  delete errors[meta.type]
  const sizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + ' MB'

  // Buat preview data URL jika berupa gambar
  const newAttachment: DocumentAttachment = {
    type: meta.type,
    title: meta.title,
    fileName: file.name,
    fileSize: sizeFormatted,
    fileType: file.type || 'application/octet-stream',
    uploadedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
  }

  // Hapus dokumen lama tipe sama lalu tambahkan yang baru
  documents.value = documents.value.filter(d => d.type !== meta.type).concat(newAttachment)
  target.value = ''
}

const loadDemoDocuments = () => {
  documents.value = [
    { type: 'KTP', title: 'KTP Pemohon', fileName: 'ktp_calon_debitur_asli.jpg', fileSize: '1.24 MB', fileType: 'image/jpeg', uploadedAt: '2026-09-15 10:15' },
    { type: 'KK', title: 'Kartu Keluarga', fileName: 'kartu_keluarga_resmi.pdf', fileSize: '2.10 MB', fileType: 'application/pdf', uploadedAt: '2026-09-15 10:16' },
    { type: 'SPK', title: 'Surat Pesanan Kendaraan', fileName: 'spk_dealer_nusantara.pdf', fileSize: '950 KB', fileType: 'application/pdf', uploadedAt: '2026-09-15 10:17' },
    { type: 'BUKTI_BAYAR', title: 'Bukti Bayar Tanda Jadi', fileName: 'kuitansi_tanda_jadi_dp.jpg', fileSize: '880 KB', fileType: 'image/jpeg', uploadedAt: '2026-09-15 10:18' }
  ]
  Object.keys(errors).forEach(k => delete errors[k])
}

const validate = (): boolean => {
  let isValid = true
  Object.keys(errors).forEach(k => delete errors[k])

  documentTypes.forEach(docMeta => {
    if (!getDocument(docMeta.type)) {
      errors[docMeta.type] = `${docMeta.title} wajib diunggah.`
      isValid = false
    }
  })

  return isValid
}

const handleReview = () => {
  if (validate()) {
    emit('review')
  }
}
</script>
