<template>
  <div class="card" style="padding: 0; overflow: hidden;">
    <!-- Filter & Search Toolbar -->
    <div style="padding: 1rem 1.25rem; border-bottom: 1px solid var(--border-subtle); background-color: #fafbfc; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
      <!-- Filter Status Pills -->
      <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
        <button 
          v-for="filter in filterOptions" 
          :key="filter.value"
          type="button"
          class="btn btn-secondary"
          style="min-height: 32px; padding: 0.2rem 0.65rem; font-size: 0.78rem;"
          :style="selectedFilter === filter.value ? 'background-color: var(--primary); color: #fff; border-color: var(--primary); font-weight: 600;' : ''"
          @click="selectedFilter = filter.value"
        >
          {{ filter.label }}
          <span 
            style="display: inline-block; padding: 0.05rem 0.35rem; border-radius: 10px; font-size: 0.7rem; margin-left: 0.25rem;"
            :style="selectedFilter === filter.value ? 'background: rgba(255,255,255,0.25); color: #fff;' : 'background: #e2e8f0; color: var(--text-secondary);'"
          >
            {{ getCountForFilter(filter.value) }}
          </span>
        </button>
      </div>

      <!-- Search Input -->
      <div style="min-width: 260px; position: relative;">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari nama, NIK, dealer, atau no. aplikasi..."
          class="form-control"
          style="padding-left: 2rem; min-height: 34px; font-size: 0.82rem;"
        />
        <svg 
          width="14" 
          height="14" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
          style="position: absolute; left: 0.65rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
    </div>

    <!-- Data Table -->
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem;">
        <thead>
          <tr style="background-color: #f1f5f9; border-bottom: 1px solid var(--border-subtle); color: var(--text-secondary); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.5px;">
            <th style="padding: 0.85rem 1rem;">No. Pengajuan & Waktu</th>
            <th style="padding: 0.85rem 1rem;">Konsumen & NIK</th>
            <th style="padding: 0.85rem 1rem;">Unit Kendaraan & Dealer</th>
            <th style="padding: 0.85rem 1rem; text-align: right;">Harga OTR</th>
            <th style="padding: 0.85rem 1rem; text-align: right;">Angsuran / Bln</th>
            <th style="padding: 0.85rem 1rem; text-align: center;">Tenor</th>
            <th style="padding: 0.85rem 1rem; text-align: center;">Status</th>
            <th style="padding: 0.85rem 1rem; text-align: center;">Aksi Keputusan</th>
          </tr>
        </thead>

        <!-- Normal State: Menampilkan Daftar Data -->
        <tbody v-if="filteredApplications.length > 0">
          <tr 
            v-for="app in filteredApplications" 
            :key="app.id"
            style="border-bottom: 1px solid var(--border-subtle); transition: background-color 150ms ease;"
            class="table-row-hover"
          >
            <!-- No. Pengajuan & Tanggal -->
            <td style="padding: 0.85rem 1rem;">
              <div class="tabular-nums" style="font-weight: 700; color: var(--primary);">
                {{ app.applicationNo }}
              </div>
              <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.15rem;">
                {{ app.submittedAt }}
              </div>
              <div style="font-size: 0.7rem; color: #64748b; margin-top: 0.2rem;">
                Sales: {{ app.marketingName.split('(')[0] }}
              </div>
            </td>

            <!-- Konsumen & NIK -->
            <td style="padding: 0.85rem 1rem;">
              <div style="font-weight: 600; color: var(--text-primary);">{{ app.customer.fullName }}</div>
              <div class="tabular-nums" style="font-size: 0.75rem; color: var(--text-muted);">
                NIK: {{ app.customer.nik }}
              </div>
              <div style="font-size: 0.72rem; color: var(--text-secondary); margin-top: 0.15rem;">
                Status: {{ app.customer.maritalStatus }}
              </div>
            </td>

            <!-- Kendaraan & Dealer -->
            <td style="padding: 0.85rem 1rem;">
              <div style="font-weight: 600; color: var(--text-primary);">
                {{ app.vehicle.brand }} {{ app.vehicle.model }} ({{ app.vehicle.variantType }})
              </div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">
                Warna: {{ app.vehicle.color }}
              </div>
              <div style="font-size: 0.75rem; color: #1e40af; margin-top: 0.2rem;">
                {{ app.vehicle.dealerName }}
              </div>
            </td>

            <!-- OTR Price -->
            <td class="tabular-nums" style="padding: 0.85rem 1rem; text-align: right; font-weight: 600;">
              {{ formatRupiah(app.vehicle.otrPrice) }}
              <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: normal;">
                DP {{ app.loan.dpPercentage }}% ({{ formatRupiah(app.loan.dpAmount) }})
              </div>
            </td>

            <!-- Cicilan / Bulan -->
            <td class="tabular-nums" style="padding: 0.85rem 1rem; text-align: right; font-weight: 700; color: var(--primary); font-size: 0.95rem;">
              {{ formatRupiah(app.loan.monthlyInstallment) }}
              <div style="font-size: 0.7rem; color: #047857; font-weight: normal;">
                Pokok: {{ formatRupiah(app.loan.loanPrincipal) }}
              </div>
            </td>

            <!-- Tenor -->
            <td style="padding: 0.85rem 1rem; text-align: center;">
              <span class="badge" style="background-color: #f1f5f9; border: 1px solid var(--border-subtle);">
                {{ app.loan.tenorMonths }} Bln
              </span>
            </td>

            <!-- Status Badge -->
            <td style="padding: 0.85rem 1rem; text-align: center;">
              <span 
                class="badge"
                :class="{
                  'badge-pending': app.status === 'PENDING_APPROVAL',
                  'badge-approved': app.status === 'APPROVED',
                  'badge-rejected': app.status === 'REJECTED',
                  'badge-revise': app.status === 'REVISION_REQUIRED'
                }"
              >
                {{ app.status === 'PENDING_APPROVAL' ? 'MENUNGGU APPROVAL' : app.status }}
              </span>
              <div v-if="app.poNumber" style="font-size: 0.68rem; color: #047857; margin-top: 0.25rem; font-weight: 600;">
                PO: {{ app.poNumber }}
              </div>
            </td>

            <!-- Aksi Keputusan / Action -->
            <td style="padding: 0.85rem 1rem; text-align: center; white-space: nowrap;">
              <div style="display: flex; gap: 0.35rem; justify-content: center; align-items: center;">
                <!-- Tombol Review Pengajuan -->
                <button 
                  type="button" 
                  class="btn btn-secondary"
                  style="min-height: 32px; padding: 0.25rem 0.65rem; font-size: 0.78rem;"
                  @click="emit('review', app)"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  Review
                </button>

                <!-- Tombol Lihat PDF jika status Approved -->
                <button 
                  v-if="app.status === 'APPROVED'"
                  type="button" 
                  class="btn btn-success"
                  style="min-height: 32px; padding: 0.25rem 0.65rem; font-size: 0.78rem;"
                  title="Lihat Dokumen PO & Kontrak Digital"
                  @click="emit('view-doc', app)"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  Dokumen PO
                </button>
              </div>
            </td>
          </tr>
        </tbody>

        <!-- Empty State (R-27: Kejelasan UI saat data kosong) -->
        <tbody v-else>
          <tr>
            <td colspan="8" style="padding: 3rem 1rem; text-align: center; color: var(--text-muted);">
              <div style="width: 48px; height: 48px; border-radius: 50%; background-color: #f1f5f9; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem auto; color: var(--text-secondary);">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">
                Tidak ada pengajuan yang sesuai kriteria pencarian
              </div>
              <p style="font-size: 0.82rem; max-width: 400px; margin: 0 auto 1rem auto;">
                Coba ganti kata kunci pencarian atau ubah filter status di atas untuk melihat data lainnya.
              </p>
              <button 
                type="button" 
                class="btn btn-secondary"
                style="min-height: 32px; padding: 0.25rem 0.75rem; font-size: 0.78rem;"
                @click="resetFilter"
              >
                Reset Filter Pencarian
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CreditApplication } from '~/composables/useApplications'
import { useCreditCalculator } from '~/composables/useCreditCalculator'

