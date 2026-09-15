# PT. JKL AutoCredit - Sistem Digitalisasi Kredit Kendaraan Bermotor

Platform aplikasi web terpadu untuk digitalisasi proses penerimaan, verifikasi, persetujuan (*approval*), dan penerbitan dokumen pembiayaan kredit kendaraan bermotor pada **PT. JKL**.

Proyek ini dibangun sebagai solusi untuk **Soal 2.a: Program Berbasis Web untuk Menunjang Digitalisasi**, mentransformasi proses operasional manual (berkas fisik, fotokopi, tanda tangan basah keliling, dan cetak dokumen fisik) menjadi ekosistem digital nir-kertas (*paperless*) yang cepat, transparan, dan terstandarisasi.

---

## 📑 Daftar Isi
- [Ikhtisar Solusi](#-ikhtisar-solusi)
- [Modul & Fitur Utama](#-modul--fitur-utama)
- [Arsitektur & Alur Modul](#-arsitektur--alur-modul)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Struktur Direktori Proyek](#-struktur-direktori-proyek)
- [Panduan Menjalankan Aplikasi](#-panduan-menjalankan-aplikasi)
- [Panduan Pengujian Sistem (Demo Walkthrough)](#-panduan-pengujian-sistem-demo-walkthrough)
- [Dokumentasi Lengkap](#-dokumentasi-lengkap)

---

## 🎯 Ikhtisar Solusi

| Aspek Operasional | Alur Kerja Manual Lama (*As-Is*) | Solusi Digital PT. JKL (*To-Be*) |
| :--- | :--- | :--- |
| **Pengumpulan Berkas** | Formulir kertas manual, fotokopi KTP, KK, SPK, dan bukti bayar tanda jadi yang rentan tercecer. | **Modul Submission**: Formulir web multi-langkah (*wizard*) terpusat dengan upload berkas digital & kompresi otomatis. |
| **Kalkulasi Kredit** | Menghitung cicilan secara manual atau tabel brosur kertas. | **Kalkulator Kredit Real-Time**: Otomatis menghitung pokok pinjaman, total bunga flat, dan angsuran bulanan. |
| **Persetujuan Atasan** | Marketing mengantar tumpukan map fisik ke meja Supervisor. | **Dashboard Approval**: Antrean persetujuan *real-time* dengan panel split-screen verifikasi data dan pratinjau dokumen asli. |
| **Penerbitan PO & Kontrak** | Admin mengetik ulang data lalu mencetak fisik (*print*) lembar PO dan Kontrak. | **Document Generator**: Sistem otomatis meng-generate lembar resmi PDF PO Dealer dan Surat Kontrak begitu status menjadi *Approved*. |
| **Pencairan Dana** | Menunggu kurir mengantar arsip basah kembali ke kantor backoffice. | Rekapitulasi digital siap cair (*Ready for Disbursement*) tanpa re-entry data. |

---

## 🚀 Modul & Fitur Utama

### 1. Modul Submission (Marketing & Sales Dealer)
- **Langkah 1: Identitas Konsumen**: Input NIK (validasi 16 digit), Nama, Tanggal Lahir (validasi usia minimal 21 tahun), Status Perkawinan, serta seksi kondisional **Data Pasangan** (Nama & NIK pasangan) jika pemohon berstatus *Kawin*.
- **Langkah 2: Data Kendaraan & Dealer**: Pilihan Dealer Rekanan, Merk, Model, Tipe, Warna, dan Harga OTR (dilengkapi fitur *1-Klik Preset Katalog Motor Terlaris*).
- **Langkah 3: Skema Pinjaman & Simulasi Finansial**:
  - Validasi Uang Muka (DP) minimal 15% sesuai regulasi OJK & PT. JKL.
  - Pilihan Tenor fleksibel (12, 24, 36, 48 Bulan).
  - Pilihan Asuransi (All Risk, TLO, Kombinasi).
  - Kotak ringkasan struktur pembiayaan & cicilan per bulan secara transparan.
- **Langkah 4: Unggah Berkas Persyaratan**: Dropzone interaktif untuk 4 dokumen wajib (KTP, KK, SPK, Bukti Bayar Tanda Jadi) dengan validasi ukuran (< 5MB) dan tombol *Isi Cepat Berkas Demo*.
- **Modal Rekapitulasi & Penomoran Resmi**: Sebelum data dikirim, pengguna dapat meninjau seluruh data. Sistem kemudian menerbitkan Nomor Pengajuan resmi (`APP-YYYYMMDD-XXXX`) dengan status `PENDING_APPROVAL`.

### 2. Modul Approval (Atasan Marketing / Credit Supervisor)
- **Kartu Metrik KPI**: Menampilkan statistik *Total Pengajuan*, *Perlu Tindakan (Pending)*, *Disetujui (Approved)*, dan *Ditolak / Revisi*.
- **Tabel Antrean Pengajuan**: Dilengkapi filter status instan dan kotak pencarian menyeluruh (*Search by Name, NIK, Dealer, Application No*).
- **Split-Screen Review Modal**:
  - Kolom kiri: Menampilkan ringkasan profil debitur, riwayat kredit, dan analisis finansial.
  - Kolom kanan: *Tab selector* untuk menginspeksi berkas digital asli (KTP, KK, SPK, Bukti Bayar).
- **3 Aksi Keputusan Supervisor**:
  - **Setujui (Approve)**: Mengubah status menjadi `APPROVED`, menerbitkan Nomor PO (`PO-YYYYMMDD-XXXX`), dan memicu *Document Generator*.
  - **Tolak (Reject)**: Menolak pengajuan dengan kewajiban mencantumkan alasan penolakan.
  - **Minta Revisi (Revise)**: Mengembalikan pengajuan ke marketing dengan catatan perbaikan berkas.

### 3. Modul Document Generator (PDF PO & Kontrak Otomatis)
- **Purchase Order (PO Dealer)**: Kop resmi PT. JKL, rincian unit motor pesanan, rincian pembayaran DP konsumen, nilai pencairan pembiayaan PT. JKL ke dealer, serta *digital signature verified*.
- **Surat Perjanjian Pembiayaan Konsumen (Akad Kredit)**: Format perjanjian legal standar memuat identitas kreditur & debitur, pasal pokok pinjaman, bunga flat tahunan, jadwal angsuran bulanan, dan jaminan fidusia.
- **Cetak & Simpan PDF**: Menggunakan *CSS Print Stylesheet* berstandar kertas A4 yang dapat langsung dicetak atau disimpan sebagai file PDF melalui browser.

---

## 🔄 Arsitektur & Alur Modul

```
[Sales / Marketing]
        │
        ▼ (1) Input Data & Upload Berkas
+-----------------------+
|   Modul Submission    |
+-----------+-----------+
            │ Status: PENDING_APPROVAL
            ▼
+-----------------------+
|    Modul Approval     | <--- [Atasan Marketing]
+-----------+-----------+
            │ Action: APPROVE
            ▼ (Otomatis Trigger Generator)
+-----------------------+
|   Document Generator  | ---> [Terbit PDF PO Dealer & Kontrak]
+-----------+-----------+
            │ Status: READY_FOR_DISBURSE
            ▼
+-----------------------+
|    Admin Backoffice   | ---> [Pencairan Dana ke Rekening Dealer]
+-----------------------+
```

---

## 🛠️ Teknologi yang Digunakan

- **Framework**: [Nuxt 4](https://nuxt.com/) (Vite 8 & Vue 3.5 Composition API)
- **Routing**: File-based Routing bawaan Nuxt
- **State Management**: Reactive Composables (`useState`) dengan persistensi otomatis ke `localStorage`
- **Styling**: Vanilla CSS Design Tokens berstandar **Anti-Slop** (WCAG AA Compliance, Zero AI-mesh gradients, Tabular Numerals untuk data keuangan, responsif mobile $\ge 44\text{px}$ tap target)
- **Tipografi**: Plus Jakarta Sans & JetBrains Mono (Google Fonts)

---

## 📂 Struktur Direktori Proyek

```
nuxt-app/
├── app/
│   ├── app.vue                                # Layout wrapper & navigasi
│   ├── assets/
│   │   └── css/
│   │       └── main.css                       # Design tokens, palet warna, tipografi, modal
│   ├── components/
│   │   ├── common/
│   │   │   └── AppHeader.vue                  # Topbar navigasi & switch modul
│   │   ├── submission/
│   │   │   ├── StepWizard.vue                 # Indikator langkah 1-4
│   │   │   ├── CustomerForm.vue               # Form identitas debitur & pasangan
│   │   │   ├── VehicleForm.vue                # Form dealer, motor & preset katalog
│   │   │   ├── LoanForm.vue                   # Kalkulator DP, tenor & cicilan
│   │   │   ├── DocumentUploader.vue           # Dropzone berkas KTP/KK/SPK/DP
│   │   │   └── SubmissionSummaryModal.vue     # Modal konfirmasi & generate no. app
│   │   ├── approval/
│   │   │   ├── MetricCards.vue                # Kartu statistik KPI antrean
│   │   │   ├── ApprovalTable.vue              # Tabel data & pencarian pengajuan
│   │   │   └── ApplicationReviewModal.vue     # Panel split-view review & aksi supervisor
│   │   └── generator/
│   │       └── DocumentGeneratorModal.vue     # Penampil PDF Purchase Order & Kontrak A4
│   ├── composables/
│   │   ├── useCreditCalculator.ts             # Logika matematika kredit & format Rupiah
│   │   └── useApplications.ts                 # State reaktif pengajuan & penyimpanan lokal
│   └── pages/
│       ├── index.vue                          # Halaman Modul 1: Form Input Pengajuan
│       └── approval.vue                       # Halaman Modul 2: Dashboard Approval
│
├── docs/
│   ├── module_flow.md                         # Alur proses modul & state lifecycle
│   ├── product_skeleton.md                    # Cetak biru arsitektur produk, ERD & API
│   └── ui_direction.md                        # Standar UI & pedoman Anti-Slop
│
├── DESIGN.md                                  # Ringkasan tokens desain & dial
├── nuxt.config.ts                             # Konfigurasi Nuxt & Google Fonts
└── package.json
```

---

## ⚡ Panduan Menjalankan Aplikasi

### 1. Prasyarat Sistem
- Node.js (versi 18.x atau lebih baru)
- npm (versi 9.x atau lebih baru)

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan Server Pengembangan (*Development Server*)
```bash
npm run dev
```
Aplikasi dapat diakses melalui browser pada alamat:
👉 **`http://localhost:3000`**

### 4. Membangun untuk Produksi (*Production Build*)
```bash
npm run build
```

---

## 🧪 Panduan Pengujian Sistem (*Demo Walkthrough*)

Untuk melihat seluruh fitur bekerja secara end-to-end:

1. **Uji Pengisian Formulir (Modul 1)**:
   - Buka `http://localhost:3000`.
   - Klik tombol **"Isi Cepat Data Demo (1-Klik)"** pada pojok kanan atas.
   - Formulir akan otomatis terisi lengkap hingga Langkah 4.
   - Klik **"Review & Kirim Pengajuan"**.
   - Pada modal ringkasan, klik **"Konfirmasi & Kirim Pengajuan"**.
   - Sistem akan menerbitkan Nomor Pengajuan resmi baru (contoh: `APP-20260915-XXXX`).
2. **Uji Persetujuan & Penerbitan Dokumen (Modul 2 & Document Generator)**:
   - Klik tombol **"Buka Dashboard Approval (Atasan)"** atau buka menu `Modul 2: Dashboard Approval`.
   - Pengajuan baru Anda akan tampil di baris teratas dengan status `PENDING_APPROVAL`.
   - Klik tombol **"Review"** di baris pengajuan tersebut.
   - Periksa data debitur di panel kiri dan klik tab berkas di panel kanan.
   - Klik tombol hijau **"Setujui (Approve & Terbitkan PO)"**.
   - Sistem akan seketika membuka **Document Generator**, menampilkan **Surat Purchase Order (PO Dealer)** lengkap dengan nomor PO resmi dan **Surat Kontrak Pembiayaan Konsumen**.
   - Klik tombol **"Cetak / Download PDF"** untuk menguji hasil cetak dokumen legal A4.

---

## 📚 Dokumentasi Lengkap

Dokumentasi rancangan sistem tersimpan rapi dalam folder `docs/`:
- 📄 **[docs/module_flow.md](file:///d:/Koding/bca/nuxt-app/docs/module_flow.md)**: Analisis As-Is vs To-Be, Mermaid Flowchart End-to-End, dan Diagram Siklus Status (*State Lifecycle*).
- 📄 **[docs/product_skeleton.md](file:///d:/Koding/bca/nuxt-app/docs/product_skeleton.md)**: Arsitektur produk, Diagram Relasi Data (ERD), Struktur Komponen, Kontrak API JSON, dan Aturan Bisnis.
- 📄 **[docs/ui_direction.md](file:///d:/Koding/bca/nuxt-app/docs/ui_direction.md)**: Pedoman UI Direction, Anti-Slop standard, palet warna korporat, dan aksesibilitas WCAG AA.
- 📄 **[DESIGN.md](file:///d:/Koding/bca/nuxt-app/DESIGN.md)**: Ringkasan token desain visual aplikasi.
