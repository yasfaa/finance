/**
 * Composable untuk manajemen data pengajuan kredit PT. JKL
 * Terhubung secara reaktif antara Modul Submission (Marketing) dan Modul Approval (Atasan)
 */

export interface CustomerData {
  nik: string
  fullName: string
  birthDate: string
  maritalStatus: 'BELUM_KAWIN' | 'KAWIN' | 'CERAI'
  spouseName?: string
  spouseNik?: string
  phoneNumber: string
  address: string
}

export interface VehicleData {
  dealerName: string
  brand: string
  model: string
  variantType: string
  color: string
  otrPrice: number
}

export interface LoanData {
  dpAmount: number
  dpPercentage: number
  tenorMonths: number
  insuranceType: 'ALL_RISK' | 'TLO' | 'KOMBINASI'
  interestRate: number
  loanPrincipal: number
  monthlyInstallment: number
}

export interface DocumentAttachment {
  type: 'KTP' | 'KK' | 'SPK' | 'BUKTI_BAYAR'
  title: string
  fileName: string
  fileSize: string
  fileType: string
  previewUrl?: string
  uploadedAt: string
}

export interface CreditApplication {
  id: string
  applicationNo: string
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'REVISION_REQUIRED' | 'DISBURSED'
  submittedAt: string
  marketingName: string
  customer: CustomerData
  vehicle: VehicleData
  loan: LoanData
  documents: DocumentAttachment[]
  reviewerNotes?: string
  reviewedAt?: string
  reviewedBy?: string
  poNumber?: string
}

// Sample data awal agar sistem langsung dapat diuji coba
const initialApplications: CreditApplication[] = [
  {
    id: 'app-001',
    applicationNo: 'APP-20260915-0001',
    status: 'PENDING_APPROVAL',
    submittedAt: '2026-09-15 09:30',
    marketingName: 'Dimas Aditya (Sales Dealer Honda Sudirman)',
    customer: {
      nik: '3271021508920003',
      fullName: 'Rian Pratama',
      birthDate: '1992-08-15',
      maritalStatus: 'KAWIN',
      spouseName: 'Dewi Lestari',
      spouseNik: '3271025506940001',
      phoneNumber: '081288992233',
      address: 'Jl. Merdeka No. 45, Kebayoran Baru, Jakarta Selatan'
    },
    vehicle: {
      dealerName: 'PT Nusantara Jaya Motor Sudirman',
      brand: 'Honda',
      model: 'Vario 160',
      variantType: 'CBS',
      color: 'Matte Black',
      otrPrice: 27500000
    },
    loan: {
      dpAmount: 5500000,
      dpPercentage: 20,
      tenorMonths: 36,
      insuranceType: 'ALL_RISK',
      interestRate: 0.08,
      loanPrincipal: 22000000,
      monthlyInstallment: 757778
    },
    documents: [
      { type: 'KTP', title: 'KTP Pemohon', fileName: 'ktp_rian_pratama.jpg', fileSize: '1.2 MB', fileType: 'image/jpeg', uploadedAt: '2026-09-15 09:20' },
      { type: 'KK', title: 'Kartu Keluarga', fileName: 'kk_keluarga_rian.pdf', fileSize: '2.1 MB', fileType: 'application/pdf', uploadedAt: '2026-09-15 09:22' },
      { type: 'SPK', title: 'Surat Pesanan Kendaraan', fileName: 'spk_honda_vario.pdf', fileSize: '850 KB', fileType: 'application/pdf', uploadedAt: '2026-09-15 09:25' },
      { type: 'BUKTI_BAYAR', title: 'Bukti Bayar Tanda Jadi', fileName: 'transfer_dp_tanda_jadi.jpg', fileSize: '980 KB', fileType: 'image/jpeg', uploadedAt: '2026-09-15 09:28' }
    ]
  },
  {
    id: 'app-002',
    applicationNo: 'APP-20260914-0015',
    status: 'APPROVED',
    submittedAt: '2026-09-14 14:15',
    marketingName: 'Siti Rahayu (Sales Dealer Yamaha Kebon Jeruk)',
    customer: {
      nik: '3174092201880005',
      fullName: 'Ahmad Fauzi',
      birthDate: '1988-01-22',
      maritalStatus: 'BELUM_KAWIN',
      phoneNumber: '085611223344',
      address: 'Jl. Palmerah Barat No. 18, Jakarta Barat'
    },
    vehicle: {
      dealerName: 'PT Yamaha Abadi Motor',
      brand: 'Yamaha',
      model: 'NMAX 155',
      variantType: 'Connected / ABS',
      color: 'Prestige Silver',
      otrPrice: 35750000
    },
    loan: {
      dpAmount: 8937500,
      dpPercentage: 25,
      tenorMonths: 24,
      insuranceType: 'ALL_RISK',
      interestRate: 0.08,
      loanPrincipal: 26812500,
      monthlyInstallment: 1295938
    },
    documents: [
      { type: 'KTP', title: 'KTP Pemohon', fileName: 'ktp_ahmad_fauzi.jpg', fileSize: '1.4 MB', fileType: 'image/jpeg', uploadedAt: '2026-09-14 14:05' },
      { type: 'KK', title: 'Kartu Keluarga', fileName: 'kk_ahmad.pdf', fileSize: '1.8 MB', fileType: 'application/pdf', uploadedAt: '2026-09-14 14:08' },
      { type: 'SPK', title: 'Surat Pesanan Kendaraan', fileName: 'spk_nmax.pdf', fileSize: '900 KB', fileType: 'application/pdf', uploadedAt: '2026-09-14 14:10' },
      { type: 'BUKTI_BAYAR', title: 'Bukti Bayar Tanda Jadi', fileName: 'kuitansi_dp_dealer.jpg', fileSize: '1.1 MB', fileType: 'image/jpeg', uploadedAt: '2026-09-14 14:12' }
    ],
    reviewedBy: 'Bambang Sudarmono (Credit Supervisor)',
    reviewedAt: '2026-09-14 16:30',
    reviewerNotes: 'Kapasitas bayar sangat baik, riwayat BI Checking lancar. Disetujui.',
    poNumber: 'PO-20260914-0015'
  }
]

