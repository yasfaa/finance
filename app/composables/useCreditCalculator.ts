/**
 * Composable untuk kalkulasi kredit kendaraan bermotor PT. JKL
 * Menggunakan kaidah perhitungan bunga flat standar multifinance
 */

export function useCreditCalculator() {
  /**
   * Format number to Rupiah string (e.g. Rp 25.000.000)
   */
  const formatRupiah = (value: number | string): string => {
    const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9]/g, '')) || 0 : value
    return 'Rp ' + Math.round(num).toLocaleString('id-ID')
  }

  /**
   * Parse Rupiah input back to plain number
   */
  const parseRupiah = (value: string): number => {
    return parseFloat(value.replace(/[^0-9]/g, '')) || 0
  }

  /**
   * Hitung kalkulasi lengkap kredit:
   * - Pokok Hutang = Harga OTR - DP
   * - Bunga Flat per tahun (default 8% / tahun)
   * - Total Bunga = Pokok * (BungaPerTahun * TenorBulan / 12)
   * - Total Pinjaman = Pokok + Total Bunga
   * - Angsuran per Bulan = Total Pinjaman / TenorBulan
   */
  const calculateLoan = (params: {
    otrPrice: number
    dpAmount: number
    tenorMonths: number
    annualInterestRate?: number
  }) => {
    const { otrPrice, dpAmount, tenorMonths, annualInterestRate = 0.08 } = params

    const validOtr = Math.max(0, otrPrice)
    const validDp = Math.min(validOtr, Math.max(0, dpAmount))
    const validTenor = tenorMonths > 0 ? tenorMonths : 12

    const dpPercentage = validOtr > 0 ? Math.round((validDp / validOtr) * 100) : 0
    const loanPrincipal = Math.max(0, validOtr - validDp)

    const tenorYears = validTenor / 12
    const totalInterest = Math.round(loanPrincipal * annualInterestRate * tenorYears)
    const totalLoan = loanPrincipal + totalInterest
    const monthlyInstallment = Math.round(totalLoan / validTenor)

    return {
      otrPrice: validOtr,
      dpAmount: validDp,
      dpPercentage,
      loanPrincipal,
      totalInterest,
      totalLoan,
      monthlyInstallment,
      annualInterestRate
    }
  }

  return {
    formatRupiah,
    parseRupiah,
    calculateLoan
  }
}
