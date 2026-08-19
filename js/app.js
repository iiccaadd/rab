/**
 * APLIKASI UTAMA (MAIN APP ORCHESTRATOR)
 * SIPRO-KALTENG 2026
 * Sistem Informasi Manajemen Proyek, RAB, BOQ Volume Calculator & Kurva S
 * Wilayah: Muara Teweh (Kab. Barito Utara) & Kota Palangka Raya (Semester II 2026)
 */

import { AhspEngine } from './modules/ahsp-engine.js';
import { RabEngine, formatRupiah } from './modules/rab-engine.js';
import { ScheduleEngine } from './modules/schedule-engine.js';
import { SCurveChart } from './modules/scurve-chart.js';
import { CashflowEngine } from './modules/cashflow-engine.js';
import { StorageExportManager } from './modules/storage-export.js';
import { BOQ_CALCULATORS, getCalculatorById } from './modules/boq-engine.js';
import { MASTER_UPAH, MASTER_BAHAN, MASTER_ALAT, REGIONS } from './data/regional-prices-2026.js';

class SiproApp {
  constructor() {
    this.ahspEngine = new AhspEngine('MUARA_TEWEH');
    this.rabEngine = new RabEngine(this.ahspEngine);
    this.scheduleEngine = new ScheduleEngine(this.rabEngine);
    this.cashflowEngine = new CashflowEngine(this.rabEngine, this.scheduleEngine);
    
    this.currentView = 'dashboard';
    this.activeCalculatorId = BOQ_CALCULATORS[0].id;
    this.activeDistributionMode = 'linear';

    this.init();
  }

  init() {
    // 1. Cek LocalStorage
    const savedData = StorageExportManager.loadProject();
    if (savedData) {
      this.rabEngine.setProject(savedData);
    } else {
      this.rabEngine.recalculateAll();
    }

    // 2. Setup DOM Event Listeners
    this.setupEventListeners();

    // 3. Inisialisasi Canvas Kurva S
    const canvas = document.getElementById('scurveCanvas');
    if (canvas) {
      this.scurveChart = new SCurveChart(canvas, this.rabEngine, this.scheduleEngine);
    }

    // 4. Inisialisasi Kalkulator BOQ
    this.renderBoqSidebar();
    this.renderActiveBoqCalculator();

    // 5. Render View Awal
    this.updateRegionSelectors();
    this.refreshCurrentView();

    // Notifikasi Awal
    this.showToast(`SIPRO-KALTENG 2026 Siap Digunakan (${this.ahspEngine.getRegionInfo().name})`);
  }

