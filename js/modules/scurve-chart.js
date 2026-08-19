/**
 * MODUL DASHBOARD KURVA S & MONITORING KINERJA PROYEK
 * Render grafik Kurva S resolusi tinggi (Canvas HiDPI), Analisis Deviasi & Early Warning System (SCM)
 */

export class SCurveChart {
  constructor(canvasElement, rabEngine, scheduleEngine) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.rabEngine = rabEngine;
    this.scheduleEngine = scheduleEngine;
    this.hoverData = null;

    this.initCanvasEvents();
  }

  initCanvasEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
      this.handleMouseMove(x, y);
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.hoverData = null;
      this.render();
    });
  }

  handleMouseMove(x, y) {
    if (!this.lastRenderMetrics) return;
    const { padLeft, padRight, width, chartWidth, durationWeeks, pointsX } = this.lastRenderMetrics;

    let nearestWeek = null;
    let minDist = Infinity;

    for (let w = 1; w <= durationWeeks; w++) {
      const px = pointsX[w - 1];
      const dist = Math.abs(x - px);
      if (dist < minDist && dist < 30) {
        minDist = dist;
        nearestWeek = w;
      }
    }

    if (nearestWeek !== this.hoverData) {
      this.hoverData = nearestWeek;
      this.render();
    }
  }

  getMetrics() {
    const project = this.rabEngine.getProject();
    const sched = this.scheduleEngine.generateScheduleMatrix();
    const durationWeeks = sched.durationWeeks;
    const actuals = project.actualWeeklyProgress || {};

    const cumulativeActual = [];
    const weeklyActual = [];
    let lastRecordedWeek = 0;

    for (let w = 1; w <= durationWeeks; w++) {
      if (actuals[w] && actuals[w].percentage !== undefined && actuals[w].percentage !== null && actuals[w].percentage !== '') {
        const actVal = Number(actuals[w].percentage);
        cumulativeActual.push(actVal);
        const prevVal = w === 1 ? 0 : (cumulativeActual[w - 2] || 0);
        weeklyActual.push(Number((actVal - prevVal).toFixed(2)));
        lastRecordedWeek = w;
      } else {
        cumulativeActual.push(null);
        weeklyActual.push(null);
      }
    }

    // Deviasi pada minggu terakhir yang tercatat
    let currentDeviation = 0;
    let currentPlanned = 0;
    let currentActual = 0;
    let scmStatus = 'NORMAL'; // 'NORMAL', 'WARNING', 'CRITICAL'

    if (lastRecordedWeek > 0) {
      currentPlanned = sched.cumulativePlanned[lastRecordedWeek - 1] || 0;
      currentActual = cumulativeActual[lastRecordedWeek - 1] || 0;
      currentDeviation = Number((currentActual - currentPlanned).toFixed(2));

      if (currentDeviation < -5.0) {
        scmStatus = 'CRITICAL';
      } else if (currentDeviation < 0) {
        scmStatus = 'WARNING';
      } else {
        scmStatus = 'AHEAD';
      }
    }

    return {
      durationWeeks,
      sched,
      actuals,
      cumulativeActual,
      weeklyActual,
      lastRecordedWeek,
      currentPlanned,
      currentActual,
      currentDeviation,
      scmStatus
    };
  }

  render() {
    if (!this.canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width * dpr || 1000 * dpr;
    const height = rect.height * dpr || 460 * dpr;

    this.canvas.width = width;
    this.canvas.height = height;

    const ctx = this.ctx;
    ctx.clearRect(0, 0, width, height);

    const metrics = this.getMetrics();
    const { durationWeeks, sched, cumulativeActual, weeklyActual, lastRecordedWeek } = metrics;

    const padLeft = 65 * dpr;
    const padRight = 35 * dpr;
    const padTop = 40 * dpr;
    const padBottom = 65 * dpr;

    const chartWidth = width - padLeft - padRight;
    const chartHeight = height - padTop - padBottom;

    const pointsX = [];
    for (let w = 1; w <= durationWeeks; w++) {
      const px = padLeft + ((w - 1) / (durationWeeks - 1 || 1)) * chartWidth;
      pointsX.push(px);
    }

    this.lastRenderMetrics = { padLeft, padRight, padTop, padBottom, width, height, chartWidth, chartHeight, durationWeeks, pointsX };

    // 1. Background Grid & Y-Axis Scale
    ctx.lineWidth = 1 * dpr;
    ctx.font = `${11 * dpr}px 'Inter', sans-serif`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    const yTicks = [0, 20, 40, 60, 80, 100];
    yTicks.forEach(pct => {
      const py = padTop + chartHeight - (pct / 100) * chartHeight;
      ctx.strokeStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(padLeft, py);
      ctx.lineTo(width - padRight, py);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.fillText(`${pct}%`, padLeft - 10 * dpr, py);
    });

    // 2. X-Axis Weeks
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let w = 1; w <= durationWeeks; w++) {
      const px = pointsX[w - 1];
      ctx.strokeStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.moveTo(px, padTop);
      ctx.lineTo(px, padTop + chartHeight);
      ctx.stroke();

      ctx.fillStyle = (w === this.hoverData) ? '#1e293b' : '#64748b';
      ctx.font = (w === this.hoverData) ? `bold ${11 * dpr}px 'Inter', sans-serif` : `${10 * dpr}px 'Inter', sans-serif`;
      ctx.fillText(`M-${w}`, px, padTop + chartHeight + 8 * dpr);
    }

    // 3. Render Area Deviasi (Shading) jika ada aktual
    if (lastRecordedWeek > 0) {
      ctx.save();
      ctx.beginPath();
      // Jalur Rencana sampai lastRecordedWeek
      for (let i = 0; i < lastRecordedWeek; i++) {
        const px = pointsX[i];
        const py = padTop + chartHeight - (sched.cumulativePlanned[i] / 100) * chartHeight;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      // Jalur Aktual terbalik
      for (let i = lastRecordedWeek - 1; i >= 0; i--) {
        const px = pointsX[i];
        const py = padTop + chartHeight - ((cumulativeActual[i] || 0) / 100) * chartHeight;
        ctx.lineTo(px, py);
      }
      ctx.closePath();
      const isAhead = (cumulativeActual[lastRecordedWeek - 1] >= sched.cumulativePlanned[lastRecordedWeek - 1]);
      ctx.fillStyle = isAhead ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.15)';
      ctx.fill();
      ctx.restore();
    }

    // 4. Render Garis Kurva Rencana (Planned S-Curve - Biru)
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3 * dpr;
    ctx.beginPath();
    for (let i = 0; i < durationWeeks; i++) {
      const px = pointsX[i];
      const py = padTop + chartHeight - (sched.cumulativePlanned[i] / 100) * chartHeight;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Node Titik Rencana
    pointsX.forEach((px, i) => {
      const py = padTop + chartHeight - (sched.cumulativePlanned[i] / 100) * chartHeight;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      ctx.arc(px, py, 4 * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // 5. Render Garis Kurva Realisasi (Actual S-Curve - Hijau/Merah)
    if (lastRecordedWeek > 0) {
      const isCritical = (cumulativeActual[lastRecordedWeek - 1] - sched.cumulativePlanned[lastRecordedWeek - 1]) < -5;
      const actualColor = isCritical ? '#dc2626' : '#10b981';

      ctx.strokeStyle = actualColor;
      ctx.lineWidth = 3.5 * dpr;
      ctx.beginPath();
      for (let i = 0; i < lastRecordedWeek; i++) {
        const px = pointsX[i];
        const py = padTop + chartHeight - ((cumulativeActual[i] || 0) / 100) * chartHeight;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Node Titik Realisasi (Diamond/Square)
      for (let i = 0; i < lastRecordedWeek; i++) {
        const px = pointsX[i];
        const py = padTop + chartHeight - ((cumulativeActual[i] || 0) / 100) * chartHeight;
        ctx.fillStyle = actualColor;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2 * dpr;
        ctx.beginPath();
        ctx.arc(px, py, 5.5 * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }

    // 6. Tooltip Interaktif saat Hover
    if (this.hoverData && this.hoverData <= durationWeeks) {
      const wIdx = this.hoverData - 1;
      const px = pointsX[wIdx];
      const planVal = sched.cumulativePlanned[wIdx];
      const actVal = cumulativeActual[wIdx];
      const devVal = (actVal !== null) ? Number((actVal - planVal).toFixed(2)) : null;

      // Vertical marker
      ctx.strokeStyle = '#475569';
      ctx.setLineDash([4 * dpr, 4 * dpr]);
      ctx.lineWidth = 1.5 * dpr;
      ctx.beginPath();
      ctx.moveTo(px, padTop);
      ctx.lineTo(px, padTop + chartHeight);
      ctx.stroke();
      ctx.setLineDash([]);

      // Tooltip Card
      const tooltipW = 200 * dpr;
      const tooltipH = (actVal !== null ? 90 : 65) * dpr;
      let ttX = px + 15 * dpr;
      if (ttX + tooltipW > width - padRight) {
        ttX = px - tooltipW - 15 * dpr;
      }
      const ttY = padTop + 20 * dpr;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.shadowColor = 'rgba(0,0,0,0.25)';
      ctx.shadowBlur = 12 * dpr;
      ctx.beginPath();
      ctx.roundRect(ttX, ttY, tooltipW, tooltipH, 6 * dpr);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.font = `bold ${12 * dpr}px 'Inter', sans-serif`;
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(`Minggu ke-${this.hoverData}`, ttX + 12 * dpr, ttY + 10 * dpr);

      ctx.font = `${11 * dpr}px 'Inter', sans-serif`;
      ctx.fillStyle = '#93c5fd';
      ctx.fillText(`• Rencana: ${planVal}%`, ttX + 12 * dpr, ttY + 30 * dpr);

      if (actVal !== null) {
        ctx.fillStyle = '#6ee7b7';
        ctx.fillText(`• Realisasi: ${actVal}%`, ttX + 12 * dpr, ttY + 48 * dpr);

        ctx.fillStyle = devVal >= 0 ? '#34d399' : '#f87171';
        ctx.font = `bold ${11 * dpr}px 'Inter', sans-serif`;
        ctx.fillText(`• Deviasi: ${devVal >= 0 ? '+' : ''}${devVal}%`, ttX + 12 * dpr, ttY + 66 * dpr);
      } else {
        ctx.fillStyle = '#94a3b8';
        ctx.font = `italic ${10 * dpr}px 'Inter', sans-serif`;
        ctx.fillText(`(Belum ada input opname)`, ttX + 12 * dpr, ttY + 48 * dpr);
      }
    }
  }
}
