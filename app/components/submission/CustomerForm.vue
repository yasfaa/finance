<template>
  <div class="card">
    <div class="card-header">
      <div>
        <h2>Langkah 1: Data Konsumen & Calon Debitur</h2>
        <p>Lengkapi informasi identitas diri calon konsumen sesuai dokumen resmi KTP dan Kartu Keluarga.</p>
      </div>
      <span class="badge badge-revise">Wajib Sesuai KTP</span>
    </div>

    <div class="form-grid">
      <!-- NIK Pemohon -->
      <div class="form-group">
        <label for="nik" class="form-label">
          Nomor Induk Kependudukan (NIK) <span class="required">*</span>
        </label>
        <input 
          id="nik"
          v-model="customer.nik"
          type="text"
          maxlength="16"
          placeholder="16 digit NIK tertera di KTP"
          class="form-control nik-field"
          :class="{ 'is-invalid': errors.nik }"
          @input="sanitizeNik"
        />
        <span v-if="errors.nik" class="form-error">{{ errors.nik }}</span>
        <span v-else class="form-helper">Wajib 16 digit angka resmi Kependudukan & Catatan Sipil.</span>
      </div>

      <!-- Nama Lengkap -->
      <div class="form-group">
        <label for="fullName" class="form-label">
          Nama Lengkap (Sesuai KTP) <span class="required">*</span>
        </label>
        <input 
          id="fullName"
          v-model="customer.fullName"
          type="text"
          placeholder="Contoh: Budi Santoso"
          class="form-control"
          :class="{ 'is-invalid': errors.fullName }"
        />
        <span v-if="errors.fullName" class="form-error">{{ errors.fullName }}</span>
      </div>

      <!-- Tanggal Lahir & Usia -->
      <div class="form-group">
        <label for="birthDate" class="form-label">
          Tanggal Lahir <span class="required">*</span>
        </label>
        <input 
          id="birthDate"
          v-model="customer.birthDate"
          type="date"
          class="form-control"
          :class="{ 'is-invalid': errors.birthDate }"
          @change="calculateAge"
        />
        <span v-if="errors.birthDate" class="form-error">{{ errors.birthDate }}</span>
        <span v-else-if="age !== null" class="form-helper">
          Usia saat ini: <strong>{{ age }} tahun</strong> (Syarat minimal 21 tahun).
        </span>
      </div>

      <!-- Status Perkawinan -->
      <div class="form-group">
        <label class="form-label">
          Status Perkawinan <span class="required">*</span>
        </label>
        <div class="segmented-group">
          <button 
            type="button" 
            class="segmented-btn" 
            :class="{ active: customer.maritalStatus === 'BELUM_KAWIN' }"
            @click="customer.maritalStatus = 'BELUM_KAWIN'"
          >
            Belum Kawin
          </button>
          <button 
            type="button" 
            class="segmented-btn" 
            :class="{ active: customer.maritalStatus === 'KAWIN' }"
            @click="customer.maritalStatus = 'KAWIN'"
          >
            Kawin
          </button>
          <button 
            type="button" 
            class="segmented-btn" 
            :class="{ active: customer.maritalStatus === 'CERAI' }"
            @click="customer.maritalStatus = 'CERAI'"
          >
            Cerai
          </button>
        </div>
      </div>

      <!-- Seksi Kondisional: Data Pasangan jika Status Kawin -->
      <div v-if="customer.maritalStatus === 'KAWIN'" class="form-grid-full" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-sm); padding: 1rem; margin-top: 0.25rem;">
        <h4 style="font-size: 0.92rem; margin-bottom: 0.75rem; color: #1e40af; display: flex; align-items: center; gap: 0.4rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          Data Pasangan (Wajib untuk Status Kawin)
        </h4>

        <div class="form-grid">
          <div class="form-group">
            <label for="spouseName" class="form-label">
              Nama Pasangan (Suami/Istri) <span class="required">*</span>
            </label>
            <input 
              id="spouseName"
              v-model="customer.spouseName"
              type="text"
              placeholder="Nama lengkap pasangan sesuai KTP"
              class="form-control"
              :class="{ 'is-invalid': errors.spouseName }"
            />
            <span v-if="errors.spouseName" class="form-error">{{ errors.spouseName }}</span>
          </div>

          <div class="form-group">
            <label for="spouseNik" class="form-label">
              NIK Pasangan <span class="required">*</span>
            </label>
            <input 
              id="spouseNik"
              v-model="customer.spouseNik"
              type="text"
              maxlength="16"
              placeholder="16 digit NIK pasangan"
              class="form-control nik-field"
              :class="{ 'is-invalid': errors.spouseNik }"
              @input="sanitizeSpouseNik"
            />
            <span v-if="errors.spouseNik" class="form-error">{{ errors.spouseNik }}</span>
          </div>
        </div>
      </div>

      <!-- Nomor Telepon -->
      <div class="form-group">
        <label for="phoneNumber" class="form-label">
          Nomor Telepon / WhatsApp Aktif <span class="required">*</span>
        </label>
        <div class="input-group">
          <span class="input-prefix">+62</span>
          <input 
            id="phoneNumber"
            v-model="customer.phoneNumber"
            type="tel"
            placeholder="812-xxxx-xxxx"
            class="form-control"
            :class="{ 'is-invalid': errors.phoneNumber }"
          />
        </div>
        <span v-if="errors.phoneNumber" class="form-error">{{ errors.phoneNumber }}</span>
        <span v-else class="form-helper">Nomor ini digunakan untuk verifikasi dan konfirmasi pengajuan.</span>
      </div>

      <!-- Alamat Lengkap -->
      <div class="form-group form-grid-full">
        <label for="address" class="form-label">
          Alamat Domisili / Tempat Tinggal Saat Ini <span class="required">*</span>
        </label>
        <textarea 
          id="address"
          v-model="customer.address"
          rows="3"
          placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota dan provinsi"
          class="form-control"
          :class="{ 'is-invalid': errors.address }"
        ></textarea>
        <span v-if="errors.address" class="form-error">{{ errors.address }}</span>
      </div>
    </div>

    <!-- Tombol Navigasi -->
    <div class="form-actions">
      <div></div>
      <button type="button" class="btn btn-primary" @click="handleNext">
        Lanjutkan ke Data Kendaraan
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CustomerData } from '~/composables/useApplications'

