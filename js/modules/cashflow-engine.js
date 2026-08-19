/**
 * MODUL FINANCIAL CASHFLOW & PEMBAYARAN TERMIJN (MC)
 * Mengelola proyeksi arus kas rencana, realisasi pencairan termijn, dan potongan retensi
 */

export class CashflowEngine {
  constructor(rabEngine, scheduleEngine) {
    this.rabEngine = rabEngine;
    this.scheduleEngine = scheduleEngine;
  }

  getDefaultTermijnPlan() {
    return [
      { id: 't_dp', name: 'Uang Muka Kerja (DP 20%)', triggerPct: 0, payoutPct: 20, isPaid: true, weekDisbursed: 1, note: 'Syarat Jaminan Uang Muka diserahkan' },
      { id: 't_1', name: 'Termijn I (MC-01 - Progres 30%)', triggerPct: 30, payoutPct: 25, isPaid: false, weekDisbursed: 6, note: 'Potongan pengembalian DP 20%' },
      { id: 't_2', name: 'Termijn II (MC-02 - Progres 60%)', triggerPct: 60, payoutPct: 25, isPaid: false, weekDisbursed: 11, note: 'Potongan pengembalian DP 20%' },
      { id: 't_3', name: 'Termijn III (MC-03 - Progres 100% PHO)', triggerPct: 100, payoutPct: 25, isPaid: false, weekDisbursed: 16, note: 'Berita Acara Serah Terima Pertama' },
      { id: 't_retensi', name: 'Retensi Masa Pemeliharaan (5% FHO)', triggerPct: 100, payoutPct: 5, isPaid: false, weekDisbursed: 24, note: 'Serah Terima Akhir setelah 180 hari' }
    ];
  }

  generateCashflowProjection() {
    const project = this.rabEngine.getProject();
    const sched = this.scheduleEngine.generateScheduleMatrix();
    const grandTotal = project.summary ? project.summary.grandTotal : 0;
    const durationWeeks = sched.durationWeeks;

    const termijnList = project.termijnPlan || this.getDefaultTermijnPlan();

    const weeklyInflow = new Array(durationWeeks).fill(0);
    const cumulativeInflow = [];
    let runningInflow = 0;

    termijnList.forEach(t => {
      if (t.weekDisbursed <= durationWeeks) {
        const nominal = (t.payoutPct / 100) * grandTotal;
        weeklyInflow[t.weekDisbursed - 1] += nominal;
      }
    });

    for (let i = 0; i < durationWeeks; i++) {
      runningInflow += weeklyInflow[i];
      cumulativeInflow.push(runningInflow);
    }

    return {
      grandTotal,
      termijnList,
      weeklyInflow,
      cumulativeInflow,
      weeklyOutflow: sched.weeklyPlannedCosts,
      cumulativeOutflow: sched.cumulativePlannedCosts
    };
  }
}
