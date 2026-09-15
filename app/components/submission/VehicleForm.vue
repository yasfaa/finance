<template>
  <div class="card">
    <div class="card-header">
      <div>
        <h2>Langkah 2: Data Kendaraan & Dealer Rekanan</h2>
        <p>Tentukan dealer rekanan dan spesifikasi unit motor yang dipesan oleh calon debitur.</p>
      </div>
      <span class="badge badge-revise">Unit Motor Baru</span>
    </div>

    <!-- Quick Preset Pilihan Motor Cepat -->
    <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: var(--radius-sm); padding: 0.85rem 1rem; margin-bottom: 1.25rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <span style="font-size: 0.82rem; font-weight: 600; color: #1e40af;">Pilih Cepat dari Katalog Motor Terlaris:</span>
        <span style="font-size: 0.72rem; color: var(--text-muted);">Otomatis mengisi merk, tipe & estimasi OTR</span>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        <button 
          v-for="item in motorPresets" 
          :key="item.model"
          type="button"
          class="btn btn-secondary"
          style="min-height: 32px; padding: 0.25rem 0.65rem; font-size: 0.78rem;"
          @click="applyPreset(item)"
        >
          {{ item.brand }} {{ item.model }} ({{ formatRupiah(item.price) }})
        </button>
      </div>
    </div>

    <div class="form-grid">
      <!-- Dealer Rekanan -->
      <div class="form-group form-grid-full">
        <label for="dealerName" class="form-label">
          Nama Dealer Rekanan <span class="required">*</span>
        </label>
        <select 
          id="dealerName"
          v-model="vehicle.dealerName"
          class="form-control"
          :class="{ 'is-invalid': errors.dealerName }"
        >
          <option value="" disabled>-- Pilih Dealer Rekanan PT. JKL --</option>
          <option value="PT Nusantara Jaya Motor Sudirman">PT Nusantara Jaya Motor - Sudirman (Honda)</option>
          <option value="PT Astra Motor Jakarta Barat">PT Astra Motor - Jakarta Barat (Honda)</option>
          <option value="PT Yamaha Abadi Motor Kebon Jeruk">PT Yamaha Abadi Motor - Kebon Jeruk (Yamaha)</option>
          <option value="PT Mega Perkasa Suzuki Motor">PT Mega Perkasa - Daan Mogot (Suzuki)</option>
          <option value="PT Kawasaki Citra Motor">PT Kawasaki Citra Motor - Fatmawati (Kawasaki)</option>
        </select>
        <span v-if="errors.dealerName" class="form-error">{{ errors.dealerName }}</span>
      </div>

      <!-- Merk Kendaraan -->
      <div class="form-group">
        <label for="brand" class="form-label">
          Merk Kendaraan <span class="required">*</span>
        </label>
        <select 
          id="brand"
          v-model="vehicle.brand"
          class="form-control"
          :class="{ 'is-invalid': errors.brand }"
        >
          <option value="Honda">Honda</option>
          <option value="Yamaha">Yamaha</option>
          <option value="Suzuki">Suzuki</option>
          <option value="Kawasaki">Kawasaki</option>
        </select>
        <span v-if="errors.brand" class="form-error">{{ errors.brand }}</span>
      </div>

      <!-- Model Kendaraan -->
      <div class="form-group">
        <label for="model" class="form-label">
          Model Kendaraan <span class="required">*</span>
        </label>
        <input 
          id="model"
          v-model="vehicle.model"
          type="text"
          placeholder="Contoh: Vario 160, NMAX 155, Beat Street"
          class="form-control"
          :class="{ 'is-invalid': errors.model }"
        />
        <span v-if="errors.model" class="form-error">{{ errors.model }}</span>
      </div>

      <!-- Tipe Kendaraan -->
      <div class="form-group">
        <label for="variantType" class="form-label">
          Tipe Kendaraan / Varian <span class="required">*</span>
        </label>
        <input 
          id="variantType"
          v-model="vehicle.variantType"
          type="text"
          placeholder="Contoh: CBS, ABS, Connected, Street"
          class="form-control"
          :class="{ 'is-invalid': errors.variantType }"
        />
        <span v-if="errors.variantType" class="form-error">{{ errors.variantType }}</span>
      </div>

      <!-- Warna Kendaraan -->
      <div class="form-group">
        <label for="color" class="form-label">
          Pilihan Warna Unit <span class="required">*</span>
        </label>
        <input 
          id="color"
          v-model="vehicle.color"
          type="text"
          placeholder="Contoh: Matte Black, Pearl White, Red Metallic"
          class="form-control"
          :class="{ 'is-invalid': errors.color }"
        />
        <span v-if="errors.color" class="form-error">{{ errors.color }}</span>
      </div>

      <!-- Harga Kendaraan (Harga OTR) -->
      <div class="form-group form-grid-full">
        <label for="otrPrice" class="form-label">
          Harga Kendaraan (OTR - On The Road) <span class="required">*</span>
        </label>
        <div class="input-group">
          <span class="input-prefix">Rp</span>
          <input 
            id="otrPrice"
            type="text"
            :value="formattedOtr"
            class="form-control tabular-nums"
            style="font-size: 1.05rem; font-weight: 600;"
            :class="{ 'is-invalid': errors.otrPrice }"
            placeholder="0"
            @input="handleOtrInput"
          />
        </div>
        <span v-if="errors.otrPrice" class="form-error">{{ errors.otrPrice }}</span>
        <span v-else class="form-helper">
          Harga resmi yang disepakati dengan pihak dealer rekanan dan tercantum pada SPK.
        </span>
      </div>
    </div>

    <!-- Tombol Navigasi -->
    <div class="form-actions">
      <button type="button" class="btn btn-secondary" @click="emit('back')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Kembali ke Data Konsumen
      </button>

      <button type="button" class="btn btn-primary" @click="handleNext">
        Lanjutkan ke Skema Pinjaman
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VehicleData } from '~/composables/useApplications'
import { useCreditCalculator } from '~/composables/useCreditCalculator'

