/**
 * MODUL TIME SCHEDULE & DISTRIBUSI BOBOT MINGGUAN
 * Menghitung distribusi jadwal rencana linier/kurva S dan matriks bobot mingguan
 */

export class ScheduleEngine {
  constructor(rabEngine) {
    this.rabEngine = rabEngine;
  }

  /**
   * Menghasilkan matriks jadwal dan kurva rencana untuk seluruh proyek
   */
  generateScheduleMatrix(distributionMode = 'linear') {
    const project = this.rabEngine.getProject();
    const durationWeeks = Number(project.info.durationWeeks) || 16;
    const totalDirectCost = project.summary ? project.summary.totalDirectCost : 0;

    const weeklyPlannedTotals = new Array(durationWeeks).fill(0);
    const itemSchedules = [];

    // Hitung distribusi untuk tiap item
    project.divisions.forEach(div => {
      div.items.forEach(item => {
        const itemWeight = item.weight || 0;
        let startW = Math.max(1, Math.min(Number(item.startWeek) || 1, durationWeeks));
        let endW = Math.max(startW, Math.min(Number(item.endWeek) || startW, durationWeeks));
        const itemDuration = (endW - startW) + 1;

        const weeklyWeights = new Array(durationWeeks).fill(0);

        if (itemDuration > 0 && itemWeight > 0) {
          if (distributionMode === 'linear') {
            const weightPerWeek = itemWeight / itemDuration;
            for (let w = startW; w <= endW; w++) {
              weeklyWeights[w - 1] = weightPerWeek;
              weeklyPlannedTotals[w - 1] += weightPerWeek;
            }
          } else if (distributionMode === 'bell_curve') {
            // Distribusi kurva normal bertahap
            let factors = [];
            for (let i = 0; i < itemDuration; i++) {
              const x = (i + 0.5) / itemDuration;
              const f = Math.sin(Math.PI * x);
              factors.push(f);
            }
            const sumF = factors.reduce((a, b) => a + b, 0);
            for (let i = 0; i < itemDuration; i++) {
              const wIdx = startW - 1 + i;
              const wVal = (factors[i] / sumF) * itemWeight;
              weeklyWeights[wIdx] = wVal;
              weeklyPlannedTotals[wIdx] += wVal;
            }
          }
        }

        itemSchedules.push({
          itemId: item.id,
          ahspCode: item.ahspCode,
          name: item.name,
          unit: item.unit,
          volume: item.volume,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
          weight: itemWeight,
          startWeek: startW,
          endWeek: endW,
          weeklyWeights
        });
      });
    });

    // Hitung kumulatif rencana (%)
    const cumulativePlanned = [];
    let runningPlanned = 0;
    for (let i = 0; i < durationWeeks; i++) {
      runningPlanned += weeklyPlannedTotals[i];
      // Pastikan presisi desimal 2 angka di akhir
      if (i === durationWeeks - 1 && Math.abs(runningPlanned - 100) < 0.05) {
        runningPlanned = 100.0;
      }
      cumulativePlanned.push(Number(runningPlanned.toFixed(2)));
    }

    // Hitung biaya rencana per minggu (Rp)
    const weeklyPlannedCosts = weeklyPlannedTotals.map(pct => (pct / 100) * totalDirectCost);
    const cumulativePlannedCosts = cumulativePlanned.map(pct => (pct / 100) * totalDirectCost);

    return {
      durationWeeks,
      itemSchedules,
      weeklyPlannedTotals: weeklyPlannedTotals.map(v => Number(v.toFixed(2))),
      cumulativePlanned,
      weeklyPlannedCosts,
      cumulativePlannedCosts
    };
  }
}
