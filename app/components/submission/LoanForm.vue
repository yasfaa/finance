<template>
  <div class="card">
    <div class="card-header">
      <div>
        <h2>Langkah 3: Skema Pinjaman & Simulasi Finansial</h2>
        <p>Tentukan nominal uang muka (DP), jangka waktu kredit (tenor), dan jenis asuransi kendaraan.</p>
      </div>
      <span class="badge badge-pending">Kalkulasi Otomatis</span>
    </div>

    <!-- Alert Edukasi Syarat DP Minimum -->
    <div class="alert alert-info">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 2px;">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
      <div>
        <strong>Ketentuan Uang Muka (DP):</strong> Sesuai regulasi OJK & kebijakan PT. JKL, minimal DP kendaraan bermotor adalah <strong>15%</strong> dari Harga OTR (Untuk OTR {{ formatRupiah(otrPrice) }}, minimal DP adalah {{ formatRupiah(minDpAmount) }}).
      </div>
    </div>

    <div class="form-grid">
      <!-- Input Nominal Uang Muka (DP) -->
      <div class="form-group">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <label for="dpAmount" class="form-label">
            Uang Muka (Down Payment / DP) <span class="required">*</span>
          </label>
          <span class="badge badge-revise" style="font-size: 0.75rem;">
            {{ loan.dpPercentage }}% dari OTR
          </span>
        </div>
        <div class="input-group">
          <span class="input-prefix">Rp</span>
          <input 
            id="dpAmount"
            type="text"
            :value="formattedDp"
            class="form-control tabular-nums"
            style="font-size: 1.05rem; font-weight: 600;"
            :class="{ 'is-invalid': errors.dpAmount }"
            placeholder="0"
            @input="handleDpInput"
          />
        </div>
        <span v-if="errors.dpAmount" class="form-error">{{ errors.dpAmount }}</span>

        <!-- Quick DP Buttons -->
        <div style="display: flex; gap: 0.4rem; margin-top: 0.4rem;">
          <button 
            v-for="pct in [15, 20, 25, 30, 40]" 
            :key="pct"
            type="button" 
            class="btn btn-secondary"
            style="min-height: 28px; padding: 0.15rem 0.5rem; font-size: 0.75rem;"
            :style="loan.dpPercentage === pct ? 'border-color: var(--primary); background-color: var(--primary-light); color: var(--primary); font-weight: 700;' : ''"
            @click="setDpByPercentage(pct)"
          >
            {{ pct }}%
          </button>
        </div>
      </div>

      <!-- Tenor / Lama Kredit (Bulan) -->
      <div class="form-group">
        <label class="form-label">
          Jangka Waktu Kredit (Tenor) <span class="required">*</span>
        </label>
        <div class="segmented-group">
          <button 
            v-for="tenor in [12, 24, 36, 48]" 
            :key="tenor"
            type="button" 
            class="segmented-btn" 
            :class="{ active: loan.tenorMonths === tenor }"
            @click="setTenor(tenor)"
          >
            {{ tenor }} Bln ({{ tenor / 12 }} Thn)
          </button>
        </div>
        <span class="form-helper" style="margin-top: 0.4rem;">
          Suku bunga flat kompetitif <strong>8.00% per tahun</strong>.
        </span>
      </div>

      <!-- Jenis Asuransi Kendaraan -->
      <div class="form-group form-grid-full">
        <label class="form-label">
          Jenis Perlindungan Asuransi <span class="required">*</span>
        </label>
        <div class="segmented-group">
          <button 
            type="button" 
            class="segmented-btn" 
            :class="{ active: loan.insuranceType === 'ALL_RISK' }"
            @click="loan.insuranceType = 'ALL_RISK'"
          >
            All Risk (Perlindungan Penuh Kerusakan & Kehilangan)
          </button>
          <button 
            type="button" 
            class="segmented-btn" 
            :class="{ active: loan.insuranceType === 'TLO' }"
            @click="loan.insuranceType = 'TLO'"
          >
            TLO (Total Loss Only / Kehilangan Saja)
          </button>
          <button 
            type="button" 
            class="segmented-btn" 
            :class="{ active: loan.insuranceType === 'KOMBINASI' }"
            @click="loan.insuranceType = 'KOMBINASI'"
          >
            Kombinasi (1 Thn All Risk + Sisanya TLO)
          </button>
        </div>
      </div>
    </div>

    <!-- Ringkasan Finansial Real-Time (Calculation Summary) -->
    <div class="calc-summary-box">
      <div class="calc-summary-header">
        <span>Struktur Pembiayaan & Estimasi Cicilan</span>
        <span style="font-size: 0.75rem; font-weight: 500; color: var(--text-muted);">Perhitungan Otomatis Sistem</span>
      </div>

      <div class="calc-row">
        <span class="calc-label">Harga OTR Kendaraan</span>
        <span class="calc-value tabular-nums">{{ formatRupiah(calcResult.otrPrice) }}</span>
      </div>

      <div class="calc-row">
        <span class="calc-label">Uang Muka Pembayaran (DP)</span>
        <span class="calc-value tabular-nums" style="color: #047857;">
          - {{ formatRupiah(calcResult.dpAmount) }} ({{ calcResult.dpPercentage }}%)
        </span>
      </div>

      <div class="calc-row">
        <span class="calc-label">Pokok Hutang Pinjaman</span>
        <span class="calc-value tabular-nums">{{ formatRupiah(calcResult.loanPrincipal) }}</span>
      </div>

      <div class="calc-row">
        <span class="calc-label">Total Bunga ({{ loan.tenorMonths }} Bulan @ 8%/thn)</span>
        <span class="calc-value tabular-nums">{{ formatRupiah(calcResult.totalInterest) }}</span>
      </div>

      <div class="calc-row">
        <span class="calc-label">Total Pembiayaan Kontrak</span>
        <span class="calc-value tabular-nums">{{ formatRupiah(calcResult.totalLoan) }}</span>
      </div>

      <div class="calc-highlight">
        <div>
          <div class="calc-highlight-label">Angsuran per Bulan (Cicilan)</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">
            Tenor {{ loan.tenorMonths }} bulan pembayaran
          </div>
        </div>
        <div class="calc-highlight-value tabular-nums">
          {{ formatRupiah(calcResult.monthlyInstallment) }}
          <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-secondary);">/ bln</span>
        </div>
      </div>
    </div>

    <!-- Tombol Navigasi -->
    <div class="form-actions">
      <button type="button" class="btn btn-secondary" @click="emit('back')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Kembali ke Data Kendaraan
      </button>

      <button type="button" class="btn btn-primary" @click="handleNext">
        Lanjutkan ke Unggah Dokumen
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LoanData } from '~/composables/useApplications'
import { useCreditCalculator } from '~/composables/useCreditCalculator'