const props = defineProps<{
  applications: CreditApplication[]
  currentFilter: string
}>()

const emit = defineEmits<{
  (e: 'review', app: CreditApplication): void
  (e: 'view-doc', app: CreditApplication): void
  (e: 'update:filter', status: string): void
}>()

const { formatRupiah } = useCreditCalculator()
const searchQuery = ref('')
const selectedFilter = ref(props.currentFilter || 'ALL')

watch(() => props.currentFilter, (val) => {
  selectedFilter.value = val || 'ALL'
})

watch(selectedFilter, (val) => {
  emit('update:filter', val)
})

const filterOptions = [
  { value: 'ALL', label: 'Semua Status' },
  { value: 'PENDING_APPROVAL', label: 'Menunggu Approval' },
  { value: 'APPROVED', label: 'Disetujui (PO Ready)' },
  { value: 'REJECTED', label: 'Ditolak' },
  { value: 'REVISION_REQUIRED', label: 'Butuh Revisi' }
]

const getCountForFilter = (status: string) => {
  if (status === 'ALL') return props.applications.length
  return props.applications.filter(a => a.status === status).length
}

const filteredApplications = computed(() => {
  let list = props.applications

  // Filter status
  if (selectedFilter.value !== 'ALL') {
    list = list.filter(a => a.status === selectedFilter.value)
  }

  // Filter search
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(a => 
      a.applicationNo.toLowerCase().includes(q) ||
      a.customer.fullName.toLowerCase().includes(q) ||
      a.customer.nik.includes(q) ||
      a.vehicle.dealerName.toLowerCase().includes(q) ||
      a.vehicle.model.toLowerCase().includes(q) ||
      (a.poNumber && a.poNumber.toLowerCase().includes(q))
    )
  }

  return list
})

const resetFilter = () => {
  searchQuery.value = ''
  selectedFilter.value = 'ALL'
}
</script>

<style scoped>
.table-row-hover:hover {
  background-color: var(--bg-surface-hover);
}
</style>