export function useApplications() {
  const applications = useState<CreditApplication[]>('jkl_applications', () => {
    // Inisialisasi dari localStorage jika tersedia di browser
    if (import.meta.client) {
      const stored = localStorage.getItem('jkl_credit_applications_v1')
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch (e) {
          console.error('Failed to parse stored applications', e)
        }
      }
    }
    return initialApplications
  })

  // Sinkronkan ke localStorage setiap ada perubahan
  const persist = () => {
    if (import.meta.client) {
      localStorage.setItem('jkl_credit_applications_v1', JSON.stringify(applications.value))
    }
  }

  /**
   * Submit pengajuan baru dari Modul Submission
   */
  const submitNewApplication = (payload: {
    customer: CustomerData
    vehicle: VehicleData
    loan: LoanData
    documents: DocumentAttachment[]
  }): CreditApplication => {
    const today = new Date()
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '')
    const randomSeq = Math.floor(1000 + Math.random() * 9000)
    const appNo = `APP-${dateStr}-${randomSeq}`

    const newApp: CreditApplication = {
      id: 'app-' + Date.now(),
      applicationNo: appNo,
      status: 'PENDING_APPROVAL',
      submittedAt: today.toISOString().replace('T', ' ').slice(0, 16),
      marketingName: 'Budi Santoso (Marketing Officer PT. JKL)',
      customer: { ...payload.customer },
      vehicle: { ...payload.vehicle },
      loan: { ...payload.loan },
      documents: [...payload.documents]
    }

    // Sisipkan di awal daftar (paling baru di atas)
    applications.value = [newApp, ...applications.value]
    persist()

    return newApp
  }

  /**
   * Keputusan Atasan Marketing (Approval Modul)
   */
  const decideApplication = (
    id: string,
    decision: 'APPROVE' | 'REJECT' | 'REVISE',
    notes: string,
    supervisorName: string = 'Hendro Wicaksono (Supervisor)'
  ) => {
    const today = new Date()
    const index = applications.value.findIndex((app) => app.id === id)
    if (index !== -1) {
      const app = { ...applications.value[index] }
      app.reviewedAt = today.toISOString().replace('T', ' ').slice(0, 16)
      app.reviewedBy = supervisorName
      app.reviewerNotes = notes

      if (decision === 'APPROVE') {
        app.status = 'APPROVED'
        // Otomatis terbitkan nomor PO
        app.poNumber = `PO-${today.toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`
      } else if (decision === 'REJECT') {
        app.status = 'REJECTED'
      } else {
        app.status = 'REVISION_REQUIRED'
      }

      applications.value[index] = app
      applications.value = [...applications.value]
      persist()
    }
  }

  /**
   * Reset ke data bawaan untuk demo
   */
  const resetDemoData = () => {
    applications.value = [...initialApplications]
    persist()
  }

  return {
    applications,
    submitNewApplication,
    decideApplication,
    resetDemoData
  }
}