const props = defineProps<{
  modelValue: LoanData
  otrPrice: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: LoanData): void
  (e: 'next'): void
  (e: 'back'): void
}>()

const { formatRupiah, calculateLoan } = useCreditCalculator()
const loan = reactive<LoanData>({ ...props.modelValue })
const errors = reactive<Record<string, string>>({})

const minDpAmount = computed(() => Math.round(props.otrPrice * 0.15))

const formattedDp = computed(() => {
  return loan.dpAmount ? loan.dpAmount.toLocaleString('id-ID') : ''
})

const calcResult = computed(() => {
  return calculateLoan({
    otrPrice: props.otrPrice,
    dpAmount: loan.dpAmount,
    tenorMonths: loan.tenorMonths,
    annualInterestRate: loan.interestRate || 0.08
  })
})

// Sinkronkan kalkulasi ke state
watch(calcResult, (res) => {
  loan.dpPercentage = res.dpPercentage
  loan.loanPrincipal = res.loanPrincipal
  loan.monthlyInstallment = res.monthlyInstallment
  emit('update:modelValue', { ...loan })
}, { immediate: true })

const handleDpInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const raw = target.value.replace(/[^0-9]/g, '')
  const num = parseInt(raw, 10) || 0
  loan.dpAmount = num
  if (num >= minDpAmount.value) {
    delete errors.dpAmount
  }
}

const setDpByPercentage = (pct: number) => {
  loan.dpAmount = Math.round(props.otrPrice * (pct / 100))
  delete errors.dpAmount
}

const setTenor = (tenor: number) => {
  loan.tenorMonths = tenor
}

const validate = (): boolean => {
  let isValid = true
  Object.keys(errors).forEach(key => delete errors[key])

  if (!loan.dpAmount || loan.dpAmount < minDpAmount.value) {
    errors.dpAmount = `Uang muka (DP) minimal 15% dari OTR yaitu ${formatRupiah(minDpAmount.value)}.`
    isValid = false
  }

  if (!loan.tenorMonths) {
    errors.tenorMonths = 'Pilih jangka waktu kredit.'
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