const props = defineProps<{
  modelValue: CustomerData
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: CustomerData): void
  (e: 'next'): void
}>()

const customer = reactive<CustomerData>({ ...props.modelValue })
const errors = reactive<Record<string, string>>({})
const age = ref<number | null>(null)

watch(customer, (newVal) => {
  emit('update:modelValue', { ...newVal })
}, { deep: true })

const sanitizeNik = () => {
  customer.nik = customer.nik.replace(/[^0-9]/g, '')
  if (errors.nik && customer.nik.length === 16) {
    delete errors.nik
  }
}

const sanitizeSpouseNik = () => {
  if (customer.spouseNik) {
    customer.spouseNik = customer.spouseNik.replace(/[^0-9]/g, '')
    if (errors.spouseNik && customer.spouseNik.length === 16) {
      delete errors.spouseNik
    }
  }
}

const calculateAge = () => {
  if (!customer.birthDate) return
  const birth = new Date(customer.birthDate)
  const today = new Date()
  let calcAge = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    calcAge--
  }
  age.value = calcAge
  if (calcAge < 21) {
    errors.birthDate = 'Usia calon debitur minimal 21 tahun untuk memenuhi regulasi pembiayaan.'
  } else {
    delete errors.birthDate
  }
}

// Inisialisasi usia jika tanggal lahir sudah ada
if (customer.birthDate) {
  calculateAge()
}

const validate = (): boolean => {
  let isValid = true
  Object.keys(errors).forEach(key => delete errors[key])

  if (!customer.nik || customer.nik.length !== 16) {
    errors.nik = 'NIK wajib 16 digit angka.'
    isValid = false
  }

  if (!customer.fullName || customer.fullName.trim().length < 3) {
    errors.fullName = 'Nama lengkap wajib diisi minimal 3 karakter.'
    isValid = false
  }

  if (!customer.birthDate) {
    errors.birthDate = 'Tanggal lahir wajib diisi.'
    isValid = false
  } else if (age.value !== null && age.value < 21) {
    errors.birthDate = 'Usia minimal 21 tahun.'
    isValid = false
  }

  if (customer.maritalStatus === 'KAWIN') {
    if (!customer.spouseName || customer.spouseName.trim().length < 3) {
      errors.spouseName = 'Nama pasangan wajib diisi untuk status kawin.'
      isValid = false
    }
    if (!customer.spouseNik || customer.spouseNik.length !== 16) {
      errors.spouseNik = 'NIK pasangan wajib 16 digit angka.'
      isValid = false
    }
  }

  if (!customer.phoneNumber || customer.phoneNumber.trim().length < 9) {
    errors.phoneNumber = 'Nomor telepon minimal 9 digit.'
    isValid = false
  }

  if (!customer.address || customer.address.trim().length < 10) {
    errors.address = 'Alamat domisili lengkap wajib diisi minimal 10 karakter.'
    isValid = false
  }

  return isValid
}

const handleNext = () => {
  if (validate()) {
    emit('next')
  }
}
</script>
