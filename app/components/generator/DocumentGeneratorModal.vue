<template>
  <div class="modal-overlay" @keydown.esc="emit('close')" tabindex="-1">
    <div 
      class="modal-content" 
      style="max-width: 850px; height: 92vh;"
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="doc-modal-title"
    >
      <!-- Modal Header -->
      <div class="modal-header">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="badge badge-approved" style="font-size: 0.72rem;">DOCUMENT GENERATOR</span>
            <h3 id="doc-modal-title" style="font-size: 1.15rem; font-weight: 700;">
              Dokumen Otomatis Pengajuan: {{ application.applicationNo }}
            </h3>
          </div>
          <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">
            Diterbitkan otomatis oleh sistem saat pengajuan berstatus <strong>APPROVED</strong>.
          </p>
        </div>

        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <button 
            type="button" 
            class="btn btn-primary" 
            style="min-height: 32px; padding: 0.25rem 0.75rem; font-size: 0.8rem;"
            @click="triggerPrint"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Cetak / Download PDF
          </button>

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
      </div>

      <!-- Selector Dokumen: PO Dealer vs Kontrak Pembiayaan -->
      <div style="padding: 0.75rem 1.25rem; background-color: #f1f5f9; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; gap: 0.5rem;">
          <button 
            type="button" 
            class="btn btn-secondary"
            style="min-height: 32px; padding: 0.2rem 0.75rem; font-size: 0.8rem;"
            :style="activeDocTab === 'PO' ? 'background-color: var(--primary); color: #fff; border-color: var(--primary); font-weight: 600;' : ''"
            @click="activeDocTab = 'PO'"
          >
            1. Purchase Order (PO Dealer)
          </button>
          <button 
            type="button" 
            class="btn btn-secondary"
            style="min-height: 32px; padding: 0.2rem 0.75rem; font-size: 0.8rem;"
            :style="activeDocTab === 'KONTRAK' ? 'background-color: var(--primary); color: #fff; border-color: var(--primary); font-weight: 600;' : ''"
            @click="activeDocTab = 'KONTRAK'"
          >
            2. Perjanjian Kontrak Kredit Konsumen
          </button>
        </div>

        <span class="badge badge-approved" style="font-size: 0.75rem;">
          No. PO: {{ application.poNumber || 'PO-20260915-0012' }}
        </span>
      </div>

      <!-- Modal Body (Format Kertas A4 Dokumen Legal) -->
      <div class="modal-body" style="background-color: #525659; padding: 1.5rem; display: flex; justify-content: center; overflow-y: auto;">
        <!-- Kertas Lembar Dokumen Putih A4 -->
        <div 
          id="printable-doc"
          style="width: 100%; max-width: 680px; background-color: #ffffff; color: #0f172a; padding: 2.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.3); font-family: 'Times New Roman', serif; line-height: 1.4; border-radius: 2px;"
        >
          <!-- KOP SURAT RESMI PT. JKL -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 0.75rem; margin-bottom: 1.25rem;">
            <div>
              <h1 style="font-size: 1.35rem; font-weight: 700; color: #1e3a8a; letter-spacing: 0.5px; font-family: sans-serif;">
                PT. JKL PERKREDITAN MULTIFINANCE
              </h1>
              <div style="font-size: 0.8rem; color: #475569; font-family: sans-serif;">
                Gedung Menara Finansial Lt. 14, Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan
              </div>
              <div style="font-size: 0.75rem; color: #64748b; font-family: sans-serif;">
                Telp: (021) 555-8899 | Email: credit.operation@jkl-multifinance.co.id
              </div>
            </div>
            <div style="text-align: right;">
              <div style="border: 2px solid #1e40af; color: #1e40af; font-family: sans-serif; font-weight: 800; font-size: 0.82rem; padding: 0.3rem 0.6rem; border-radius: 4px; text-transform: uppercase;">
                {{ activeDocTab === 'PO' ? 'PURCHASE ORDER' : 'SURAT KONTRAK' }}
              </div>
            </div>
          </div>

          <!-- DOKUMEN 1: PURCHASE ORDER (PO DEALER) -->
          <div v-if="activeDocTab === 'PO'">
            <div style="text-align: center; margin-bottom: 1.5rem;">
              <h2 style="font-size: 1.15rem; font-weight: 700; text-decoration: underline; text-transform: uppercase;">
                SURAT PESANAN PEMBIAYAAN KENDARAAN (PURCHASE ORDER)
              </h2>
              <div style="font-size: 0.85rem; font-family: sans-serif; margin-top: 0.25rem;">
                Nomor: <strong>{{ application.poNumber || 'PO-20260915-0012' }}</strong>
              </div>
            </div>

            <div style="font-size: 0.85rem; margin-bottom: 1rem;">
              <table style="width: 100%; font-size: 0.85rem; border-collapse: collapse;">
                <tr>
                  <td style="width: 120px; padding: 2px 0;">Kepada Yth.</td>
                  <td style="width: 10px;">:</td>
                  <td><strong>Pimpinan {{ application.vehicle.dealerName }}</strong></td>
                </tr>
                <tr>
                  <td style="padding: 2px 0;">Perihal</td>
                  <td>:</td>
                  <td>Pemberitahuan Persetujuan Pembiayaan & Konfirmasi Unit</td>
                </tr>
                <tr>
                  <td style="padding: 2px 0;">Tanggal Terbit</td>
                  <td>:</td>
                  <td>{{ todayDateFormatted }}</td>
                </tr>
              </table>
            </div>

            <p style="font-size: 0.85rem; text-align: justify; margin-bottom: 0.75rem;">
              Dengan hormat,<br />
              Sehubungan dengan pengajuan kredit kendaraan bermotor melalui fasilitas pembiayaan PT. JKL Perkreditan Multifinance, dengan ini kami sampaikan bahwa permohonan kredit berikut telah <strong>DISETUJUI (APPROVED)</strong>:
            </p>

            <!-- Tabel Data Konsumen & Kendaraan -->
            <table style="width: 100%; font-size: 0.82rem; border: 1px solid #000; border-collapse: collapse; margin-bottom: 1rem;">
              <tr style="background-color: #f1f5f9;">
                <th colspan="2" style="border: 1px solid #000; padding: 4px 8px; text-align: left; font-family: sans-serif;">
                  A. DATA KONSUMEN / PEMBELI
                </th>
              </tr>
              <tr>
                <td style="width: 180px; border: 1px solid #000; padding: 4px 8px;">Nama Konsumen</td>
                <td style="border: 1px solid #000; padding: 4px 8px;"><strong>{{ application.customer.fullName }}</strong></td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 4px 8px;">Nomor Induk Kependudukan (NIK)</td>
                <td style="border: 1px solid #000; padding: 4px 8px;">{{ application.customer.nik }}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 4px 8px;">Alamat Domisili</td>
                <td style="border: 1px solid #000; padding: 4px 8px;">{{ application.customer.address }}</td>
              </tr>
              <tr style="background-color: #f1f5f9;">
                <th colspan="2" style="border: 1px solid #000; padding: 4px 8px; text-align: left; font-family: sans-serif;">
                  B. RINCIAN KENDARAAN BERMOTOR
                </th>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 4px 8px;">Merk / Model / Varian</td>
                <td style="border: 1px solid #000; padding: 4px 8px;">
                  {{ application.vehicle.brand }} {{ application.vehicle.model }} ({{ application.vehicle.variantType }})
                </td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 4px 8px;">Pilihan Warna Unit</td>
                <td style="border: 1px solid #000; padding: 4px 8px;">{{ application.vehicle.color }}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 4px 8px;">Harga On The Road (OTR)</td>
                <td style="border: 1px solid #000; padding: 4px 8px; font-weight: 700;">
                  {{ formatRupiah(application.vehicle.otrPrice) }}
                </td>
              </tr>
              <tr style="background-color: #f1f5f9;">
                <th colspan="2" style="border: 1px solid #000; padding: 4px 8px; text-align: left; font-family: sans-serif;">
                  C. KETENTUAN PENCAIRAN DANA KE DEALER
                </th>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 4px 8px;">Uang Muka (DP) dari Konsumen</td>
                <td style="border: 1px solid #000; padding: 4px 8px;">
                  {{ formatRupiah(application.loan.dpAmount) }} (Disetor langsung ke dealer)
                </td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 4px 8px; font-weight: 700; color: #1e40af;">
                  Jumlah Tagihan Cair PT. JKL
                </td>
                <td style="border: 1px solid #000; padding: 4px 8px; font-weight: 700; color: #1e40af; font-size: 0.95rem;">
                  {{ formatRupiah(application.loan.loanPrincipal) }}
                </td>
              </tr>
            </table>

            <p style="font-size: 0.8rem; text-align: justify; margin-bottom: 1.5rem;">
              Mohon agar unit kendaraan disiapkan dan diserahterimakan kepada konsumen setelah Surat Perjanjian Pembiayaan ditandatangani. Pencairan dana sebesar <strong>{{ formatRupiah(application.loan.loanPrincipal) }}</strong> akan ditransfer oleh Admin Backoffice PT. JKL ke rekening resmi dealer rekanan.
            </p>

            <!-- Tanda Tangan PO -->
            <div style="display: flex; justify-content: space-between; margin-top: 1.5rem; font-size: 0.85rem;">
              <div style="text-align: center; width: 220px;">
                <div>Konfirmasi Penerimaan Dealer,</div>
                <div style="height: 55px;"></div>
                <div style="border-bottom: 1px solid #000; font-weight: 700;">( {{ application.vehicle.dealerName }} )</div>
                <div style="font-size: 0.72rem; color: #64748b;">Cap & Tanda Tangan Dealer</div>
              </div>

              <div style="text-align: center; width: 220px;">
                <div>Jakarta, {{ todayDateFormatted }}</div>
                <div>PT. JKL Multifinance Indonesia</div>
                <div style="height: 15px;"></div>
                <div style="display: inline-block; padding: 2px 6px; border: 1px solid #10b981; color: #047857; font-size: 0.65rem; font-family: sans-serif; border-radius: 3px;">
                  ✓ DIGITAL SIGNATURE VERIFIED
                </div>
                <div style="height: 15px;"></div>
                <div style="border-bottom: 1px solid #000; font-weight: 700;">( Bambang Sudarmono )</div>
                <div style="font-size: 0.72rem; color: #64748b;">Credit Approval Supervisor</div>
              </div>
            </div>
          </div>

          <!-- DOKUMEN 2: KONTRAK PERJANJIAN PEMBIAYAAN KONSUMEN -->
          <div v-else>
            <div style="text-align: center; margin-bottom: 1.5rem;">
              <h2 style="font-size: 1.15rem; font-weight: 700; text-decoration: underline; text-transform: uppercase;">
                SURAT PERJANJIAN PEMBIAYAAN KONSUMEN (KREDIT)
              </h2>
              <div style="font-size: 0.85rem; font-family: sans-serif; margin-top: 0.25rem;">
                Nomor Perjanjian: <strong>KTR-{{ application.applicationNo.replace('APP-', '') }}</strong>
              </div>
            </div>

            <p style="font-size: 0.82rem; text-align: justify; margin-bottom: 0.75rem;">
              Pada hari ini, tanggal <strong>{{ todayDateFormatted }}</strong>, dibuat dan disepakati perjanjian fasilitas pembiayaan antara:
            </p>

            <div style="font-size: 0.82rem; margin-left: 1rem; margin-bottom: 0.75rem;">
              <div>1. <strong>PT. JKL PERKREDITAN MULTIFINANCE</strong>, berkedudukan di Jakarta, bertindak sebagai <strong>KREDITUR (Pemberi Pembiayaan)</strong>.</div>
              <div style="margin-top: 0.35rem;">
                2. <strong>{{ application.customer.fullName }}</strong>, NIK: {{ application.customer.nik }}, beralamat di {{ application.customer.address }}, bertindak sebagai <strong>DEBITUR (Konsumen)</strong>.
              </div>
            </div>

            <p style="font-size: 0.82rem; margin-bottom: 0.75rem;">
              Kedua belah pihak sepakat mengikatkan diri dengan ketentuan pokok pembiayaan sebagai berikut:
            </p>

            <!-- Tabel Ketentuan Finansial -->
            <table style="width: 100%; font-size: 0.82rem; border: 1px solid #000; border-collapse: collapse; margin-bottom: 1rem;">
              <tr style="background-color: #f1f5f9;">
                <th colspan="2" style="border: 1px solid #000; padding: 4px 8px; text-align: left; font-family: sans-serif;">
                  PASAL I: KETENTUAN POKOK PINJAMAN & ANGSURAN
                </th>
              </tr>
              <tr>
                <td style="width: 220px; border: 1px solid #000; padding: 4px 8px;">Objek Unit Kendaraan</td>
                <td style="border: 1px solid #000; padding: 4px 8px;">{{ application.vehicle.brand }} {{ application.vehicle.model }} ({{ application.vehicle.color }})</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 4px 8px;">Nilai Pokok Pembiayaan</td>
                <td style="border: 1px solid #000; padding: 4px 8px; font-weight: 700;">{{ formatRupiah(application.loan.loanPrincipal) }}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 4px 8px;">Jangka Waktu Pembiayaan (Tenor)</td>
                <td style="border: 1px solid #000; padding: 4px 8px;">{{ application.loan.tenorMonths }} Bulan Pembayaran</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 4px 8px;">Tingkat Suku Bunga Flat</td>
                <td style="border: 1px solid #000; padding: 4px 8px;">8.00% per tahun</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 4px 8px; font-weight: 700; color: #1e40af;">Besaran Angsuran per Bulan</td>
                <td style="border: 1px solid #000; padding: 4px 8px; font-weight: 700; color: #1e40af; font-size: 0.92rem;">
                  {{ formatRupiah(application.loan.monthlyInstallment) }} / bulan
                </td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 4px 8px;">Jenis Perlindungan Asuransi</td>
                <td style="border: 1px solid #000; padding: 4px 8px;">{{ application.loan.insuranceType }}</td>
              </tr>
            </table>

            <div style="font-size: 0.78rem; text-align: justify; margin-bottom: 1.5rem; color: #334155;">
              <strong>PASAL II: JAMINAN FIDUSIA & KETENTUAN HUKUM</strong><br />
              Debitur setuju menyerahkan hak kepemilikan BPKB atas unit kendaraan bermotor yang dibiayai kepada Kreditur sebagai Jaminan Fidusia sampai seluruh kewajiban pinjaman dilunasi secara penuh.
            </div>

            <!-- Tanda Tangan Kontrak -->
            <div style="display: flex; justify-content: space-between; margin-top: 1.5rem; font-size: 0.85rem;">
              <div style="text-align: center; width: 220px;">
                <div>DEBITUR (KONSUMEN),</div>
                <div style="height: 15px;"></div>
                <div style="display: inline-block; padding: 2px 6px; border: 1px dashed #64748b; color: #64748b; font-size: 0.65rem; font-family: sans-serif;">
                  Materai Rp 10.000 / E-Sign
                </div>
                <div style="height: 15px;"></div>
                <div style="border-bottom: 1px solid #000; font-weight: 700;">( {{ application.customer.fullName }} )</div>
                <div style="font-size: 0.72rem; color: #64748b;">Debitur Utama</div>
              </div>

              <div style="text-align: center; width: 220px;">
                <div>KREDITUR (PT. JKL),</div>
                <div style="height: 15px;"></div>
                <div style="display: inline-block; padding: 2px 6px; border: 1px solid #10b981; color: #047857; font-size: 0.65rem; font-family: sans-serif; border-radius: 3px;">
                  ✓ DIGITAL SIGNATURE VERIFIED
                </div>
                <div style="height: 15px;"></div>
                <div style="border-bottom: 1px solid #000; font-weight: 700;">( Bambang Sudarmono )</div>
                <div style="font-size: 0.72rem; color: #64748b;">Credit Approval Supervisor</div>
              </div>
            </div>
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
}>()

const { formatRupiah } = useCreditCalculator()
const activeDocTab = ref<'PO' | 'KONTRAK'>('PO')

const todayDateFormatted = computed(() => {
  const d = new Date()
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
})

const triggerPrint = () => {
  if (import.meta.client) {
    window.print()
  }
}
</script>

<style>
@media print {
  body * {
    visibility: hidden;
  }
  #printable-doc, #printable-doc * {
    visibility: visible;
  }
  #printable-doc {
    position: absolute;
    left: 0;
    top: 0;
    width: 100% !important;
    max-width: 100% !important;
    box-shadow: none !important;
    padding: 1.5cm !important;
  }
}
</style>