  setupEventListeners() {
    // Nav Tabs
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetView = btn.dataset.view;
        this.switchView(targetView);
      });
    });

    // Regional Switcher
    const regionSelect = document.getElementById('regionSelect');
    if (regionSelect) {
      regionSelect.addEventListener('change', (e) => {
        const newRegion = e.target.value;
        this.rabEngine.setRegion(newRegion);
        this.autoSave();
        this.refreshCurrentView();
        this.showToast(`Wilayah acuan diubah ke: ${this.ahspEngine.getRegionInfo().name}`);
      });
    }

    // Export & Action Buttons
    const btnExportJson = document.getElementById('btnExportJson');
    if (btnExportJson) {
      btnExportJson.addEventListener('click', () => {
        StorageExportManager.exportToJson(this.rabEngine.getProject(), `Proyek_${this.rabEngine.getProject().info.name.replace(/\s+/g, '_')}_2026.json`);
        this.showToast('File JSON Proyek berhasil diunduh');
      });
    }

    const btnImportJson = document.getElementById('btnImportJson');
    const inputImportJson = document.getElementById('inputImportJson');
    if (btnImportJson && inputImportJson) {
      btnImportJson.addEventListener('click', () => inputImportJson.click());
      inputImportJson.addEventListener('change', async (e) => {
        if (e.target.files && e.target.files[0]) {
          try {
            const importedData = await StorageExportManager.importFromJson(e.target.files[0]);
            this.rabEngine.setProject(importedData);
            this.autoSave();
            this.updateRegionSelectors();
            this.refreshCurrentView();
            this.showToast('Proyek berhasil diimpor!');
          } catch (err) {
            alert('Gagal mengimpor: ' + err.message);
          }
          inputImportJson.value = '';
        }
      });
    }

    const btnExportRabCsv = document.getElementById('btnExportRabCsv');
    if (btnExportRabCsv) {
      btnExportRabCsv.addEventListener('click', () => {
        StorageExportManager.exportRabToCsv(this.rabEngine.getProject());
        this.showToast('RAB berhasil diekspor ke format Spreadsheet/CSV');
      });
    }

    const btnPrint = document.getElementById('btnPrint');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        StorageExportManager.triggerPrint();
      });
    }

    // Reset Default Project
    const btnResetProject = document.getElementById('btnResetProject');
    if (btnResetProject) {
      btnResetProject.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin memuat ulang contoh proyek standar 2026? Data yang diedit akan diperbarui.')) {
          this.rabEngine.project = this.rabEngine.createDefaultProject();
          this.rabEngine.recalculateAll();
          this.autoSave();
          this.updateRegionSelectors();
          this.refreshCurrentView();
          this.showToast('Contoh proyek standar berhasil dimuat ulang');
        }
      });
    }

    // Edit Project Info Modal
    const btnEditProjectInfo = document.getElementById('btnEditProjectInfo');
    if (btnEditProjectInfo) {
      btnEditProjectInfo.addEventListener('click', () => this.openProjectInfoModal());
    }

    // Form Project Info Submit
    const formProjectInfo = document.getElementById('formProjectInfo');
    if (formProjectInfo) {
      formProjectInfo.addEventListener('submit', (e) => {
        e.preventDefault();
        const proj = this.rabEngine.getProject();
        proj.info.name = document.getElementById('projNameInput').value;
        proj.info.owner = document.getElementById('projOwnerInput').value;
        proj.info.location = document.getElementById('projLocationInput').value;
        proj.info.contractNo = document.getElementById('projContractNoInput').value;
        proj.info.contractor = document.getElementById('projContractorInput').value;
        proj.info.consultant = document.getElementById('projConsultantInput').value;
        proj.info.durationWeeks = Number(document.getElementById('projDurationInput').value) || 16;
        proj.info.overheadProfitRate = Number(document.getElementById('projOverheadInput').value) || 10;
        proj.info.ppnRate = Number(document.getElementById('projPpnInput').value) || 11;
        
        this.rabEngine.recalculateAll();
        this.autoSave();
        this.closeModal('modalProjectInfo');
        this.refreshCurrentView();
        this.showToast('Informasi proyek berhasil disimpan');
      });
    }

    // Tambah Divisi Modal Trigger
    const btnAddDivision = document.getElementById('btnAddDivision');
    if (btnAddDivision) {
      btnAddDivision.addEventListener('click', () => {
        const divName = prompt('Masukkan Nama Kelompok / Divisi Pekerjaan Baru:');
        if (divName && divName.trim()) {
          this.rabEngine.addDivision(divName.trim());
          this.autoSave();
          this.renderRabView();
          this.showToast(`Divisi ${divName.toUpperCase()} ditambahkan`);
        }
      });
    }

    // Modal Close Buttons
    document.querySelectorAll('.modal-close-btn, .btn-modal-cancel').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
      });
    });

    // Form Add Item Submit
    const formAddItem = document.getElementById('formAddItem');
    if (formAddItem) {
      formAddItem.addEventListener('submit', (e) => {
        e.preventDefault();
        const divisionId = document.getElementById('addItemDivisionId').value;
        const source = document.getElementById('addItemSource').value;
        
        let itemData = {};
        if (source === 'ahsp') {
          const ahspCode = document.getElementById('addItemAhspSelect').value;
          const ahspItem = this.ahspEngine.getAhspByCode(ahspCode);
          if (!ahspItem) return;
          itemData = {
            ahspCode: ahspItem.code,
            name: ahspItem.name,
            unit: ahspItem.unit,
            volume: Number(document.getElementById('addItemVolume').value) || 1,
            startWeek: Number(document.getElementById('addItemStartWeek').value) || 1,
            endWeek: Number(document.getElementById('addItemEndWeek').value) || 4
          };
        } else {
          itemData = {
            ahspCode: 'CUSTOM',
            name: document.getElementById('addItemCustomName').value,
            unit: document.getElementById('addItemCustomUnit').value,
            volume: Number(document.getElementById('addItemVolume').value) || 1,
            unitPrice: Number(document.getElementById('addItemCustomPrice').value) || 0,
            startWeek: Number(document.getElementById('addItemStartWeek').value) || 1,
            endWeek: Number(document.getElementById('addItemEndWeek').value) || 4
          };
        }

        this.rabEngine.addItem(divisionId, itemData);
        this.autoSave();
        this.closeModal('modalAddItem');
        this.renderRabView();
        this.showToast('Item pekerjaan berhasil ditambahkan ke RAB');
      });
    }

    // Switch sumber item AHSP vs Custom di Modal
    const addItemSource = document.getElementById('addItemSource');
    if (addItemSource) {
      addItemSource.addEventListener('change', (e) => {
        const isAhsp = (e.target.value === 'ahsp');
        document.getElementById('ahspSelectGroup').style.display = isAhsp ? 'block' : 'none';
        document.getElementById('customItemFieldsGroup').style.display = isAhsp ? 'none' : 'block';
      });
    }

    // Schedule Distribution Mode Switcher
    const schedDistSelect = document.getElementById('schedDistModeSelect');
    if (schedDistSelect) {
      schedDistSelect.addEventListener('change', (e) => {
        this.activeDistributionMode = e.target.value;
        this.renderScheduleView();
        if (this.scurveChart) this.scurveChart.render();
      });
    }

    // Opname Form Submit
    const formOpname = document.getElementById('formOpname');
    if (formOpname) {
      formOpname.addEventListener('submit', (e) => {
        e.preventDefault();
        const week = Number(document.getElementById('opnameWeekSelect').value);
        const percentage = Number(document.getElementById('opnamePercentage').value);
        const note = document.getElementById('opnameNote').value;
        const weatherGood = Number(document.getElementById('opnameWeatherGood').value) || 6;
        const weatherRain = Number(document.getElementById('opnameWeatherRain').value) || 1;

        const proj = this.rabEngine.getProject();
        if (!proj.actualWeeklyProgress) proj.actualWeeklyProgress = {};
        
        proj.actualWeeklyProgress[week] = {
          date: new Date().toISOString().split('T')[0],
          percentage,
          note,
          weatherGood,
          weatherRain
        };

        this.autoSave();
        this.refreshCurrentView();
        this.showToast(`Data Opname Fisik Minggu ke-${week} berhasil disimpan!`);
      });
    }

    // Database Filters
    const dbSearchInput = document.getElementById('dbSearchInput');
    const dbDivisionFilter = document.getElementById('dbDivisionFilter');
    if (dbSearchInput) {
      dbSearchInput.addEventListener('input', () => this.renderDatabaseView());
    }
    if (dbDivisionFilter) {
      dbDivisionFilter.addEventListener('change', () => this.renderDatabaseView());
    }
  }

  autoSave() {
    StorageExportManager.saveProject(this.rabEngine.getProject());
  }

  switchView(viewId) {
    this.currentView = viewId;
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewId);
    });
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.toggle('active', sec.id === `view_${viewId}`);
    });

    this.refreshCurrentView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateRegionSelectors() {
    const regionSelect = document.getElementById('regionSelect');
    const currentReg = this.rabEngine.getProject().info.regionId || 'MUARA_TEWEH';
    if (regionSelect) {
      regionSelect.value = currentReg;
    }
  }

  refreshCurrentView() {
    this.renderKpiSummary();

    switch (this.currentView) {
      case 'dashboard':
        this.renderDashboardView();
        break;
      case 'boq':
        this.renderActiveBoqCalculator();
        break;
      case 'rab':
        this.renderRabView();
        break;
      case 'schedule':
        this.renderScheduleView();
        break;
      case 'scurve':
        this.renderSCurveView();
        break;
      case 'cashflow':
        this.renderCashflowView();
        break;
      case 'database':
        this.renderDatabaseView();
        break;
    }
  }

  renderKpiSummary() {
    const proj = this.rabEngine.getProject();
    const sum = proj.summary || {};
    const metrics = this.scurveChart ? this.scurveChart.getMetrics() : null;

    // Nilai Kontrak
    const elContractVal = document.getElementById('kpiContractValue');
    if (elContractVal) elContractVal.textContent = formatRupiah(sum.grandTotal);

    // Progres Fisik Saat Ini
    const elActualProg = document.getElementById('kpiActualProgress');
    const elTargetProg = document.getElementById('kpiTargetProgress');
    const elDeviation = document.getElementById('kpiDeviation');
    const elStatusBadge = document.getElementById('kpiStatusBadge');

    if (metrics && metrics.lastRecordedWeek > 0) {
      if (elActualProg) elActualProg.textContent = `${metrics.currentActual}%`;
      if (elTargetProg) elTargetProg.textContent = `Target M-${metrics.lastRecordedWeek}: ${metrics.currentPlanned}%`;
      
      if (elDeviation) {
        elDeviation.textContent = `${metrics.currentDeviation >= 0 ? '+' : ''}${metrics.currentDeviation}%`;
        elDeviation.className = metrics.currentDeviation >= 0 ? 'kpi-value text-success' : 'kpi-value text-danger';
      }

      if (elStatusBadge) {
        if (metrics.scmStatus === 'CRITICAL') {
          elStatusBadge.innerHTML = `<span class="badge badge-danger">KONTRAK KRITIS (SCM)</span>`;
        } else if (metrics.scmStatus === 'WARNING') {
          elStatusBadge.innerHTML = `<span class="badge badge-warning">DEVIASI RINGAN</span>`;
        } else {
          elStatusBadge.innerHTML = `<span class="badge badge-success">ON TRACK / AHEAD</span>`;
        }
      }
    } else {
      if (elActualProg) elActualProg.textContent = '0.00%';
      if (elTargetProg) elTargetProg.textContent = 'Belum ada opname';
      if (elDeviation) elDeviation.textContent = '0.00%';
      if (elStatusBadge) elStatusBadge.innerHTML = `<span class="badge badge-info">SIAP DIMULAI</span>`;
    }
  }

  // ==========================================
  // VIEW: DASHBOARD
  // ==========================================
  renderDashboardView() {
    const proj = this.rabEngine.getProject();
    const sum = proj.summary || {};

    // Render Mini Meta
    const elName = document.getElementById('dashProjName');
    const elOwner = document.getElementById('dashProjOwner');
    const elLoc = document.getElementById('dashProjLoc');
    const elDur = document.getElementById('dashProjDur');

    if (elName) elName.textContent = proj.info.name;
    if (elOwner) elOwner.textContent = proj.info.owner;
    if (elLoc) elLoc.textContent = `${proj.info.location} [${this.ahspEngine.getRegionInfo().name}]`;
    if (elDur) elDur.textContent = `${proj.info.durationWeeks} Minggu (${proj.info.durationWeeks * 7} Hari Kalender)`;

    // Render S-Curve Canvas
    if (this.scurveChart) {
      setTimeout(() => this.scurveChart.render(), 50);
    }

    // Render Divisi Summary List
    const divContainer = document.getElementById('dashDivisionsList');
    if (divContainer) {
      divContainer.innerHTML = proj.divisions.map((d, idx) => `
        <div style="display:flex; justify-content:space-between; padding:0.65rem 0; border-bottom:1px solid #f1f5f9; font-size:0.85rem;">
          <span style="font-weight:600;">${d.code} - ${d.name}</span>
          <span style="font-family:var(--font-mono); font-weight:700; color:var(--primary-700);">${formatRupiah(d.subtotal)} <small style="color:#64748b; font-weight:normal;">(${(d.weight || 0).toFixed(2)}%)</small></span>
        </div>
      `).join('');
    }
  }

  // ==========================================
  // VIEW: BOQ VOLUME CALCULATOR
  // ==========================================
  renderBoqSidebar() {
    const container = document.getElementById('boqSidebarMenu');
    if (!container) return;

    container.innerHTML = BOQ_CALCULATORS.map(calc => `
      <button class="boq-menu-item ${calc.id === this.activeCalculatorId ? 'active' : ''}" data-id="${calc.id}">
        <span class="boq-menu-category">${calc.category}</span>
        <span>${calc.name}</span>
      </button>
    `).join('');

    container.querySelectorAll('.boq-menu-item').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeCalculatorId = btn.dataset.id;
        this.renderBoqSidebar();
        this.renderActiveBoqCalculator();
      });
    });
  }

  renderActiveBoqCalculator() {
    const calc = getCalculatorById(this.activeCalculatorId);
    const container = document.getElementById('boqActiveCalcArea');
    if (!calc || !container) return;

    // Collect default values
    const currentVals = {};
    calc.inputs.forEach(inp => {
      currentVals[inp.id] = inp.default;
    });

    container.innerHTML = `
      <div class="boq-calculator-card">
        <div class="boq-header">
          <span class="badge badge-primary" style="margin-bottom:0.5rem;">${calc.category}</span>
          <h2 class="boq-title">${calc.name}</h2>
          <p class="boq-desc">${calc.description}</p>
        </div>

        <div class="boq-formula-box">
          <div>
            <div class="boq-formula-label">Formula Standar Geometri / Struktur:</div>
            <div style="font-size:1.1rem; margin-top:0.25rem;">${calc.formulaDisplay}</div>
          </div>
          <span style="font-size:1.5rem;">📐</span>
        </div>

        <h4 style="font-size:0.95rem; font-weight:700; margin-bottom:0.75rem; color:#1e293b;">Input Dimensi & Parameter Teknis:</h4>
        <div class="boq-inputs-grid" id="boqInputsContainer">
          ${calc.inputs.map(inp => `
            <div class="form-group">
              <label class="form-label">${inp.label}</label>
              ${inp.options ? `
                <select class="form-select boq-param-input" data-id="${inp.id}">
                  ${inp.options.map(opt => {
                    const val = typeof opt === 'object' ? opt.value : opt;
                    const lbl = typeof opt === 'object' ? opt.label : opt;
                    return `<option value="${val}" ${val == inp.default ? 'selected' : ''}>${lbl} ${inp.unit ? inp.unit : ''}</option>`;
                  }).join('')}
                </select>
              ` : `
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <input type="number" class="form-input boq-param-input" data-id="${inp.id}" value="${inp.default}" step="${inp.step || 'any'}" min="${inp.min || 0}" style="flex:1;">
                  <span style="font-size:0.8rem; color:#64748b; font-weight:600; min-width:45px;">${inp.unit}</span>
                </div>
              `}
            </div>
          `).join('')}
        </div>

        <div class="boq-results-panel" id="boqResultsContainer">
          <!-- Live Result Calculation -->
        </div>

        <div class="boq-push-rab-card">
          <div class="boq-push-rab-info">
            <h4>💡 Integrasikan Volume Ini ke Tabel RAB</h4>
            <p>Pilih divisi dan terapkan hasil perhitungan volume secara otomatis ke item pekerjaan.</p>
          </div>
          <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
            <select class="form-select" id="boqTargetDivisionSelect" style="max-width:250px;">
              ${this.rabEngine.getProject().divisions.map(d => `<option value="${d.id}">${d.code} - ${d.name}</option>`).join('')}
            </select>
            <button class="btn btn-primary" id="btnPushBoqToRab">
              <span>+ Terapkan ke RAB</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Hook live calculation
    const updateCalc = () => {
      const pVals = {};
      container.querySelectorAll('.boq-param-input').forEach(input => {
        pVals[input.dataset.id] = input.value;
      });
      const result = calc.calculate(pVals);
      this.lastBoqResult = result;
      this.lastBoqCalc = calc;

      const resContainer = document.getElementById('boqResultsContainer');
      if (resContainer) {
        resContainer.innerHTML = `
          <div class="boq-result-main">
            <div>
              <span class="boq-result-label">Hasil Perhitungan Utama:</span>
              <div class="boq-result-val">${result.mainVolume} ${result.unit}</div>
            </div>
            <span class="badge badge-success" style="font-size:0.85rem; padding:0.4rem 0.8rem;">✓ Kalkulasi Presisi</span>
          </div>

          ${result.outputs && result.outputs.length > 1 ? `
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:0.75rem; margin-bottom:1rem;">
              ${result.outputs.map(out => `
                <div style="background:#ffffff; padding:0.6rem 0.85rem; border-radius:var(--radius-md); border:1px solid #bbf7d0;">
                  <div style="font-size:0.75rem; color:#15803d; font-weight:600;">${out.label}</div>
                  <div style="font-size:1.1rem; font-weight:800; font-family:var(--font-mono); color:#14532d;">${out.value}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div style="margin-bottom:0.5rem; font-size:0.8rem; font-weight:700; color:#15803d;">Langkah Perhitungan (Audit Trail):</div>
          <div class="boq-steps-list">
            ${result.steps.map(s => `<div>👉 ${s}</div>`).join('')}
          </div>
        `;
      }
    };

    container.querySelectorAll('.boq-param-input').forEach(inp => {
      inp.addEventListener('input', updateCalc);
      inp.addEventListener('change', updateCalc);
    });

    updateCalc();

    // Push to RAB handler
    const btnPush = document.getElementById('btnPushBoqToRab');
    if (btnPush) {
      btnPush.addEventListener('click', () => {
        const divId = document.getElementById('boqTargetDivisionSelect').value;
        const targetAhspCode = calc.targetAhspCodes ? calc.targetAhspCodes[0] : null;
        let ahspItem = targetAhspCode ? this.ahspEngine.getAhspByCode(targetAhspCode) : null;

        const newItem = this.rabEngine.addItem(divId, {
          ahspCode: ahspItem ? ahspItem.code : 'CUSTOM',
          name: `${calc.name} (${this.lastBoqResult.mainVolume} ${this.lastBoqResult.unit})`,
          unit: this.lastBoqResult.unit,
          volume: this.lastBoqResult.mainVolume,
          unitPrice: ahspItem ? this.ahspEngine.calculateItemPrice(ahspItem.code).unitPrice : 0,
          boqRef: calc.id
        });

        // Jika ada secondary volumes (misal beton + besi + bekisting), tawarkan tambah otomatis!
        if (this.lastBoqResult.secondaryVolumes && this.lastBoqResult.secondaryVolumes.length > 0) {
          this.lastBoqResult.secondaryVolumes.forEach(sec => {
            const secAhsp = sec.targetCode ? this.ahspEngine.getAhspByCode(sec.targetCode) : null;
            this.rabEngine.addItem(divId, {
              ahspCode: secAhsp ? secAhsp.code : 'CUSTOM',
              name: `${sec.name}`,
              unit: sec.unit,
              volume: sec.volume,
              unitPrice: secAhsp ? this.ahspEngine.calculateItemPrice(secAhsp.code).unitPrice : 0,
              boqRef: calc.id
            });
          });
        }

        this.autoSave();
        this.showToast(`Item BOQ berhasil diterapkan ke Divisi terpilih!`);
        this.switchView('rab');
      });
    }
  }

  // ==========================================
  // VIEW: RAB BUILDER
  // ==========================================
  renderRabView() {
    const proj = this.rabEngine.getProject();
    const sum = proj.summary || {};
    const container = document.getElementById('rabDivisionsContainer');
    if (!container) return;

    // Render Meta Info Card
    const metaContainer = document.getElementById('rabProjectMetaShowcase');
    if (metaContainer) {
      metaContainer.innerHTML = `
        <div class="project-meta-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid #f1f5f9; padding-bottom:0.75rem;">
            <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-main);">${proj.info.name}</h3>
            <button class="btn btn-secondary btn-sm" id="btnQuickEditMeta">✏️ Edit Informasi Proyek</button>
          </div>
          <div class="project-meta-grid">
            <div class="meta-item"><span class="meta-label">Pemilik Proyek / Instansi</span><span class="meta-val">${proj.info.owner}</span></div>
            <div class="meta-item"><span class="meta-label">Lokasi / Wilayah Acuan</span><span class="meta-val">${proj.info.location} (${this.ahspEngine.getRegionInfo().shortName})</span></div>
            <div class="meta-item"><span class="meta-label">No. Kontrak</span><span class="meta-val font-mono">${proj.info.contractNo}</span></div>
            <div class="meta-item"><span class="meta-label">Tahun Anggaran</span><span class="meta-val">${proj.info.fiscalYear}</span></div>
            <div class="meta-item"><span class="meta-label">Pelaksana / Kontraktor</span><span class="meta-val">${proj.info.contractor}</span></div>
            <div class="meta-item"><span class="meta-label">Waktu Pelaksanaan</span><span class="meta-val font-mono">${proj.info.durationWeeks} Minggu (${proj.info.durationWeeks * 7} Hari)</span></div>
          </div>
        </div>
      `;
      const btnEdit = document.getElementById('btnQuickEditMeta');
      if (btnEdit) btnEdit.addEventListener('click', () => this.openProjectInfoModal());
    }

    // Render Divisions
    container.innerHTML = proj.divisions.map((div, dIdx) => `
      <div class="division-card" data-div-id="${div.id}">
        <div class="division-header">
          <div class="division-title">
            <span class="badge badge-primary">${div.code}</span>
            <span>${div.name}</span>
          </div>
          <div class="division-stats">
            <span>Subtotal: <strong class="division-subtotal-val">${formatRupiah(div.subtotal)}</strong></span>
            <span>Bobot: <strong>${(div.weight || 0).toFixed(2)}%</strong></span>
            <div style="display:flex; gap:0.5rem;">
              <button class="btn btn-secondary btn-sm btn-add-item-to-div" data-div-id="${div.id}">+ Tambah Item</button>
              <button class="btn btn-icon-danger btn-delete-div" data-div-id="${div.id}" title="Hapus Divisi">🗑️</button>
            </div>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width:45px;" class="text-center">No</th>
                <th>Uraian Item Pekerjaan</th>
                <th style="width:110px;">Kode AHSP</th>
                <th style="width:70px;" class="text-center">Satuan</th>
                <th style="width:110px;" class="text-right">Volume</th>
                <th style="width:140px;" class="text-right">Harga Satuan (Rp)</th>
                <th style="width:150px;" class="text-right">Jumlah Harga (Rp)</th>
                <th style="width:85px;" class="text-right">Bobot (%)</th>
                <th style="width:110px;" class="text-center">Durasi (Minggu)</th>
                <th style="width:65px;" class="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${div.items.length === 0 ? `
                <tr><td colspan="10" class="text-center" style="padding:1.5rem; color:#94a3b8;">Belum ada item pekerjaan di divisi ini. Klik "+ Tambah Item" atau kirim dari BOQ Calculator.</td></tr>
              ` : div.items.map((item, iIdx) => `
                <tr data-item-id="${item.id}">
                  <td class="text-center font-mono" style="color:#64748b;">${dIdx + 1}.${iIdx + 1}</td>
                  <td>
                    <div style="font-weight:600; color:var(--text-main);">${item.name}</div>
                    ${item.ahspCode && item.ahspCode !== 'CUSTOM' ? `
                      <button class="btn-link-ahsp-detail" data-code="${item.ahspCode}" style="background:none; border:none; color:var(--primary-600); font-size:0.75rem; cursor:pointer; padding:0; text-decoration:underline;">Lihat Rincian Analisa PUPR</button>
                    ` : ''}
                  </td>
                  <td class="font-mono"><span class="badge badge-info">${item.ahspCode || '-'}</span></td>
                  <td class="text-center font-mono">${item.unit}</td>
                  <td class="text-right">
                    <input type="number" class="inline-input-volume input-item-volume" data-item-id="${item.id}" value="${item.volume}" step="any" min="0">
                  </td>
                  <td class="text-right font-mono" style="font-weight:600;">
                    ${formatRupiah(item.unitPrice)}
                  </td>
                  <td class="text-right font-mono" style="font-weight:700; color:var(--primary-700);">
                    ${formatRupiah(item.subtotal)}
                  </td>
                  <td class="text-right font-mono" style="font-weight:700; color:#0f172a;">
                    ${(item.weight || 0).toFixed(2)}%
                  </td>
                  <td class="text-center font-mono">
                    <div class="duration-selector" style="justify-content:center;">
                      <select class="duration-select-mini input-item-startweek" data-item-id="${item.id}">
                        ${Array.from({ length: proj.info.durationWeeks }, (_, i) => `<option value="${i + 1}" ${item.startWeek === i + 1 ? 'selected' : ''}>M-${i + 1}</option>`).join('')}
                      </select>
                      <span style="color:#94a3b8;">s/d</span>
                      <select class="duration-select-mini input-item-endweek" data-item-id="${item.id}">
                        ${Array.from({ length: proj.info.durationWeeks }, (_, i) => `<option value="${i + 1}" ${item.endWeek === i + 1 ? 'selected' : ''}>M-${i + 1}</option>`).join('')}
                      </select>
                    </div>
                  </td>
                  <td class="text-center">
                    <button class="btn-icon-danger btn-delete-item" data-item-id="${item.id}" title="Hapus Item">🗑️</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `).join('');

    // Render Recapitulation Banner
    const recapContainer = document.getElementById('rabRecapitulationShowcase');
    if (recapContainer) {
      recapContainer.innerHTML = `
        <div class="recap-card">
          <div style="font-size:0.95rem; font-weight:800; text-transform:uppercase; letter-spacing:1px; margin-bottom:1rem; color:#38bdf8;">
            📋 REKAPITULASI BIAYA PROYEK & NILAI KONTRAK
          </div>
          <div class="recap-grid">
            <div class="recap-item">
              <span class="recap-label">Total Real Cost Konstruksi (Fisik)</span>
              <span class="recap-val">${formatRupiah(sum.totalDirectCost)}</span>
            </div>
            <div class="recap-item">
              <span class="recap-label">Jasa Kontraktor / Overhead & Profit (${sum.overheadRate}%)</span>
              <span class="recap-val">${formatRupiah(sum.overheadCost)}</span>
            </div>
            <div class="recap-item">
              <span class="recap-label">Subtotal + Overhead</span>
              <span class="recap-val">${formatRupiah(sum.subtotalWithOverhead)}</span>
            </div>
            <div class="recap-item">
              <span class="recap-label">Pajak Pertambahan Nilai PPN (${sum.ppnRate}%)</span>
              <span class="recap-val">${formatRupiah(sum.ppnCost)}</span>
            </div>
          </div>

          <div class="grand-total-showcase">
            <div class="grand-total-left">
              <span class="grand-total-label">Grand Total Nilai Kontrak Fisik 2026</span>
              <span class="grand-total-value">${formatRupiah(sum.grandTotal)}</span>
            </div>
            <div style="display:flex; gap:0.75rem;">
              <button class="btn btn-success" id="btnRabExportCsvQuick">📥 Ekspor CSV / Excel</button>
              <button class="btn btn-primary" id="btnRabPrintQuick">🖨️ Cetak RAB (PDF)</button>
            </div>
          </div>

          <div class="terbilang-box">
            <span class="terbilang-tag">Terbilang:</span> "${sum.terbilang}"
          </div>
        </div>
      `;

      const bCsv = document.getElementById('btnRabExportCsvQuick');
      const bPrint = document.getElementById('btnRabPrintQuick');
      if (bCsv) bCsv.addEventListener('click', () => StorageExportManager.exportRabToCsv(proj));
      if (bPrint) bPrint.addEventListener('click', () => StorageExportManager.triggerPrint());
    }

    // Bind item inline actions
    container.querySelectorAll('.input-item-volume').forEach(input => {
      input.addEventListener('change', (e) => {
        const itemId = e.target.dataset.itemId;
        const newVol = Number(e.target.value) || 0;
        this.rabEngine.updateItem(itemId, { volume: newVol });
        this.autoSave();
        this.renderRabView();
        this.renderKpiSummary();
      });
    });

    container.querySelectorAll('.input-item-startweek').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const itemId = e.target.dataset.itemId;
        this.rabEngine.updateItem(itemId, { startWeek: Number(e.target.value) });
        this.autoSave();
      });
    });

    container.querySelectorAll('.input-item-endweek').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const itemId = e.target.dataset.itemId;
        this.rabEngine.updateItem(itemId, { endWeek: Number(e.target.value) });
        this.autoSave();
      });
    });

    container.querySelectorAll('.btn-delete-item').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Hapus item pekerjaan ini dari RAB?')) {
          this.rabEngine.deleteItem(btn.dataset.itemId);
          this.autoSave();
          this.renderRabView();
          this.renderKpiSummary();
          this.showToast('Item berhasil dihapus');
        }
      });
    });

    container.querySelectorAll('.btn-add-item-to-div').forEach(btn => {
      btn.addEventListener('click', () => {
        this.openAddItemModal(btn.dataset.divId);
      });
    });

    container.querySelectorAll('.btn-delete-div').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Hapus seluruh kelompok divisi ini beserta isinya?')) {
          this.rabEngine.deleteDivision(btn.dataset.divId);
          this.autoSave();
          this.renderRabView();
          this.renderKpiSummary();
          this.showToast('Divisi berhasil dihapus');
        }
      });
    });

    container.querySelectorAll('.btn-link-ahsp-detail').forEach(btn => {
      btn.addEventListener('click', () => {
        this.openAhspDetailModal(btn.dataset.code);
      });
    });
  }

  // ==========================================
  // VIEW: TIME SCHEDULE & MATRIX GANTT
  // ==========================================
  renderScheduleView() {
    const matrix = this.scheduleEngine.generateScheduleMatrix(this.activeDistributionMode);
    const container = document.getElementById('scheduleTableContainer');
    const proj = this.rabEngine.getProject();
    if (!container) return;

    const weeks = Array.from({ length: matrix.durationWeeks }, (_, i) => i + 1);

    container.innerHTML = `
      <div class="schedule-matrix-wrapper">
        <table class="schedule-table">
          <thead>
            <tr>
              <th class="col-sticky-left" style="width:280px;">Uraian Pekerjaan</th>
              <th style="width:70px;">Bobot (%)</th>
              <th style="width:90px;">Jadwal</th>
              ${weeks.map(w => `<th style="width:50px;">M-${w}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${proj.divisions.map(div => `
              <tr class="row-division">
                <td class="col-sticky-left">${div.code} - ${div.name}</td>
                <td class="text-right font-mono">${(div.weight || 0).toFixed(2)}%</td>
                <td>-</td>
                ${weeks.map(() => `<td></td>`).join('')}
              </tr>
              ${div.items.map(item => {
                const itemSched = matrix.itemSchedules.find(s => s.itemId === item.id);
                return `
                  <tr>
                    <td class="col-sticky-left" style="padding-left:1.5rem;">${item.name}</td>
                    <td class="text-right font-mono font-bold">${(item.weight || 0).toFixed(2)}%</td>
                    <td class="font-mono text-center">M${item.startWeek}-M${item.endWeek}</td>
                    ${weeks.map((w, wIdx) => {
                      const val = itemSched ? itemSched.weeklyWeights[wIdx] : 0;
                      return val > 0 ? `
                        <td class="week-cell-active">${val.toFixed(2)}%</td>
                      ` : `
                        <td class="week-cell-empty">-</td>
                      `;
                    }).join('')}
                  </tr>
                `;
              }).join('')}
            `).join('')}

            <!-- REKAPITULASI RENCANA MINGGUAN -->
            <tr class="row-summary" style="border-top:3px solid var(--border-strong);">
              <td class="col-sticky-left" style="font-weight:800; color:var(--text-main);">PROGRES RENCANA MINGGUAN (%)</td>
              <td class="text-right font-mono font-bold">100.00%</td>
              <td>-</td>
              ${matrix.weeklyPlannedTotals.map(val => `
                <td class="font-mono text-right" style="font-weight:700; color:var(--primary-700);">${val.toFixed(2)}%</td>
              `).join('')}
            </tr>

            <tr class="row-cumulative">
              <td class="col-sticky-left" style="font-weight:900; color:var(--primary-900);">PROGRES RENCANA KUMULATIF (%)</td>
              <td class="text-right font-mono font-bold" style="color:var(--primary-900);">100.00%</td>
              <td>-</td>
              ${matrix.cumulativePlanned.map(val => `
                <td class="font-mono text-right" style="font-weight:800; color:var(--primary-700);">${val.toFixed(2)}%</td>
              `).join('')}
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  // ==========================================
  // VIEW: DASHBOARD KURVA S & OPNAME MONITORING
  // ==========================================
  renderSCurveView() {
    if (this.scurveChart) {
      setTimeout(() => this.scurveChart.render(), 50);
    }

    const metrics = this.scurveChart ? this.scurveChart.getMetrics() : null;
    const proj = this.rabEngine.getProject();
    const durationWeeks = proj.info.durationWeeks || 16;

    // Render SCM Alert jika kritis
    const scmBannerContainer = document.getElementById('scurveScmAlertContainer');
    if (scmBannerContainer && metrics) {
      if (metrics.scmStatus === 'CRITICAL') {
        scmBannerContainer.innerHTML = `
          <div class="scm-alert-banner">
            <div class="scm-alert-content">
              <span class="scm-alert-icon">⚠️</span>
              <div class="scm-alert-text">
                <h4>PERINGATAN: PROYEK MASUK KATEGORI KONTRAK KRITIS (DEVIASI ${metrics.currentDeviation}%)</h4>
                <p>Deviasi realisasi fisik telah melampaui batas toleransi -5.00%. Sesuai Permen PUPR & Klausul Standar Kontrak Konstruksi, Pejabat Pembuat Komitmen (PPK) direkomendasikan segera menerbitkan Surat Peringatan dan menggelar Rapat Pembuktian Keterlambatan (<strong>Show Cause Meeting / SCM Tingkat I</strong>).</p>
              </div>
            </div>
            <button class="btn btn-danger btn-sm" onclick="alert('Rekomendasi Penanganan SCM: \\n1. Penambahan jam kerja (Lembur / Shift Malam)\\n2. Penambahan tenaga kerja lokal & alat berat\\n3. Penyesuaian metode kerja paralel')">Panduan SCM</button>
          </div>
        `;
      } else {
        scmBannerContainer.innerHTML = '';
      }
    }

    // Render Opname Week Selector Options
    const opnameWeekSel = document.getElementById('opnameWeekSelect');
    if (opnameWeekSel) {
      opnameWeekSel.innerHTML = Array.from({ length: durationWeeks }, (_, i) => {
        const w = i + 1;
        const hasData = proj.actualWeeklyProgress && proj.actualWeeklyProgress[w];
        return `<option value="${w}">Minggu ke-${w} ${hasData ? `(Tercatat: ${hasData.percentage}%)` : '(Belum Diisi)'}</option>`;
      }).join('');

      opnameWeekSel.onchange = () => {
        const w = Number(opnameWeekSel.value);
        const data = proj.actualWeeklyProgress && proj.actualWeeklyProgress[w];
        if (data) {
          document.getElementById('opnamePercentage').value = data.percentage;
          document.getElementById('opnameNote').value = data.note || '';
          document.getElementById('opnameWeatherGood').value = data.weatherGood || 6;
          document.getElementById('opnameWeatherRain').value = data.weatherRain || 1;
        } else {
          document.getElementById('opnamePercentage').value = '';
          document.getElementById('opnameNote').value = '';
        }
      };

      // Trigger first selection
      opnameWeekSel.dispatchEvent(new Event('change'));
    }

    // Render Opname History Table
    const historyContainer = document.getElementById('opnameHistoryTableBody');
    if (historyContainer && metrics) {
      const weeks = Array.from({ length: durationWeeks }, (_, i) => i + 1);
      historyContainer.innerHTML = weeks.map(w => {
        const planVal = metrics.sched.cumulativePlanned[w - 1];
        const actVal = metrics.cumulativeActual[w - 1];
        const hasAct = (actVal !== null && actVal !== undefined);
        const devVal = hasAct ? Number((actVal - planVal).toFixed(2)) : null;
        const logData = proj.actualWeeklyProgress ? proj.actualWeeklyProgress[w] : null;

        return `
          <tr>
            <td class="text-center font-mono font-bold">M-${w}</td>
            <td class="text-right font-mono">${planVal}%</td>
            <td class="text-right font-mono font-bold" style="color:${hasAct ? '#10b981' : '#94a3b8'};">
              ${hasAct ? `${actVal}%` : '-'}
            </td>
            <td class="text-center">
              ${devVal !== null ? `
                <span class="${devVal >= 0 ? 'deviation-badge-pos' : 'deviation-badge-neg'}">
                  ${devVal >= 0 ? '+' : ''}${devVal}%
                </span>
              ` : '-'}
            </td>
            <td style="font-size:0.8rem; color:#475569;">
              ${logData ? logData.note || 'Opname tercatat' : '<span style="color:#cbd5e1;">-</span>'}
            </td>
            <td class="text-center font-mono" style="font-size:0.75rem;">
              ${logData ? `☀️ ${logData.weatherGood || 0} hr | 🌧️ ${logData.weatherRain || 0} hr` : '-'}
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // ==========================================
  // VIEW: CASHFLOW & TERMIJN
  // ==========================================
  renderCashflowView() {
    const data = this.cashflowEngine.generateCashflowProjection();
    const container = document.getElementById('cashflowTermijnTableBody');
    if (!container) return;

    container.innerHTML = data.termijnList.map((t, idx) => {
      const nominal = (t.payoutPct / 100) * data.grandTotal;
      return `
        <tr>
          <td class="text-center font-mono font-bold">${idx + 1}</td>
          <td style="font-weight:600;">${t.name}</td>
          <td class="text-center font-mono font-bold">${t.payoutPct}%</td>
          <td class="text-right font-mono font-bold" style="color:var(--primary-700);">${formatRupiah(nominal)}</td>
          <td class="text-center font-mono">Minggu ke-${t.weekDisbursed}</td>
          <td><span class="badge ${t.isPaid ? 'badge-success' : 'badge-warning'}">${t.isPaid ? 'Sudah Cair' : 'Rencana Cair'}</span></td>
          <td style="font-size:0.8rem; color:#64748b;">${t.note}</td>
        </tr>
      `;
    }).join('');
  }

  // ==========================================
  // VIEW: DATABASE HARGA & AHSP 2026
  // ==========================================
  renderDatabaseView() {
    const container = document.getElementById('databaseAhspTableBody');
    if (!container) return;

    const query = document.getElementById('dbSearchInput') ? document.getElementById('dbSearchInput').value : '';
    const divisionFilter = document.getElementById('dbDivisionFilter') ? document.getElementById('dbDivisionFilter').value : '';

    const items = this.ahspEngine.getAllCalculatedItems(this.rabEngine.getProject().info.regionId, divisionFilter || null, query);

    container.innerHTML = items.length === 0 ? `
      <tr><td colspan="7" class="text-center" style="padding:2rem; color:#94a3b8;">Tidak ada analisa harga satuan yang cocok dengan pencarian.</td></tr>
    ` : items.map((item, idx) => `
      <tr>
        <td class="text-center font-mono" style="color:#64748b;">${idx + 1}</td>
        <td class="font-mono"><span class="badge badge-primary">${item.code}</span></td>
        <td style="font-weight:600; color:var(--text-main);">${item.name}</td>
        <td class="text-center font-mono">${item.unit}</td>
        <td class="text-right font-mono" style="color:#0284c7;">${formatRupiah(item.totalBahan)}</td>
        <td class="text-right font-mono" style="color:#059669;">${formatRupiah(item.totalUpah)}</td>
        <td class="text-right font-mono font-bold" style="color:var(--primary-700); font-size:0.9rem;">${formatRupiah(item.unitPrice)}</td>
        <td class="text-center">
          <button class="btn btn-secondary btn-sm btn-view-ahsp-detail" data-code="${item.code}">Rincian</button>
        </td>
      </tr>
    `).join('');

    container.querySelectorAll('.btn-view-ahsp-detail').forEach(btn => {
      btn.addEventListener('click', () => this.openAhspDetailModal(btn.dataset.code));
    });
  }

  // ==========================================
  // MODALS
  // ==========================================
  openProjectInfoModal() {
    const proj = this.rabEngine.getProject();
    document.getElementById('projNameInput').value = proj.info.name;
    document.getElementById('projOwnerInput').value = proj.info.owner;
    document.getElementById('projLocationInput').value = proj.info.location;
    document.getElementById('projContractNoInput').value = proj.info.contractNo;
    document.getElementById('projContractorInput').value = proj.info.contractor;
    document.getElementById('projConsultantInput').value = proj.info.consultant;
    document.getElementById('projDurationInput').value = proj.info.durationWeeks;
    document.getElementById('projOverheadInput').value = proj.info.overheadProfitRate;
    document.getElementById('projPpnInput').value = proj.info.ppnRate;

    this.openModal('modalProjectInfo');
  }

  openAddItemModal(divisionId) {
    document.getElementById('addItemDivisionId').value = divisionId;
    
    // Populate AHSP Options
    const ahspSelect = document.getElementById('addItemAhspSelect');
    if (ahspSelect) {
      ahspSelect.innerHTML = this.ahspEngine.getAllAhspItems().map(item => {
        const calc = this.ahspEngine.calculateItemPrice(item.code);
        return `<option value="${item.code}">[${item.code}] ${item.name} (${formatRupiah(calc.unitPrice)}/${item.unit})</option>`;
      }).join('');
    }

    this.openModal('modalAddItem');
  }

  openAhspDetailModal(ahspCode) {
    const breakdown = this.ahspEngine.calculateItemPrice(ahspCode);
    const item = this.ahspEngine.getAhspByCode(ahspCode);
    if (!breakdown || !item) return;

    const modalTitle = document.getElementById('ahspDetailTitle');
    const modalBody = document.getElementById('ahspDetailBody');

    if (modalTitle) modalTitle.textContent = `Analisa Harga Satuan: ${breakdown.code}`;
    if (modalBody) {
      modalBody.innerHTML = `
        <div style="margin-bottom:1rem; padding-bottom:0.75rem; border-bottom:1px solid #f1f5f9;">
          <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-main);">${breakdown.name}</h3>
          <p style="font-size:0.825rem; color:#64748b; margin-top:0.25rem;">${item.description || ''}</p>
          <div style="margin-top:0.5rem; display:flex; gap:1rem; font-size:0.825rem;">
            <span>Satuan: <strong class="font-mono">${breakdown.unit}</strong></span>
            <span>Wilayah Acuan: <strong>${this.ahspEngine.getRegionInfo().name}</strong></span>
          </div>
        </div>

        <div class="table-wrapper" style="margin-bottom:1rem;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Komponen</th>
                <th>Kode</th>
                <th>Tipe</th>
                <th class="text-right">Koefisien</th>
                <th class="text-right">Harga Satuan (Rp)</th>
                <th class="text-right">Subtotal (Rp)</th>
              </tr>
            </thead>
            <tbody>
              ${breakdown.breakdown.map(comp => {
                let name = comp.code;
                if (comp.type === 'upah') {
                  const u = MASTER_UPAH.find(x => x.code === comp.code);
                  if (u) name = u.name;
                } else if (comp.type === 'bahan') {
                  const b = MASTER_BAHAN.find(x => x.code === comp.code);
                  if (b) name = b.name;
                } else if (comp.type === 'alat') {
                  const a = MASTER_ALAT.find(x => x.code === comp.code);
                  if (a) name = a.name;
                }
                return `
                  <tr>
                    <td style="font-weight:600;">${name}</td>
                    <td class="font-mono"><span class="badge badge-info">${comp.code}</span></td>
                    <td><span class="badge ${comp.type === 'upah' ? 'badge-success' : comp.type === 'bahan' ? 'badge-primary' : 'badge-warning'}">${comp.type.toUpperCase()}</span></td>
                    <td class="text-right font-mono">${comp.coeff}</td>
                    <td class="text-right font-mono">${formatRupiah(comp.unitPrice)}</td>
                    <td class="text-right font-mono font-bold">${formatRupiah(comp.subtotal)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <div style="background:#f8fafc; padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.95rem; font-weight:800; color:var(--text-main);">HARGA SATUAN PEKERJAAN (HSP):</span>
          <span style="font-size:1.4rem; font-weight:900; font-family:var(--font-mono); color:var(--primary-700);">${formatRupiah(breakdown.unitPrice)} / ${breakdown.unit}</span>
        </div>
      `;
    }

    this.openModal('modalAhspDetail');
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>ℹ️</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

// Inisialisasi Aplikasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
  window.siproApp = new SiproApp();
});
