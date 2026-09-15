# UI Direction & Design System: Sistem Kredit Digital PT. JKL
**Standar Antarmuka Anti-Slop & Enterprise Design System**

Dokumen ini menjadi pedoman visual dan interaksi tunggal (*Single Source of Truth*) untuk pengembangan antarmuka web PT. JKL AutoCredit. Pedoman ini dirancang mengikuti kaidah **Anti-Slop** (menghindari visual generik AI) dan prinsip **Enterprise Calm UI** (mengutamakan kejelasan keputusan, keterbacaan data, serta kenyamanan kerja operasional).

---

## 1. Design Read & Dials (Prinsip Dasar)

> **Design Read**: Aplikasi web pembiayaan kredit kendaraan untuk Sales Marketing dan Credit Supervisor, dengan gaya *Calm Enterprise Financial*, menggunakan konfigurasi dial:  
> **ENERGY 1 (Tenang & Terstruktur) / RHYTHM 2 (Hierarki Konsisten) / MOTION 1 (Mikro-transisi Fungsional)**.

### Mengapa Pendekatan Ini?
- **Fokus Keputusan**: Pengguna (Marketing, Atasan, Backoffice) bekerja berjam-jam membaca angka pinjaman, NIK, dan dokumen legal. Warna dan elemen visual hanya dipakai untuk memberikan **makna status**, bukan dekorasi liar.
- **Bebas AI Slop**: Menolak gradien ungu-pink, *mesh gradient*, *excessive glassmorphism*, bentuk kapsul (*pill shape*) di semua elemen, dan animasi melayang (*floating/bouncing*) tanpa tujuan.

---

## 2. Palet Warna & Design Tokens

Sistem warna dibatasi secara ketat pada **1 warna brand korporat**, **skala netral slate**, dan **3 warna semantik status**.

```css
:root {
  /* Surface & Background */
  --bg-app: #f8fafc;              /* Slate 50: Latar belakang kanvas aplikasi */
  --bg-surface: #ffffff;          /* Putih murni: Kartu, panel, modal, tabel */
  --bg-surface-hover: #f1f5f9;    /* Slate 100: Hover baris tabel dan tombol sekunder */
  --border-subtle: #e2e8f0;       /* Slate 200: Garis pemisah & batas kartu */
  --border-strong: #cbd5e1;       /* Slate 300: Batas input form saat idle */

  /* Text & Kontras (Sesuai WCAG AA min. 4.5:1) */
  --text-primary: #0f172a;        /* Slate 900: Judul, data utama, nominal */
  --text-secondary: #475569;      /* Slate 600: Label form, deskripsi */
  --text-muted: #94a3b8;          /* Slate 400: Placeholder, keterangan tanggal */
  --text-inverse: #ffffff;        /* Putih: Teks di atas tombol utama */

  /* Primary Brand (Navy Finansial Resmi) */
  --primary: #1e40af;             /* Blue 800: Elemen utama, tombol submit aktif */
  --primary-hover: #1d4ed8;       /* Blue 700: State hover */
  --primary-light: #eff6ff;       /* Blue 50: Background tab aktif / sorotan */

  /* Semantic Status Tokens (Hanya untuk Status Bisnis) */
  --status-pending-bg: #fffbeb;   /* Amber 50 */
  --status-pending-text: #b45309; /* Amber 700: Menunggu Review Atasan */
  --status-pending-border: #fde68a;

  --status-approved-bg: #ecfdf5;  /* Emerald 50 */
  --status-approved-text: #047857;/* Emerald 700: Disetujui & Siap Terbit Dokumen */
  --status-approved-border: #a7f3d0;

  --status-rejected-bg: #fef2f2;  /* Rose 50 */
  --status-rejected-text: #b91c1c;/* Rose 700: Ditolak */
  --status-rejected-border: #fecaca;

  --status-revise-bg: #eff6ff;    /* Sky 50 */
  --status-revise-text: #0284c7;  /* Sky 700: Butuh Revisi Dokumen */
  --status-revise-border: #bae6fd;
}
```

---

## 3. Tipografi & Tabular Angka

Menggunakan font modern yang berfokus pada keterbacaan formulir dan dokumen legal:

- **Font Utama**: `'Plus Jakarta Sans'`, `'Inter'`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`.
- **Angka Finansial & Kode Identitas**: Wajib menggunakan *tabular numerals* agar angka nominal rupiah, tenor, dan NIK sejajar secara vertikal:
  ```css
  .tabular-nums, .currency, .nik-field, td.amount {
    font-variant-numeric: tabular-nums;
    font-feature-settings: 'tnum';
  }
  ```
- **Hierarki Tipografi**:
  - `H1 / Page Title`: 22px / Semi-bold (600) / Tracking normal.
  - `H2 / Section Title`: 16px / Semi-bold (600).
  - `Body Text`: 14px / Regular (400) / Line-height 1.5.
  - `Form Label`: 13px / Medium (500) / Warna Slate 700.
  - `Helper / Microcopy`: 12px / Regular (400) / Warna Slate 500.

---

## 4. Bentuk Geometris & Spacing (Layout Rules)

1. **Border Radius Terukur**:
   - Input, tombol, select box: `6px` atau `8px`.
   - Card panel, modal pop-up: `8px` atau `10px`.
   - **Aturan Tegas Anti-Slop**: Tidak menggunakan bentuk pil/kapsul penuh (`rounded-full`) untuk card, kontainer input, ataupun layout utama.
2. **Elevasi & Bayangan (Shadow)**:
   - Gunakan bayangan halus (*soft elevation*) untuk membedakan lapisan:
     ```css
     --shadow-card: 0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04);
     --shadow-modal: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04);
     ```
   - Dilarang membuat efek glow berwarna neon atau bayangan kabur yang berlebihan.
3. **Spacing Grid**:
   - Berbasis kelipatan 4px/8px (`8px`, `12px`, `16px`, `24px`, `32px`).

---

## 5. Kaidah Anti-Slop & Craftsmanship (R-Rules Compliance)

Untuk memastikan UI tidak terlihat seperti hasil *template AI generik*, standar berikut wajib diterapkan:

| Kode Aturan | Aturan Khusus | Penerapan Nyata di Sistem Ini |
| :--- | :--- | :--- |
| **R-02 (Copywriting)** | **DILARANG** menggunakan karakter *em dash* (`—`) di teks antarmuka. | Gunakan koma (`,`), titik (`.`), tanda hubung biasa (`-`), atau kurung `()`. |
| **R-03 (Responsiveness)** | Tampilan mobile harus bekerja rapi tanpa horizontal scroll. | Minimal tap target `44px` untuk tombol di layar sentuh, grid form berubah menjadi 1 kolom saat layar ponsel. |
| **R-15 & R-16 (CTA & Diksi)**| Hindari tombol generik (*Get Started*, *Explore*) dan kata *buzzword* (*AI Powered, Revolutionary*). | Gunakan kalimat tindakan operasional jelas: **"Kirim Pengajuan Kredit"**, **"Setujui Pengajuan"**, **"Tolak Pengajuan"**, **"Unduh Dokumen PO"**. |
| **R-25 (Contrast)** | Memenuhi standar WCAG AA (kontras minimal 4.5:1). | Teks abu-abu muda di atas background putih dilarang; label menggunakan Slate 700 (`#334155`). |
| **R-26 (Interaktivitas)** | Semua tombol dan navigasi harus berfungsi nyata. | Tidak ada tombol mati. Modal approval dapat dibuka, ditutup, dan memiliki tombol konfirmasi yang mengubah state data. |
| **R-27 (State Lengkap)** | Setiap modul memiliki 3 state: Normal, Kosong (*Empty*), dan Memuat (*Loading*). | Tabel approval menyajikan *Empty State* informatif saat antrean bersih, dan indikator *loading skeleton* saat memproses. |
| **R-32 (Aksesibilitas)** | Dapat dinavigasi via keyboard. | Modal dapat ditutup menggunakan tombol `Escape`, input memiliki `:focus-visible` ring warna biru yang jelas. |

---

## 6. Standar Komponen Utama

### A. Form Input Pengajuan (Modul Submission)
- **Step Wizard Navigasi**:
  - Langkah 1: Data Pemohon / Konsumen
  - Langkah 2: Data Kendaraan & Dealer
  - Langkah 3: Skema Kredit & Angsuran
  - Langkah 4: Unggah Berkas Persyaratan
- **Kalkulator Angsuran Real-Time**:
  - Input Down Payment (DP) otomatis menghitung persentase DP, pokok hutang, dan angsuran per bulan secara transparan.
- **Upload Box Interaktif**:
  - Dropzone berkas KTP, KK, SPK, dan Bukti Bayar dengan indikator nama file, ukuran berkas, dan tombol hapus/ganti file.

### B. Dashboard Approval (Modul Atasan Marketing)
- **Statistik Metrik Sederhana**:
  - 4 Kartu metrik: Total Pengajuan, Butuh Review Segera, Disetujui Bulan Ini, Ditolak.
- **Tabel Data Antrean**:
  - Kolom terstruktur: Nomor Pengajuan, Tanggal, Nama Konsumen, Dealer & Unit, Plafon Pinjaman, Tenor, Status, dan Tombol Aksi.
  - Teks rata kiri untuk nama/dealer, rata kanan untuk nominal uang, rata tengah untuk status/tanggal.
- **Modal Review Split-Screen**:
  - Bagian Kiri: Ringkasan data kredit dan riwayat pemohon.
  - Bagian Kanan: Preview dokumen (KTP/KK) dengan fungsi zoom.
  - Bagian Bawah: Tombol aksi **Setujui (Approve)**, **Kembalikan (Revise)**, dan **Tolak (Reject)** dengan input alasan wajib.

### C. Generator Dokumen (Modal Preview PDF)
- Lembar pratinjau dokumen berformat A4 dengan tata letak surat resmi:
  - Header kop surat PT. JKL Perkreditan Motor.
  - Rincian Purchase Order (PO) ke Dealer resmi.
  - Rincian Akad Pembiayaan Konsumen dan jadwal angsuran.
  - Tombol aksi: **Cetak Dokumen** dan **Simpan PDF Digital**.
