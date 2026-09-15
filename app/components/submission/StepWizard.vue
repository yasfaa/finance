<template>
  <nav aria-label="Progress Pengajuan Kredit" class="step-wizard">
    <ol class="steps-list">
      <li 
        v-for="step in steps" 
        :key="step.number"
        class="step-item"
        :class="{
          active: currentStep === step.number,
          completed: currentStep > step.number,
          disabled: currentStep < step.number
        }"
        @click="onStepClick(step.number)"
      >
        <span class="step-number" aria-hidden="true">
          <svg v-if="currentStep > step.number" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span v-else>{{ step.number }}</span>
        </span>
        <div class="step-text">
          <span class="step-title">{{ step.title }}</span>
          <span class="step-subtitle">{{ step.subtitle }}</span>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentStep: number
}>()

const emit = defineEmits<{
  (e: 'change-step', step: number): void
}>()

const steps = [
  { number: 1, title: 'Data Konsumen', subtitle: 'Identitas Pemohon' },
  { number: 2, title: 'Data Kendaraan', subtitle: 'Pilihan Unit Motor' },
  { number: 3, title: 'Skema Pinjaman', subtitle: 'Kalkulator DP & Tenor' },
  { number: 4, title: 'Unggah Berkas', subtitle: 'KTP, KK, SPK, DP' }
]

const onStepClick = (stepNumber: number) => {
  // Hanya izinkan klik kembali ke langkah yang sudah selesai atau langkah saat ini
  if (stepNumber <= props.currentStep) {
    emit('change-step', stepNumber)
  }
}
</script>