const props = defineProps<{
  modelValue: VehicleData
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: VehicleData): void
  (e: 'next'): void
  (e: 'back'): void
}>()

const { formatRupiah, parseRupiah } = useCreditCalculator()
const vehicle = reactive<VehicleData>({ ...props.modelValue })
const errors = reactive<Record<string, string>>({})

const formattedOtr = computed(() => {
  return vehicle.otrPrice ? vehicle.otrPrice.toLocaleString('id-ID') : ''
})

const motorPresets = [
  { brand: 'Honda', model: 'Vario 160', variant: 'CBS', color: 'Matte Black', price: 27500000 },
  { brand: 'Honda', model: 'Beat Street', variant: 'Street eSP', color: 'Street Black', price: 19100000 },
  { brand: 'Honda', model: 'PCX 160', variant: 'ABS', color: 'Imperial Matte Blue', price: 36800000 },
  { brand: 'Yamaha', model: 'NMAX 155', variant: 'Connected / ABS', color: 'Prestige Silver', price: 35750000 },
  { brand: 'Yamaha', model: 'Aerox 155', variant: 'Cyber City', color: 'Cyber City Special', price: 28500000 }
]

const applyPreset = (preset: typeof motorPresets[0]) => {
  vehicle.brand = preset.brand
  vehicle.model = preset.model
  vehicle.variantType = preset.variant
  vehicle.color = preset.color
  vehicle.otrPrice = preset.price
  delete errors.model
  delete errors.variantType
  delete errors.color
  delete errors.otrPrice
}

watch(vehicle, (newVal) => {
  emit('update:modelValue', { ...newVal })
}, { deep: true })

const handleOtrInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const raw = target.value.replace(/[^0-9]/g, '')
  const num = parseInt(raw, 10) || 0
  vehicle.otrPrice = num
  if (errors.otrPrice && num > 5000000) {
    delete errors.otrPrice
  }
}

const validate = (): boolean => {
  let isValid = true
  Object.keys(errors).forEach(key => delete errors[key])

  if (!vehicle.dealerName) {
    errors.dealerName = 'Pilih dealer rekanan penerima SPK.'
    isValid = false
  }

  if (!vehicle.brand) {
    errors.brand = 'Pilih merk kendaraan.'
    isValid = false
  }

  if (!vehicle.model || vehicle.model.trim().length < 2) {
    errors.model = 'Model kendaraan wajib diisi.'
    isValid = false
  }

  if (!vehicle.variantType || vehicle.variantType.trim().length < 2) {
    errors.variantType = 'Tipe / varian kendaraan wajib diisi.'
    isValid = false
  }

  if (!vehicle.color || vehicle.color.trim().length < 2) {
    errors.color = 'Pilihan warna unit wajib diisi.'
    isValid = false
  }

  if (!vehicle.otrPrice || vehicle.otrPrice < 5000000) {
    errors.otrPrice = 'Harga OTR kendaraan tidak valid (minimal Rp 5.000.000).'
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
