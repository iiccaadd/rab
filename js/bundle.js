/**
 * ==============================================================================
 * SIPRO-KALTENG 2026 - MASTER CORE APPLICATION BUNDLE
 * Standar Permen PUPR & Acuan Satuan Harga Muara Teweh / Palangka Raya 2026
 * ==============================================================================
 */

(function(window, document) {
  'use strict';

  // --- SVG ICON TEMPLATES HELPER ---
  const Icons = {
    edit: '<svg class="icon-svg-sm" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
    eye: '<svg class="icon-svg-sm" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
    trash: '<svg class="icon-svg-sm" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
    plus: '<svg class="icon-svg-sm" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
    alert: '<svg class="icon-svg-lg" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
    bolt: '<svg class="icon-svg" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
    download: '<svg class="icon-svg" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
    printer: '<svg class="icon-svg" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>'
  };

  // --- UTILITY FORMATTERS & CALCULATORS ---
  const Utils = {
    formatRupiah(val) {
      if (val === null || val === undefined || isNaN(val)) return 'Rp 0';
      const num = Math.round(Number(val));
      return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },

    formatNumber(val, decimals = 2) {
      if (val === null || val === undefined || isNaN(val)) return '0,00';
      const fixed = Number(val).toFixed(decimals);
      const parts = fixed.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return parts.join(',');
    },

    parseRupiah(str) {
      if (!str) return 0;
      if (typeof str === 'number') return str;
      const clean = str.toString().replace(/[^0-9,-]/g, '').replace(',', '.');
      return parseFloat(clean) || 0;
    },

    sanitizeText(str) {
      if (!str) return '';
      return str.toString()
        .replace(/Ã‚/g, '')
        .replace(/Ã¢/g, '')
        .trim();
    },

    formatUnitBadge(unit) {
      if (!unit) return '<span class="unit-badge unit-badge-default">-</span>';
      const clean = this.sanitizeText(unit).trim().toLowerCase();
      
      if (clean === 'm3' || clean === 'm^3' || clean === 'mm3' || clean.indexOf('m3') !== -1 || clean.indexOf('mÂ³') !== -1) {
        return '<span class="unit-badge unit-badge-m3">m<sup>3</sup></span>';
      }
      if (clean === 'm2' || clean === 'm^2' || clean === 'mm2' || clean.indexOf('m2') !== -1 || clean.indexOf('mÂ²') !== -1) {
        return '<span class="unit-badge unit-badge-m2">m<sup>2</sup></span>';
      }
      if (clean === 'm1' || clean === "m'" || clean === 'm' || clean === 'meter') {
        return '<span class="unit-badge unit-badge-m1">m\'</span>';
      }
      if (clean === 'kg' || clean === 'kilogram') {
        return '<span class="unit-badge unit-badge-kg">kg</span>';
      }
      return '<span class="unit-badge unit-badge-default">' + this.sanitizeText(unit) + '</span>';
    },

    formatUnitHtml(unit) {
      if (!unit) return '-';
      const clean = this.sanitizeText(unit).trim().toLowerCase();
      if (clean === 'm3' || clean === 'm^3' || clean === 'mm3' || clean.indexOf('m3') !== -1 || clean.indexOf('mÂ³') !== -1) return 'm<sup>3</sup>';
      if (clean === 'm2' || clean === 'm^2' || clean === 'mm2' || clean.indexOf('m2') !== -1 || clean.indexOf('mÂ²') !== -1) return 'm<sup>2</sup>';
      if (clean === 'm1' || clean === "m'") return "m'";
      return this.sanitizeText(unit);
    },

    formatUnitPlain(unit) {
      if (!unit) return '-';
      const clean = this.sanitizeText(unit).trim().toLowerCase();
      if (clean === 'm3' || clean === 'm^3' || clean === 'mm3' || clean.indexOf('m3') !== -1 || clean.indexOf('mÂ³') !== -1) return 'm3';
      if (clean === 'm2' || clean === 'm^2' || clean === 'mm2' || clean.indexOf('m2') !== -1 || clean.indexOf('mÂ²') !== -1) return 'm2';
      if (clean === 'm1' || clean === "m'") return "m'";
      return this.sanitizeText(unit);
    },

    terbilang(n) {
      const bilangan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
      n = Math.floor(Math.abs(Number(n) || 0));
      if (n < 12) return bilangan[n];
      if (n < 20) return this.terbilang(n - 10) + ' Belas';
      if (n < 100) return this.terbilang(Math.floor(n / 10)) + ' Puluh ' + this.terbilang(n % 10);
      if (n < 200) return 'Seratus ' + this.terbilang(n - 100);
      if (n < 1000) return this.terbilang(Math.floor(n / 100)) + ' Ratus ' + this.terbilang(n % 100);
      if (n < 2000) return 'Seribu ' + this.terbilang(n - 1000);
      if (n < 1000000) return this.terbilang(Math.floor(n / 1000)) + ' Ribu ' + this.terbilang(n % 1000);
      if (n < 1000000000) return this.terbilang(Math.floor(n / 1000000)) + ' Juta ' + this.terbilang(n % 1000000);
      if (n < 1000000000000) return this.terbilang(Math.floor(n / 1000000000)) + ' Miliar ' + this.terbilang(n % 1000000000);
      return this.terbilang(Math.floor(n / 1000000000000)) + ' Triliun ' + this.terbilang(n % 1000000000000);
    },

    generateId(prefix = 'id') {
      return prefix + '_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
    },

    safeEvalMath(expr, scope = {}) {
      if (!expr) return 0;
      try {
        let sanitized = expr.toString().trim();
        sanitized = sanitized.replace(/\^/g, '**');
        sanitized = sanitized.replace(/:/g, '/');

        const scopeLower = {};
        Object.keys(scope).forEach(k => {
          scopeLower[k.toLowerCase()] = Number(scope[k]) || 0;
        });

        // If 'x' is not a defined variable in inputs, replace multiplication 'x' or 'X'
        if (!scopeLower.hasOwnProperty('x')) {
          sanitized = sanitized.replace(/(?<=[0-9a-zA-Z\)])\s*[xX]\s*(?=[0-9a-zA-Z\(])/g, ' * ');
        }

        const keys = Object.keys(scopeLower);
        const values = Object.values(scopeLower);
        const fn = new Function(...keys, 'return (' + sanitized.toLowerCase() + ');');
        const res = fn(...values);
        return isFinite(res) ? Number(res) : 0;
      } catch (e) {
        console.warn('Math Eval Error:', e, expr, scope);
        return 0;
      }
    }
  };

  // --- AHSP DATABASE & ENGINE ---
  class AhspEngine {
    constructor() {
      this.overridesKey = 'sipro_ahsp_custom_overrides_v1';
      this.overrides = this.loadOverrides();
      this.items = [];
      this.initDatabase();
    }

    loadOverrides() {
      const saved = localStorage.getItem(this.overridesKey);
      if (saved) {
        try {
          return JSON.parse(saved) || {};
        } catch (e) {
          console.warn('Failed parsing AHSP overrides', e);
        }
      }
      return {};
    }

    saveOverrides() {
      try {
        localStorage.setItem(this.overridesKey, JSON.stringify(this.overrides));
      } catch (e) {
        console.warn('Error saving AHSP overrides', e);
      }
    }

    initDatabase() {
      const raw = window.MASTER_AHSP_2026 || window.AHSP_PUPR_DATABASE_2026 || [];
      if (Array.isArray(raw) && raw.length > 0) {
        this.items = raw
          .map(it => {
            const code = it.kode || it.code || '';
            const ovr  = this.overrides[code] || {};
            const comps = Array.isArray(it.components) ? it.components : [];
            const hsp   = Number(ovr.hsp_final !== undefined ? ovr.hsp_final : (it.hsp_final || it.price || 0));
            const upah  = Number(it.biaya_upah  || it.upah  || 0);
            const bahan = Number(it.biaya_bahan || it.bahan || 0);
            const alat  = Number(it.biaya_alat  || it.alat  || 0);
            const ovhAmt= Number(it.overhead || 0);
            return {
              kode:       code,
              nama:       ovr.nama || it.nama || it.name || '',
              sat:        ovr.sat  || it.sat  || it.unit || 'ls',
              hsp_final:  hsp,
              biaya_upah: upah,
              biaya_bahan:bahan,
              biaya_alat: alat,
              overhead:   ovhAmt,
              divisi:     it.divisi || it.division || 'Umum',
              components: comps
            };
          })
          // Filter out pure section headers (no HSP and no components)
          .filter(it => it.hsp_final > 0 || it.components.length > 0 || it.nama.length > 0);
      } else {
        this.items = this.getDefaultAhspFallback();
      }
    }

    resetToDefault() {
      this.overrides = {};
      this.saveOverrides();
      this.initDatabase();
      return this.items;
    }

    getAll() {
      return this.items;
    }

    getByCode(code) {
      if (!code) return null;
      const clean = code.trim().toLowerCase();
      return this.items.find(x => x.kode && x.kode.trim().toLowerCase() === clean) || null;
    }

    getAhspWithComponents(code, name = '', unit = 'm3', unitPrice = 0) {
      let ahsp = this.getByCode(code);
      if (!ahsp && code) {
        const stripped = code.replace(/^[a-zA-Z]\./, '');
        ahsp = this.items.find(x => x.kode && (x.kode === stripped || x.kode.endsWith('.' + stripped)));
      }

      if ((!ahsp || !ahsp.components || ahsp.components.length === 0) && name) {
        const cleanName = name.toLowerCase().replace(/fâ€™c|fÂ€™c|fÃ¢â‚¬â„¢c/g, "f'c");
        ahsp = this.items.find(x => x.nama && (x.nama.toLowerCase().includes(cleanName) || cleanName.includes(x.nama.toLowerCase())) && x.components && x.components.length > 0);
      }

      if (ahsp && ahsp.components && ahsp.components.length > 0) {
        return ahsp;
      }

      // Generate realistic, standard PUPR 2026 components for any item based on keywords
      const itName = (name || (ahsp ? ahsp.nama : '') || '').toLowerCase();
      const itUnit = (unit || (ahsp ? ahsp.sat : '') || 'm3');
      const itPrice = unitPrice || (ahsp ? ahsp.hsp_final : 0) || 100000;
      const cleanTitle = (name || (ahsp ? ahsp.nama : '') || code).replace(/fâ€™c|fÂ€™c|fÃ¢â‚¬â„¢c/g, "f'c");

      let comps = [];
      let divisi = ahsp ? ahsp.divisi : 'Pekerjaan Struktur';

      if (itName.includes('beton') || itName.includes('k-225') || itName.includes('k 225') || itName.includes('sloof') || itName.includes('kolom') || itName.includes('balok') || itName.includes('ringbalk') || itName.includes('plat') || itName.includes('cor')) {
        divisi = 'Pekerjaan Struktur Beton Bertulang';
        comps = [
          { uraian: 'Pekerja', satuan: 'OH', koefisien: 1.6500, harga_satuan: 164000, jumlah_harga: 270600, jenis: 'tenaga' },
          { uraian: 'Tukang batu', satuan: 'OH', koefisien: 0.2750, harga_satuan: 198000, jumlah_harga: 54450, jenis: 'tenaga' },
          { uraian: 'Kepala tukang', satuan: 'OH', koefisien: 0.0280, harga_satuan: 210000, jumlah_harga: 5880, jenis: 'tenaga' },
          { uraian: 'Mandor', satuan: 'OH', koefisien: 0.0830, harga_satuan: 226000, jumlah_harga: 18758, jenis: 'tenaga' },
          { uraian: 'Semen Portland (PC)', satuan: 'kg', koefisien: 371.0000, harga_satuan: 1300, jumlah_harga: 482300, jenis: 'bahan' },
          { uraian: 'Pasir Beton / Cor', satuan: 'm3', koefisien: 0.4990, harga_satuan: 370200, jumlah_harga: 184730, jenis: 'bahan' },
          { uraian: 'Kerikil / Split 2/3', satuan: 'm3', koefisien: 0.7760, harga_satuan: 352300, jumlah_harga: 273385, jenis: 'bahan' },
          { uraian: 'Air Kerja', satuan: 'liter', koefisien: 215.0000, harga_satuan: 200, jumlah_harga: 43000, jenis: 'bahan' },
          { uraian: 'Sewa Concrete Mixer / Molen', satuan: 'hari', koefisien: 0.2500, harga_satuan: 160000, jumlah_harga: 40000, jenis: 'alat' }
        ];
      } else if (itName.includes('pondasi') || itName.includes('batu belah') || itName.includes('batu kali') || itName.includes('aanstamping')) {
        divisi = 'Pekerjaan Pondasi & Struktur Bawah';
        comps = [
          { uraian: 'Pekerja', satuan: 'OH', koefisien: 1.5000, harga_satuan: 164000, jumlah_harga: 246000, jenis: 'tenaga' },
          { uraian: 'Tukang batu', satuan: 'OH', koefisien: 0.7500, harga_satuan: 198000, jumlah_harga: 148500, jenis: 'tenaga' },
          { uraian: 'Kepala tukang', satuan: 'OH', koefisien: 0.0750, harga_satuan: 210000, jumlah_harga: 15750, jenis: 'tenaga' },
          { uraian: 'Mandor', satuan: 'OH', koefisien: 0.0750, harga_satuan: 226000, jumlah_harga: 16950, jenis: 'tenaga' },
          { uraian: 'Batu Belah 15/20 cm', satuan: 'm3', koefisien: 1.2000, harga_satuan: 286500, jumlah_harga: 343800, jenis: 'bahan' },
          { uraian: 'Semen Portland (PC)', satuan: 'kg', koefisien: 136.0000, harga_satuan: 1300, jumlah_harga: 176800, jenis: 'bahan' },
          { uraian: 'Pasir Pasang', satuan: 'm3', koefisien: 0.5440, harga_satuan: 200000, jumlah_harga: 108800, jenis: 'bahan' }
        ];
      } else if (itName.includes('galian') || itName.includes('tanah biasa') || itName.includes('pembersihan') || itName.includes('striping')) {
        divisi = 'Pekerjaan Tanah & Persiapan';
        comps = [
          { uraian: 'Pekerja', satuan: 'OH', koefisien: 0.7500, harga_satuan: 164000, jumlah_harga: 123000, jenis: 'tenaga' },
          { uraian: 'Mandor', satuan: 'OH', koefisien: 0.0380, harga_satuan: 226000, jumlah_harga: 8588, jenis: 'tenaga' }
        ];
      } else if (itName.includes('urug') || itName.includes('pasir') || itName.includes('timbunan')) {
        divisi = 'Pekerjaan Tanah & Pondasi';
        comps = [
          { uraian: 'Pekerja', satuan: 'OH', koefisien: 0.3000, harga_satuan: 164000, jumlah_harga: 49200, jenis: 'tenaga' },
          { uraian: 'Mandor', satuan: 'OH', koefisien: 0.0100, harga_satuan: 226000, jumlah_harga: 2260, jenis: 'tenaga' },
          { uraian: 'Pasir Urug Pilihan', satuan: 'm3', koefisien: 1.2000, harga_satuan: 150000, jumlah_harga: 180000, jenis: 'bahan' }
        ];
      } else if (itName.includes('bata') || itName.includes('dinding') || itName.includes('hebel')) {
        divisi = 'Pekerjaan Pasangan Dinding & Plesteran';
        comps = [
          { uraian: 'Pekerja', satuan: 'OH', koefisien: 0.3000, harga_satuan: 164000, jumlah_harga: 49200, jenis: 'tenaga' },
          { uraian: 'Tukang batu', satuan: 'OH', koefisien: 0.1000, harga_satuan: 198000, jumlah_harga: 19800, jenis: 'tenaga' },
          { uraian: 'Kepala tukang', satuan: 'OH', koefisien: 0.0100, harga_satuan: 210000, jumlah_harga: 2100, jenis: 'tenaga' },
          { uraian: 'Mandor', satuan: 'OH', koefisien: 0.0150, harga_satuan: 226000, jumlah_harga: 3390, jenis: 'tenaga' },
          { uraian: 'Bata Merah Bakar Standar', satuan: 'buah', koefisien: 70.0000, harga_satuan: 700, jumlah_harga: 49000, jenis: 'bahan' },
          { uraian: 'Semen Portland (PC)', satuan: 'kg', koefisien: 11.5000, harga_satuan: 1300, jumlah_harga: 14950, jenis: 'bahan' },
          { uraian: 'Pasir Pasang', satuan: 'm3', koefisien: 0.0430, harga_satuan: 200000, jumlah_harga: 8600, jenis: 'bahan' }
        ];
      } else if (itName.includes('plester') || itName.includes('acian') || itName.includes('benangan')) {
        divisi = 'Pekerjaan Pasangan Dinding & Plesteran';
        comps = [
          { uraian: 'Pekerja', satuan: 'OH', koefisien: 0.3000, harga_satuan: 164000, jumlah_harga: 49200, jenis: 'tenaga' },
          { uraian: 'Tukang batu', satuan: 'OH', koefisien: 0.1500, harga_satuan: 198000, jumlah_harga: 29700, jenis: 'tenaga' },
          { uraian: 'Kepala tukang', satuan: 'OH', koefisien: 0.0150, harga_satuan: 210000, jumlah_harga: 3150, jenis: 'tenaga' },
          { uraian: 'Mandor', satuan: 'OH', koefisien: 0.0150, harga_satuan: 226000, jumlah_harga: 3390, jenis: 'tenaga' },
          { uraian: 'Semen Portland (PC)', satuan: 'kg', koefisien: 6.2400, harga_satuan: 1300, jumlah_harga: 8112, jenis: 'bahan' },
          { uraian: 'Pasir Pasang', satuan: 'm3', koefisien: 0.0240, harga_satuan: 200000, jumlah_harga: 4800, jenis: 'bahan' }
        ];
      } else if (itName.includes('besi') || itName.includes('tulangan') || itName.includes('pembesian') || itName.includes('bjtp')) {
        divisi = 'Pekerjaan Struktur Beton Bertulang';
        comps = [
          { uraian: 'Pekerja', satuan: 'OH', koefisien: 0.0070, harga_satuan: 164000, jumlah_harga: 1148, jenis: 'tenaga' },
          { uraian: 'Tukang besi', satuan: 'OH', koefisien: 0.0070, harga_satuan: 198000, jumlah_harga: 1386, jenis: 'tenaga' },
          { uraian: 'Kepala tukang', satuan: 'OH', koefisien: 0.0007, harga_satuan: 210000, jumlah_harga: 147, jenis: 'tenaga' },
          { uraian: 'Mandor', satuan: 'OH', koefisien: 0.0004, harga_satuan: 226000, jumlah_harga: 90, jenis: 'tenaga' },
          { uraian: 'Besi Beton Polos BJTP 280', satuan: 'kg', koefisien: 1.0500, harga_satuan: 14840, jumlah_harga: 15582, jenis: 'bahan' },
          { uraian: 'Kawat Beton / Bendrat', satuan: 'kg', koefisien: 0.0150, harga_satuan: 18800, jumlah_harga: 282, jenis: 'bahan' }
        ];
      } else if (itName.includes('bekisting') || itName.includes('begisting') || itName.includes('cetakan')) {
        divisi = 'Pekerjaan Struktur Beton Bertulang';
        comps = [
          { uraian: 'Pekerja', satuan: 'OH', koefisien: 0.5200, harga_satuan: 164000, jumlah_harga: 85280, jenis: 'tenaga' },
          { uraian: 'Tukang kayu', satuan: 'OH', koefisien: 0.2600, harga_satuan: 198000, jumlah_harga: 51480, jenis: 'tenaga' },
          { uraian: 'Kepala tukang', satuan: 'OH', koefisien: 0.0260, harga_satuan: 210000, jumlah_harga: 5460, jenis: 'tenaga' },
          { uraian: 'Mandor', satuan: 'OH', koefisien: 0.0260, harga_satuan: 226000, jumlah_harga: 5876, jenis: 'tenaga' },
          { uraian: 'Kayu Kaso 5/7 Kelas II/III', satuan: 'm3', koefisien: 0.0400, harga_satuan: 10214200, jumlah_harga: 408568, jenis: 'bahan' },
          { uraian: 'Paku Biasa 5-7 cm', satuan: 'kg', koefisien: 0.4000, harga_satuan: 20000, jumlah_harga: 8000, jenis: 'bahan' },
          { uraian: 'Minyak Bekisting', satuan: 'liter', koefisien: 0.2000, harga_satuan: 21000, jumlah_harga: 4200, jenis: 'bahan' }
        ];
      } else if (itName.includes('cat') || itName.includes('pengecatan') || itName.includes('plamir')) {
        divisi = 'Pekerjaan Pengecatan & Finishing';
        comps = [
          { uraian: 'Pekerja', satuan: 'OH', koefisien: 0.0200, harga_satuan: 164000, jumlah_harga: 3280, jenis: 'tenaga' },
          { uraian: 'Tukang cat', satuan: 'OH', koefisien: 0.0630, harga_satuan: 198000, jumlah_harga: 12474, jenis: 'tenaga' },
          { uraian: 'Kepala tukang', satuan: 'OH', koefisien: 0.0063, harga_satuan: 210000, jumlah_harga: 1323, jenis: 'tenaga' },
          { uraian: 'Mandor', satuan: 'OH', koefisien: 0.0030, harga_satuan: 226000, jumlah_harga: 678, jenis: 'tenaga' },
          { uraian: 'Plamir / Cat Dasar Alkali', satuan: 'kg', koefisien: 0.1000, harga_satuan: 28000, jumlah_harga: 2800, jenis: 'bahan' },
          { uraian: 'Cat Tembok Penutup Emulsi', satuan: 'kg', koefisien: 0.2600, harga_satuan: 45000, jumlah_harga: 11700, jenis: 'bahan' },
          { uraian: 'Kertas Amplas', satuan: 'lembar', koefisien: 0.5000, harga_satuan: 6000, jumlah_harga: 3000, jenis: 'bahan' }
        ];
      } else if (itName.includes('atap') || itName.includes('spandek') || itName.includes('seng') || itName.includes('genteng') || itName.includes('truss') || itName.includes('baja ringan')) {
        divisi = 'Pekerjaan Atap & Plafon';
        comps = [
          { uraian: 'Pekerja', satuan: 'OH', koefisien: 0.1500, harga_satuan: 164000, jumlah_harga: 24600, jenis: 'tenaga' },
          { uraian: 'Tukang kayu / atap', satuan: 'OH', koefisien: 0.1000, harga_satuan: 198000, jumlah_harga: 19800, jenis: 'tenaga' },
          { uraian: 'Kepala tukang', satuan: 'OH', koefisien: 0.0100, harga_satuan: 210000, jumlah_harga: 2100, jenis: 'tenaga' },
          { uraian: 'Mandor', satuan: 'OH', koefisien: 0.0080, harga_satuan: 226000, jumlah_harga: 1808, jenis: 'tenaga' },
          { uraian: 'Penutup Atap Spandek / Seng BJLS', satuan: 'm2', koefisien: 1.0500, harga_satuan: 85000, jumlah_harga: 89250, jenis: 'bahan' },
          { uraian: 'Paku / Sekrup Atap Khusus', satuan: 'kg', koefisien: 0.0800, harga_satuan: 35000, jumlah_harga: 2800, jenis: 'bahan' }
        ];
      } else if (itName.includes('plafon') || itName.includes('gypsum') || itName.includes('grc') || itName.includes('langit-langit')) {
        divisi = 'Pekerjaan Atap & Plafon';
        comps = [
          { uraian: 'Pekerja', satuan: 'OH', koefisien: 0.1000, harga_satuan: 164000, jumlah_harga: 16400, jenis: 'tenaga' },
          { uraian: 'Tukang plafon / kayu', satuan: 'OH', koefisien: 0.0500, harga_satuan: 198000, jumlah_harga: 9900, jenis: 'tenaga' },
          { uraian: 'Kepala tukang', satuan: 'OH', koefisien: 0.0050, harga_satuan: 210000, jumlah_harga: 1050, jenis: 'tenaga' },
          { uraian: 'Mandor', satuan: 'OH', koefisien: 0.0050, harga_satuan: 226000, jumlah_harga: 1130, jenis: 'tenaga' },
          { uraian: 'Papan GRC / Gypsum 9 mm', satuan: 'lembar', koefisien: 0.3640, harga_satuan: 75000, jumlah_harga: 27300, jenis: 'bahan' },
          { uraian: 'Rangka Hollow Galvalum 20x40 / 40x40', satuan: 'm1', koefisien: 3.5000, harga_satuan: 14500, jumlah_harga: 50750, jenis: 'bahan' },
          { uraian: 'Sekrup Gypsum / GRC', satuan: 'dus', koefisien: 0.1100, harga_satuan: 35000, jumlah_harga: 3850, jenis: 'bahan' }
        ];
      } else if (itName.includes('keramik') || itName.includes('lantai') || itName.includes('granit') || itName.includes('ubin')) {
        divisi = 'Pekerjaan Penutup Lantai & Dinding';
        comps = [
          { uraian: 'Pekerja', satuan: 'OH', koefisien: 0.2500, harga_satuan: 164000, jumlah_harga: 41000, jenis: 'tenaga' },
          { uraian: 'Tukang batu / keramik', satuan: 'OH', koefisien: 0.1250, harga_satuan: 198000, jumlah_harga: 24750, jenis: 'tenaga' },
          { uraian: 'Kepala tukang', satuan: 'OH', koefisien: 0.0125, harga_satuan: 210000, jumlah_harga: 2625, jenis: 'tenaga' },
          { uraian: 'Mandor', satuan: 'OH', koefisien: 0.0125, harga_satuan: 226000, jumlah_harga: 2825, jenis: 'tenaga' },
          { uraian: 'Ubin Keramik 40x40 cm Standar', satuan: 'm2', koefisien: 1.0500, harga_satuan: 78000, jumlah_harga: 81900, jenis: 'bahan' },
          { uraian: 'Semen Portland (PC)', satuan: 'kg', koefisien: 9.8000, harga_satuan: 1300, jumlah_harga: 12740, jenis: 'bahan' },
          { uraian: 'Pasir Pasang', satuan: 'm3', koefisien: 0.0450, harga_satuan: 200000, jumlah_harga: 9000, jenis: 'bahan' },
          { uraian: 'Semen Warna / Grout', satuan: 'kg', koefisien: 1.5000, harga_satuan: 15000, jumlah_harga: 22500, jenis: 'bahan' }
        ];
      } else {
        divisi = 'Pekerjaan Standar Konstruksi';
        const upahPortion = Math.round(itPrice * 0.35);
        const bahanPortion = Math.round(itPrice * 0.55);
        comps = [
          { uraian: 'Pekerja Konstruksi', satuan: 'OH', koefisien: 0.6000, harga_satuan: 164000, jumlah_harga: 98400, jenis: 'tenaga' },
          { uraian: 'Tukang Terampil', satuan: 'OH', koefisien: 0.2000, harga_satuan: 198000, jumlah_harga: 39600, jenis: 'tenaga' },
          { uraian: 'Mandor Lapangan', satuan: 'OH', koefisien: 0.0200, harga_satuan: 226000, jumlah_harga: 4520, jenis: 'tenaga' },
          { uraian: 'Bahan Material Konstruksi Pokok', satuan: itUnit, koefisien: 1.0000, harga_satuan: bahanPortion, jumlah_harga: bahanPortion, jenis: 'bahan' }
        ];
      }

      let totU = 0, totB = 0, totA = 0;
      comps.forEach(c => {
        const sub = c.jumlah_harga || (c.koefisien * c.harga_satuan) || 0;
        if (c.jenis === 'tenaga') totU += sub;
        else if (c.jenis === 'bahan') totB += sub;
        else if (c.jenis === 'alat') totA += sub;
      });
      const d = totU + totB + totA;
      const ovh = Math.round(d * 0.10);
      const fin = d + ovh;

      return {
        kode: code || '1.1.1.1',
        nama: cleanTitle,
        sat: itUnit,
        divisi: divisi,
        biaya_upah: totU,
        biaya_bahan: totB,
        biaya_alat: totA,
        overhead: ovh,
        hsp_final: itPrice || fin,
        components: comps
      };
    }

    updateItem(code, updatedFields) {
      const idx = this.items.findIndex(x => x.kode === code);
      if (idx !== -1) {
        this.items[idx] = { ...this.items[idx], ...updatedFields };
        this.overrides[code] = {
          nama: this.items[idx].nama,
          sat: this.items[idx].sat,
          hsp_final: this.items[idx].hsp_final
        };
        this.saveOverrides();
        return this.items[idx];
      }
      return null;
    }

    filter(query = '', division = '') {
      let result = this.items;
      if (division) {
        result = result.filter(x => x.divisi && x.divisi.toLowerCase() === division.toLowerCase());
      }
      if (query && query.trim()) {
        const q = query.trim().toLowerCase();
        result = result.filter(x => 
          (x.kode && x.kode.toLowerCase().includes(q)) ||
          (x.nama && x.nama.toLowerCase().includes(q)) ||
          (x.divisi && x.divisi.toLowerCase().includes(q))
        );
      }
      return result;
    }

    getDivisionsList() {
      const set = new Set();
      this.items.forEach(x => {
        if (x.divisi) set.add(x.divisi);
      });
      return Array.from(set).sort();
    }

    getDefaultAhspFallback() {
      return [
        { kode: 'A.2.2.1.1', nama: 'Penggalian 1 m3 tanah biasa sedalam 1 m', divisi: 'Pekerjaan Tanah', sat: 'm3', hsp_final: 78500, biaya_upah: 78500, biaya_bahan: 0, components: [] },
        { kode: 'A.3.2.1.2', nama: 'Pemasangan 1 m3 pondasi batu belah 1SP : 4PP', divisi: 'Pekerjaan Pondasi', sat: 'm3', hsp_final: 945000, biaya_upah: 285000, biaya_bahan: 660000, components: [] },
        { kode: 'A.4.1.1.5', nama: 'Membuat 1 m3 beton mutu fc = 19,3 MPa (K 225)', divisi: 'Pekerjaan Beton', sat: 'm3', hsp_final: 1285000, biaya_upah: 225000, biaya_bahan: 1060000, components: [] }
      ];
    }

    // =====================================================================
    // PRICE OVERRIDE SYSTEM (Harga Satuan Komponen / Bahan & Upah)
    // =====================================================================
    get priceKey() { return 'sipro_komponen_prices_v1'; }

    loadKomponenPrices() {
      try {
        const s = localStorage.getItem(this.priceKey);
        return s ? JSON.parse(s) : {};
      } catch (e) { return {}; }
    }

    saveKomponenPrices(map) {
      try { localStorage.setItem(this.priceKey, JSON.stringify(map)); } catch (e) {}
    }

    resetKomponenPrices() {
      localStorage.removeItem(this.priceKey);
    }

    // Get the effective price for a component (override takes precedence)
    getKomponenPrice(uraian, jenis) {
      const map = this.loadKomponenPrices();
      const key = (jenis + '||' + (uraian || '').toLowerCase().trim());
      return map[key] !== undefined ? map[key] : null;
    }

    // Extract all unique components from master database, grouped by jenis
    getAllUniqueKomponen(jenis = 'tenaga') {
      const map = new Map(); // key = lower(uraian), value = { uraian, satuan, harga_satuan_default }
      this.items.forEach(it => {
        (it.components || []).forEach(c => {
          if (c.jenis !== jenis) return;
          const key = (c.uraian || '').toLowerCase().trim();
          if (!key || key.length < 2) return;
          if (!map.has(key)) {
            map.set(key, {
              uraian: c.uraian || '',
              satuan: c.satuan || (jenis === 'tenaga' ? 'OH' : '-'),
              harga_satuan_default: c.harga_satuan || 0
            });
          }
        });
      });
      return Array.from(map.values()).sort((a, b) => a.uraian.localeCompare(b.uraian, 'id'));
    }

    // Apply komponen price overrides to all items' components
    applyKomponenPrices() {
      const map = this.loadKomponenPrices();
      if (Object.keys(map).length === 0) return; // No overrides

      this.items.forEach(it => {
        let newUpah = 0, newBahan = 0, newAlat = 0;
        let changed = false;

        (it.components || []).forEach(c => {
          const key = (c.jenis + '||' + (c.uraian || '').toLowerCase().trim());
          if (map[key] !== undefined) {
            c.harga_satuan = map[key];
            c.jumlah_harga = Math.round(c.koefisien * map[key]);
            changed = true;
          }
          if (c.jenis === 'tenaga') newUpah  += (c.jumlah_harga || 0);
          else if (c.jenis === 'bahan')  newBahan += (c.jumlah_harga || 0);
          else if (c.jenis === 'alat')   newAlat  += (c.jumlah_harga || 0);
        });

        if (changed) {
          it.biaya_upah  = Math.round(newUpah);
          it.biaya_bahan = Math.round(newBahan);
          it.biaya_alat  = Math.round(newAlat);
          const total  = newUpah + newBahan + newAlat;
          it.overhead  = Math.round(total * 0.10);
          it.hsp_final = Math.round(total + it.overhead);
        }
      });
    }
  }


  // --- RAB ENGINE & PROJECT STORE ---
  class RabEngine {
    constructor(ahspEngine) {
      this.ahspEngine = ahspEngine;
      this.storageKey = 'sipro_project_active_2026_v4';
      this.project = this.loadProject();
    }

    getDefaultProject() {
      return {
        info: {
          program: 'PROGRAM PENINGKATAN PRASARANA, SARANA, DAN UTILITAS UMUM (PSU)',
          kegiatan: 'URUSAN PENYELENGGARAAN PSU PERUMAHAN',
          name: 'PEMBANGUNAN KANTOR BPD',
          location: 'KAB. BARITO UTARA',
          year: '2026',
          contractNo: '600/08.KONTRAK/DPUPR-CK/2026',
          contractor: 'CV. BARITO UTARA KONSTRUKSI',
          consultant: 'CV. KONSULTAN TEKNIK KAL-TENG',
          ppk: 'H. AHMAD RIFAI, ST., MT.',
          nipPpk: '19780512 200501 1 008',
          durationWeeks: 16,
          ppnPercent: 11
        },
        divisions: [
          {
            id: 'div_1',
            code: 'DIV. I',
            name: 'PEKERJAAN PERSIAPAN & TANAH',
            items: [
              {
                id: 'it_1_1',
                wbsCode: '1.1',
                ahspCode: 'A.2.2.1.9',
                name: 'Pembersihan dan perataan lapangan kerja',
                unit: 'm2',
                volume: 180.0,
                unitPrice: 18500,
                totalPrice: 3330000,
                startWeek: 1,
                endWeek: 2,
                weight: 0,
                boq_backup: { panjang: 15, lebar: 12, tinggi: 1, faktor: 1, rumusTitle: 'Pembersihan Lapangan', rumusFormula: 'P * L', steps: '15.00 m x 12.00 m = 180.00 m2' }
              },
              {
                id: 'it_1_2',
                wbsCode: '1.2',
                ahspCode: 'A.2.2.1.1',
                name: 'Penggalian 1 m3 tanah biasa sedalam 1 m',
                unit: 'm3',
                volume: 48.5,
                unitPrice: 78500,
                totalPrice: 3807250,
                startWeek: 1,
                endWeek: 3,
                weight: 0,
                boq_backup: { panjang: 48.5, lebar: 1.0, tinggi: 1.0, faktor: 1, rumusTitle: 'Galian Tanah Pondasi', rumusFormula: 'P * L * T', steps: '48.50 m x 1.00 m x 1.00 m = 48.50 m3' }
              },
              {
                id: 'it_1_3',
                wbsCode: '1.3',
                ahspCode: 'A.2.3.1.1',
                name: 'Pengurugan kembali 1 m3 galian tanah',
                unit: 'm3',
                volume: 16.2,
                unitPrice: 34200,
                totalPrice: 554040,
                startWeek: 3,
                endWeek: 4,
                weight: 0,
                boq_backup: { panjang: 48.5, lebar: 1.0, tinggi: 0.33, faktor: 1, rumusTitle: 'Urugan Kembali Tanah', rumusFormula: 'Vol Galian * 1/3', steps: '48.50 m3 x 1/3 = 16.20 m3' }
              },
              {
                id: 'it_1_4',
                wbsCode: '1.4',
                ahspCode: 'A.2.3.1.11',
                name: 'Pengurugan 1 m3 pasir urug bawah pondasi',
                unit: 'm3',
                volume: 4.85,
                unitPrice: 228000,
                totalPrice: 1105800,
                startWeek: 2,
                endWeek: 3,
                weight: 0,
                boq_backup: { panjang: 48.5, lebar: 1.0, tinggi: 0.10, faktor: 1, rumusTitle: 'Pasir Urug Bawah Pondasi', rumusFormula: 'P * L * t', steps: '48.50 m x 1.00 m x 0.10 m = 4.85 m3' }
              }
            ]
          },
          {
            id: 'div_2',
            code: 'DIV. II',
            name: 'PEKERJAAN PONDASI & STRUKTUR BETON',
            items: [
              {
                id: 'it_2_1',
                wbsCode: '2.1',
                ahspCode: 'A.3.2.1.2',
                name: 'Pemasangan 1 m3 pondasi batu belah 1SP : 4PP',
                unit: 'm3',
                volume: 32.4,
                unitPrice: 945000,
                totalPrice: 30618000,
                startWeek: 2,
                endWeek: 5,
                weight: 0,
                boq_backup: { panjang: 48.5, lebar: 0.8, tinggi: 0.85, faktor: 1, rumusTitle: 'Pondasi Batu Kali Trapesium', rumusFormula: '0.5 * (a + b) * t * L', steps: '0.5 x (0.35 + 0.80) m x 0.85 m x 48.50 m = 32.40 m3' }
              },
              {
                id: 'it_2_2',
                wbsCode: '2.2',
                ahspCode: 'A.4.1.1.5',
                name: "Membuat 1 m3 beton mutu f'c = 19,3 MPa (K 225) untuk Sloof",
                unit: 'm3',
                volume: 5.82,
                unitPrice: 1285000,
                totalPrice: 7478700,
                startWeek: 4,
                endWeek: 7,
                weight: 0,
                boq_backup: { panjang: 48.5, lebar: 0.15, tinggi: 0.20, faktor: 1, rumusTitle: 'Beton Sloof 15/20', rumusFormula: 'P * b * h', steps: '48.50 m x 0.15 m x 0.20 m = 5.82 m3' }
              },
              {
                id: 'it_2_3',
                wbsCode: '2.3',
                ahspCode: 'A.4.1.1.5',
                name: "Membuat 1 m3 beton mutu f'c = 19,3 MPa (K 225) untuk Kolom Praktis & Struktur",
                unit: 'm3',
                volume: 6.48,
                unitPrice: 1285000,
                totalPrice: 8326800,
                startWeek: 5,
                endWeek: 9,
                weight: 0,
                boq_backup: { panjang: 0.2, lebar: 0.2, tinggi: 3.6, faktor: 45, rumusTitle: 'Beton Kolom Struktur 20/20', rumusFormula: 'b * h * t * n', steps: '0.20 m x 0.20 m x 3.60 m x 45 titik = 6.48 m3' }
              },
              {
                id: 'it_2_4',
                wbsCode: '2.4',
                ahspCode: 'A.4.1.1.5',
                name: "Membuat 1 m3 beton mutu f'c = 19,3 MPa (K 225) untuk Ringbalk & Balok",
                unit: 'm3',
                volume: 4.36,
                unitPrice: 1285000,
                totalPrice: 5602600,
                startWeek: 7,
                endWeek: 11,
                weight: 0,
                boq_backup: { panjang: 48.5, lebar: 0.15, tinggi: 0.15, faktor: 1, rumusTitle: 'Beton Ringbalk 15/15', rumusFormula: 'P * b * h', steps: '48.50 m x 0.15 m x 0.15 m = 4.36 m3' }
              }
            ]
          },
          {
            id: 'div_3',
            code: 'DIV. III',
            name: 'PEKERJAAN DINDING, PLESTERAN & FINISHING',
            items: [
              {
                id: 'it_3_1',
                wbsCode: '3.1',
                ahspCode: 'A.4.4.1.9',
                name: 'Pemasangan 1 m2 dinding bata merah tebal 1/2 bata 1SP : 4PP',
                unit: 'm2',
                volume: 245.0,
                unitPrice: 168500,
                totalPrice: 41282500,
                startWeek: 6,
                endWeek: 11,
                weight: 0,
                boq_backup: { panjang: 48.5, lebar: 3.6, tinggi: 1, faktor: 1.4, rumusTitle: 'Dinding Bata Merah', rumusFormula: 'Keliling * Tinggi - Bukaan', steps: '((48.50 m x 3.60 m) - Bukaan Kusen 30 m2) x 1.4 = 245.00 m2' }
              },
              {
                id: 'it_3_2',
                wbsCode: '3.2',
                ahspCode: 'A.4.4.2.4',
                name: 'Pemasangan 1 m2 plesteran 1SP : 4PP tebal 15 mm (2 sisi)',
                unit: 'm2',
                volume: 490.0,
                unitPrice: 52400,
                totalPrice: 25676000,
                startWeek: 8,
                endWeek: 13,
                weight: 0,
                boq_backup: { panjang: 245, lebar: 2, tinggi: 1, faktor: 1, rumusTitle: 'Plesteran Dinding 2 Sisi', rumusFormula: 'Luas Dinding * 2 Sisi', steps: '245.00 m2 x 2 = 490.00 m2' }
              },
              {
                id: 'it_3_3',
                wbsCode: '3.3',
                ahspCode: 'A.4.4.3.3',
                name: 'Pemasangan 1 m2 acian dinding',
                unit: 'm2',
                volume: 490.0,
                unitPrice: 38200,
                totalPrice: 18718000,
                startWeek: 9,
                endWeek: 14,
                weight: 0,
                boq_backup: { panjang: 490, lebar: 1, tinggi: 1, faktor: 1, rumusTitle: 'Acian Dinding 2 Sisi', rumusFormula: 'Sama dengan Plesteran', steps: '490.00 m2 x 1 = 490.00 m2' }
              },
              {
                id: 'it_3_4',
                wbsCode: '3.4',
                ahspCode: 'A.4.5.2.22',
                name: 'Pemasangan 1 m2 lantai keramik 40x40 cm motif',
                unit: 'm2',
                volume: 135.0,
                unitPrice: 188000,
                totalPrice: 25380000,
                startWeek: 11,
                endWeek: 15,
                weight: 0,
                boq_backup: { panjang: 15, lebar: 9, tinggi: 1, faktor: 1, rumusTitle: 'Lantai Keramik Bangunan Utama', rumusFormula: 'P * L', steps: '15.00 m x 9.00 m = 135.00 m2' }
              },
              {
                id: 'it_3_5',
                wbsCode: '3.5',
                ahspCode: 'A.4.7.1.10',
                name: 'Pengecatan 1 m2 tembok baru interior dan eksterior',
                unit: 'm2',
                volume: 490.0,
                unitPrice: 34500,
                totalPrice: 16905000,
                startWeek: 12,
                endWeek: 16,
                weight: 0,
                boq_backup: { panjang: 490, lebar: 1, tinggi: 1, faktor: 1, rumusTitle: 'Pengecatan Tembok', rumusFormula: 'Sama dengan Luas Acian', steps: '490.00 m2 x 1 = 490.00 m2' }
              }
            ]
          },
          {
            id: 'div_4',
            code: 'DIV. IV',
            name: 'PEKERJAAN ATAP & PLAFON',
            items: [
              {
                id: 'it_4_1',
                wbsCode: '4.1',
                ahspCode: 'A.4.2.1.21',
                name: 'Pemasangan 1 m2 rangka atap baja ringan profil C75',
                unit: 'm2',
                volume: 165.0,
                unitPrice: 245000,
                totalPrice: 40425000,
                startWeek: 8,
                endWeek: 12,
                weight: 0,
                boq_backup: { panjang: 16.5, lebar: 10, tinggi: 1, faktor: 1, rumusTitle: 'Rangka Atap Baja Ringan', rumusFormula: 'Luas Bidang Atap (Kemiringan 30 deg)', steps: '16.50 m x 10.00 m = 165.00 m2' }
              },
              {
                id: 'it_4_2',
                wbsCode: '4.2',
                ahspCode: 'A.4.5.2.4',
                name: 'Pemasangan 1 m2 penutup atap genteng metal berpasir',
                unit: 'm2',
                volume: 165.0,
                unitPrice: 135000,
                totalPrice: 22275000,
                startWeek: 10,
                endWeek: 13,
                weight: 0,
                boq_backup: { panjang: 16.5, lebar: 10, tinggi: 1, faktor: 1, rumusTitle: 'Penutup Atap Genteng Metal', rumusFormula: 'Sama dengan Rangka Atap', steps: '165.00 m2 x 1 = 165.00 m2' }
              },
              {
                id: 'it_4_3',
                wbsCode: '4.3',
                ahspCode: 'A.4.5.1.7',
                name: 'Pemasangan 1 m2 plafon gypsum board 9 mm + rangka hollow',
                unit: 'm2',
                volume: 135.0,
                unitPrice: 145000,
                totalPrice: 19575000,
                startWeek: 11,
                endWeek: 15,
                weight: 0,
                boq_backup: { panjang: 15, lebar: 9, tinggi: 1, faktor: 1, rumusTitle: 'Plafon Gypsum Ruang Dalam', rumusFormula: 'P * L', steps: '15.00 m x 9.00 m = 135.00 m2' }
              }
            ]
          }
        ],
        opnames: [
          { week: 1, cumulativePercent: 2.15, note: 'Pembersihan lahan & patok bouwplank 100%', weatherGood: 6, weatherRain: 1, date: '2026-08-01' },
          { week: 2, cumulativePercent: 5.80, note: 'Galian tanah pondasi lajur dan pasir urug', weatherGood: 5, weatherRain: 2, date: '2026-08-08' },
          { week: 3, cumulativePercent: 12.45, note: 'Pasangan pondasi batu belah segmen 1', weatherGood: 6, weatherRain: 1, date: '2026-08-15' },
          { week: 4, cumulativePercent: 21.30, note: 'Pondasi selesai, perakitan besi sloof', weatherGood: 7, weatherRain: 0, date: '2026-08-22' }
        ]
      };
    }

    getSavedProjectsList() {
      try {
        const raw = localStorage.getItem('sipro_saved_projects_list_2026');
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list) && list.length > 0) return list;
        }
      } catch (e) {
        console.warn('Failed to parse saved projects list', e);
      }
      return [];
    }

    saveProjectsList(list) {
      try {
        localStorage.setItem('sipro_saved_projects_list_2026', JSON.stringify(list));
      } catch (e) {
        console.warn('Failed to save projects list', e);
      }
    }

    syncToProjectsList(proj) {
      if (!proj || !proj.info) return;
      const projId = proj.id || proj.info.id || 'proj_default_2026';
      proj.id = projId;
      proj.info.id = projId;
      proj.updatedAt = new Date().toISOString();

      let list = this.getSavedProjectsList();
      const idx = list.findIndex(p => p.id === projId || (p.info && p.info.id === projId));
      if (idx >= 0) {
        list[idx] = JSON.parse(JSON.stringify(proj));
      } else {
        list.unshift(JSON.parse(JSON.stringify(proj)));
      }
      this.saveProjectsList(list);
    }

    loadProject() {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.info) {
            if (!parsed.id) {
              parsed.id = parsed.info.id || 'proj_default_2026';
              parsed.info.id = parsed.id;
            }
            this.recalculateProject(parsed);
            this.syncToProjectsList(parsed);
            return parsed;
          }
        } catch (e) {
          console.warn('Failed to parse project from localStorage', e);
        }
      }
      const initial = this.getDefaultProject();
      initial.id = 'proj_default_2026';
      initial.info.id = 'proj_default_2026';
      this.recalculateProject(initial);
      this.saveProject(initial);
      return initial;
    }

    saveProject(proj = null) {
      if (proj) this.project = proj;
      if (!this.project.id) {
        this.project.id = (this.project.info && this.project.info.id) || 'proj_' + Date.now();
        if (this.project.info) this.project.info.id = this.project.id;
      }
      this.recalculateProject(this.project);
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.project));
        this.syncToProjectsList(this.project);
      } catch (e) {
        console.warn('LocalStorage error saving project', e);
      }
    }

    createNewProject(options = {}) {
      // 1. Auto-save current active project so it is preserved in the archive
      this.saveProject();

      // 2. Build new clean project
      const newId = 'proj_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
      const newProj = {
        id: newId,
        info: {
          id: newId,
          name: (options.name || 'PROYEK KONSTRUKSI BARU').trim().toUpperCase(),
          program: options.program || 'PROGRAM PENINGKATAN PRASARANA, SARANA, DAN UTILITAS UMUM (PSU)',
          kegiatan: options.kegiatan || 'URUSAN PENYELENGGARAAN PSU PERUMAHAN',
          location: options.location || 'KAB. BARITO UTARA',
          year: options.year || '2026',
          contractNo: options.contractNo || ('600/' + Math.floor(Math.random() * 90 + 10) + '.KONTRAK/DPUPR-CK/2026'),
          contractor: options.contractor || 'CV. BARITO UTARA KONSTRUKSI',
          consultant: options.consultant || 'CV. KONSULTAN TEKNIK KAL-TENG',
          ppk: options.ppk || 'H. AHMAD RIFAI, ST., MT.',
          nipPpk: options.nipPpk || '19780512 200501 1 008',
          durationWeeks: parseInt(options.durationWeeks) || 16,
          ppnPercent: parseFloat(options.ppnPercent) || 11,
          region: options.region || 'MUARA_TEWEH',
          createdAt: new Date().toISOString()
        },
        divisions: options.withDefaultStructure ? [
          { id: 'div_1', code: 'DIV. I', name: 'PEKERJAAN PERSIAPAN & TANAH', items: [], subtotal: 0 },
          { id: 'div_2', code: 'DIV. II', name: 'PEKERJAAN PONDASI & STRUKTUR BETON', items: [], subtotal: 0 },
          { id: 'div_3', code: 'DIV. III', name: 'PEKERJAAN DINDING & LANTAI', items: [], subtotal: 0 },
          { id: 'div_4', code: 'DIV. IV', name: 'PEKERJAAN ATAP & PLAFON', items: [], subtotal: 0 }
        ] : [],
        opnames: [],
        totalDirectCost: 0,
        ppnAmount: 0,
        grandTotal: 0
      };

      this.project = newProj;
      this.saveProject(newProj);
      return newProj;
    }

    openSavedProject(projId) {
      // 1. Auto-save current project before switching
      this.saveProject();

      // 2. Find target project in saved list
      const list = this.getSavedProjectsList();
      const found = list.find(p => p.id === projId || (p.info && p.info.id === projId));
      if (!found) return null;

      this.project = JSON.parse(JSON.stringify(found));
      this.recalculateProject(this.project);
      this.saveProject(this.project);
      return this.project;
    }

    duplicateProject(projId) {
      this.saveProject();
      const list = this.getSavedProjectsList();
      const orig = list.find(p => p.id === projId || (p.info && p.info.id === projId)) || this.project;
      const clone = JSON.parse(JSON.stringify(orig));
      const newId = 'proj_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
      clone.id = newId;
      if (clone.info) {
        clone.info.id = newId;
        clone.info.name = '[Salinan] ' + clone.info.name;
        clone.info.createdAt = new Date().toISOString();
      }
      this.recalculateProject(clone);
      list.unshift(clone);
      this.saveProjectsList(list);
      return clone;
    }

    deleteSavedProject(projId) {
      let list = this.getSavedProjectsList();
      list = list.filter(p => p.id !== projId && (!p.info || p.info.id !== projId));
      if (list.length === 0) {
        const def = this.getDefaultProject();
        def.id = 'proj_default_2026';
        def.info.id = 'proj_default_2026';
        list.push(def);
        this.saveProjectsList(list);
        this.project = def;
        this.saveProject(def);
        return def;
      }
      this.saveProjectsList(list);

      // If active was deleted, switch to the first remaining project
      if (this.project.id === projId || (this.project.info && this.project.info.id === projId)) {
        this.project = list[0];
        this.recalculateProject(this.project);
        this.saveProject(this.project);
      }
      return this.project;
    }

    recalculateProject(proj = null) {
      const p = proj || this.project;
      let totalDirectCost = 0;

      p.divisions.forEach(div => {
        let divSubtotal = 0;
        div.items.forEach(it => {
          it.volume = Number(it.volume) || 0;
          it.unitPrice = Number(it.unitPrice) || 0;
          it.totalPrice = it.volume * it.unitPrice;
          divSubtotal += it.totalPrice;
        });
        div.subtotal = divSubtotal;
        totalDirectCost += divSubtotal;
      });

      p.totalDirectCost = totalDirectCost;
      const ppnRate = (Number(p.info.ppnPercent) || 11) / 100;
      p.ppnAmount = Math.round(totalDirectCost * ppnRate);
      p.grandTotal = totalDirectCost + p.ppnAmount;

      p.divisions.forEach(div => {
        div.weight = totalDirectCost > 0 ? (div.subtotal / totalDirectCost) * 100 : 0;
        div.items.forEach(it => {
          it.weight = totalDirectCost > 0 ? (it.totalPrice / totalDirectCost) * 100 : 0;
        });
      });

      return p;
    }

    stepItemVolume(divId, itemId, delta) {
      const div = this.project.divisions.find(d => d.id === divId);
      if (!div) return false;
      const item = div.items.find(i => i.id === itemId);
      if (!item) return false;
      
      const newVol = Math.max(0.01, (Number(item.volume) || 0) + delta);
      item.volume = Math.round(newVol * 100) / 100;
      this.saveProject();
      return true;
    }

    setItemVolume(divId, itemId, volume, backupData = null) {
      const div = this.project.divisions.find(d => d.id === divId);
      if (!div) return false;
      const item = div.items.find(i => i.id === itemId);
      if (!item) return false;
      
      item.volume = Math.max(0.01, Number(volume) || 0.01);
      if (backupData) {
        item.boq_backup = backupData;
      }
      this.saveProject();
      return true;
    }

    addItem(divId, itemData) {
      const div = this.project.divisions.find(d => d.id === divId);
      if (!div) return null;
      
      const nextNum = div.items.length + 1;
      const divNum = div.code.replace(/[^0-9IVX]/g, '').trim() || '1';
      const unitClean = Utils.sanitizeText(itemData.unit || 'm2');
      const newItem = {
        id: Utils.generateId('it'),
        wbsCode: divNum + '.' + nextNum,
        ahspCode: itemData.ahspCode || 'CUSTOM',
        name: Utils.sanitizeText(itemData.name || 'Item Pekerjaan Baru'),
        unit: unitClean,
        volume: Number(itemData.volume) || 1,
        unitPrice: Number(itemData.unitPrice) || 0,
        totalPrice: (Number(itemData.volume) || 1) * (Number(itemData.unitPrice) || 0),
        startWeek: Number(itemData.startWeek) || 1,
        endWeek: Number(itemData.endWeek) || Math.min(4, this.project.info.durationWeeks || 16),
        weight: 0,
        boq_backup: itemData.boq_backup || { panjang: Number(itemData.volume) || 1, lebar: 1, tinggi: 1, faktor: 1, rumusTitle: 'Input Manual', rumusFormula: 'P * 1', steps: itemData.volume + ' ' + unitClean }
      };

      div.items.push(newItem);
      this.saveProject();
      return newItem;
    }

    deleteItem(divId, itemId) {
      const div = this.project.divisions.find(d => d.id === divId);
      if (!div) return false;
      const initialLen = div.items.length;
      div.items = div.items.filter(i => i.id !== itemId);
      if (div.items.length !== initialLen) {
        this.saveProject();
        return true;
      }
      return false;
    }

    addDivision(name = 'DIVISI PEKERJAAN BARU') {
      const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
      const nextIdx = this.project.divisions.length;
      const roman = romanNumerals[nextIdx] || (nextIdx + 1).toString();
      
      const newDiv = {
        id: Utils.generateId('div'),
        code: 'DIV. ' + roman,
        name: Utils.sanitizeText(name).toUpperCase(),
        subtotal: 0,
        weight: 0,
        items: []
      };

      this.project.divisions.push(newDiv);
      this.saveProject();
      return newDiv;
    }

    deleteDivision(divId) {
      const initialLen = this.project.divisions.length;
      this.project.divisions = this.project.divisions.filter(d => d.id !== divId);
      if (this.project.divisions.length !== initialLen) {
        this.saveProject();
        return true;
      }
      return false;
    }

    addOrUpdateOpname(week, cumulativePercent, note = '', weatherGood = 6, weatherRain = 1) {
      const w = Number(week);
      const pct = Number(cumulativePercent);
      if (isNaN(w) || isNaN(pct)) return false;

      const idx = this.project.opnames.findIndex(o => o.week === w);
      const newOpname = {
        week: w,
        cumulativePercent: Math.round(pct * 100) / 100,
        note: Utils.sanitizeText(note) || ('Opname kemajuan fisik minggu ke-' + w),
        weatherGood: Number(weatherGood) || 6,
        weatherRain: Number(weatherRain) || 1,
        date: new Date().toISOString().split('T')[0]
      };

      if (idx !== -1) {
        this.project.opnames[idx] = newOpname;
      } else {
        this.project.opnames.push(newOpname);
      }

      this.project.opnames.sort((a, b) => a.week - b.week);
      this.saveProject();
      return newOpname;
    }

    deleteOpname(week) {
      const w = Number(week);
      this.project.opnames = this.project.opnames.filter(o => o.week !== w);
      this.saveProject();
      return true;
    }
  }

  // --- SCHEDULE ENGINE ---
  class ScheduleEngine {
    constructor(rabEngine) {
      this.rabEngine = rabEngine;
    }

    generateScheduleMatrix(distMode = 'linear') {
      const project = this.rabEngine.project;
      const durationWeeks = Number(project.info.durationWeeks) || 16;
      const weeklyPlannedTotals = new Array(durationWeeks).fill(0);
      const matrixRows = [];

      project.divisions.forEach(div => {
        const divRow = {
          isDivision: true,
          id: div.id,
          code: div.code,
          name: div.name,
          subtotal: div.subtotal,
          weight: div.weight,
          weeklyWeights: new Array(durationWeeks).fill(0)
        };

        const itemRows = [];

        div.items.forEach(it => {
          let startW = Math.max(1, Math.min(Number(it.startWeek) || 1, durationWeeks));
          let endW = Math.max(startW, Math.min(Number(it.endWeek) || durationWeeks, durationWeeks));
          const span = (endW - startW + 1);
          const itemWeekly = new Array(durationWeeks).fill(0);

          if (span > 0 && it.weight > 0) {
            if (distMode === 'bell_curve' && span >= 3) {
              const weights = [];
              let sumW = 0;
              for (let i = 0; i < span; i++) {
                const x = (i + 0.5) / span;
                const bell = Math.exp(-Math.pow(x - 0.5, 2) / (2 * 0.04));
                weights.push(bell);
                sumW += bell;
              }
              for (let i = 0; i < span; i++) {
                const wIdx = startW - 1 + i;
                const portion = (weights[i] / sumW) * it.weight;
                itemWeekly[wIdx] = portion;
                divRow.weeklyWeights[wIdx] += portion;
                weeklyPlannedTotals[wIdx] += portion;
              }
            } else {
              const portion = it.weight / span;
              for (let w = startW - 1; w < endW; w++) {
                itemWeekly[w] = portion;
                divRow.weeklyWeights[w] += portion;
                weeklyPlannedTotals[w] += portion;
              }
            }
          }

          itemRows.push({
            isDivision: false,
            id: it.id,
            divisionId: div.id,
            wbsCode: it.wbsCode,
            ahspCode: it.ahspCode,
            name: it.name,
            unit: it.unit,
            volume: it.volume,
            unitPrice: it.unitPrice,
            totalPrice: it.totalPrice,
            weight: it.weight,
            startWeek: startW,
            endWeek: endW,
            weeklyWeights: itemWeekly
          });
        });

        matrixRows.push(divRow);
        itemRows.forEach(r => matrixRows.push(r));
      });

      const cumulativePlanned = [];
      let runningSum = 0;
      for (let i = 0; i < durationWeeks; i++) {
        runningSum += weeklyPlannedTotals[i];
        cumulativePlanned.push(Math.round(runningSum * 100) / 100);
      }

      if (cumulativePlanned.length > 0) {
        cumulativePlanned[cumulativePlanned.length - 1] = 100.00;
      }

      return {
        durationWeeks,
        matrixRows,
        weeklyPlannedTotals,
        cumulativePlanned
      };
    }
  }

  // --- S-CURVE CHART VISUALIZER ---
  class SCurveChart {
    constructor(rabEngine, scheduleEngine) {
      this.rabEngine = rabEngine;
      this.scheduleEngine = scheduleEngine;
    }

    render() {
      this.renderCanvas('scurveCanvas');
      this.renderCanvas('scurveCanvasFull');
    }

    renderCanvas(canvasId) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width > 0 ? rect.width : (canvasId === 'scurveCanvasFull' ? 800 : 700);
      const height = rect.height > 0 ? rect.height : (canvasId === 'scurveCanvasFull' ? 380 : 280);
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      const padding = { top: 35, right: 35, bottom: 45, left: 55 };
      const plotWidth = Math.max(10, width - padding.left - padding.right);
      const plotHeight = Math.max(10, height - padding.top - padding.bottom);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      const sched = this.scheduleEngine.generateScheduleMatrix();
      const durationWeeks = Math.max(1, sched.durationWeeks);
      const plannedCurve = sched.cumulativePlanned;
      const opnames = this.rabEngine.project.opnames || [];

      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      for (let p = 0; p <= 100; p += 20) {
        const y = padding.top + plotHeight - (p / 100) * plotHeight;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(padding.left + plotWidth, y);
        ctx.stroke();
        ctx.fillText(p + '%', padding.left - 8, y);
      }

      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      for (let w = 1; w <= durationWeeks; w++) {
        const x = padding.left + ((w - 1) / (durationWeeks - 1 || 1)) * plotWidth;
        ctx.beginPath();
        ctx.strokeStyle = '#f1f5f9';
        ctx.moveTo(x, padding.top);
        ctx.lineTo(x, padding.top + plotHeight);
        ctx.stroke();

        if (durationWeeks <= 16 || w === 1 || w === durationWeeks || w % 2 === 0) {
          ctx.fillText('M-' + w, x, padding.top + plotHeight + 10);
        }
      }

      ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      for (let w = 1; w <= durationWeeks; w++) {
        const plannedPct = plannedCurve[w - 1] || 0;
        const criticalPct = Math.max(0, plannedPct - 5);
        const x = padding.left + ((w - 1) / (durationWeeks - 1 || 1)) * plotWidth;
        const y = padding.top + plotHeight - (criticalPct / 100) * plotHeight;
        if (w === 1) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3;
      ctx.beginPath();

      for (let w = 1; w <= durationWeeks; w++) {
        const plannedPct = plannedCurve[w - 1] || 0;
        const x = padding.left + ((w - 1) / (durationWeeks - 1 || 1)) * plotWidth;
        const y = padding.top + plotHeight - (plannedPct / 100) * plotHeight;
        if (w === 1) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      for (let w = 1; w <= durationWeeks; w++) {
        const plannedPct = plannedCurve[w - 1] || 0;
        const x = padding.left + ((w - 1) / (durationWeeks - 1 || 1)) * plotWidth;
        const y = padding.top + plotHeight - (plannedPct / 100) * plotHeight;

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      if (opnames.length > 0) {
        const sortedOpnames = [...opnames].sort((a, b) => a.week - b.week);
        const lastOpname = sortedOpnames[sortedOpnames.length - 1];
        const lastPlanned = plannedCurve[lastOpname.week - 1] || 0;
        const dev = lastOpname.cumulativePercent - lastPlanned;

        let actualColor = '#10b981';
        if (dev < -5) actualColor = '#ef4444';
        else if (dev < 0) actualColor = '#f59e0b';

        ctx.strokeStyle = actualColor;
        ctx.lineWidth = 3.5;
        ctx.beginPath();

        let started = false;
        sortedOpnames.forEach(op => {
          if (op.week <= durationWeeks) {
            const x = padding.left + ((op.week - 1) / (durationWeeks - 1 || 1)) * plotWidth;
            const y = padding.top + plotHeight - (op.cumulativePercent / 100) * plotHeight;
            if (!started) {
              ctx.moveTo(x, y);
              started = true;
            } else {
              ctx.lineTo(x, y);
            }
          }
        });
        ctx.stroke();

        sortedOpnames.forEach(op => {
          if (op.week <= durationWeeks) {
            const x = padding.left + ((op.week - 1) / (durationWeeks - 1 || 1)) * plotWidth;
            const y = padding.top + plotHeight - (op.cumulativePercent / 100) * plotHeight;

            ctx.fillStyle = actualColor;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(x, y, 2.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.font = 'bold 10px "JetBrains Mono", monospace';
            ctx.fillStyle = '#0f172a';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(op.cumulativePercent.toFixed(1) + '%', x, y - 8);
          }
        });
      }
    }
  }

  // --- BOQ CALCULATOR & CUSTOM FORMULA ENGINE ---
  class BoqEngine {
    constructor(rabEngine) {
      this.rabEngine = rabEngine;
      this.customFormulasStorageKey = 'sipro_custom_formulas_v5';
      this.customFormulas = this.loadCustomFormulas();
      this.activeModelId = 'pondasi_batu_kali';
    }

    loadCustomFormulas() {
      const saved = localStorage.getItem(this.customFormulasStorageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.map(f => {
              const obj = this.buildFormulaObject(f);
              if (obj && Array.isArray(obj.inputs)) {
                obj.inputs.forEach(inp => inp.step = 'any');
              }
              return obj;
            });
          }
        } catch (e) {
          console.warn('Failed parsing custom formulas', e);
        }
      }
      return [];
    }

    saveCustomFormulas() {
      try {
        const serialized = this.customFormulas.map(f => ({
          id: f.id,
          name: f.title,
          category: f.category,
          unit: f.unit,
          expression: f.formulaStr || f.expression,
          inputs: (f.inputs || []).map(inp => ({ ...inp, step: 'any' }))
        }));
        localStorage.setItem(this.customFormulasStorageKey, JSON.stringify(serialized));
      } catch (e) {
        console.warn('Error saving custom formulas', e);
      }
    }

    buildFormulaObject(data) {
      const unitClean = Utils.formatUnitPlain(data.unit || 'm3');
      const formulaStr = data.expression || data.formulaStr || 'P * L';
      const rawInputs = data.inputs || [
        { key: 'P', label: 'Panjang (P)', unit: 'm', default: 10, step: 'any' },
        { key: 'L', label: 'Lebar (L)', unit: 'm', default: 1, step: 'any' }
      ];
      const inputs = rawInputs.map(inp => ({ ...inp, step: 'any' }));

      return {
        id: data.id || Utils.generateId('custom_form'),
        isCustom: true,
        category: data.category || 'custom',
        categoryName: 'Rumus Kustom Saya',
        title: Utils.sanitizeText(data.name || data.title || 'Rumus Kustom'),
        description: 'Rumus Kustom: ' + formulaStr,
        unit: unitClean,
        formulaStr: formulaStr,
        ahspCode: data.ahspCode || 'CUSTOM',
        inputs: inputs,
        calculate: (inputValues) => {
          const res = Utils.safeEvalMath(formulaStr, inputValues);
          const p = inputValues.P || inputValues.p || inputValues.panjang || res;
          const l = inputValues.L || inputValues.l || inputValues.lebar || 1;
          const t = inputValues.T || inputValues.t || inputValues.tinggi || inputValues.tebal || 1;
          const n = inputValues.N || inputValues.n || inputValues.jumlah || inputValues.faktor || 1;
          
          return {
            volume: Math.max(0, Math.round(res * 1000) / 1000),
            panjang: p, lebar: l, tinggi: t, faktor: n,
            steps: [
              'Ekspresi Rumus: ' + formulaStr,
              'Parameter Input: ' + Object.entries(inputValues).map(([k, v]) => k + ' = ' + v).join(', '),
              'Hasil Volume Terhitung = ' + res.toFixed(3) + ' ' + unitClean
            ]
          };
        }
      };
    }

    addCustomFormula(formulaData) {
      const newFormula = this.buildFormulaObject(formulaData);
      this.customFormulas.push(newFormula);
      this.saveCustomFormulas();
      return newFormula;
    }

    updateCustomFormula(id, formulaData) {
      const idx = this.customFormulas.findIndex(f => f.id === id);
      if (idx !== -1) {
        formulaData.id = id;
        const updated = this.buildFormulaObject(formulaData);
        this.customFormulas[idx] = updated;
        this.saveCustomFormulas();
        return updated;
      }
      return null;
    }

    deleteCustomFormula(id) {
      const initialLen = this.customFormulas.length;
      this.customFormulas = this.customFormulas.filter(f => f.id !== id);
      if (this.customFormulas.length !== initialLen) {
        this.saveCustomFormulas();
        if (this.activeModelId === id) {
          this.activeModelId = 'pondasi_batu_kali';
        }
        return true;
      }
      return false;
    }

    getAllModels() {
      const builtin = this.getBuiltinModels();
      return [...builtin, ...this.customFormulas];
    }

    getModelById(id) {
      const all = this.getAllModels();
      return all.find(m => m.id === id) || all[0];
    }

    getBuiltinModels() {
      const OPSI_BESI_TULANGAN = [
        { value: 0.222, label: 'Ã˜6 mm â€” 0.222 kg/m (Besi Polos / Praktis)' },
        { value: 0.395, label: 'Ã˜8 mm â€” 0.395 kg/m (Besi Sengkang / Begel)' },
        { value: 0.617, label: 'Ã˜10 mm â€” 0.617 kg/m (Tulangan Plat / Pembagi Tangga)' },
        { value: 0.888, label: 'Ã˜12 mm â€” 0.888 kg/m (Tulangan Pokok Tangga / Plat Tebal)' },
        { value: 1.043, label: 'Ã˜13 mm â€” 1.043 kg/m (Tulangan Utama SNI Balok / Kolom Ringan)' },
        { value: 1.580, label: 'Ã˜16 mm â€” 1.580 kg/m (Tulangan Pokok Kolom & Balok Standar)' },
        { value: 2.227, label: 'Ã˜19 mm â€” 2.227 kg/m (Kolom / Balok Bentang Besar)' },
        { value: 2.986, label: 'Ã˜22 mm â€” 2.986 kg/m (Struktur Bertingkat Gedung)' },
        { value: 3.856, label: 'Ã˜25 mm â€” 3.856 kg/m (Elemen Struktur Berat)' }
      ];

      const OPSI_PROFIL_BAJA = [
        { value: 21.3, label: 'WF 200x100x5.5x8 (21.3 kg/m)' },
        { value: 14.0, label: 'WF 150x75x5x7 (14.0 kg/m)' },
        { value: 29.6, label: 'WF 250x125x6x9 (29.6 kg/m)' },
        { value: 36.7, label: 'WF 300x150x6.5x9 (36.7 kg/m)' },
        { value: 49.7, label: 'WF 350x175x7x11 (49.7 kg/m)' },
        { value: 66.0, label: 'WF 400x200x8x13 (66.0 kg/m)' },
        { value: 9.36, label: 'Kanal UNP 100x50x5 (9.36 kg/m)' },
        { value: 18.6, label: 'Kanal UNP 150x75x6.5 (18.6 kg/m)' },
        { value: 3.77, label: 'Besi Siku L 50x50x5 (3.77 kg/m)' },
        { value: 7.38, label: 'Besi Siku L 70x70x7 (7.38 kg/m)' },
        { value: 0.0, label: 'Manual Input (Ketik Berat di Bawah)' }
      ];

      return [
        // =========================================================================
        // 1. PEKERJAAN PERSIAPAN
        // =========================================================================
        {
          id: 'pembersihan_lahan',
          category: 'persiapan',
          categoryName: 'Pekerjaan Persiapan',
          title: 'Pembersihan & Perataan Lahan',
          description: 'Perhitungan luas pembersihan lahan/site: Panjang Lahan x Lebar Lahan.',
          unit: 'm2',
          ahspCode: 'A.2.2.1.9',
          inputs: [
            { key: 'panjang', label: 'Panjang Lahan (P)', unit: 'm', default: 30, step: 'any' },
            { key: 'lebar', label: 'Lebar Lahan (L)', unit: 'm', default: 15, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang = 0, lebar = 0 } = inputs;
            const vol = panjang * lebar;
            return {
              volume: Math.round(vol * 100) / 100,
              panjang, lebar, tinggi: 1, faktor: 1,
              steps: [
                'Luas Pembersihan Lahan = ' + panjang.toFixed(2) + ' m x ' + lebar.toFixed(2) + ' m = ' + vol.toFixed(2) + ' m2'
              ]
            };
          }
        },
        {
          id: 'bouwplank',
          category: 'persiapan',
          categoryName: 'Pekerjaan Persiapan',
          title: 'Pengukuran & Pasang Bouwplank',
          description: 'Perhitungan panjang keliling bouwplank di sekeliling bangunan (termasuk jarak bebas kerja Â±1 m).',
          unit: "m'",
          ahspCode: 'A.2.2.1.4',
          inputs: [
            { key: 'keliling', label: 'Keliling Bouwplank (Kel)', unit: 'm', default: 70, step: 'any' }
          ],
          calculate: (inputs) => {
            const { keliling = 0 } = inputs;
            return {
              volume: Math.round(keliling * 100) / 100,
              panjang: keliling, lebar: 1, tinggi: 1, faktor: 1,
              steps: [
                'Panjang Total Bouwplank = ' + keliling.toFixed(2) + " m'"
              ]
            };
          }
        },
        {
          id: 'direksi_keet',
          category: 'persiapan',
          categoryName: 'Pekerjaan Persiapan',
          title: 'Direksi Keet / Los Kerja Sementara',
          description: 'Perhitungan luas kantor proyek dan gudang/los kerja sementara: Panjang x Lebar.',
          unit: 'm2',
          ahspCode: 'A.2.2.1.1',
          inputs: [
            { key: 'panjang', label: 'Panjang Bangunan (P)', unit: 'm', default: 4, step: 'any' },
            { key: 'lebar', label: 'Lebar Bangunan (L)', unit: 'm', default: 3, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang = 0, lebar = 0 } = inputs;
            const vol = panjang * lebar;
            return {
              volume: Math.round(vol * 100) / 100,
              panjang, lebar, tinggi: 1, faktor: 1,
              steps: [
                'Luas Direksi Keet = ' + panjang.toFixed(2) + ' m x ' + lebar.toFixed(2) + ' m = ' + vol.toFixed(2) + ' m2'
              ]
            };
          }
        },
        {
          id: 'pagar_proyek',
          category: 'persiapan',
          categoryName: 'Pekerjaan Persiapan',
          title: 'Pagar Pengaman Proyek Sementara',
          description: 'Perhitungan panjang keliling pagar pengaman sementara di batas lahan proyek.',
          unit: "m'",
          ahspCode: 'A.2.2.1.2',
          inputs: [
            { key: 'panjang_pagar', label: 'Panjang Keliling Pagar (P)', unit: 'm', default: 70, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang_pagar = 0 } = inputs;
            return {
              volume: Math.round(panjang_pagar * 100) / 100,
              panjang: panjang_pagar, lebar: 1, tinggi: 1, faktor: 1,
              steps: [
                'Panjang Pagar Sementara = ' + panjang_pagar.toFixed(2) + " m'"
              ]
            };
          }
        },

        // =========================================================================
        // 2. PEKERJAAN TANAH & PONDASI
        // =========================================================================
        {
          id: 'galian_tanah',
          category: 'pondasi',
          categoryName: 'Pekerjaan Pondasi & Tanah',
          title: 'Galian Tanah Pondasi',
          description: 'Perhitungan kubikasi galian tanah: Panjang Total Galian x Lebar Dasar x Kedalaman/Tinggi Galian.',
          unit: 'm3',
          ahspCode: 'A.2.3.1.1',
          inputs: [
            { key: 'panjang', label: 'Panjang Total Galian (P)', unit: 'm', default: 10, step: 'any' },
            { key: 'lebar', label: 'Lebar Dasar Galian (L)', unit: 'm', default: 0.8, step: 'any' },
            { key: 'tinggi', label: 'Kedalaman Galian (T)', unit: 'm', default: 1.0, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang = 0, lebar = 0, tinggi = 0 } = inputs;
            const vol = panjang * lebar * tinggi;
            return {
              volume: Math.round(vol * 100) / 100,
              panjang, lebar, tinggi, faktor: 1,
              steps: [
                'Volume Galian Tanah = ' + panjang.toFixed(2) + ' m x ' + lebar.toFixed(2) + ' m x ' + tinggi.toFixed(2) + ' m = ' + vol.toFixed(2) + ' m3'
              ]
            };
          }
        },
        {
          id: 'urugan_pasir',
          category: 'pondasi',
          categoryName: 'Pekerjaan Pondasi & Tanah',
          title: 'Urugan Pasir Bawah Pondasi',
          description: 'Perhitungan volume hamparan pasir urug bawah pondasi: Panjang x Lebar x Tebal Pasir (umumnya 5-10 cm).',
          unit: 'm3',
          ahspCode: 'A.2.3.1.11',
          inputs: [
            { key: 'panjang', label: 'Panjang Jalur Pondasi (P)', unit: 'm', default: 10, step: 'any' },
            { key: 'lebar', label: 'Lebar Dasar Galian (L)', unit: 'm', default: 0.8, step: 'any' },
            { key: 'tebal', label: 'Tebal Urug Pasir (T)', unit: 'm', default: 0.10, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang = 0, lebar = 0, tebal = 0 } = inputs;
            const vol = panjang * lebar * tebal;
            return {
              volume: Math.round(vol * 100) / 100,
              panjang, lebar, tinggi: tebal, faktor: 1,
              steps: [
                'Volume Urugan Pasir = ' + panjang.toFixed(2) + ' m x ' + lebar.toFixed(2) + ' m x ' + tebal.toFixed(2) + ' m = ' + vol.toFixed(2) + ' m3'
              ]
            };
          }
        },
        {
          id: 'lantai_kerja',
          category: 'pondasi',
          categoryName: 'Pekerjaan Pondasi & Tanah',
          title: 'Lantai Kerja / Rabat Beton Bawah Pondasi',
          description: 'Perhitungan kubikasi lantai kerja beton mutu rendah (Bo/K-100) tebal Â±5 cm: Panjang x Lebar x Tebal.',
          unit: 'm3',
          ahspCode: 'A.4.1.1.1',
          inputs: [
            { key: 'panjang', label: 'Panjang Jalur (P)', unit: 'm', default: 10, step: 'any' },
            { key: 'lebar', label: 'Lebar Lantai Kerja (L)', unit: 'm', default: 0.8, step: 'any' },
            { key: 'tebal', label: 'Tebal Lantai Kerja (T)', unit: 'm', default: 0.05, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang = 0, lebar = 0, tebal = 0 } = inputs;
            const vol = panjang * lebar * tebal;
            return {
              volume: Math.round(vol * 100) / 100,
              panjang, lebar, tinggi: tebal, faktor: 1,
              steps: [
                'Volume Lantai Kerja = ' + panjang.toFixed(2) + ' m x ' + lebar.toFixed(2) + ' m x ' + tebal.toFixed(2) + ' m = ' + vol.toFixed(2) + ' m3'
              ]
            };
          }
        },
        {
          id: 'urugan_tanah_kembali',
          category: 'pondasi',
          categoryName: 'Pekerjaan Pondasi & Tanah',
          title: 'Urugan Tanah Kembali Bekas Galian',
          description: 'Perhitungan volume tanah urug kembali: Volume Total Galian dikurangi Volume Pondasi yang Terpasang di dalam Galian.',
          unit: 'm3',
          ahspCode: 'A.2.3.1.9',
          inputs: [
            { key: 'vol_galian', label: 'Volume Total Galian (V1)', unit: 'm3', default: 8.0, step: 'any' },
            { key: 'vol_pondasi', label: 'Volume Pondasi Terpasang (V2)', unit: 'm3', default: 3.0, step: 'any' }
          ],
          calculate: (inputs) => {
            const { vol_galian = 0, vol_pondasi = 0 } = inputs;
            const vol = Math.max(0, vol_galian - vol_pondasi);
            return {
              volume: Math.round(vol * 100) / 100,
              panjang: vol_galian, lebar: vol_pondasi, tinggi: 1, faktor: 1,
              steps: [
                'Volume Urugan Kembali = Volume Galian (' + vol_galian.toFixed(2) + ' m3) - Volume Pondasi (' + vol_pondasi.toFixed(2) + ' m3) = ' + vol.toFixed(2) + ' m3'
              ]
            };
          }
        },
        {
          id: 'pondasi_batu_kali',
          category: 'pondasi',
          categoryName: 'Pekerjaan Pondasi & Tanah',
          title: 'Pondasi Batu Kali (Trapesium)',
          description: 'Perhitungan volume pondasi lajur batu kali berbentuk penampang trapesium: 0.5 x (Lebar Atas + Lebar Bawah) x Tinggi x Panjang Lajur.',
          unit: 'm3',
          ahspCode: 'A.3.2.1.2',
          inputs: [
            { key: 'panjang', label: 'Panjang Total Pondasi (L)', unit: 'm', default: 48.5, step: 'any' },
            { key: 'lebar_atas', label: 'Lebar Penampang Atas (a)', unit: 'm', default: 0.35, step: 'any' },
            { key: 'lebar_bawah', label: 'Lebar Penampang Bawah (b)', unit: 'm', default: 0.80, step: 'any' },
            { key: 'tinggi', label: 'Tinggi Pondasi (t)', unit: 'm', default: 0.85, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang = 0, lebar_atas = 0, lebar_bawah = 0, tinggi = 0 } = inputs;
            const luasPenampang = 0.5 * (lebar_atas + lebar_bawah) * tinggi;
            const vol = luasPenampang * panjang;
            return {
              volume: Math.round(vol * 100) / 100,
              panjang, lebar: (lebar_atas + lebar_bawah) / 2, tinggi, faktor: 1,
              steps: [
                'Luas Penampang Trapesium = 0.5 x (' + lebar_atas.toFixed(2) + ' m + ' + lebar_bawah.toFixed(2) + ' m) x ' + tinggi.toFixed(2) + ' m = ' + luasPenampang.toFixed(4) + ' m2',
                'Volume Total Pondasi = ' + luasPenampang.toFixed(4) + ' m2 x ' + panjang.toFixed(2) + ' m = ' + vol.toFixed(2) + ' m3'
              ]
            };
          }
        },
        {
          id: 'pondasi_footplat',
          category: 'pondasi',
          categoryName: 'Pekerjaan Pondasi & Tanah',
          title: 'Pondasi Footplat / Telapak Beton',
          description: 'Perhitungan kubikasi pondasi telapak beton bertulang: Panjang x Lebar x Tebal Telapak x Jumlah Titik Pondasi.',
          unit: 'm3',
          ahspCode: 'A.4.1.1.5',
          inputs: [
            { key: 'panjang', label: 'Panjang Telapak (P)', unit: 'm', default: 1.0, step: 'any' },
            { key: 'lebar', label: 'Lebar Telapak (L)', unit: 'm', default: 1.0, step: 'any' },
            { key: 'tebal', label: 'Tebal Telapak (T)', unit: 'm', default: 0.30, step: 'any' },
            { key: 'jumlah', label: 'Jumlah Titik Pondasi (n)', unit: 'titik', default: 8, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang = 0, lebar = 0, tebal = 0, jumlah = 0 } = inputs;
            const volPerUnit = panjang * lebar * tebal;
            const volTotal = volPerUnit * jumlah;
            return {
              volume: Math.round(volTotal * 100) / 100,
              panjang, lebar, tinggi: tebal, faktor: jumlah,
              steps: [
                'Volume per Titik = ' + panjang.toFixed(2) + ' m x ' + lebar.toFixed(2) + ' m x ' + tebal.toFixed(2) + ' m = ' + volPerUnit.toFixed(4) + ' m3',
                'Volume Total (' + jumlah + ' Titik) = ' + volPerUnit.toFixed(4) + ' m3 x ' + jumlah + ' = ' + volTotal.toFixed(2) + ' m3'
              ]
            };
          }
        },
        {
          id: 'pondasi_bore_pile',
          category: 'pondasi',
          categoryName: 'Pekerjaan Pondasi & Tanah',
          title: 'Pondasi Tiang Pancang / Bore Pile',
          description: 'Perhitungan volume tiang silinder: Ï€ x (D/2)Â² x Kedalaman Tiang x Jumlah Titik.',
          unit: 'm3',
          ahspCode: 'A.3.1.1.1',
          inputs: [
            { key: 'diameter', label: 'Diameter Tiang (D)', unit: 'm', default: 0.30, step: 'any' },
            { key: 'kedalaman', label: 'Kedalaman / Panjang Tiang (T)', unit: 'm', default: 6.0, step: 'any' },
            { key: 'jumlah', label: 'Jumlah Titik Tiang (n)', unit: 'titik', default: 20, step: 'any' }
          ],
          calculate: (inputs) => {
            const { diameter = 0, kedalaman = 0, jumlah = 0 } = inputs;
            const radius = diameter / 2;
            const luasAlas = Math.PI * radius * radius;
            const volPerTitik = luasAlas * kedalaman;
            const volTotal = volPerTitik * jumlah;
            return {
              volume: Math.round(volTotal * 100) / 100,
              panjang: kedalaman, lebar: diameter, tinggi: diameter, faktor: jumlah,
              steps: [
                'Luas Penampang Silinder = Ï€ x (' + radius.toFixed(2) + ' m)Â² = ' + luasAlas.toFixed(4) + ' m2',
                'Volume per Titik = ' + luasAlas.toFixed(4) + ' m2 x ' + kedalaman.toFixed(2) + ' m = ' + volPerTitik.toFixed(4) + ' m3',
                'Volume Total (' + jumlah + ' Titik) = ' + volPerTitik.toFixed(4) + ' m3 x ' + jumlah + ' = ' + volTotal.toFixed(2) + ' m3'
              ]
            };
          }
        },
        {
          id: 'aanstamping',
          category: 'pondasi',
          categoryName: 'Pekerjaan Pondasi & Tanah',
          title: 'Aanstamping / Pasangan Batu Kosong',
          description: 'Perhitungan volume pasangan batu kosong di bawah pondasi: Panjang x Lebar x Tebal (umumnya 15-20 cm).',
          unit: 'm3',
          ahspCode: 'A.3.2.1.1',
          inputs: [
            { key: 'panjang', label: 'Panjang Total Jalur (P)', unit: 'm', default: 10, step: 'any' },
            { key: 'lebar', label: 'Lebar Dasar Pondasi (L)', unit: 'm', default: 0.8, step: 'any' },
            { key: 'tebal', label: 'Tebal Batu Kosong (T)', unit: 'm', default: 0.20, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang = 0, lebar = 0, tebal = 0 } = inputs;
            const vol = panjang * lebar * tebal;
            return {
              volume: Math.round(vol * 100) / 100,
              panjang, lebar, tinggi: tebal, faktor: 1,
              steps: [
                'Volume Aanstamping = ' + panjang.toFixed(2) + ' m x ' + lebar.toFixed(2) + ' m x ' + tebal.toFixed(2) + ' m = ' + vol.toFixed(2) + ' m3'
              ]
            };
          }
        },

        // =========================================================================
        // 3. PEKERJAAN STRUKTUR BETON
        // =========================================================================
        {
          id: 'beton_sloof',
          category: 'beton',
          categoryName: 'Pekerjaan Struktur Beton',
          title: 'Balok Sloof Beton Bertulang',
          description: 'Perhitungan kubikasi beton balok sloof dasar: Panjang x Lebar x Tinggi.',
          unit: 'm3',
          ahspCode: 'A.4.1.1.5',
          inputs: [
            { key: 'panjang', label: 'Panjang Total Sloof (L)', unit: 'm', default: 48.5, step: 'any' },
            { key: 'lebar', label: 'Lebar Sloof (b)', unit: 'm', default: 0.15, step: 'any' },
            { key: 'tinggi', label: 'Tinggi Sloof (h)', unit: 'm', default: 0.20, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang = 0, lebar = 0, tinggi = 0 } = inputs;
            const vol = panjang * lebar * tinggi;
            return {
              volume: Math.round(vol * 100) / 100,
              panjang, lebar, tinggi, faktor: 1,
              steps: [
                'Dimensi Balok Sloof: ' + panjang.toFixed(2) + ' m x ' + lebar.toFixed(2) + ' m x ' + tinggi.toFixed(2) + ' m',
                'Volume Beton Sloof = ' + vol.toFixed(3) + ' m3 = ' + vol.toFixed(2) + ' m3'
              ]
            };
          }
        },
        {
          id: 'beton_kolom',
          category: 'beton',
          categoryName: 'Pekerjaan Struktur Beton',
          title: 'Kolom Praktis / Kolom Struktur',
          description: 'Perhitungan kubikasi kolom: Lebar x Tebal x Tinggi x Jumlah Titik Kolom.',
          unit: 'm3',
          ahspCode: 'A.4.1.1.5',
          inputs: [
            { key: 'lebar', label: 'Lebar Kolom (b)', unit: 'm', default: 0.20, step: 'any' },
            { key: 'tebal', label: 'Tebal Kolom (h)', unit: 'm', default: 0.20, step: 'any' },
            { key: 'tinggi', label: 'Tinggi Kolom (t)', unit: 'm', default: 3.60, step: 'any' },
            { key: 'jumlah', label: 'Jumlah Titik Kolom (n)', unit: 'titik', default: 45, step: 'any' }
          ],
          calculate: (inputs) => {
            const { lebar = 0, tebal = 0, tinggi = 0, jumlah = 0 } = inputs;
            const volPerTitik = lebar * tebal * tinggi;
            const volTotal = volPerTitik * jumlah;
            return {
              volume: Math.round(volTotal * 100) / 100,
              panjang: tinggi, lebar, tinggi: tebal, faktor: jumlah,
              steps: [
                'Volume per Titik Kolom = ' + lebar.toFixed(2) + ' m x ' + tebal.toFixed(2) + ' m x ' + tinggi.toFixed(2) + ' m = ' + volPerTitik.toFixed(4) + ' m3',
                'Volume Total (' + jumlah + ' Titik) = ' + volPerTitik.toFixed(4) + ' m3 x ' + jumlah + ' = ' + volTotal.toFixed(2) + ' m3'
              ]
            };
          }
        },
        {
          id: 'balok_struktur',
          category: 'beton',
          categoryName: 'Pekerjaan Struktur Beton',
          title: 'Balok Struktur Beton Bertulang',
          description: 'Perhitungan kubikasi balok lantai/portal: Lebar x Tinggi x Bentang Bersih x Jumlah Balok.',
          unit: 'm3',
          ahspCode: 'A.4.1.1.5',
          inputs: [
            { key: 'lebar', label: 'Lebar Balok (b)', unit: 'm', default: 0.15, step: 'any' },
            { key: 'tinggi', label: 'Tinggi Balok (h)', unit: 'm', default: 0.30, step: 'any' },
            { key: 'panjang', label: 'Bentang / Panjang Rata-rata (L)', unit: 'm', default: 4.0, step: 'any' },
            { key: 'jumlah', label: 'Jumlah Batang Balok (n)', unit: 'batang', default: 20, step: 'any' }
          ],
          calculate: (inputs) => {
            const { lebar = 0, tinggi = 0, panjang = 0, jumlah = 0 } = inputs;
            const volPerBatang = lebar * tinggi * panjang;
            const volTotal = volPerBatang * jumlah;
            return {
              volume: Math.round(volTotal * 100) / 100,
              panjang, lebar, tinggi, faktor: jumlah,
              steps: [
                'Volume per Batang = ' + lebar.toFixed(2) + ' m x ' + tinggi.toFixed(2) + ' m x ' + panjang.toFixed(2) + ' m = ' + volPerBatang.toFixed(4) + ' m3',
                'Volume Total (' + jumlah + ' Balok) = ' + volPerBatang.toFixed(4) + ' m3 x ' + jumlah + ' = ' + volTotal.toFixed(2) + ' m3'
              ]
            };
          }
        },
        {
          id: 'plat_lantai',
          category: 'beton',
          categoryName: 'Pekerjaan Struktur Beton',
          title: 'Plat Lantai / Dak Beton Bertulang',
          description: 'Perhitungan kubikasi cor plat lantai beton: Panjang x Lebar x Tebal Plat (umumnya 10-12 cm).',
          unit: 'm3',
          ahspCode: 'A.4.1.1.5',
          inputs: [
            { key: 'panjang', label: 'Panjang Plat (P)', unit: 'm', default: 8.0, step: 'any' },
            { key: 'lebar', label: 'Lebar Plat (L)', unit: 'm', default: 6.0, step: 'any' },
            { key: 'tebal', label: 'Tebal Plat (T)', unit: 'm', default: 0.12, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang = 0, lebar = 0, tebal = 0 } = inputs;
            const vol = panjang * lebar * tebal;
            return {
              volume: Math.round(vol * 100) / 100,
              panjang, lebar, tinggi: tebal, faktor: 1,
              steps: [
                'Luas Plat = ' + panjang.toFixed(2) + ' m x ' + lebar.toFixed(2) + ' m = ' + (panjang * lebar).toFixed(2) + ' m2',
                'Volume Beton Plat = ' + (panjang * lebar).toFixed(2) + ' m2 x ' + tebal.toFixed(2) + ' m = ' + vol.toFixed(2) + ' m3'
              ]
            };
          }
        },
        {
          id: 'ring_balok',
          category: 'beton',
          categoryName: 'Pekerjaan Struktur Beton',
          title: 'Ring Balok / Balok Tutup Atap',
          description: 'Perhitungan kubikasi ring balok dinding atas: Lebar x Tinggi x Total Panjang Keliling.',
          unit: 'm3',
          ahspCode: 'A.4.1.1.5',
          inputs: [
            { key: 'lebar', label: 'Lebar Ring Balok (b)', unit: 'm', default: 0.15, step: 'any' },
            { key: 'tinggi', label: 'Tinggi Ring Balok (h)', unit: 'm', default: 0.20, step: 'any' },
            { key: 'panjang', label: 'Total Panjang Ring Balok (L)', unit: 'm', default: 60.0, step: 'any' }
          ],
          calculate: (inputs) => {
            const { lebar = 0, tinggi = 0, panjang = 0 } = inputs;
            const vol = lebar * tinggi * panjang;
            return {
              volume: Math.round(vol * 100) / 100,
              panjang, lebar, tinggi, faktor: 1,
              steps: [
                'Volume Ring Balok = ' + lebar.toFixed(2) + ' m x ' + tinggi.toFixed(2) + ' m x ' + panjang.toFixed(2) + ' m = ' + vol.toFixed(2) + ' m3'
              ]
            };
          }
        },
        {
          id: 'tangga_beton',
          category: 'beton',
          categoryName: 'Pekerjaan Struktur Beton',
          title: 'Tangga Beton (Pelat + Anak Tangga)',
          description: 'Perhitungan pendekatan kubikasi tangga beton: Panjang Bidang Miring x Lebar Tangga x Tebal Pelat Tangga.',
          unit: 'm3',
          ahspCode: 'A.4.1.1.5',
          inputs: [
            { key: 'panjang_miring', label: 'Panjang Miring Tangga (P)', unit: 'm', default: 4.0, step: 'any' },
            { key: 'lebar', label: 'Lebar Tangga (L)', unit: 'm', default: 1.2, step: 'any' },
            { key: 'tebal', label: 'Tebal Rata-rata Pelat Tangga (T)', unit: 'm', default: 0.15, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang_miring = 0, lebar = 0, tebal = 0 } = inputs;
            const vol = panjang_miring * lebar * tebal;
            return {
              volume: Math.round(vol * 100) / 100,
              panjang: panjang_miring, lebar, tinggi: tebal, faktor: 1,
              steps: [
                'Volume Tangga Beton = ' + panjang_miring.toFixed(2) + ' m x ' + lebar.toFixed(2) + ' m x ' + tebal.toFixed(2) + ' m = ' + vol.toFixed(2) + ' m3'
              ]
            };
          }
        },
        {
          id: 'tulangan_besi',
          category: 'beton',
          categoryName: 'Pekerjaan Struktur Beton',
          title: 'Tulangan Besi Beton (Estimasi Rasio kg/m3)',
          description: 'Perhitungan cepat berat total besi beton berdasarkan volume elemen cor x rasio besi (kg/m3). Rasio standar: Sloof/Ring 90-110, Kolom/Balok 110-150, Plat 90-110 kg/m3.',
          unit: 'kg',
          ahspCode: 'A.4.1.1.17',
          inputs: [
            { key: 'vol_beton', label: 'Volume Beton Elemen (V)', unit: 'm3', default: 10.0, step: 'any' },
            { key: 'rasio_besi', label: 'Rasio Besi per m3 (R)', unit: 'kg/m3', default: 120.0, step: 'any' }
          ],
          calculate: (inputs) => {
            const { vol_beton = 0, rasio_besi = 0 } = inputs;
            const totalKg = vol_beton * rasio_besi;
            return {
              volume: Math.round(totalKg * 100) / 100,
              panjang: vol_beton, lebar: rasio_besi, tinggi: 1, faktor: 1,
              steps: [
                'Estimasi Berat Besi = Volume Beton (' + vol_beton.toFixed(2) + ' m3) x Rasio Besi (' + rasio_besi.toFixed(1) + ' kg/m3) = ' + totalKg.toFixed(2) + ' kg'
              ]
            };
          }
        },
        {
          id: 'bekisting_beton',
          category: 'beton',
          categoryName: 'Pekerjaan Struktur Beton',
          title: 'Bekisting / Cetakan Beton',
          description: 'Perhitungan luas permukaan bekisting yang bersentuhan dengan adukan beton: Keliling Bidang Cetak x Panjang Elemen.',
          unit: 'm2',
          ahspCode: 'A.4.1.1.20',
          inputs: [
            { key: 'keliling_cetak', label: 'Keliling Bidang Cetak (Kel)', unit: 'm', default: 1.0, step: 'any' },
            { key: 'panjang_elemen', label: 'Panjang Total Elemen (P)', unit: 'm', default: 40.0, step: 'any' }
          ],
          calculate: (inputs) => {
            const { keliling_cetak = 0, panjang_elemen = 0 } = inputs;
            const luas = keliling_cetak * panjang_elemen;
            return {
              volume: Math.round(luas * 100) / 100,
              panjang: panjang_elemen, lebar: keliling_cetak, tinggi: 1, faktor: 1,
              steps: [
                'Luas Bekisting = Keliling Penampang (' + keliling_cetak.toFixed(2) + ' m) x Panjang (' + panjang_elemen.toFixed(2) + ' m) = ' + luas.toFixed(2) + ' m2'
              ]
            };
          }
        },

        // =========================================================================
        // 3B. PEMBESIAN STRUKTUR BETON (DENGAN DROPDOWN DIAMETER BESI SNI)
        // =========================================================================
        {
          id: 'besi_kolom_utama',
          category: 'beton',
          categoryName: 'Pekerjaan Struktur Beton & Pembesian',
          title: 'Besi Kolom: Tulangan Pokok (Utama)',
          description: 'Perhitungan berat besi tulangan pokok kolom: (Tinggi Bersih + Panjang Lewatan Ld) x Jumlah Batang x Jumlah Titik Kolom x Berat/m.',
          unit: 'kg',
          ahspCode: 'A.4.1.1.17',
          inputs: [
            { key: 'berat_m', label: 'Diameter Besi Tulangan Pokok', type: 'select', options: OPSI_BESI_TULANGAN, default: 1.580, help: 'SNI 2847', colSpan: 2 },
            { key: 'tinggi', label: 'Tinggi Bersih Kolom (H)', unit: 'm', default: 3.0, step: 'any' },
            { key: 'ld', label: 'Panjang Penyaluran / Lewatan (Ld)', unit: 'm', default: 0.64, step: 'any', help: 'Â±40 x D (Ã˜16 = 0.64m)' },
            { key: 'jml_batang', label: 'Jumlah Batang per Kolom (n)', unit: 'btg', default: 8, step: 'any' },
            { key: 'jml_kolom', label: 'Jumlah Titik Kolom (N)', unit: 'titik', default: 1, step: 'any' }
          ],
          calculate: (inputs) => {
            const { berat_m = 1.58, tinggi = 0, ld = 0, jml_batang = 0, jml_kolom = 1 } = inputs;
            const pPanjang = tinggi + ld;
            const totalPanjang = pPanjang * jml_batang * jml_kolom;
            const totalKg = totalPanjang * berat_m;
            return {
              volume: Math.round(totalKg * 100) / 100,
              panjang: pPanjang, lebar: jml_batang, tinggi: berat_m, faktor: jml_kolom,
              steps: [
                'Panjang 1 Batang Tulangan = Tinggi Kolom (' + tinggi.toFixed(2) + ' m) + Ld Overlap (' + ld.toFixed(2) + ' m) = ' + pPanjang.toFixed(2) + ' m',
                'Total Panjang Besi = ' + pPanjang.toFixed(2) + ' m x ' + jml_batang + ' btg x ' + jml_kolom + ' titik = ' + totalPanjang.toFixed(2) + " m'",
                'Berat Total Besi Pokok Kolom = ' + totalPanjang.toFixed(2) + " m' x " + berat_m.toFixed(3) + ' kg/m = ' + totalKg.toFixed(2) + ' kg'
              ]
            };
          },
          refTable: {
            title: 'Petunjuk Pengisian & Spesifikasi Besi Kolom',
            rows: [
              {
                uraian: 'Berat Tulangan Pokok (Utama) Kolom',
                rumus: '(Tinggi + Ld) x Jumlah Batang x W/m',
                variabel: 'Tinggi = tinggi bersih kolom (m)<br>Ld = panjang penyaluran / lewatan sambungan (m)<br>Jml = jumlah batang per kolom<br>W/m = berat besi per meter (kg/m)',
                contoh: 'Tinggi = 3 m, Ld = 0.64 m, Jml = 8 btg, W/m = 1.58 kg/m (Ã˜16)<br><strong>Hasil = 46.01 kg / kolom</strong>',
                petunjuk: 'Ld (panjang penyaluran/overlap) diperkirakan 40 x diameter besi (Contoh Ã˜16mm -> Ld = 40x16mm = 640mm = 0,64 m). Untuk mutu beton/besi khusus, cek SNI 2847.'
              }
            ]
          }
        },
        {
          id: 'besi_kolom_sengkang',
          category: 'beton',
          categoryName: 'Pekerjaan Struktur Beton & Pembesian',
          title: 'Besi Kolom: Sengkang / Begel Kolom',
          description: 'Perhitungan jumlah dan berat sengkang kolom: ((Tinggi / Spasi) + 1) x Keliling Sengkang x Jumlah Kolom x Berat/m.',
          unit: 'kg',
          ahspCode: 'A.4.1.1.17',
          inputs: [
            { key: 'berat_m', label: 'Diameter Besi Sengkang / Begel', type: 'select', options: OPSI_BESI_TULANGAN, default: 0.395, help: 'Umum Ã˜8 mm', colSpan: 2 },
            { key: 'tinggi', label: 'Tinggi Bersih Kolom (H)', unit: 'm', default: 3.0, step: 'any' },
            { key: 'spasi', label: 'Jarak Spasi Sengkang (s)', unit: 'm', default: 0.15, step: 'any' },
            { key: 'keliling', label: 'Keliling 1 Sengkang (Kel)', unit: 'm', default: 0.74, step: 'any', help: '2x(b+h) - 8x selimut + 2x kait' },
            { key: 'jml_kolom', label: 'Jumlah Titik Kolom (N)', unit: 'titik', default: 1, step: 'any' }
          ],
          calculate: (inputs) => {
            const { berat_m = 0.395, tinggi = 0, spasi = 0.15, keliling = 0.74, jml_kolom = 1 } = inputs;
            const jmlSengkangPerKolom = Math.ceil((tinggi / (spasi || 1)) + 1);
            const totalSengkang = jmlSengkangPerKolom * jml_kolom;
            const totalPanjang = totalSengkang * keliling;
            const totalKg = totalPanjang * berat_m;
            return {
              volume: Math.round(totalKg * 100) / 100,
              panjang: keliling, lebar: totalSengkang, tinggi: berat_m, faktor: jml_kolom,
              steps: [
                'Jumlah Sengkang per Kolom = (' + tinggi.toFixed(2) + ' m / ' + spasi.toFixed(2) + ' m) + 1 = ' + jmlSengkangPerKolom + ' bh',
                'Total Sengkang (' + jml_kolom + ' Titik) = ' + totalSengkang + ' bh sengkang',
                'Total Panjang Sengkang = ' + totalSengkang + ' bh x ' + keliling.toFixed(2) + " m = " + totalPanjang.toFixed(2) + " m'",
                'Berat Total Besi Sengkang = ' + totalPanjang.toFixed(2) + " m' x " + berat_m.toFixed(3) + ' kg/m = ' + totalKg.toFixed(2) + ' kg'
              ]
            };
          },
          refTable: {
            title: 'Petunjuk Pengisian & Spesifikasi Sengkang Kolom',
            rows: [
              {
                uraian: 'Jumlah & Berat Sengkang Kolom',
                rumus: 'Jml = (Tinggi / Spasi) + 1 | Berat = Keliling x Jml x W/m',
                variabel: 'Tinggi = tinggi kolom (m)<br>Spasi = jarak sengkang (m)<br>Kel = keliling 1 sengkang (m)<br>W/m = berat besi sengkang (kg/m)',
                contoh: 'Tinggi = 3 m, Spasi = 0.15 m -> Jml = 21 bh<br>Kel = 0.74 m, W/m = 0.395 kg/m (Ã˜8) -> <strong>Hasil = 6.14 kg / kolom</strong>',
                petunjuk: 'Keliling sengkang = 2x(b+h) âˆ’ 8x tebal selimut beton + 2x panjang kait/hook (umum 6â€“9xD atau min. 75mm). b,h = dimensi penampang kolom.'
              }
            ]
          }
        },
        {
          id: 'besi_balok_utama',
          category: 'beton',
          categoryName: 'Pekerjaan Struktur Beton & Pembesian',
          title: 'Besi Balok: Tulangan Pokok (Utama)',
          description: 'Perhitungan berat tulangan pokok balok: (Bentang Bersih + 2x Panjang Lewatan Ld) x Jumlah Batang x Jumlah Balok x Berat/m.',
          unit: 'kg',
          ahspCode: 'A.4.1.1.17',
          inputs: [
            { key: 'berat_m', label: 'Diameter Besi Tulangan Pokok', type: 'select', options: OPSI_BESI_TULANGAN, default: 1.580, help: 'SNI 2847', colSpan: 2 },
            { key: 'bentang', label: 'Bentang Bersih Balok (L)', unit: 'm', default: 4.0, step: 'any' },
            { key: 'ld', label: 'Panjang Penyaluran / Angkur Ujung (Ld)', unit: 'm', default: 0.60, step: 'any', help: 'Â±40 x D (Ã˜16 = 0.60m)' },
            { key: 'jml_batang', label: 'Jumlah Batang Tulangan per Balok (n)', unit: 'btg', default: 6, step: 'any' },
            { key: 'jml_balok', label: 'Jumlah Batang Balok (N)', unit: 'balok', default: 1, step: 'any' }
          ],
          calculate: (inputs) => {
            const { berat_m = 1.58, bentang = 0, ld = 0, jml_batang = 0, jml_balok = 1 } = inputs;
            const pPanjang = bentang + (2 * ld);
            const totalPanjang = pPanjang * jml_batang * jml_balok;
            const totalKg = totalPanjang * berat_m;
            return {
              volume: Math.round(totalKg * 100) / 100,
              panjang: pPanjang, lebar: jml_batang, tinggi: berat_m, faktor: jml_balok,
              steps: [
                'Panjang 1 Batang = Bentang (' + bentang.toFixed(2) + ' m) + 2 x Angkur Ld (' + ld.toFixed(2) + ' m) = ' + pPanjang.toFixed(2) + ' m',
                'Total Panjang Besi = ' + pPanjang.toFixed(2) + ' m x ' + jml_batang + ' btg x ' + jml_balok + ' balok = ' + totalPanjang.toFixed(2) + " m'",
                'Berat Total Besi Pokok Balok = ' + totalPanjang.toFixed(2) + " m' x " + berat_m.toFixed(3) + ' kg/m = ' + totalKg.toFixed(2) + ' kg'
              ]
            };
          },
          refTable: {
            title: 'Petunjuk Pengisian & Spesifikasi Besi Balok',
            rows: [
              {
                uraian: 'Berat Tulangan Pokok (Utama) Balok',
                rumus: '(Bentang + 2xLd) x Jumlah Batang x W/m',
                variabel: 'Bentang = panjang bersih balok (m)<br>Ld = panjang penyaluran / angkur ujung (m)<br>Jml = jumlah batang<br>W/m = berat besi per meter (kg/m)',
                contoh: 'Bentang = 4 m, Ld = 0.60 m, Jml = 6 btg, W/m = 1.58 kg/m (Ã˜16)<br><strong>Hasil = 49.30 kg / balok</strong>',
                petunjuk: 'Ld diperkirakan 40 x diameter besi (Ã˜16mm -> 0,60â€“0,64 m). Tulangan atas (tumpuan) & bawah (lapangan) sebaiknya dihitung sebagai baris terpisah bila jumlahnya berbeda.'
              }
            ]
          }
        },
        {
          id: 'besi_balok_sengkang',
          category: 'beton',
          categoryName: 'Pekerjaan Struktur Beton & Pembesian',
          title: 'Besi Balok: Sengkang / Begel Balok',
          description: 'Perhitungan jumlah dan berat sengkang balok: ((Panjang Balok / Spasi) + 1) x Keliling Sengkang x Jumlah Balok x Berat/m.',
          unit: 'kg',
          ahspCode: 'A.4.1.1.17',
          inputs: [
            { key: 'berat_m', label: 'Diameter Besi Sengkang / Begel', type: 'select', options: OPSI_BESI_TULANGAN, default: 0.395, help: 'Umum Ã˜8 mm', colSpan: 2 },
            { key: 'panjang_balok', label: 'Panjang Bersih Balok (L)', unit: 'm', default: 4.0, step: 'any' },
            { key: 'spasi', label: 'Jarak Spasi Sengkang (s)', unit: 'm', default: 0.10, step: 'any' },
            { key: 'keliling', label: 'Keliling 1 Sengkang (Kel)', unit: 'm', default: 0.86, step: 'any', help: '2x(b+h) - 8x selimut + 2x kait' },
            { key: 'jml_balok', label: 'Jumlah Batang Balok (N)', unit: 'balok', default: 1, step: 'any' }
          ],
          calculate: (inputs) => {
            const { berat_m = 0.395, panjang_balok = 0, spasi = 0.10, keliling = 0.86, jml_balok = 1 } = inputs;
            const jmlSengkangPerBalok = Math.ceil((panjang_balok / (spasi || 1)) + 1);
            const totalSengkang = jmlSengkangPerBalok * jml_balok;
            const totalPanjang = totalSengkang * keliling;
            const totalKg = totalPanjang * berat_m;
            return {
              volume: Math.round(totalKg * 100) / 100,
              panjang: keliling, lebar: totalSengkang, tinggi: berat_m, faktor: jml_balok,
              steps: [
                'Jumlah Sengkang per Balok = (' + panjang_balok.toFixed(2) + ' m / ' + spasi.toFixed(2) + ' m) + 1 = ' + jmlSengkangPerBalok + ' bh',
                'Total Sengkang (' + jml_balok + ' Balok) = ' + totalSengkang + ' bh sengkang',
                'Total Panjang Sengkang = ' + totalSengkang + ' bh x ' + keliling.toFixed(2) + " m = " + totalPanjang.toFixed(2) + " m'",
                'Berat Total Besi Sengkang = ' + totalPanjang.toFixed(2) + " m' x " + berat_m.toFixed(3) + ' kg/m = ' + totalKg.toFixed(2) + ' kg'
              ]
            };
          },
          refTable: {
            title: 'Petunjuk Pengisian & Spesifikasi Sengkang Balok',
            rows: [
              {
                uraian: 'Jumlah & Berat Sengkang Balok',
                rumus: 'Jml = (Panjang / Spasi) + 1 | Berat = Keliling x Jml x W/m',
                variabel: 'Panjang = panjang balok (m)<br>Spasi = jarak sengkang (m)<br>Kel = keliling 1 sengkang (m)<br>W/m = berat besi sengkang (kg/m)',
                contoh: 'Panjang = 4 m, Spasi = 0.10 m -> Jml = 41 bh<br>Kel = 0.86 m, W/m = 0.395 kg/m (Ã˜8) -> <strong>Hasil = 13.93 kg / balok</strong>',
                petunjuk: 'Jarak spasi di daerah tumpuan (2xtinggi balok dari muka kolom) dibuat lebih rapat (mis. 10 cm) dibanding lapangan (mis. 15â€“20 cm); hitung 2 baris terpisah bila perlu detail.'
              }
            ]
          }
        },
        {
          id: 'besi_plat_lantai',
          category: 'beton',
          categoryName: 'Pekerjaan Struktur Beton & Pembesian',
          title: 'Besi Plat Lantai (Arah X + Y + 2 Lapis)',
          description: 'Perhitungan total berat pembesian plat lantai 2 arah: ((Jumlah X x Panjang X x W_X) + (Jumlah Y x Lebar Y x W_Y)) x Faktor Lapisan (1 atau 2 lapis).',
          unit: 'kg',
          ahspCode: 'A.4.1.1.17',
          inputs: [
            { key: 'berat_x', label: 'Diameter Besi Arah X (Bentang Pendek)', type: 'select', options: OPSI_BESI_TULANGAN, default: 0.617, help: 'Umum Ã˜10 mm', colSpan: 2 },
            { key: 'berat_y', label: 'Diameter Besi Arah Y (Bentang Panjang)', type: 'select', options: OPSI_BESI_TULANGAN, default: 0.617, help: 'Umum Ã˜10 mm', colSpan: 2 },
            { key: 'panjang_x', label: 'Bentang Plat Arah X (Panjang X)', unit: 'm', default: 8.0, step: 'any' },
            { key: 'lebar_y', label: 'Bentang Plat Arah Y (Lebar Y)', unit: 'm', default: 6.0, step: 'any' },
            { key: 'spasi', label: 'Jarak Spasi Tulangan (s)', unit: 'm', default: 0.15, step: 'any' },
            { key: 'faktor_lapis', label: 'Faktor Lapisan Tulangan', type: 'select', options: [{ value: 2, label: '2 Lapis (Atas & Bawah - Standar)' }, { value: 1, label: '1 Lapis (Tunggal)' }], default: 2, colSpan: 2 }
          ],
          calculate: (inputs) => {
            const { berat_x = 0.617, berat_y = 0.617, panjang_x = 0, lebar_y = 0, spasi = 0.15, faktor_lapis = 2 } = inputs;
            const jmlX = Math.ceil((lebar_y / (spasi || 1)) + 1);
            const beratTotX = jmlX * panjang_x * berat_x;
            const jmlY = Math.ceil((panjang_x / (spasi || 1)) + 1);
            const beratTotY = jmlY * lebar_y * berat_y;
            const totalKg = (beratTotX + beratTotY) * faktor_lapis;
            return {
              volume: Math.round(totalKg * 100) / 100,
              panjang: panjang_x, lebar: lebar_y, tinggi: spasi, faktor: faktor_lapis,
              steps: [
                'Tulangan Arah X: Jml = (' + lebar_y.toFixed(2) + ' / ' + spasi.toFixed(2) + ') + 1 = ' + jmlX + ' btg -> Berat X (1 lapis) = ' + jmlX + ' x ' + panjang_x.toFixed(2) + ' m x ' + berat_x.toFixed(3) + ' kg/m = ' + beratTotX.toFixed(2) + ' kg',
                'Tulangan Arah Y: Jml = (' + panjang_x.toFixed(2) + ' / ' + spasi.toFixed(2) + ') + 1 = ' + jmlY + ' btg -> Berat Y (1 lapis) = ' + jmlY + ' x ' + lebar_y.toFixed(2) + ' m x ' + berat_y.toFixed(3) + ' kg/m = ' + beratTotY.toFixed(2) + ' kg',
                'Total Besi Plat Lantai (' + faktor_lapis + ' Lapis) = (' + beratTotX.toFixed(2) + ' kg + ' + beratTotY.toFixed(2) + ' kg) x ' + faktor_lapis + ' = ' + totalKg.toFixed(2) + ' kg'
              ]
            };
          },
          refTable: {
            title: 'Petunjuk Pengisian & Spesifikasi Besi Plat Lantai',
            rows: [
              {
                uraian: 'Pembesian Plat Lantai 2 Arah (Two-Way Slab)',
                rumus: '(Berat Arah X + Berat Arah Y) x Faktor Lapis',
                variabel: 'Jml X = (Lebar Y / Spasi) + 1<br>Jml Y = (Panjang X / Spasi) + 1<br>Faktor = 2 (2 lapis atas & bawah) atau 1 (1 lapis)',
                contoh: 'Panjang X = 8 m, Lebar Y = 6 m, Spasi = 0.15 m, Besi Ã˜10 (0.617 kg/m)<br>Berat X = 202.38 kg, Berat Y = 203.61 kg, Faktor = 2 -> <strong>Hasil = 811.98 kg</strong>',
                petunjuk: 'Plat lantai umumnya bertulangan 2 lapis (tulangan bawah/tarik & tulangan atas/susut-suhu). Gunakan diameter & jarak sesuai gambar detail pembesian.'
              }
            ]
          }
        },
        {
          id: 'besi_tangga',
          category: 'beton',
          categoryName: 'Pekerjaan Struktur Beton & Pembesian',
          title: 'Besi Tangga Beton (Pokok & Pembagi)',
          description: 'Perhitungan berat tulangan tangga: Panjang Miring (Pythagoras) x Jumlah Batang Pokok & Pembagi x Berat/m.',
          unit: 'kg',
          ahspCode: 'A.4.1.1.17',
          inputs: [
            { key: 'berat_pokok', label: 'Diameter Besi Tulangan Pokok Tangga', type: 'select', options: OPSI_BESI_TULANGAN, default: 0.888, help: 'Umum Ã˜12 mm', colSpan: 2 },
            { key: 'berat_pembagi', label: 'Diameter Besi Tulangan Pembagi Tangga', type: 'select', options: OPSI_BESI_TULANGAN, default: 0.617, help: 'Umum Ã˜10 mm', colSpan: 2 },
            { key: 'jml_anak_tangga', label: 'Jumlah Anak Tangga (n)', unit: 'bh', default: 18, step: 'any' },
            { key: 'optrede', label: 'Tinggi 1 Injakan / Optrede (T)', unit: 'm', default: 0.18, step: 'any' },
            { key: 'aantrede', label: 'Lebar 1 Injakan / Aantrede (L)', unit: 'm', default: 0.28, step: 'any' },
            { key: 'lebar_tangga', label: 'Lebar Tangga (B)', unit: 'm', default: 1.2, step: 'any' },
            { key: 'spasi_pokok', label: 'Spasi Tulangan Pokok (s1)', unit: 'm', default: 0.15, step: 'any' },
            { key: 'spasi_pembagi', label: 'Spasi Tulangan Pembagi (s2)', unit: 'm', default: 0.20, step: 'any' },
            { key: 'penyaluran', label: 'Panjang Penyaluran ke Bordes/Lantai (Ld)', unit: 'm', default: 0.20, step: 'any' }
          ],
          calculate: (inputs) => {
            const { berat_pokok = 0.888, berat_pembagi = 0.617, jml_anak_tangga = 18, optrede = 0.18, aantrede = 0.28, lebar_tangga = 1.2, spasi_pokok = 0.15, spasi_pembagi = 0.20, penyaluran = 0.20 } = inputs;
            const tNaik = jml_anak_tangga * optrede;
            const tDatar = jml_anak_tangga * aantrede;
            const pMiring = Math.sqrt((tNaik * tNaik) + (tDatar * tDatar));
            const pMiringTotal = pMiring + penyaluran;
            const jmlPokok = Math.ceil((lebar_tangga / (spasi_pokok || 1)) + 1);
            const beratPokok = jmlPokok * pMiringTotal * berat_pokok;
            const jmlPembagi = Math.ceil((pMiring / (spasi_pembagi || 1)) + 1);
            const beratPembagi = jmlPembagi * lebar_tangga * berat_pembagi;
            const totalKg = beratPokok + beratPembagi;
            return {
              volume: Math.round(totalKg * 100) / 100,
              panjang: pMiring, lebar: lebar_tangga, tinggi: tNaik, faktor: 1,
              steps: [
                'Tinggi Naik = ' + tNaik.toFixed(2) + ' m, Panjang Datar = ' + tDatar.toFixed(2) + ' m -> Panjang Miring Tangga = âˆš(' + tNaik.toFixed(2) + 'Â² + ' + tDatar.toFixed(2) + 'Â²) = ' + pMiring.toFixed(2) + ' m',
                'Tulangan Pokok: Jml = (' + lebar_tangga.toFixed(2) + ' / ' + spasi_pokok.toFixed(2) + ') + 1 = ' + jmlPokok + ' btg -> Berat Pokok = ' + jmlPokok + ' x ' + pMiringTotal.toFixed(2) + ' m x ' + berat_pokok.toFixed(3) + ' kg/m = ' + beratPokok.toFixed(2) + ' kg',
                'Tulangan Pembagi: Jml = (' + pMiring.toFixed(2) + ' / ' + spasi_pembagi.toFixed(2) + ') + 1 = ' + jmlPembagi + ' btg -> Berat Pembagi = ' + jmlPembagi + ' x ' + lebar_tangga.toFixed(2) + ' m x ' + berat_pembagi.toFixed(3) + ' kg/m = ' + beratPembagi.toFixed(2) + ' kg',
                'Total Berat Besi Tangga = ' + beratPokok.toFixed(2) + ' kg + ' + beratPembagi.toFixed(2) + ' kg = ' + totalKg.toFixed(2) + ' kg'
              ]
            };
          },
          refTable: {
            title: 'Petunjuk Pengisian & Spesifikasi Besi Tangga Beton',
            rows: [
              {
                uraian: 'Pembesian Tangga Beton (Pokok & Pembagi)',
                rumus: 'Berat Pokok + Berat Pembagi',
                variabel: 'Panjang Miring = âˆš(Total TinggiÂ² + Total DatarÂ²)<br>Jml Pokok = (Lebar Tangga / Spasi Pokok) + 1<br>Jml Pembagi = (Panjang Miring / Spasi Pembagi) + 1',
                contoh: '18 anak tangga (T=0.18, L=0.28) -> Panjang Miring = 5.99 m<br>Pokok: Ã˜12 (0.888 kg/m) = 49.55 kg | Pembagi: Ã˜10 (0.617 kg/m) = 22.95 kg -> <strong>Hasil = 72.50 kg</strong>',
                petunjuk: 'Panjang miring dihitung otomatis menggunakan Pythagoras dari tinggi optrede dan lebar aantrede. Diameter tulangan pembagi umumnya lebih kecil dari tulangan pokok.'
              }
            ]
          }
        },

        // =========================================================================
        // 4. PEKERJAAN DINDING & PLESTERAN
        // =========================================================================
        {
          id: 'dinding_bata',
          category: 'dinding',
          categoryName: 'Pekerjaan Dinding & Pasangan',
          title: 'Dinding Pasangan Bata Merah / Hebel',
          description: 'Perhitungan luas pasangan dinding netto: (Keliling Bangunan x Tinggi Dinding) - Luas Total Bukaan Pintu/Jendela.',
          unit: 'm2',
          ahspCode: 'A.4.4.1.9',
          inputs: [
            { key: 'keliling', label: 'Panjang Total Dinding (P)', unit: 'm', default: 48.5, step: 'any' },
            { key: 'tinggi', label: 'Tinggi Dinding (t)', unit: 'm', default: 3.60, step: 'any' },
            { key: 'luas_bukaan', label: 'Luas Total Bukaan Pintu/Jendela', unit: 'm2', default: 30.0, step: 'any' },
            { key: 'faktor_sekat', label: 'Faktor Pengali Dinding Sekat/Interior', unit: 'x', default: 1.4, step: 'any' }
          ],
          calculate: (inputs) => {
            const { keliling = 0, tinggi = 0, luas_bukaan = 0, faktor_sekat = 1 } = inputs;
            const luasKotor = keliling * tinggi * faktor_sekat;
            const luasNetto = Math.max(0, luasKotor - luas_bukaan);
            return {
              volume: Math.round(luasNetto * 100) / 100,
              panjang: keliling, lebar: tinggi, tinggi: 1, faktor: faktor_sekat,
              steps: [
                'Luas Kotor Dinding = ' + keliling.toFixed(2) + ' m x ' + tinggi.toFixed(2) + ' m x faktor ' + faktor_sekat + ' = ' + luasKotor.toFixed(2) + ' m2',
                'Pengurangan Bukaan Kusen = ' + luas_bukaan.toFixed(2) + ' m2',
                'Luas Netto Dinding Pasangan = ' + luasKotor.toFixed(2) + ' m2 - ' + luas_bukaan.toFixed(2) + ' m2 = ' + luasNetto.toFixed(2) + ' m2'
              ]
            };
          }
        },
        {
          id: 'plesteran_acian',
          category: 'dinding',
          categoryName: 'Pekerjaan Dinding & Pasangan',
          title: 'Plesteran & Acian Dinding 2 Sisi',
          description: 'Perhitungan luas plesteran dan acian dinding dua sisi (luar dan dalam): Luas Netto Dinding x 2 Sisi.',
          unit: 'm2',
          ahspCode: 'A.4.4.2.4',
          inputs: [
            { key: 'luas_dinding', label: 'Luas Netto Pasangan Dinding', unit: 'm2', default: 245.0, step: 'any' },
            { key: 'sisi', label: 'Jumlah Sisi Plesteran', unit: 'sisi', default: 2, step: 'any' }
          ],
          calculate: (inputs) => {
            const { luas_dinding = 0, sisi = 2 } = inputs;
            const vol = luas_dinding * sisi;
            return {
              volume: Math.round(vol * 100) / 100,
              panjang: luas_dinding, lebar: sisi, tinggi: 1, faktor: 1,
              steps: [
                'Luas Plesteran/Acian = ' + luas_dinding.toFixed(2) + ' m2 x ' + sisi + ' sisi = ' + vol.toFixed(2) + ' m2'
              ]
            };
          }
        },
        {
          id: 'acian_dinding',
          category: 'dinding',
          categoryName: 'Pekerjaan Dinding & Pasangan',
          title: 'Acian Dinding Saja',
          description: 'Perhitungan luas acian semen halus pada permukaan plesteran: Luas Dinding yang Diaci.',
          unit: 'm2',
          ahspCode: 'A.4.4.2.27',
          inputs: [
            { key: 'luas_bidang', label: 'Luas Bidang yang Diaci (L)', unit: 'm2', default: 60.0, step: 'any' }
          ],
          calculate: (inputs) => {
            const { luas_bidang = 0 } = inputs;
            return {
              volume: Math.round(luas_bidang * 100) / 100,
              panjang: luas_bidang, lebar: 1, tinggi: 1, faktor: 1,
              steps: [
                'Luas Acian Dinding = ' + luas_bidang.toFixed(2) + ' m2'
              ]
            };
          }
        },
        {
          id: 'sponengan_nat',
          category: 'dinding',
          categoryName: 'Pekerjaan Dinding & Pasangan',
          title: 'Sponengan / Nat Sudut Dinding & Kusen',
          description: 'Perhitungan panjang total garis sudut plesteran atau nat tali air pada sudut dinding/kusen.',
          unit: "m'",
          ahspCode: 'A.4.4.2.19',
          inputs: [
            { key: 'panjang_sudut', label: 'Panjang Total Sudut/Nat (P)', unit: 'm', default: 20.0, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang_sudut = 0 } = inputs;
            return {
              volume: Math.round(panjang_sudut * 100) / 100,
              panjang: panjang_sudut, lebar: 1, tinggi: 1, faktor: 1,
              steps: [
                'Panjang Sponengan / Sudut = ' + panjang_sudut.toFixed(2) + " m'"
              ]
            };
          }
        },
        {
          id: 'dinding_trasram',
          category: 'dinding',
          categoryName: 'Pekerjaan Dinding & Pasangan',
          title: 'Dinding Trasram (Kedap Air 1SP : 2PP / 1SP : 3PP)',
          description: 'Perhitungan luas pasangan bata trasram kedap air (KM/WC, bawah dinding Â±20-150 cm): Panjang Dinding x Tinggi Trasram.',
          unit: 'm2',
          ahspCode: 'A.4.4.1.1',
          inputs: [
            { key: 'panjang', label: 'Panjang Dinding Trasram (P)', unit: 'm', default: 10.0, step: 'any' },
            { key: 'tinggi', label: 'Tinggi Trasram dari Lantai (T)', unit: 'm', default: 0.30, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang = 0, tinggi = 0 } = inputs;
            const vol = panjang * tinggi;
            return {
              volume: Math.round(vol * 100) / 100,
              panjang, lebar: tinggi, tinggi: 1, faktor: 1,
              steps: [
                'Luas Pasangan Trasram = ' + panjang.toFixed(2) + ' m x ' + tinggi.toFixed(2) + ' m = ' + vol.toFixed(2) + ' m2'
              ]
            };
          }
        },

        // =========================================================================
        // 5. PEKERJAAN ATAP
        // =========================================================================
        {
          id: 'rangka_penutup_atap',
          category: 'atap',
          categoryName: 'Pekerjaan Atap & Plafon',
          title: 'Rangka Baja Ringan & Atap Spandek/Genteng',
          description: 'Perhitungan luas bidang miring atap: (Panjang Bangunan + Overstek) x (Lebar Bangunan + Overstek) / cos(Sudut Kemiringan).',
          unit: 'm2',
          ahspCode: 'A.4.2.1.21',
          inputs: [
            { key: 'panjang', label: 'Panjang Bangunan + Overstek', unit: 'm', default: 16.5, step: 'any' },
            { key: 'lebar', label: 'Lebar Bangunan + Overstek', unit: 'm', default: 10.0, step: 'any' },
            { key: 'sudut_derajat', label: 'Sudut Kemiringan Atap (derajat)', unit: 'derajat', default: 30, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang = 0, lebar = 0, sudut_derajat = 30 } = inputs;
            const rad = (sudut_derajat * Math.PI) / 180;
            const cosVal = Math.cos(rad);
            const luasDatar = panjang * lebar;
            const luasMiring = luasDatar / (cosVal || 1);
            return {
              volume: Math.round(luasMiring * 100) / 100,
              panjang, lebar, tinggi: 1, faktor: 1 / cosVal,
              steps: [
                'Luas Proyeksi Datar = ' + panjang.toFixed(2) + ' m x ' + lebar.toFixed(2) + ' m = ' + luasDatar.toFixed(2) + ' m2',
                'Faktor Sudut Kemiringan (cos ' + sudut_derajat + ' deg) = ' + cosVal.toFixed(4),
                'Luas Bidang Miring Atap = ' + luasDatar.toFixed(2) + ' m2 / ' + cosVal.toFixed(4) + ' = ' + luasMiring.toFixed(2) + ' m2'
              ]
            };
          }
        },
        {
          id: 'penutup_atap',
          category: 'atap',
          categoryName: 'Pekerjaan Atap & Plafon',
          title: 'Penutup Atap Genteng / Metal / Spandek',
          description: 'Perhitungan luas penutup atap (sama dengan luas atap bidang miring terpasang).',
          unit: 'm2',
          ahspCode: 'A.4.5.2.1',
          inputs: [
            { key: 'luas_miring', label: 'Luas Bidang Miring Atap (L)', unit: 'm2', default: 92.4, step: 'any' }
          ],
          calculate: (inputs) => {
            const { luas_miring = 0 } = inputs;
            return {
              volume: Math.round(luas_miring * 100) / 100,
              panjang: luas_miring, lebar: 1, tinggi: 1, faktor: 1,
              steps: [
                'Luas Penutup Atap = ' + luas_miring.toFixed(2) + ' m2'
              ]
            };
          }
        },
        {
          id: 'listplank',
          category: 'atap',
          categoryName: 'Pekerjaan Atap & Plafon',
          title: 'Listplank Kayu / GRC',
          description: 'Perhitungan panjang listplank tepi atap: Panjang Keliling Tepi Atap x Jumlah Lapis Papan.',
          unit: "m'",
          ahspCode: 'A.4.5.1.8',
          inputs: [
            { key: 'keliling', label: 'Panjang Keliling Tepi Atap (Kel)', unit: 'm', default: 36.0, step: 'any' },
            { key: 'lapis', label: 'Jumlah Lapis Papan Listplank', unit: 'lapis', default: 1, step: 'any' }
          ],
          calculate: (inputs) => {
            const { keliling = 0, lapis = 1 } = inputs;
            const vol = keliling * lapis;
            return {
              volume: Math.round(vol * 100) / 100,
              panjang: keliling, lebar: lapis, tinggi: 1, faktor: 1,
              steps: [
                'Panjang Listplank = ' + keliling.toFixed(2) + ' m x ' + lapis + " lapis = " + vol.toFixed(2) + " m'"
              ]
            };
          }
        },
        {
          id: 'talang_air',
          category: 'atap',
          categoryName: 'Pekerjaan Atap & Plafon',
          title: 'Talang Air Jurai / Talang Datar & Tegak',
          description: 'Perhitungan panjang total saluran talang air (talang datar jurai atap + talang tegak pipa turun).',
          unit: "m'",
          ahspCode: 'A.4.5.2.29',
          inputs: [
            { key: 'panjang_talang', label: 'Total Panjang Jalur Talang (P)', unit: 'm', default: 20.0, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang_talang = 0 } = inputs;
            return {
              volume: Math.round(panjang_talang * 100) / 100,
              panjang: panjang_talang, lebar: 1, tinggi: 1, faktor: 1,
              steps: [
                'Panjang Total Talang Air = ' + panjang_talang.toFixed(2) + " m'"
              ]
            };
          }
        },
        {
          id: 'nok_bubungan',
          category: 'atap',
          categoryName: 'Pekerjaan Atap & Plafon',
          title: 'Nok / Bubungan Atap',
          description: 'Perhitungan panjang bubungan pada puncak atau pertemuan jurai bidang atap.',
          unit: "m'",
          ahspCode: 'A.4.5.2.14',
          inputs: [
            { key: 'panjang_nok', label: 'Panjang Total Bubungan Nok (P)', unit: 'm', default: 12.0, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang_nok = 0 } = inputs;
            return {
              volume: Math.round(panjang_nok * 100) / 100,
              panjang: panjang_nok, lebar: 1, tinggi: 1, faktor: 1,
              steps: [
                'Panjang Nok / Bubungan = ' + panjang_nok.toFixed(2) + " m'"
              ]
            };
          }
        },

        // =========================================================================
        // 6. PEKERJAAN FINISHING
        // =========================================================================
        {
          id: 'lantai_keramik',
          category: 'finishing',
          categoryName: 'Pekerjaan Finishing',
          title: 'Pasangan Lantai Keramik / Granit / Homogeneous Tile',
          description: 'Perhitungan luas bersih lantai ruangan: (Panjang x Lebar Ruangan) dikurangi Luas Obstruksi (kolom struktur, meja beton, dll).',
          unit: 'm2',
          ahspCode: 'A.4.4.3.35',
          inputs: [
            { key: 'panjang', label: 'Panjang Ruangan (P)', unit: 'm', default: 8.0, step: 'any' },
            { key: 'lebar', label: 'Lebar Ruangan (L)', unit: 'm', default: 6.0, step: 'any' },
            { key: 'luas_obstruksi', label: 'Luas Obstruksi/Kolom (Lo)', unit: 'm2', default: 1.0, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang = 0, lebar = 0, luas_obstruksi = 0 } = inputs;
            const luasKotor = panjang * lebar;
            const luasNetto = Math.max(0, luasKotor - luas_obstruksi);
            return {
              volume: Math.round(luasNetto * 100) / 100,
              panjang, lebar, tinggi: 1, faktor: 1,
              steps: [
                'Luas Kotor Ruangan = ' + panjang.toFixed(2) + ' m x ' + lebar.toFixed(2) + ' m = ' + luasKotor.toFixed(2) + ' m2',
                'Luas Netto Keramik = ' + luasKotor.toFixed(2) + ' m2 - Obstruksi ' + luas_obstruksi.toFixed(2) + ' m2 = ' + luasNetto.toFixed(2) + ' m2'
              ]
            };
          }
        },
        {
          id: 'plafond_ruangan',
          category: 'finishing',
          categoryName: 'Pekerjaan Finishing',
          title: 'Plafond Gypsum / GRC / PVC + Rangka',
          description: 'Perhitungan luas penutup langit-langit/plafon ruangan: Panjang x Lebar Ruangan.',
          unit: 'm2',
          ahspCode: 'A.4.5.1.7',
          inputs: [
            { key: 'panjang', label: 'Panjang Ruangan (P)', unit: 'm', default: 8.0, step: 'any' },
            { key: 'lebar', label: 'Lebar Ruangan (L)', unit: 'm', default: 6.0, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang = 0, lebar = 0 } = inputs;
            const luas = panjang * lebar;
            return {
              volume: Math.round(luas * 100) / 100,
              panjang, lebar, tinggi: 1, faktor: 1,
              steps: [
                'Luas Plafond = ' + panjang.toFixed(2) + ' m x ' + lebar.toFixed(2) + ' m = ' + luas.toFixed(2) + ' m2'
              ]
            };
          }
        },
        {
          id: 'pengecatan_dinding',
          category: 'finishing',
          categoryName: 'Pekerjaan Finishing',
          title: 'Pengecatan Dinding / Plafond (Multi-Lapis)',
          description: 'Perhitungan luas pengecatan: Luas Bidang Bersih x Jumlah Lapisan Cat (dasar + penutup 2-3 lapis).',
          unit: 'm2',
          ahspCode: 'A.4.7.1.10',
          inputs: [
            { key: 'luas_bidang', label: 'Luas Bidang yang Dicat (L)', unit: 'm2', default: 100.0, step: 'any' },
            { key: 'lapis', label: 'Jumlah Lapisan Cat (N)', unit: 'lapis', default: 2, step: 'any' }
          ],
          calculate: (inputs) => {
            const { luas_bidang = 0, lapis = 2 } = inputs;
            const vol = luas_bidang * lapis;
            return {
              volume: Math.round(vol * 100) / 100,
              panjang, lebar: lapis, tinggi: 1, faktor: 1,
              steps: [
                'Volume Pengecatan = ' + luas_bidang.toFixed(2) + ' m2 x ' + lapis + ' lapis = ' + vol.toFixed(2) + ' m2'
              ]
            };
          }
        },
        {
          id: 'kusen_pintu_jendela',
          category: 'finishing',
          categoryName: 'Pekerjaan Finishing',
          title: 'Pemasangan Kusen Pintu & Jendela (Aluminium / Kayu)',
          description: 'Perhitungan jumlah unit kusen pintu dan jendela terpasang sesuai skedul gambar.',
          unit: 'unit',
          ahspCode: 'A.4.6.1.1',
          inputs: [
            { key: 'jumlah_unit', label: 'Jumlah Unit Kusen (n)', unit: 'unit', default: 15, step: 'any' }
          ],
          calculate: (inputs) => {
            const { jumlah_unit = 0 } = inputs;
            return {
              volume: Math.round(jumlah_unit * 100) / 100,
              panjang: jumlah_unit, lebar: 1, tinggi: 1, faktor: 1,
              steps: [
                'Jumlah Kusen = ' + jumlah_unit + ' unit'
              ]
            };
          }
        },
        {
          id: 'daun_pintu_jendela',
          category: 'finishing',
          categoryName: 'Pekerjaan Finishing',
          title: 'Pemasangan Daun Pintu & Daun Jendela',
          description: 'Perhitungan jumlah unit daun pintu/jendela termasuk engsel, kunci, dan aksesoris.',
          unit: 'unit',
          ahspCode: 'A.4.6.1.5',
          inputs: [
            { key: 'jumlah_daun', label: 'Jumlah Daun Pintu/Jendela (n)', unit: 'unit', default: 15, step: 'any' }
          ],
          calculate: (inputs) => {
            const { jumlah_daun = 0 } = inputs;
            return {
              volume: Math.round(jumlah_daun * 100) / 100,
              panjang: jumlah_daun, lebar: 1, tinggi: 1, faktor: 1,
              steps: [
                'Jumlah Daun Pintu/Jendela = ' + jumlah_daun + ' unit'
              ]
            };
          }
        },
        {
          id: 'kaca_jendela',
          category: 'finishing',
          categoryName: 'Pekerjaan Finishing',
          title: 'Pemasangan Kaca Mati / Jendela',
          description: 'Perhitungan luas bidang kaca: Panjang Kaca x Lebar Kaca per Unit x Jumlah Daun Kaca.',
          unit: 'm2',
          ahspCode: 'A.4.6.2.1',
          inputs: [
            { key: 'panjang', label: 'Panjang/Tinggi Kaca per Unit (P)', unit: 'm', default: 1.0, step: 'any' },
            { key: 'lebar', label: 'Lebar Kaca per Unit (L)', unit: 'm', default: 1.5, step: 'any' },
            { key: 'jumlah', label: 'Jumlah Lembar Kaca (n)', unit: 'lbr', default: 10, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang = 0, lebar = 0, jumlah = 0 } = inputs;
            const luasPerLbr = panjang * lebar;
            const totalLuas = luasPerLbr * jumlah;
            return {
              volume: Math.round(totalLuas * 100) / 100,
              panjang, lebar, tinggi: 1, faktor: jumlah,
              steps: [
                'Luas per Lembar = ' + panjang.toFixed(2) + ' m x ' + lebar.toFixed(2) + ' m = ' + luasPerLbr.toFixed(4) + ' m2',
                'Total Luas Kaca (' + jumlah + ' Lembar) = ' + luasPerLbr.toFixed(4) + ' m2 x ' + jumlah + ' = ' + totalLuas.toFixed(2) + ' m2'
              ]
            };
          }
        },
        {
          id: 'waterproofing',
          category: 'finishing',
          categoryName: 'Pekerjaan Finishing',
          title: 'Waterproofing Area Basah / Dak Beton',
          description: 'Perhitungan luas lapisan waterproofing membran/coating pada lantai KM/WC atau dak atap: Panjang x Lebar Area.',
          unit: 'm2',
          ahspCode: 'A.4.4.3.1',
          inputs: [
            { key: 'panjang', label: 'Panjang Area Basah (P)', unit: 'm', default: 3.0, step: 'any' },
            { key: 'lebar', label: 'Lebar Area Basah (L)', unit: 'm', default: 2.0, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang = 0, lebar = 0 } = inputs;
            const vol = panjang * lebar;
            return {
              volume: Math.round(vol * 100) / 100,
              panjang, lebar, tinggi: 1, faktor: 1,
              steps: [
                'Luas Waterproofing = ' + panjang.toFixed(2) + ' m x ' + lebar.toFixed(2) + ' m = ' + vol.toFixed(2) + ' m2'
              ]
            };
          }
        },
        {
          id: 'railing_tangga',
          category: 'finishing',
          categoryName: 'Pekerjaan Finishing',
          title: 'Railing Tangga / Railing Balkon',
          description: 'Perhitungan total panjang pagar pengaman/railing tangga dan void balkon terpasang.',
          unit: "m'",
          ahspCode: 'A.4.6.1.18',
          inputs: [
            { key: 'panjang_railing', label: 'Total Panjang Railing (P)', unit: 'm', default: 15.0, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang_railing = 0 } = inputs;
            return {
              volume: Math.round(panjang_railing * 100) / 100,
              panjang: panjang_railing, lebar: 1, tinggi: 1, faktor: 1,
              steps: [
                'Panjang Railing = ' + panjang_railing.toFixed(2) + " m'"
              ]
            };
          }
        },

        // =========================================================================
        // 7. PEKERJAAN MEP (MEKANIKAL, ELEKTRIKAL, PLUMBING)
        // =========================================================================
        {
          id: 'pipa_air_bersih',
          category: 'mep',
          categoryName: 'Pekerjaan MEP (Mekanikal, Elektrikal, Plumbing)',
          title: 'Instalasi Pipa Air Bersih (PPR / PVC / Galvanis)',
          description: 'Perhitungan panjang pipa air bersih: Panjang Jalur Ukur x Faktor Sambungan/Fitting (1.10 = toleransi 10%).',
          unit: "m'",
          ahspCode: 'A.5.1.1.1',
          inputs: [
            { key: 'panjang_jalur', label: 'Panjang Jalur Terukur (P)', unit: 'm', default: 50.0, step: 'any' },
            { key: 'faktor_sambungan', label: 'Faktor Sambungan/Fitting (F)', unit: 'x', default: 1.10, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang_jalur = 0, faktor_sambungan = 1.1 } = inputs;
            const vol = panjang_jalur * faktor_sambungan;
            return {
              volume: Math.round(vol * 100) / 100,
              panjang: panjang_jalur, lebar: faktor_sambungan, tinggi: 1, faktor: 1,
              steps: [
                'Panjang Pipa Air Bersih = ' + panjang_jalur.toFixed(2) + ' m x faktor fitting ' + faktor_sambungan + " = " + vol.toFixed(2) + " m'"
              ]
            };
          }
        },
        {
          id: 'pipa_air_kotor',
          category: 'mep',
          categoryName: 'Pekerjaan MEP (Mekanikal, Elektrikal, Plumbing)',
          title: 'Instalasi Pipa Air Kotor & Buangan (PVC AW/D)',
          description: 'Perhitungan panjang pipa air kotor, air bekas, dan pipa vent: Panjang Jalur x Faktor Sambungan (1.10).',
          unit: "m'",
          ahspCode: 'A.5.1.1.7',
          inputs: [
            { key: 'panjang_jalur', label: 'Panjang Jalur Terukur (P)', unit: 'm', default: 40.0, step: 'any' },
            { key: 'faktor_sambungan', label: 'Faktor Sambungan/Fitting (F)', unit: 'x', default: 1.10, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang_jalur = 0, faktor_sambungan = 1.1 } = inputs;
            const vol = panjang_jalur * faktor_sambungan;
            return {
              volume: Math.round(vol * 100) / 100,
              panjang: panjang_jalur, lebar: faktor_sambungan, tinggi: 1, faktor: 1,
              steps: [
                'Panjang Pipa Air Kotor = ' + panjang_jalur.toFixed(2) + ' m x faktor fitting ' + faktor_sambungan + " = " + vol.toFixed(2) + " m'"
              ]
            };
          }
        },
        {
          id: 'titik_listrik',
          category: 'mep',
          categoryName: 'Pekerjaan MEP (Mekanikal, Elektrikal, Plumbing)',
          title: 'Titik Instalasi Listrik (Lampu / Saklar / Stop Kontak)',
          description: 'Perhitungan jumlah titik instalasi listrik penerangan dan daya sesuai gambar tata letak elektrikal.',
          unit: 'titik',
          ahspCode: 'A.5.2.1.1',
          inputs: [
            { key: 'jumlah_titik', label: 'Jumlah Titik Instalasi (n)', unit: 'titik', default: 45, step: 'any' }
          ],
          calculate: (inputs) => {
            const { jumlah_titik = 0 } = inputs;
            return {
              volume: Math.round(jumlah_titik * 100) / 100,
              panjang: jumlah_titik, lebar: 1, tinggi: 1, faktor: 1,
              steps: [
                'Jumlah Titik Instalasi Listrik = ' + jumlah_titik + ' titik'
              ]
            };
          }
        },
        {
          id: 'kabel_listrik',
          category: 'mep',
          categoryName: 'Pekerjaan MEP (Mekanikal, Elektrikal, Plumbing)',
          title: 'Pengkabelan Listrik (NYM / NYY / NYA)',
          description: 'Perhitungan panjang kabel listrik: Panjang Jalur Instalasi x Jumlah Jalur/Kawat Fasa.',
          unit: "m'",
          ahspCode: 'A.5.2.1.5',
          inputs: [
            { key: 'panjang_jalur', label: 'Panjang Jalur Instalasi (P)', unit: 'm', default: 100.0, step: 'any' },
            { key: 'jumlah_jalur', label: 'Jumlah Kawat/Fasa (n)', unit: 'jalur', default: 3, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang_jalur = 0, jumlah_jalur = 1 } = inputs;
            const vol = panjang_jalur * jumlah_jalur;
            return {
              volume: Math.round(vol * 100) / 100,
              panjang: panjang_jalur, lebar: jumlah_jalur, tinggi: 1, faktor: 1,
              steps: [
                'Panjang Total Kabel = ' + panjang_jalur.toFixed(2) + ' m x ' + jumlah_jalur + " jalur = " + vol.toFixed(2) + " m'"
              ]
            };
          }
        },
        {
          id: 'panel_listrik',
          category: 'mep',
          categoryName: 'Pekerjaan MEP (Mekanikal, Elektrikal, Plumbing)',
          title: 'Panel Listrik (MCB Box / Panel Distribusi / SDP)',
          description: 'Perhitungan jumlah unit panel box distribusi daya listrik terpasang.',
          unit: 'unit',
          ahspCode: 'A.5.2.1.9',
          inputs: [
            { key: 'jumlah_unit', label: 'Jumlah Unit Panel (n)', unit: 'unit', default: 2, step: 'any' }
          ],
          calculate: (inputs) => {
            const { jumlah_unit = 0 } = inputs;
            return {
              volume: Math.round(jumlah_unit * 100) / 100,
              panjang: jumlah_unit, lebar: 1, tinggi: 1, faktor: 1,
              steps: [
                'Jumlah Unit Panel Listrik = ' + jumlah_unit + ' unit'
              ]
            };
          }
        },
        {
          id: 'sanitair_unit',
          category: 'mep',
          categoryName: 'Pekerjaan MEP (Mekanikal, Elektrikal, Plumbing)',
          title: 'Pemasangan Alat Sanitair (Kloset / Wastafel / Kran / Shower)',
          description: 'Perhitungan jumlah unit alat saniter terpasang per jenis perlengkapan.',
          unit: 'unit',
          ahspCode: 'A.5.1.1.25',
          inputs: [
            { key: 'jumlah_unit', label: 'Jumlah Unit Sanitair (n)', unit: 'unit', default: 6, step: 'any' }
          ],
          calculate: (inputs) => {
            const { jumlah_unit = 0 } = inputs;
            return {
              volume: Math.round(jumlah_unit * 100) / 100,
              panjang: jumlah_unit, lebar: 1, tinggi: 1, faktor: 1,
              steps: [
                'Jumlah Alat Sanitair = ' + jumlah_unit + ' unit'
              ]
            };
          }
        },
        {
          id: 'septictank',
          category: 'mep',
          categoryName: 'Pekerjaan MEP (Mekanikal, Elektrikal, Plumbing)',
          title: 'Septictank / Biotank + Peresapan',
          description: 'Perhitungan kubikasi bak septictank/peresapan: Panjang x Lebar x Tinggi/Kedalaman Bak.',
          unit: 'm3',
          ahspCode: 'A.5.1.1.30',
          inputs: [
            { key: 'panjang', label: 'Panjang Bak (P)', unit: 'm', default: 2.0, step: 'any' },
            { key: 'lebar', label: 'Lebar Bak (L)', unit: 'm', default: 1.5, step: 'any' },
            { key: 'tinggi', label: 'Kedalaman / Tinggi Bak (T)', unit: 'm', default: 1.5, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang = 0, lebar = 0, tinggi = 0 } = inputs;
            const vol = panjang * lebar * tinggi;
            return {
              volume: Math.round(vol * 100) / 100,
              panjang, lebar, tinggi, faktor: 1,
              steps: [
                'Kapasitas/Volume Septictank = ' + panjang.toFixed(2) + ' m x ' + lebar.toFixed(2) + ' m x ' + tinggi.toFixed(2) + ' m = ' + vol.toFixed(2) + ' m3'
              ]
            };
          }
        },
        {
          id: 'ground_tank',
          category: 'mep',
          categoryName: 'Pekerjaan MEP (Mekanikal, Elektrikal, Plumbing)',
          title: 'Ground Tank / Reservoir Air Bawah',
          description: 'Perhitungan kubikasi bak penampungan air bersih bawah: Panjang x Lebar x Tinggi Bak.',
          unit: 'm3',
          ahspCode: 'A.5.1.1.31',
          inputs: [
            { key: 'panjang', label: 'Panjang Bak (P)', unit: 'm', default: 2.0, step: 'any' },
            { key: 'lebar', label: 'Lebar Bak (L)', unit: 'm', default: 2.0, step: 'any' },
            { key: 'tinggi', label: 'Tinggi Bak (T)', unit: 'm', default: 1.5, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang = 0, lebar = 0, tinggi = 0 } = inputs;
            const vol = panjang * lebar * tinggi;
            return {
              volume: Math.round(vol * 100) / 100,
              panjang, lebar, tinggi, faktor: 1,
              steps: [
                'Kapasitas Ground Tank = ' + panjang.toFixed(2) + ' m x ' + lebar.toFixed(2) + ' m x ' + tinggi.toFixed(2) + ' m = ' + vol.toFixed(2) + ' m3'
              ]
            };
          }
        },
        {
          id: 'instalasi_ac',
          category: 'mep',
          categoryName: 'Pekerjaan MEP (Mekanikal, Elektrikal, Plumbing)',
          title: 'Instalasi Titik / Unit AC (Termasuk Refrigerant & Drain)',
          description: 'Perhitungan jumlah unit instalasi AC pendingin ruangan.',
          unit: 'titik',
          ahspCode: 'A.5.3.1.1',
          inputs: [
            { key: 'jumlah_titik', label: 'Jumlah Titik AC (n)', unit: 'titik', default: 8, step: 'any' }
          ],
          calculate: (inputs) => {
            const { jumlah_titik = 0 } = inputs;
            return {
              volume: Math.round(jumlah_titik * 100) / 100,
              panjang: jumlah_titik, lebar: 1, tinggi: 1, faktor: 1,
              steps: [
                'Jumlah Titik AC = ' + jumlah_titik + ' titik'
              ]
            };
          }
        },
        {
          id: 'fire_alarm_hydrant',
          category: 'mep',
          categoryName: 'Pekerjaan MEP (Mekanikal, Elektrikal, Plumbing)',
          title: 'Fire Alarm / Smoke Detector / Hydrant Box',
          description: 'Perhitungan jumlah titik detektor kebakaran atau titik kotak hydrant proteksi kebakaran.',
          unit: 'titik',
          ahspCode: 'A.5.3.1.5',
          inputs: [
            { key: 'jumlah_titik', label: 'Jumlah Titik Proteksi (n)', unit: 'titik', default: 4, step: 'any' }
          ],
          calculate: (inputs) => {
            const { jumlah_titik = 0 } = inputs;
            return {
              volume: Math.round(jumlah_titik * 100) / 100,
              panjang: jumlah_titik, lebar: 1, tinggi: 1, faktor: 1,
              steps: [
                'Jumlah Titik Fire Alarm/Hydrant = ' + jumlah_titik + ' titik'
              ]
            };
          }
        },

        // =========================================================================
        // 8. PEKERJAAN KONSTRUKSI BAJA (LENGKAP DENGAN TABEL RUJUKAN & PETUNJUK)
        // =========================================================================
        {
          id: 'baja_profil_wf',
          category: 'baja',
          categoryName: 'Pekerjaan Konstruksi Baja',
          title: 'Konstruksi Baja: Berat Profil WF / H-Beam / Kanal / Siku',
          description: 'Perhitungan berat profil baja struktural: Berat per meter (tabel profil resmi) x Panjang Batang x Jumlah Batang.',
          unit: 'kg',
          ahspCode: 'A.4.2.1.1',
          inputs: [
            { key: 'profil_preset', label: 'Pilih Profil Standar Produsen', type: 'select', options: OPSI_PROFIL_BAJA, default: 21.3, help: 'Tabel Standar SNI', colSpan: 2 },
            { key: 'berat_custom', label: 'Berat Profil per Meter (W/m) â€” [Bila Kustom/Manual]', unit: 'kg/m', default: 21.3, step: 'any', colSpan: 2 },
            { key: 'panjang', label: 'Panjang Batang Profil (P)', unit: 'm', default: 6.0, step: 'any' },
            { key: 'jumlah', label: 'Jumlah Batang Profil (n)', unit: 'batang', default: 10, step: 'any' }
          ],
          calculate: (inputs) => {
            const { profil_preset = 21.3, berat_custom = 21.3, panjang = 0, jumlah = 0 } = inputs;
            const wPerM = profil_preset > 0 ? profil_preset : berat_custom;
            const totalKg = wPerM * panjang * jumlah;
            return {
              volume: Math.round(totalKg * 100) / 100,
              panjang, lebar: wPerM, tinggi: 1, faktor: jumlah,
              steps: [
                'Berat Profil per Meter = ' + wPerM.toFixed(2) + ' kg/m',
                'Berat per Batang = ' + wPerM.toFixed(2) + ' kg/m x ' + panjang.toFixed(2) + ' m = ' + (wPerM * panjang).toFixed(2) + ' kg/btg',
                'Berat Total Profil Baja (' + jumlah + ' Batang) = ' + (wPerM * panjang).toFixed(2) + ' kg x ' + jumlah + ' = ' + totalKg.toFixed(2) + ' kg'
              ]
            };
          },
          refTable: {
            title: 'Tabel Spesifikasi & Petunjuk Pengisian Profil Baja',
            rows: [
              {
                uraian: 'Berat Profil Baja (WF/H-Beam/Kanal C/Siku)',
                rumus: 'Berat/m (tabel) x Panjang x Jumlah Batang',
                variabel: 'W/m = berat profil per meter dari tabel produsen (kg/m)<br>Panjang = panjang batang (m)<br>Jml = jumlah batang',
                contoh: 'W/m = 21.3 kg/m (WF200x100), Panjang = 6 m, Jml = 10 btg<br><strong>Hasil = 1.278 kg</strong>',
                petunjuk: 'Berat/m wajib diambil dari tabel resmi profil baja produsen (Baja Gunung Garuda / Krakatau Steel / SNI), karena bentuk penampang tidak beraturan sehingga tidak dihitung dari rumus geometris sederhana.'
              }
            ]
          }
        },
        {
          id: 'baja_baseplate',
          category: 'baja',
          categoryName: 'Pekerjaan Konstruksi Baja',
          title: 'Konstruksi Baja: Plat Baja / Baseplate / Stiffener',
          description: 'Perhitungan berat plat baja/tumpuan: Panjang (m) x Lebar (m) x Tebal (mm) x 7.85 x Jumlah Plat.',
          unit: 'kg',
          ahspCode: 'A.4.2.1.2',
          inputs: [
            { key: 'panjang', label: 'Panjang Plat (P)', unit: 'm', default: 0.30, step: 'any' },
            { key: 'lebar', label: 'Lebar Plat (L)', unit: 'm', default: 0.30, step: 'any' },
            { key: 'tebal_mm', label: 'Tebal Plat Baja (T)', unit: 'mm', default: 12.0, step: 'any', help: 'Satuan milimeter (mm)' },
            { key: 'jumlah', label: 'Jumlah Buah Plat (n)', unit: 'bh', default: 1, step: 'any' }
          ],
          calculate: (inputs) => {
            const { panjang = 0, lebar = 0, tebal_mm = 0, jumlah = 1 } = inputs;
            const beratPerBh = panjang * lebar * tebal_mm * 7.85;
            const totalKg = beratPerBh * jumlah;
            return {
              volume: Math.round(totalKg * 100) / 100,
              panjang, lebar, tinggi: tebal_mm, faktor: jumlah,
              steps: [
                'Luas Plat = ' + panjang.toFixed(2) + ' m x ' + lebar.toFixed(2) + ' m = ' + (panjang * lebar).toFixed(4) + ' m2',
                'Berat per Buah = ' + (panjang * lebar).toFixed(4) + ' m2 x ' + tebal_mm.toFixed(1) + ' mm x 7.85 = ' + beratPerBh.toFixed(2) + ' kg/bh',
                'Total Berat Plat Baja (' + jumlah + ' Buah) = ' + beratPerBh.toFixed(2) + ' kg x ' + jumlah + ' = ' + totalKg.toFixed(2) + ' kg'
              ]
            };
          },
          refTable: {
            title: 'Tabel Spesifikasi & Petunjuk Pengisian Plat Baja / Baseplate',
            rows: [
              {
                uraian: 'Berat Plat Baja / Baseplate / Stiffener',
                rumus: 'Panjang x Lebar x Tebal(mm) x 7,85',
                variabel: 'Panjang = panjang plat (m)<br>Lebar = lebar plat (m)<br>Tebal = tebal plat (mm)<br>BJ Baja = 7.85 kg/mÂ²/mm',
                contoh: 'Panjang = 0.30 m, Lebar = 0.30 m, Tebal = 12 mm<br><strong>Hasil = 8.48 kg / buah</strong>',
                petunjuk: 'Angka 7,85 = berat jenis baja (7850 kg/m3) dikonversi menjadi kg per mÂ² per mm tebal, sehingga Tebal langsung diisi dalam satuan mm.'
              }
            ]
          }
        },
        {
          id: 'baja_pipa',
          category: 'baja',
          categoryName: 'Pekerjaan Konstruksi Baja',
          title: 'Konstruksi Baja: Pipa Baja Berongga (Hollow Round Pipe)',
          description: 'Perhitungan berat pipa baja bulat: 0.02466 x Tebal t (mm) x (Diameter D - t) x Panjang (m) x Jumlah Batang.',
          unit: 'kg',
          ahspCode: 'A.4.2.1.3',
          inputs: [
            { key: 'diameter_od', label: 'Diameter Luar Pipa (OD)', unit: 'mm', default: 114.3, step: 'any', help: 'Contoh: Pipa 4 inch = 114.3 mm' },
            { key: 'tebal_t', label: 'Tebal Dinding Pipa (t)', unit: 'mm', default: 4.0, step: 'any' },
            { key: 'panjang', label: 'Panjang Batang Pipa (P)', unit: 'm', default: 6.0, step: 'any' },
            { key: 'jumlah', label: 'Jumlah Batang Pipa (n)', unit: 'batang', default: 1, step: 'any' }
          ],
          calculate: (inputs) => {
            const { diameter_od = 0, tebal_t = 0, panjang = 0, jumlah = 1 } = inputs;
            const wPerM = 0.02466 * tebal_t * (diameter_od - tebal_t);
            const beratPerBtg = wPerM * panjang;
            const totalKg = beratPerBtg * jumlah;
            return {
              volume: Math.round(totalKg * 100) / 100,
              panjang, lebar: wPerM, tinggi: 1, faktor: jumlah,
              steps: [
                'Berat per Meter = 0.02466 x ' + tebal_t.toFixed(1) + ' mm x (' + diameter_od.toFixed(1) + ' - ' + tebal_t.toFixed(1) + ') = ' + wPerM.toFixed(3) + ' kg/m',
                'Berat per Batang (' + panjang.toFixed(2) + ' m) = ' + wPerM.toFixed(3) + ' kg/m x ' + panjang.toFixed(2) + ' m = ' + beratPerBtg.toFixed(2) + ' kg',
                'Total Berat Pipa Baja (' + jumlah + ' Batang) = ' + beratPerBtg.toFixed(2) + ' kg x ' + jumlah + ' = ' + totalKg.toFixed(2) + ' kg'
              ]
            };
          },
          refTable: {
            title: 'Tabel Spesifikasi & Petunjuk Pengisian Pipa Baja',
            rows: [
              {
                uraian: 'Berat Pipa Baja (Pipa Bulat Berongga)',
                rumus: '0,02466 x t x (D âˆ’ t) x Panjang',
                variabel: 't = tebal pipa (mm)<br>D = diameter luar pipa / OD (mm)<br>Panjang = panjang pipa (m)',
                contoh: 't = 4 mm, D = 114.3 mm (pipa 4"), Panjang = 6 m<br><strong>Hasil = 65.28 kg / batang</strong>',
                petunjuk: 'D & t diambil dari spesifikasi pipa baja (mis. pipa 4 inch OD 114,3 mm tebal 4 mm). Rumus berlaku untuk pipa bulat berongga (hollow round pipe).'
              }
            ]
          }
        },
        {
          id: 'baja_baut_htb',
          category: 'baja',
          categoryName: 'Pekerjaan Konstruksi Baja',
          title: 'Konstruksi Baja: Kebutuhan Baut Struktur / HTB',
          description: 'Perhitungan jumlah kebutuhan baut pengikat sambungan: Jumlah Titik Sambungan x Jumlah Baut tiap Sambungan.',
          unit: 'titik',
          ahspCode: 'A.4.2.1.4',
          inputs: [
            { key: 'titik_sambungan', label: 'Jumlah Titik Sambungan Struktur (N)', unit: 'titik', default: 20, step: 'any' },
            { key: 'baut_per_titik', label: 'Jumlah Baut per Titik Sambungan (n)', unit: 'baut', default: 4, step: 'any' }
          ],
          calculate: (inputs) => {
            const { titik_sambungan = 0, baut_per_titik = 0 } = inputs;
            const totalBaut = titik_sambungan * baut_per_titik;
            return {
              volume: Math.round(totalBaut * 100) / 100,
              panjang: titik_sambungan, lebar: baut_per_titik, tinggi: 1, faktor: 1,
              steps: [
                'Kebutuhan Baut Struktur = ' + titik_sambungan + ' Titik Sambungan x ' + baut_per_titik + ' Baut/Titik = ' + totalBaut + ' bh baut (HTB)'
              ]
            };
          },
          refTable: {
            title: 'Tabel Spesifikasi & Petunjuk Pengisian Baut Struktur',
            rows: [
              {
                uraian: 'Jumlah Baut / Mur-Baut (HTB)',
                rumus: 'Jumlah Titik Sambungan x Jumlah Baut per Sambungan',
                variabel: 'Titik = jumlah titik sambungan struktur<br>Jml = jumlah baut tiap 1 titik sambungan',
                contoh: 'Titik = 20 titik sambungan, Jml = 4 baut per titik<br><strong>Hasil = 80 baut</strong>',
                petunjuk: 'Jumlah titik & baut per sambungan mengikuti gambar detail sambungan (connection detail) sesuai perhitungan struktur.'
              }
            ]
          }
        },
        {
          id: 'baja_cat_galvanis',
          category: 'baja',
          categoryName: 'Pekerjaan Konstruksi Baja',
          title: 'Konstruksi Baja: Luas Pengecatan / Zinc Chromate / Galvanis',
          description: 'Perhitungan luas permukaan pelapisan baja: Keliling Penampang Profil x Panjang Batang x Jumlah Batang.',
          unit: 'm2',
          ahspCode: 'A.4.7.1.1',
          inputs: [
            { key: 'keliling_profil', label: 'Keliling Penampang Profil Terekspos (Kel)', unit: 'm', default: 0.90, step: 'any', help: 'Lihat tabel profil produsen' },
            { key: 'panjang', label: 'Panjang Batang Profil (P)', unit: 'm', default: 6.0, step: 'any' },
            { key: 'jumlah', label: 'Jumlah Batang Profil (n)', unit: 'batang', default: 10, step: 'any' },
            { key: 'lapis', label: 'Jumlah Lapisan Cat / Permukaan', unit: 'lapis', default: 1, step: 'any' }
          ],
          calculate: (inputs) => {
            const { keliling_profil = 0, panjang = 0, jumlah = 0, lapis = 1 } = inputs;
            const luas1Btg = keliling_profil * panjang;
            const totalLuas = luas1Btg * jumlah * lapis;
            return {
              volume: Math.round(totalLuas * 100) / 100,
              panjang, lebar: keliling_profil, tinggi: lapis, faktor: jumlah,
              steps: [
                'Luas Permukaan 1 Batang = ' + keliling_profil.toFixed(2) + ' m x ' + panjang.toFixed(2) + ' m = ' + luas1Btg.toFixed(2) + ' m2/btg',
                'Total Luas Pengecatan (' + jumlah + ' Batang, ' + lapis + ' Lapis) = ' + luas1Btg.toFixed(2) + ' m2 x ' + jumlah + ' x ' + lapis + ' = ' + totalLuas.toFixed(2) + ' m2'
              ]
            };
          },
          refTable: {
            title: 'Tabel Spesifikasi & Petunjuk Pengecatan Baja',
            rows: [
              {
                uraian: 'Luas Pengecatan / Galvanis Konstruksi Baja',
                rumus: 'Keliling Penampang x Panjang x Jumlah Batang',
                variabel: 'Kel = keliling penampang profil terekspos (m)<br>Panjang = panjang batang (m)<br>Jml = jumlah batang',
                contoh: 'Kel = 0.90 m, Panjang = 6 m, Jml = 10 btg<br><strong>Hasil = 54.00 mÂ²</strong>',
                petunjuk: 'Keliling penampang dijumlahkan dari seluruh sisi profil yang terekspos (dilihat pada tabel profil produsen); kalikan 2 bila kedua sisi permukaan dicat/dilapisi terpisah.'
              }
            ]
          }
        },
        {
          id: 'baja_total_rekap',
          category: 'baja',
          categoryName: 'Pekerjaan Konstruksi Baja',
          title: 'Konstruksi Baja: Berat Total (Rekap + Aksesoris Sambungan)',
          description: 'Perhitungan berat total konstruksi baja proyek: Total Berat Elemen Utama x (1 + Faktor Tambahan Sambungan/Plat/Las).',
          unit: 'kg',
          ahspCode: 'A.4.2.1.1',
          inputs: [
            { key: 'total_berat', label: 'Total Berat Elemen Profil & Plat Baja (W)', unit: 'kg', default: 5000.0, step: 'any' },
            { key: 'faktor_sambungan', label: 'Faktor Tambahan Sambungan/Baut/Las (F)', unit: 'x', default: 0.10, step: 'any', help: 'Umumnya 0.08 s/d 0.12 (8-12%)' }
          ],
          calculate: (inputs) => {
            const { total_berat = 0, faktor_sambungan = 0.10 } = inputs;
            const beratTambahan = total_berat * faktor_sambungan;
            const totalRekap = total_berat + beratTambahan;
            return {
              volume: Math.round(totalRekap * 100) / 100,
              panjang: total_berat, lebar: 1 + faktor_sambungan, tinggi: 1, faktor: 1,
              steps: [
                'Berat Elemen Utama = ' + total_berat.toFixed(2) + ' kg',
                'Tambahan Plat Sambung, Baut, & Las (' + (faktor_sambungan * 100).toFixed(1) + '%) = ' + beratTambahan.toFixed(2) + ' kg',
                'Berat Total Konstruksi Baja = ' + total_berat.toFixed(2) + ' kg + ' + beratTambahan.toFixed(2) + ' kg = ' + totalRekap.toFixed(2) + ' kg'
              ]
            };
          },
          refTable: {
            title: 'Tabel Spesifikasi & Petunjuk Rekapitulasi Konstruksi Baja',
            rows: [
              {
                uraian: 'Berat Total Konstruksi Baja (Rekap + Sambungan)',
                rumus: 'Total Berat Elemen x (1 + Faktor Tambahan Sambungan)',
                variabel: 'Total = jumlah seluruh berat elemen baja (kg)<br>Faktor = faktor tambahan plat sambung/baut/aksesoris (umumnya 0,08â€“0,12)',
                contoh: 'Total = 5.000 kg, Faktor = 0.10 (10%)<br><strong>Hasil = 5.500 kg</strong>',
                petunjuk: 'Faktor tambahan mengakomodasi berat plat sambung, baut, dan aksesoris yang tidak dihitung satu per satu; sesuaikan dengan kompleksitas struktur.'
              }
            ]
          }
        }
      ];
    }
  }

  // --- OFFICIAL DOCUMENT EXPORT & PREVIEW MANAGER ---
  class OfficialDocExportManager {
    constructor(rabEngine, ahspEngine) {
      this.rabEngine = rabEngine;
      this.ahspEngine = ahspEngine;
    }

    generateRabHtml(proj = null) {
      const p = proj || this.rabEngine.project;
      let divRowsHtml = '';

      p.divisions.forEach((div) => {
        divRowsHtml += '<tr style="background:#f1f5f9; font-weight:bold;">' +
          '<td style="text-align:center; padding:6px 8px; border:1px solid #cbd5e1;">' + div.code + '</td>' +
          '<td colspan="5" style="padding:6px 8px; border:1px solid #cbd5e1;">' + div.name + '</td>' +
          '<td style="text-align:right; padding:6px 8px; border:1px solid #cbd5e1;">' + Utils.formatRupiah(div.subtotal) + '</td>' +
          '</tr>';

        div.items.forEach((it, iIdx) => {
          divRowsHtml += '<tr>' +
            '<td style="text-align:center; padding:5px 8px; border:1px solid #cbd5e1;">' + (iIdx + 1) + '</td>' +
            '<td style="padding:5px 8px; border:1px solid #cbd5e1;">' + it.name + '</td>' +
            '<td style="text-align:center; font-family:monospace; padding:5px 8px; border:1px solid #cbd5e1;">' + (it.ahspCode || '-') + '</td>' +
            '<td style="text-align:right; padding:5px 8px; border:1px solid #cbd5e1;">' + Utils.formatNumber(it.volume, 2) + '</td>' +
            '<td style="text-align:center; padding:5px 8px; border:1px solid #cbd5e1;">' + Utils.formatUnitHtml(it.unit) + '</td>' +
            '<td style="text-align:right; padding:5px 8px; border:1px solid #cbd5e1;">' + Utils.formatRupiah(it.unitPrice) + '</td>' +
            '<td style="text-align:right; padding:5px 8px; border:1px solid #cbd5e1;">' + Utils.formatRupiah(it.totalPrice) + '</td>' +
            '</tr>';
        });
      });

      return '<div style="font-family: Arial, sans-serif; font-size: 10pt; color: #000; padding: 15px;">' +
        '<div style="text-align: center; margin-bottom: 20px;">' +
        '<h3 style="margin: 0; font-size: 13pt; text-transform: uppercase; font-weight: bold;">RENCANA ANGGARAN BIAYA (RAB)</h3>' +
        '<h4 style="margin: 4px 0 0 0; font-size: 10.5pt; text-transform: uppercase; font-weight: normal;">PROGRAM: ' + p.info.program + '</h4>' +
        '<h4 style="margin: 2px 0 0 0; font-size: 10.5pt; text-transform: uppercase; font-weight: bold;">PEKERJAAN: ' + p.info.name + '</h4>' +
        '<h5 style="margin: 2px 0 0 0; font-size: 9.5pt; font-weight: normal;">LOKASI: ' + p.info.location + ' &bull; TAHUN ANGGARAN: ' + p.info.year + '</h5>' +
        '</div>' +
        '<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 9.5pt;">' +
        '<thead>' +
        '<tr style="background: #e2e8f0; font-weight: bold; text-align: center;">' +
        '<th style="width: 45px; padding: 8px; border: 1px solid #94a3b8;">NO</th>' +
        '<th style="padding: 8px; border: 1px solid #94a3b8;">URAIAN PEKERJAAN</th>' +
        '<th style="width: 110px; padding: 8px; border: 1px solid #94a3b8;">KODE AHSP</th>' +
        '<th style="width: 80px; padding: 8px; border: 1px solid #94a3b8;">VOLUME</th>' +
        '<th style="width: 60px; padding: 8px; border: 1px solid #94a3b8;">SAT</th>' +
        '<th style="width: 130px; padding: 8px; border: 1px solid #94a3b8;">HARGA SATUAN (Rp)</th>' +
        '<th style="width: 140px; padding: 8px; border: 1px solid #94a3b8;">JUMLAH HARGA (Rp)</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' + divRowsHtml + '</tbody>' +
        '<tfoot>' +
        '<tr style="font-weight: bold; background: #f8fafc;">' +
        '<td colspan="6" style="text-align: right; padding: 8px; border: 1px solid #94a3b8;">JUMLAH BIAYA FISIK LANGSUNG</td>' +
        '<td style="text-align: right; padding: 8px; border: 1px solid #94a3b8;">' + Utils.formatRupiah(p.totalDirectCost) + '</td>' +
        '</tr>' +
        '<tr style="font-weight: bold; background: #f8fafc;">' +
        '<td colspan="6" style="text-align: right; padding: 8px; border: 1px solid #94a3b8;">PAJAK PERTAMBAHAN NILAI (PPN ' + p.info.ppnPercent + '%)</td>' +
        '<td style="text-align: right; padding: 8px; border: 1px solid #94a3b8;">' + Utils.formatRupiah(p.ppnAmount) + '</td>' +
        '</tr>' +
        '<tr style="font-weight: bold; background: #e2e8f0; font-size: 10.5pt;">' +
        '<td colspan="6" style="text-align: right; padding: 10px; border: 1px solid #94a3b8;">TOTAL NILAI KONTRAK (TERMASUK PPN)</td>' +
        '<td style="text-align: right; padding: 10px; border: 1px solid #94a3b8; color: #0f172a;">' + Utils.formatRupiah(p.grandTotal) + '</td>' +
        '</tr>' +
        '</tfoot>' +
        '</table>' +
        '<div style="margin-top: 15px; padding: 10px; border: 1px solid #cbd5e1; background: #f8fafc; font-size: 9.5pt;">' +
        '<strong>Terbilang:</strong> <em>' + Utils.terbilang(p.grandTotal) + ' Rupiah</em>' +
        '</div>' +
        '<div style="margin-top: 30px; display: flex; justify-content: space-between; page-break-inside: avoid;">' +
        '<div style="text-align: center; width: 45%;">' +
        '<div>Disetujui Oleh:</div>' +
        '<div style="font-weight: bold; margin-bottom: 50px;">PEJABAT PEMBUAT KOMITMEN (PPK)</div>' +
        '<div style="font-weight: bold; text-decoration: underline;">' + p.info.ppk + '</div>' +
        '<div>NIP. ' + p.info.nipPpk + '</div>' +
        '</div>' +
        '<div style="text-align: center; width: 45%;">' +
        '<div>Dibuat Oleh:</div>' +
        '<div style="font-weight: bold; margin-bottom: 50px;">KONTRAKTOR PELAKSANA</div>' +
        '<div style="font-weight: bold; text-decoration: underline;">DIREKTUR UTAMA</div>' +
        '<div>' + p.info.contractor + '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    }

    generateVolumeHtml(proj = null) {
      const p = proj || this.rabEngine.project;
      let rowsHtml = '';

      p.divisions.forEach((div) => {
        rowsHtml += '<tr style="background:#f1f5f9; font-weight:bold;">' +
          '<td style="text-align:center; padding:6px; border:1px solid #cbd5e1;">' + div.code + '</td>' +
          '<td colspan="9" style="padding:6px; border:1px solid #cbd5e1;">' + div.name + '</td>' +
          '</tr>';

        div.items.forEach((it, idx) => {
          const b = it.boq_backup || { panjang: it.volume, lebar: 1, tinggi: 1, faktor: 1, rumusTitle: '-', steps: '-' };
          rowsHtml += '<tr>' +
            '<td style="text-align:center; padding:5px; border:1px solid #cbd5e1;">' + (idx + 1) + '</td>' +
            '<td style="padding:5px; border:1px solid #cbd5e1;">' + it.name + '</td>' +
            '<td style="text-align:center; font-family:monospace; padding:5px; border:1px solid #cbd5e1;">' + (it.ahspCode || '-') + '</td>' +
            '<td style="text-align:right; font-weight:bold; padding:5px; border:1px solid #cbd5e1;">' + Utils.formatNumber(it.volume, 2) + '</td>' +
            '<td style="text-align:center; padding:5px; border:1px solid #cbd5e1;">' + Utils.formatUnitHtml(it.unit) + '</td>' +
            '<td style="text-align:right; padding:5px; border:1px solid #cbd5e1;">' + Utils.formatNumber(b.panjang || 0, 2) + '</td>' +
            '<td style="text-align:right; padding:5px; border:1px solid #cbd5e1;">' + Utils.formatNumber(b.lebar || 0, 2) + '</td>' +
            '<td style="text-align:right; padding:5px; border:1px solid #cbd5e1;">' + Utils.formatNumber(b.tinggi || 0, 2) + '</td>' +
            '<td style="text-align:right; padding:5px; border:1px solid #cbd5e1;">' + Utils.formatNumber(b.faktor || 1, 2) + '</td>' +
            '<td style="padding:5px; border:1px solid #cbd5e1; font-size:9pt; color:#475569;">' + (b.steps || b.rumusTitle || '-') + '</td>' +
            '</tr>';
        });
      });

      return '<div style="font-family: Arial, sans-serif; font-size: 10pt; color: #000; padding: 15px;">' +
        '<div style="text-align: center; margin-bottom: 20px;">' +
        '<h3 style="margin: 0; font-size: 13pt; text-transform: uppercase; font-weight: bold;">BACKUP DATA PERHITUNGAN VOLUME PEKERJAAN (BOQ)</h3>' +
        '<h4 style="margin: 4px 0 0 0; font-size: 10.5pt; text-transform: uppercase; font-weight: bold;">PEKERJAAN: ' + p.info.name + '</h4>' +
        '<h5 style="margin: 2px 0 0 0; font-size: 9.5pt; font-weight: normal;">LOKASI: ' + p.info.location + ' &bull; TAHUN: ' + p.info.year + '</h5>' +
        '</div>' +
        '<table style="width: 100%; border-collapse: collapse; font-size: 9pt;">' +
        '<thead>' +
        '<tr style="background: #e2e8f0; font-weight: bold; text-align: center;">' +
        '<th style="width: 35px; padding: 6px; border: 1px solid #94a3b8;">NO</th>' +
        '<th style="padding: 6px; border: 1px solid #94a3b8;">URAIAN PEKERJAAN</th>' +
        '<th style="width: 90px; padding: 6px; border: 1px solid #94a3b8;">KODE AHSP</th>' +
        '<th style="width: 75px; padding: 6px; border: 1px solid #94a3b8;">VOL TOTAL</th>' +
        '<th style="width: 50px; padding: 6px; border: 1px solid #94a3b8;">SAT</th>' +
        '<th style="width: 65px; padding: 6px; border: 1px solid #94a3b8;">PANJANG (m)</th>' +
        '<th style="width: 65px; padding: 6px; border: 1px solid #94a3b8;">LEBAR (m)</th>' +
        '<th style="width: 65px; padding: 6px; border: 1px solid #94a3b8;">TINGGI (m)</th>' +
        '<th style="width: 55px; padding: 6px; border: 1px solid #94a3b8;">FAKTOR</th>' +
        '<th style="width: 190px; padding: 6px; border: 1px solid #94a3b8;">CATATAN RUMUS / DIMENSI</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' + rowsHtml + '</tbody>' +
        '</table>' +
        '</div>';
    }

    generateAnalisaHtml(proj = null) {
      const p = proj || this.rabEngine.project;
      let tablesHtml = '';
      let itemIndex = 1;

      const cellStyle = 'padding:6px 8px; border:1px solid #cbd5e1;';
      const cellR     = cellStyle + 'text-align:right; font-family:monospace;';
      const cellC     = cellStyle + 'text-align:center; font-family:monospace;';
      const cellBoldR = cellStyle + 'text-align:right; font-family:monospace; font-weight:bold;';

      p.divisions.forEach(div => {
        div.items.forEach(it => {
          const ahsp = this.ahspEngine.getAhspWithComponents(it.ahspCode, it.name, it.unit, it.unitPrice);
          const comps = ahsp.components || [];

          const tenagaComps = comps.filter(c => c.jenis === 'tenaga');
          const bahanComps  = comps.filter(c => c.jenis === 'bahan');
          const alatComps   = comps.filter(c => c.jenis === 'alat');

          let totalTenaga = 0, totalBahan = 0, totalAlat = 0;
          let compRows = '';

          // A. TENAGA KERJA
          if (tenagaComps.length > 0) {
            compRows += '<tr style="background:#eff6ff;"><td colspan="6" style="' + cellStyle + 'padding:6px 10px; font-weight:bold; color:#1d4ed8; font-size:9.5pt;">A. TENAGA KERJA</td></tr>';
            tenagaComps.forEach((c, ci) => {
              const jml = c.jumlah_harga || (c.koefisien * c.harga_satuan) || 0;
              totalTenaga += jml;
              compRows += '<tr>' +
                '<td style="' + cellC + '">' + (ci + 1) + '</td>' +
                '<td style="' + cellStyle + '">' + (c.uraian || '-') + '</td>' +
                '<td style="' + cellC + '">' + Utils.formatUnitBadge(c.satuan || 'OH') + '</td>' +
                '<td style="' + cellR + '">' + Utils.formatNumber(c.koefisien || 0, 4) + '</td>' +
                '<td style="' + cellR + '">' + Utils.formatRupiah(c.harga_satuan || 0) + '</td>' +
                '<td style="' + cellBoldR + '">' + Utils.formatRupiah(jml) + '</td>' +
                '</tr>';
            });
            compRows += '<tr style="background:#dbeafe;"><td colspan="5" style="' + cellStyle + 'text-align:right; padding:6px 10px; font-weight:bold; color:#1d4ed8;">Jumlah Tenaga Kerja (A):</td>' +
              '<td style="' + cellBoldR + 'color:#1d4ed8;">' + Utils.formatRupiah(totalTenaga) + '</td></tr>';
          }

          // B. BAHAN / MATERIAL
          if (bahanComps.length > 0) {
            compRows += '<tr style="background:#f0fdf4;"><td colspan="6" style="' + cellStyle + 'padding:6px 10px; font-weight:bold; color:#166534; font-size:9.5pt;">B. BAHAN / MATERIAL</td></tr>';
            bahanComps.forEach((c, ci) => {
              const jml = c.jumlah_harga || (c.koefisien * c.harga_satuan) || 0;
              totalBahan += jml;
              compRows += '<tr>' +
                '<td style="' + cellC + '">' + (ci + 1) + '</td>' +
                '<td style="' + cellStyle + '">' + (c.uraian || '-') + '</td>' +
                '<td style="' + cellC + '">' + Utils.formatUnitBadge(c.satuan || '-') + '</td>' +
                '<td style="' + cellR + '">' + Utils.formatNumber(c.koefisien || 0, 4) + '</td>' +
                '<td style="' + cellR + '">' + Utils.formatRupiah(c.harga_satuan || 0) + '</td>' +
                '<td style="' + cellBoldR + '">' + Utils.formatRupiah(jml) + '</td>' +
                '</tr>';
            });
            compRows += '<tr style="background:#dcfce7;"><td colspan="5" style="' + cellStyle + 'text-align:right; padding:6px 10px; font-weight:bold; color:#166534;">Jumlah Bahan (B):</td>' +
              '<td style="' + cellBoldR + 'color:#166534;">' + Utils.formatRupiah(totalBahan) + '</td></tr>';
          }

          // C. PERALATAN
          if (alatComps.length > 0) {
            compRows += '<tr style="background:#fffbeb;"><td colspan="6" style="' + cellStyle + 'padding:6px 10px; font-weight:bold; color:#92400e; font-size:9.5pt;">C. PERALATAN</td></tr>';
            alatComps.forEach((c, ci) => {
              const jml = c.jumlah_harga || (c.koefisien * c.harga_satuan) || 0;
              totalAlat += jml;
              compRows += '<tr>' +
                '<td style="' + cellC + '">' + (ci + 1) + '</td>' +
                '<td style="' + cellStyle + '">' + (c.uraian || '-') + '</td>' +
                '<td style="' + cellC + '">' + Utils.formatUnitBadge(c.satuan || '-') + '</td>' +
                '<td style="' + cellR + '">' + Utils.formatNumber(c.koefisien || 0, 4) + '</td>' +
                '<td style="' + cellR + '">' + Utils.formatRupiah(c.harga_satuan || 0) + '</td>' +
                '<td style="' + cellBoldR + '">' + Utils.formatRupiah(jml) + '</td>' +
                '</tr>';
            });
            compRows += '<tr style="background:#fef9c3;"><td colspan="5" style="' + cellStyle + 'text-align:right; padding:6px 10px; font-weight:bold; color:#92400e;">Jumlah Peralatan (C):</td>' +
              '<td style="' + cellBoldR + 'color:#92400e;">' + Utils.formatRupiah(totalAlat) + '</td></tr>';
          } else {
            compRows += '<tr style="background:#fafafa;"><td colspan="6" style="' + cellStyle + 'color:#94a3b8; font-style:italic; font-size:8.5pt;">C. Peralatan: -</td></tr>';
          }

          const biayaLangsung = totalTenaga + totalBahan + totalAlat;
          const overhead = ahsp.overhead || Math.round(biayaLangsung * 0.10);
          const hspFinal = ahsp.hsp_final || (biayaLangsung + overhead);

          compRows += '<tr style="background:#f1f5f9; font-weight:bold;"><td colspan="5" style="' + cellStyle + 'text-align:right;">D. Jumlah Biaya Langsung (A+B+C):</td>' +
            '<td style="' + cellBoldR + '">' + Utils.formatRupiah(biayaLangsung) + '</td></tr>' +
            '<tr style="background:#f8fafc;"><td colspan="5" style="' + cellStyle + 'text-align:right;">E. Biaya Umum &amp; Keuntungan (10% &times; D):</td>' +
            '<td style="' + cellR + '">' + Utils.formatRupiah(overhead) + '</td></tr>';

          const cleanItemTitle = (ahsp.nama || it.name || '').replace(/fâ€™c|fÂ€™c|fÃ¢â‚¬â„¢c/g, "f'c");

          tablesHtml += '<div style="margin-bottom: 24px; page-break-inside: avoid; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden; background: #fff;">' +
            '<div style="background:#f8fafc; padding:10px 14px; border-bottom:1px solid #cbd5e1;">' +
            '<div style="font-size:8pt; color:#64748b; margin-bottom:2px;">Standar: <strong>SE Bina Konstruksi No 47 Tahun 2026</strong></div>' +
            '<div style="font-size:10.5pt; font-weight:800; color:#0f172a;">' + itemIndex + '. [' + ahsp.kode + '] ' + cleanItemTitle + '</div>' +
            '<div style="font-size:8.5pt; color:#0284c7; margin-top:2px;">Satuan: <strong>1 ' + Utils.formatUnitPlain(ahsp.sat) + '</strong> &nbsp;&middot;&nbsp; Divisi: <strong>' + (ahsp.divisi || div.name || '-') + '</strong></div>' +
            '</div>' +
            '<table style="width: 100%; border-collapse: collapse; font-size: 9pt;">' +
            '<thead>' +
            '<tr style="background:#f1f5f9; text-align:center; font-weight:bold;">' +
            '<th style="width:40px; padding:6px; border:1px solid #cbd5e1;">No</th>' +
            '<th style="padding:6px; border:1px solid #cbd5e1; text-align:left;">Uraian Komponen</th>' +
            '<th style="width:60px; padding:6px; border:1px solid #cbd5e1;">Sat</th>' +
            '<th style="width:90px; padding:6px; border:1px solid #cbd5e1; text-align:right;">Koefisien</th>' +
            '<th style="width:130px; padding:6px; border:1px solid #cbd5e1; text-align:right;">Harga Satuan (Rp)</th>' +
            '<th style="width:140px; padding:6px; border:1px solid #cbd5e1; text-align:right;">Jumlah Harga (Rp)</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>' + compRows + '</tbody>' +
            '<tfoot>' +
            '<tr style="background:#e0f2fe; font-weight:bold; font-size:10pt;">' +
            '<td colspan="5" style="' + cellStyle + 'text-align:right; color:#0369a1; padding:8px 10px;">F. HARGA SATUAN PEKERJAAN / HSP (D + E):</td>' +
            '<td style="' + cellBoldR + 'color:#0369a1; font-size:10.5pt; padding:8px 10px;">' + Utils.formatRupiah(hspFinal) + '</td>' +
            '</tr>' +
            '</tfoot>' +
            '</table>' +
            '</div>';

          itemIndex++;
        });
      });

      return '<div style="font-family: Arial, sans-serif; font-size: 10pt; color: #000; padding: 15px;">' +
        '<div style="text-align: center; margin-bottom: 20px;">' +
        '<h3 style="margin: 0; font-size: 13pt; text-transform: uppercase; font-weight: bold;">DAFTAR ANALISA HARGA SATUAN PEKERJAAN (AHSP) TERPILIH</h3>' +
        '<h4 style="margin: 4px 0 0 0; font-size: 10.5pt; text-transform: uppercase; font-weight: bold;">STANDAR SE BINA KONSTRUKSI NO 47 / TAHUN 2026</h4>' +
        '<h5 style="margin: 2px 0 0 0; font-size: 9.5pt; font-weight: normal;">PEKERJAAN: ' + p.info.name + ' &bull; LOKASI: ' + p.info.location + '</h5>' +
        '</div>' +
        tablesHtml +
        '</div>';
    }


    generateUpahHtml(proj = null) {
      const p = proj || this.rabEngine.project;

      // ── Kumpulkan tenaga unik dari AHSP yang dipakai di BOQ ─────────────
      const upahMap = new Map(); // key = lower(uraian) → { uraian, satuan, harga_satuan }

      p.divisions.forEach(div => {
        div.items.forEach(boqItem => {
          const ahsp = this.ahspEngine.getAhspWithComponents(boqItem.ahspCode, boqItem.name, boqItem.unit, boqItem.unitPrice);
          if (!ahsp) return;
          (ahsp.components || [])
            .filter(c => c.jenis === 'tenaga')
            .forEach(c => {
              const key = (c.uraian || '').toLowerCase().trim();
              if (!key || key.length < 2) return;
              if (!upahMap.has(key)) {
                upahMap.set(key, {
                  uraian:   c.uraian || '-',
                  satuan:   c.satuan || 'OH',
                  harga:    c.harga_satuan || 0
                });
              } else if (c.harga_satuan > 0 && upahMap.get(key).harga === 0) {
                // update harga jika sebelumnya 0
                upahMap.get(key).harga = c.harga_satuan;
              }
            });
        });
      });

      // Urutkan abjad
      const upahList = Array.from(upahMap.values())
        .sort((a, b) => a.uraian.localeCompare(b.uraian, 'id'));

      // ── Fallback jika tidak ada item BOQ berAHSP ────────────────────────
      const isEmpty = upahList.length === 0;
      const rows = isEmpty
        ? '<tr><td colspan="5" style="padding:2rem; text-align:center; color:#94a3b8;">' +
          'Belum ada item pekerjaan dengan kode AHSP yang dipilih di BOQ.</td></tr>'
        : upahList.map((u, i) =>
            '<tr>' +
            '<td style="text-align:center; padding:6px; border:1px solid #cbd5e1;">' + (i + 1) + '</td>' +
            '<td style="text-align:center; font-family:monospace; padding:6px; border:1px solid #cbd5e1; font-size:9pt;">L.' + String(i + 1).padStart(2, '0') + '</td>' +
            '<td style="padding:6px; border:1px solid #cbd5e1; font-weight:bold;">' + u.uraian + '</td>' +
            '<td style="text-align:center; padding:6px; border:1px solid #cbd5e1;">' + u.satuan + '</td>' +
            '<td style="text-align:right; font-family:monospace; font-weight:700; padding:6px; border:1px solid #cbd5e1; color:#0369a1;">' + Utils.formatRupiah(u.harga) + '</td>' +
            '</tr>'
          ).join('');

      return '<div style="font-family: Arial, sans-serif; font-size: 10pt; color: #000; padding: 15px;">' +
        '<div style="text-align: center; margin-bottom: 20px;">' +
        '<h3 style="margin: 0; font-size: 13pt; text-transform: uppercase; font-weight: bold;">DAFTAR STANDAR SATUAN UPAH TENAGA KERJA</h3>' +
        '<h4 style="margin: 4px 0 0 0; font-size: 10.5pt; text-transform: uppercase; font-weight: bold;">' + p.info.location + ' - TAHUN ANGGARAN ' + p.info.year + '</h4>' +
        '<p style="margin:6px 0 0 0; font-size:9pt; color:#475569;">Diambil dari: ' + p.info.name + ' &mdash; berdasarkan komponen AHSP SE Bina Konstruksi No 47 / 2026</p>' +
        '</div>' +
        '<table style="width: 100%; border-collapse: collapse; font-size: 9.5pt;">' +
        '<thead>' +
        '<tr style="background:#dbeafe; text-align:center; font-weight:bold; color:#1e40af;">' +
        '<th style="width:40px; padding:8px; border:1px solid #94a3b8;">NO</th>' +
        '<th style="width:80px; padding:8px; border:1px solid #94a3b8;">KODE</th>' +
        '<th style="padding:8px; border:1px solid #94a3b8;">JENIS TENAGA KERJA</th>' +
        '<th style="width:60px; padding:8px; border:1px solid #94a3b8;">SATUAN</th>' +
        '<th style="width:145px; padding:8px; border:1px solid #94a3b8;">UPAH HARIAN (Rp)</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' + rows + '</tbody>' +
        '</table>' +
        '</div>';
    }

    generateBahanHtml(proj = null) {
      const p = proj || this.rabEngine.project;

      // ── Kumpulkan bahan unik dari AHSP yang dipakai di BOQ ───────────────
      const bahanMap = new Map(); // key = lower(uraian) → { uraian, satuan, harga_satuan }

      p.divisions.forEach(div => {
        div.items.forEach(boqItem => {
          const ahsp = this.ahspEngine.getAhspWithComponents(boqItem.ahspCode, boqItem.name, boqItem.unit, boqItem.unitPrice);
          if (!ahsp) return;
          (ahsp.components || [])
            .filter(c => c.jenis === 'bahan')
            .forEach(c => {
              const key = (c.uraian || '').toLowerCase().trim();
              if (!key || key.length < 2) return;
              if (!bahanMap.has(key)) {
                bahanMap.set(key, {
                  uraian: c.uraian || '-',
                  satuan: c.satuan || '-',
                  harga:  c.harga_satuan || 0
                });
              } else if (c.harga_satuan > 0 && bahanMap.get(key).harga === 0) {
                bahanMap.get(key).harga = c.harga_satuan;
              }
            });
        });
      });

      // Urutkan abjad
      const bahanList = Array.from(bahanMap.values())
        .sort((a, b) => a.uraian.localeCompare(b.uraian, 'id'));

      // ── Fallback jika tidak ada BOQ ──────────────────────────────────────
      const isEmpty = bahanList.length === 0;
      const cs = 'padding:6px; border:1px solid #cbd5e1;';
      const cr = cs + 'text-align:right; font-family:monospace;';
      const cc = cs + 'text-align:center;';

      const rowsHtml = isEmpty
        ? '<tr><td colspan="7" style="' + cs + 'text-align:center; color:#94a3b8; padding:2rem;">' +
          'Belum ada item pekerjaan dengan kode AHSP yang dipilih di BOQ.</td></tr>'
        : bahanList.map((b, i) =>
            '<tr>' +
            '<td style="' + cc + '">' + (i + 1) + '</td>' +
            '<td style="' + cs + 'font-weight:bold;">' + b.uraian + '</td>' +
            '<td style="' + cc + '">' + Utils.formatUnitHtml(b.satuan) + '</td>' +
            '<td style="' + cr + '">' + Utils.formatRupiah(b.harga) + '</td>' +
            '<td style="' + cs + 'font-size:9pt; color:#475569;">Sesuai lokasi proyek</td>' +
            '<td style="' + cr + '">Rp 0</td>' +
            '<td style="' + cr + 'font-weight:bold; color:#0369a1;">' + Utils.formatRupiah(b.harga) + '</td>' +
            '</tr>'
          ).join('');

      return '<div style="font-family: Arial, sans-serif; font-size: 10pt; color: #000; padding: 15px;">' +
        '<div style="text-align: center; margin-bottom: 20px;">' +
        '<h3 style="margin: 0; font-size: 13pt; text-transform: uppercase; font-weight: bold;">DAFTAR HARGA SATUAN BAHAN, MATERIAL &amp; TRANSPORTASI</h3>' +
        '<h4 style="margin: 4px 0 0 0; font-size: 10.5pt; text-transform: uppercase; font-weight: bold;">' + p.info.location + ' - TAHUN ANGGARAN ' + p.info.year + '</h4>' +
        '<p style="margin:6px 0 0 0; font-size:9pt; color:#475569;">Diambil dari: ' + p.info.name + ' &mdash; berdasarkan komponen AHSP SE Bina Konstruksi No 47 / 2026</p>' +
        '</div>' +
        '<table style="width: 100%; border-collapse: collapse; font-size: 9pt;">' +
        '<thead>' +
        '<tr style="background:#dcfce7; text-align:center; font-weight:bold; color:#166534;">' +
        '<th style="width:35px; padding:6px; border:1px solid #94a3b8;">NO</th>' +
        '<th style="padding:6px; border:1px solid #94a3b8;">NAMA BAHAN / MATERIAL</th>' +
        '<th style="width:50px; padding:6px; border:1px solid #94a3b8;">SAT</th>' +
        '<th style="width:115px; padding:6px; border:1px solid #94a3b8;">HARGA POKOK</th>' +
        '<th style="width:140px; padding:6px; border:1px solid #94a3b8;">SUMBER / QUARRY</th>' +
        '<th style="width:105px; padding:6px; border:1px solid #94a3b8;">BIAYA ANGKUT</th>' +
        '<th style="width:130px; padding:6px; border:1px solid #94a3b8;">HARGA TOTAL DI LOKASI</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' + rowsHtml + '</tbody>' +
        '</table>' +
        '</div>';
    }

    // =====================================================================
    // REKAP KEBUTUHAN BAHAN & TENAGA DARI AHSP TERPILIH
    // Aggregates component quantities × BOQ volume for each selected AHSP
    // =====================================================================
    generateRekkapKebutuhanHtml(proj = null, jenis = 'bahan') {
      const p = proj || this.rabEngine.project;
      const aggr = new Map(); // key = "uraian||satuan" => { uraian, satuan, totalQty, totalHarga, listItem }

      p.divisions.forEach(div => {
        div.items.forEach(boqItem => {
          const volume = Number(boqItem.volume || boqItem.qty || 0);
          if (volume <= 0) return;

          const ahsp = this.ahspEngine.getAhspWithComponents(boqItem.ahspCode, boqItem.name, boqItem.unit, boqItem.unitPrice);
          if (!ahsp || !ahsp.components || ahsp.components.length === 0) return;

          ahsp.components
            .filter(c => c.jenis === jenis)
            .forEach(c => {
              const key = (c.uraian || '').trim() + '||' + (c.satuan || '-');
              const qty  = (c.koefisien || 0) * volume;
              const hrgTotal = (c.harga_satuan || 0) * qty;

              if (!aggr.has(key)) {
                aggr.set(key, {
                  uraian:    c.uraian || '-',
                  satuan:    c.satuan || '-',
                  hrg_sat:   c.harga_satuan || 0,
                  totalQty:  0,
                  totalHarga:0,
                  listItem:  []
                });
              }
              const entry = aggr.get(key);
              entry.totalQty   += qty;
              entry.totalHarga += hrgTotal;
              entry.listItem.push(boqItem.name || boqItem.nama || ahsp.kode);
            });
        });
      });

      if (aggr.size === 0) {
        return '<div style="text-align:center; padding:3rem; color:#94a3b8;">' +
          '<div style="font-size:2.5rem; margin-bottom:0.75rem;">' + (jenis === 'bahan' ? '🧱' : '👷') + '</div>' +
          '<p style="font-size:1rem; font-weight:600;">Belum ada item AHSP dengan komponen ' + (jenis === 'bahan' ? 'bahan material' : 'tenaga kerja') + ' yang terpilih.</p>' +
          '<p style="font-size:0.85rem; color:#64748b;">Tambahkan item BOQ dengan kode AHSP yang memiliki rincian komponen.</p>' +
          '</div>';
      }

      const title = jenis === 'bahan'
        ? 'REKAPITULASI KEBUTUHAN BAHAN / MATERIAL'
        : 'REKAPITULASI KEBUTUHAN TENAGA KERJA';
      const color = jenis === 'bahan' ? '#166534' : '#0369a1';
      const bgHead = jenis === 'bahan' ? '#dcfce7' : '#dbeafe';

      const cs = 'padding:5px 8px; border:1px solid #cbd5e1;';
      const cr = cs + 'text-align:right;';
      const cc = cs + 'text-align:center;';

      let rows = '';
      let grand = 0;
      let idx = 0;
      aggr.forEach(entry => {
        idx++;
        grand += entry.totalHarga;
        rows += '<tr>' +
          '<td style="' + cc + '">' + idx + '</td>' +
          '<td style="' + cs + 'font-weight:600;">' + entry.uraian + '</td>' +
          '<td style="' + cc + '">' + entry.satuan + '</td>' +
          '<td style="' + cr + 'font-family:monospace;">' + Utils.formatNumber(entry.totalQty, 4) + '</td>' +
          '<td style="' + cr + 'font-family:monospace;">' + Utils.formatRupiah(entry.hrg_sat) + '</td>' +
          '<td style="' + cr + 'font-family:monospace; font-weight:700;">' + Utils.formatRupiah(entry.totalHarga) + '</td>' +
          '</tr>';
      });

      rows += '<tr style="background:' + bgHead + '; font-weight:bold;">' +
        '<td colspan="5" style="' + cr + 'color:' + color + '; font-size:10pt;">JUMLAH TOTAL:</td>' +
        '<td style="' + cr + 'color:' + color + '; font-family:monospace; font-size:10pt;">' + Utils.formatRupiah(grand) + '</td>' +
        '</tr>';

      return '<div style="font-family:Arial,sans-serif; font-size:9pt; color:#000;">' +
        '<div style="text-align:center; margin-bottom:16px;">' +
        '<h3 style="margin:0; font-size:12pt; font-weight:bold; color:' + color + ';">' + title + '</h3>' +
        '<h4 style="margin:4px 0 0 0; font-size:9.5pt; font-weight:normal;">Pekerjaan: ' + p.info.name + ' &bull; Lokasi: ' + p.info.location + '</h4>' +
        '</div>' +
        '<table style="width:100%; border-collapse:collapse; font-size:9pt;">' +
        '<thead>' +
        '<tr style="background:' + bgHead + '; text-align:center; font-weight:bold; color:' + color + ';">' +
        '<th style="width:35px; padding:6px; border:1px solid #94a3b8;">NO</th>' +
        '<th style="padding:6px; border:1px solid #94a3b8;">' + (jenis === 'bahan' ? 'NAMA BAHAN / MATERIAL' : 'NAMA TENAGA KERJA') + '</th>' +
        '<th style="width:60px; padding:6px; border:1px solid #94a3b8;">SAT</th>' +
        '<th style="width:110px; padding:6px; border:1px solid #94a3b8;">TOTAL VOLUME</th>' +
        '<th style="width:120px; padding:6px; border:1px solid #94a3b8;">HARGA SATUAN (Rp)</th>' +
        '<th style="width:140px; padding:6px; border:1px solid #94a3b8;">JUMLAH HARGA (Rp)</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' + rows + '</tbody>' +
        '</table>' +
        '</div>';
    }

    generateAllDocsHtml(proj = null) {
      const p = proj || this.rabEngine.project;
      return '<div class="print-bundle-wrapper">' +
        this.generateRabHtml(p) +
        '<div style="page-break-before: always; margin-top: 30px; border-top: 2px dashed #cbd5e1; padding-top: 20px;"></div>' +
        this.generateVolumeHtml(p) +
        '<div style="page-break-before: always; margin-top: 30px; border-top: 2px dashed #cbd5e1; padding-top: 20px;"></div>' +
        this.generateAnalisaHtml(p) +
        '<div style="page-break-before: always; margin-top: 30px; border-top: 2px dashed #cbd5e1; padding-top: 20px;"></div>' +
        this.generateUpahHtml(p) +
        '<div style="page-break-before: always; margin-top: 30px; border-top: 2px dashed #cbd5e1; padding-top: 20px;"></div>' +
        this.generateBahanHtml(p) +
        '</div>';
    }

    openPreviewModal(type, title) {
      const p = this.rabEngine.project;
      let html = '';

      if (type === 'rab') html = this.generateRabHtml(p);
      else if (type === 'vol') html = this.generateVolumeHtml(p);
      else if (type === 'analisa') html = this.generateAnalisaHtml(p);
      else if (type === 'upah') html = this.generateUpahHtml(p);
      else if (type === 'bahan') html = this.generateBahanHtml(p);
      else if (type === 'all') html = this.generateAllDocsHtml(p);

      const titleEl = document.getElementById('printDocumentPreviewTitle');
      if (titleEl) titleEl.textContent = title || 'Pratinjau Dokumen Resmi';

      const bodyEl = document.getElementById('printDocumentPreviewBody');
      if (bodyEl) bodyEl.innerHTML = html;

      const modal = document.getElementById('modalPrintDocument');
      if (modal) modal.classList.add('active');
    }

    exportSingleExcel(type, fileName = 'Dokumen') {
      const p = this.rabEngine.project;
      let html = '';
      let sheetName = 'Sheet1';

      if (type === 'rab') {
        html = this.generateRabHtml(p);
        sheetName = '1. RAB Proyek';
      } else if (type === 'vol') {
        html = this.generateVolumeHtml(p);
        sheetName = '2. Backup BOQ';
      } else if (type === 'analisa') {
        html = this.generateAnalisaHtml(p);
        sheetName = '3. Analisa AHSP';
      } else if (type === 'upah') {
        html = this.generateUpahHtml(p);
        sheetName = '4. Standar Upah';
      } else if (type === 'bahan') {
        html = this.generateBahanHtml(p);
        sheetName = '5. Standar Bahan';
      }

      const xml = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
        '<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8">' +
        '<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>' + sheetName + '</x:Name><x:WorksheetSource HRef="#sheet_1"/></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->' +
        '</head><body><div id="sheet_1">' + html + '</div></body></html>';

      const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName + '.xls';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    exportMultiSheetExcel() {
      const p = this.rabEngine.project;
      const rabHtml = this.generateRabHtml(p);
      const volHtml = this.generateVolumeHtml(p);
      const analisaHtml = this.generateAnalisaHtml(p);
      const upahHtml = this.generateUpahHtml(p);
      const bahanHtml = this.generateBahanHtml(p);

      const xmlContent = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
        '<head>' +
        '<!--[if gte mso 9]>' +
        '<xml>' +
        '<x:ExcelWorkbook>' +
        '<x:ExcelWorksheets>' +
        '<x:ExcelWorksheet><x:Name>1. RAB Proyek</x:Name><x:WorksheetSource HRef="#sheet_rab"/></x:ExcelWorksheet>' +
        '<x:ExcelWorksheet><x:Name>2. Backup Data Volume</x:Name><x:WorksheetSource HRef="#sheet_vol"/></x:ExcelWorksheet>' +
        '<x:ExcelWorksheet><x:Name>3. Analisa AHSP 2026</x:Name><x:WorksheetSource HRef="#sheet_analisa"/></x:ExcelWorksheet>' +
        '<x:ExcelWorksheet><x:Name>4. Standar Upah Kerja</x:Name><x:WorksheetSource HRef="#sheet_upah"/></x:ExcelWorksheet>' +
        '<x:ExcelWorksheet><x:Name>5. Standar Bahan Quarry</x:Name><x:WorksheetSource HRef="#sheet_bahan"/></x:ExcelWorksheet>' +
        '</x:ExcelWorksheets>' +
        '</x:ExcelWorkbook>' +
        '</xml>' +
        '<![endif]-->' +
        '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">' +
        '</head>' +
        '<body>' +
        '<div id="sheet_rab">' + rabHtml + '</div>' +
        '<br style="page-break-before:always;">' +
        '<div id="sheet_vol">' + volHtml + '</div>' +
        '<br style="page-break-before:always;">' +
        '<div id="sheet_analisa">' + analisaHtml + '</div>' +
        '<br style="page-break-before:always;">' +
        '<div id="sheet_upah">' + upahHtml + '</div>' +
        '<br style="page-break-before:always;">' +
        '<div id="sheet_bahan">' + bahanHtml + '</div>' +
        '</body>' +
        '</html>';

      const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'DOKUMEN_PROYEK_' + p.info.name.replace(/[^a-zA-Z0-9]/g, '_') + '_2026.xls';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }

  // --- MAIN SIPRO APPLICATION CONTROLLER ---
  class SiproApp {
    constructor() {
      this.ahspEngine = new AhspEngine();
      this.rabEngine = new RabEngine(this.ahspEngine);
      this.scheduleEngine = new ScheduleEngine(this.rabEngine);
      this.scurveChart = new SCurveChart(this.rabEngine, this.scheduleEngine);
      this.boqEngine = new BoqEngine(this.rabEngine);
      this.exportManager = new OfficialDocExportManager(this.rabEngine, this.ahspEngine);

      this.currentView = 'dashboard';
      this.dbCurrentPage = 1;
      this.dbPageSize = 50;

      this.initDom();
      this.initEvents();
      this.initAuthPortal();
      this.initSettingsManager();
      this.render();
    }

    initDom() {
      this.populateAhspDivisionFilter();
      this.populateOpnameWeekSelect();

      // Check logged-in user info from auth system
      try {
        const userInfoStr = localStorage.getItem('user_info');
        const topbarUserName = document.getElementById('topbarUserName');
        if (userInfoStr && topbarUserName) {
          const user = JSON.parse(userInfoStr);
          if (user && user.name) {
            topbarUserName.textContent = user.name;
          }
        }
      } catch (e) {}
    }

    initEvents() {
      // Mobile sidebar toggle handlers
      const btnToggleMobile = document.getElementById('btnToggleMobileSidebar');
      const btnCloseSidebarMobile = document.getElementById('btnCloseSidebarMobile');
      const sidebarMobileBackdrop = document.getElementById('sidebarMobileBackdrop');
      const appSidebar = document.getElementById('appSidebar');

      const toggleMobileSidebar = (open) => {
        if (!appSidebar) return;
        if (open) {
          appSidebar.classList.add('mobile-open');
          if (sidebarMobileBackdrop) sidebarMobileBackdrop.classList.add('active');
        } else {
          appSidebar.classList.remove('mobile-open');
          if (sidebarMobileBackdrop) sidebarMobileBackdrop.classList.remove('active');
        }
      };

      if (btnToggleMobile) {
        btnToggleMobile.addEventListener('click', (e) => {
          e.preventDefault();
          toggleMobileSidebar(true);
        });
      }

      if (btnCloseSidebarMobile) {
        btnCloseSidebarMobile.addEventListener('click', (e) => {
          e.preventDefault();
          toggleMobileSidebar(false);
        });
      }

      if (sidebarMobileBackdrop) {
        sidebarMobileBackdrop.addEventListener('click', () => {
          toggleMobileSidebar(false);
        });
      }

      // Desktop/Tablet Sidebar Collapse Toggle (Minimalkan ke kiri & ikon kecil)
      const btnToggleSidebarCollapse = document.getElementById('btnToggleSidebarCollapse');
      const isCollapsedPref = localStorage.getItem('sipro_sidebar_collapsed') === 'true';
      if (isCollapsedPref && appSidebar) {
        appSidebar.classList.add('is-collapsed');
      }

      if (btnToggleSidebarCollapse && appSidebar) {
        btnToggleSidebarCollapse.addEventListener('click', (e) => {
          e.preventDefault();
          const isCollapsed = appSidebar.classList.toggle('is-collapsed');
          localStorage.setItem('sipro_sidebar_collapsed', isCollapsed ? 'true' : 'false');
        });
      }

      const handleLogout = async (e) => {
        if (e) e.preventDefault();
        if (confirm('Apakah Anda yakin ingin keluar dari akun?')) {
          if (typeof API !== 'undefined' && API.logout) {
            await API.logout();
          } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_info');
            window.location.href = 'login.html';
          }
        }
      };

      const btnTopLogout = document.getElementById('btnTopLogout');
      if (btnTopLogout) {
        btnTopLogout.addEventListener('click', handleLogout);
      }

      const btnSidebarLogout = document.getElementById('btnSidebarLogout');
      if (btnSidebarLogout) {
        btnSidebarLogout.addEventListener('click', handleLogout);
      }

      document.addEventListener('click', (e) => {
        const btn = e.target.closest('.nav-tab-btn, [data-view]');
        if (btn && btn.dataset.view) {
          e.preventDefault();
          this.switchView(btn.dataset.view);
          toggleMobileSidebar(false);
        }
      });

      document.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        if (target.classList.contains('btn-rab-vol-plus')) {
          e.preventDefault();
          const divId = target.dataset.divId;
          const itemId = target.dataset.itemId;
          this.rabEngine.stepItemVolume(divId, itemId, 1);
          this.render();
          this.showToast('Volume bertambah (+1.00)');
        } else if (target.classList.contains('btn-rab-vol-minus')) {
          e.preventDefault();
          const divId = target.dataset.divId;
          const itemId = target.dataset.itemId;
          this.rabEngine.stepItemVolume(divId, itemId, -1);
          this.render();
          this.showToast('Volume berkurang (-1.00)');
        } else if (target.classList.contains('btn-rab-delete-item')) {
          e.preventDefault();
          const divId = target.dataset.divId;
          const itemId = target.dataset.itemId;
          if (confirm('Apakah Anda yakin ingin menghapus item pekerjaan ini dari RAB?')) {
            this.rabEngine.deleteItem(divId, itemId);
            this.render();
            this.showToast('Item berhasil dihapus');
          }
        } else if (target.classList.contains('btn-rab-add-item-to-div')) {
          e.preventDefault();
          const divId = target.dataset.divId;
          this.openAddItemModal(divId);
        } else if (target.classList.contains('btn-rab-del-div')) {
          e.preventDefault();
          const divId = target.dataset.divId;
          if (confirm('Hapus seluruh kelompok divisi ini beserta isinya?')) {
            this.rabEngine.deleteDivision(divId);
            this.render();
            this.showToast('Divisi berhasil dihapus');
          }
        } else if (target.classList.contains('btn-edit-ahsp-row')) {
          e.preventDefault();
          const code = target.dataset.code;
          this.openEditAhspModal(code);
        } else if (target.classList.contains('btn-view-ahsp-detail')) {
          e.preventDefault();
          const code = target.dataset.code;
          this.openAhspDetailModal(code);
        } else if (target.classList.contains('btn-boq-edit') || target.id === 'btnEditActiveCustom') {
          e.preventDefault();
          e.stopPropagation();
          const id = target.dataset.id;
          this.openEditCustomFormulaModal(id);
        } else if (target.classList.contains('btn-boq-delete') || target.id === 'btnDeleteActiveCustom') {
          e.preventDefault();
          e.stopPropagation();
          const id = target.dataset.id;
          this.deleteCustomFormula(id);
        }
      });

      const btnAddDiv = document.getElementById('btnAddDivision');
      if (btnAddDiv) {
        btnAddDiv.addEventListener('click', () => {
          const name = prompt('Masukkan Nama Kelompok Divisi Baru:');
          if (name && name.trim()) {
            this.rabEngine.addDivision(name.trim());
            this.render();
            this.showToast('Kelompok Divisi berhasil ditambahkan');
          }
        });
      }

      // Project Management & Switcher Events
      const btnTopProjMgr = document.getElementById('btnTopProjectManager');
      if (btnTopProjMgr) {
        btnTopProjMgr.addEventListener('click', () => this.openProjectManagerModal());
      }

      const btnTopNewProj = document.getElementById('btnTopNewProject');
      if (btnTopNewProj) {
        btnTopNewProj.addEventListener('click', () => this.openCreateProjectModal());
      }

      const btnSidebarNewProj = document.getElementById('btnSidebarNewProject');
      if (btnSidebarNewProj) {
        btnSidebarNewProj.addEventListener('click', () => this.openCreateProjectModal());
      }

      const btnSidebarProjList = document.getElementById('btnSidebarProjectList');
      if (btnSidebarProjList) {
        btnSidebarProjList.addEventListener('click', () => this.openProjectManagerModal());
      }

      const btnDashProjMgr = document.getElementById('btnDashProjectManager');
      if (btnDashProjMgr) {
        btnDashProjMgr.addEventListener('click', () => this.openProjectManagerModal());
      }

      const btnDashNewProj = document.getElementById('btnDashNewProject');
      if (btnDashNewProj) {
        btnDashNewProj.addEventListener('click', () => this.openCreateProjectModal());
      }

      const btnModalOpenNew = document.getElementById('btnModalOpenCreateProject');
      if (btnModalOpenNew) {
        btnModalOpenNew.addEventListener('click', () => {
          this.closeModal('modalProjectManager');
          this.openCreateProjectModal();
        });
      }

      const formCreateProj = document.getElementById('formCreateProject');
      if (formCreateProj) {
        formCreateProj.addEventListener('submit', (e) => {
          e.preventDefault();
          this.submitCreateProjectForm();
        });
      }

      const searchProjInput = document.getElementById('projectManagerSearchInput');
      if (searchProjInput) {
        searchProjInput.addEventListener('input', (e) => {
          this.renderProjectManagerList(e.target.value);
        });
      }

      const btnEditProj = document.getElementById('btnEditProjectInfo');
      if (btnEditProj) {
        btnEditProj.addEventListener('click', () => this.openProjectInfoModal());
      }

      const formProjInfo = document.getElementById('formProjectInfo');
      if (formProjInfo) {
        formProjInfo.addEventListener('submit', (e) => {
          e.preventDefault();
          this.saveProjectInfoForm();
        });
      }

      // Export / Import / Reset / Print Tools
      const btnExportJson = document.getElementById('btnExportJson');
      if (btnExportJson) {
        btnExportJson.addEventListener('click', () => {
          this.handleExportSavedProject(this.rabEngine.project.id);
        });
      }

      const btnImportJson = document.getElementById('btnImportJson');
      const inputImportJson = document.getElementById('inputImportJson');
      if (btnImportJson && inputImportJson) {
        btnImportJson.addEventListener('click', () => inputImportJson.click());
        inputImportJson.addEventListener('change', (e) => {
          if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (re) => {
              try {
                const parsed = JSON.parse(re.target.result);
                if (parsed && parsed.info) {
                  if (!parsed.id) parsed.id = 'proj_' + Date.now();
                  if (parsed.info) parsed.info.id = parsed.id;
                  this.rabEngine.recalculateProject(parsed);
                  this.rabEngine.project = parsed;
                  this.rabEngine.saveProject(parsed);
                  this.render();
                  this.showToast('Proyek berhasil diimpor dan dimuat!');
                } else {
                  alert('Format file JSON proyek tidak valid.');
                }
              } catch (err) {
                alert('Gagal membaca file JSON: ' + err.message);
              }
              inputImportJson.value = '';
            };
            reader.readAsText(e.target.files[0]);
          }
        });
      }

      const btnResetProj = document.getElementById('btnResetProject');
      if (btnResetProj) {
        btnResetProj.addEventListener('click', () => {
          if (confirm('Apakah Anda ingin memuat data proyek acuan standar PUPR? Data proyek saat ini akan tetap tersimpan di arsip.')) {
            this.rabEngine.saveProject();
            const def = this.rabEngine.getDefaultProject();
            def.id = 'proj_default_' + Date.now();
            def.info.id = def.id;
            def.info.name = 'PEMBANGUNAN KANTOR BPD (STANDAR PUPR)';
            this.rabEngine.recalculateProject(def);
            this.rabEngine.project = def;
            this.rabEngine.saveProject(def);
            this.render();
            this.showToast('Contoh proyek standar PUPR berhasil dimuat!');
          }
        });
      }

      const btnPrint = document.getElementById('btnPrint');
      if (btnPrint) {
        btnPrint.addEventListener('click', () => {
          window.print();
        });
      }

      const btnExportRabCsv = document.getElementById('btnExportRabCsv');
      if (btnExportRabCsv) {
        btnExportRabCsv.addEventListener('click', () => {
          const p = this.rabEngine.project;
          let csv = 'No WBS,Uraian Pekerjaan,Kode AHSP,Volume,Satuan,Harga Satuan (Rp),Total Harga (Rp),Bobot (%)\r\n';
          (p.divisions || []).forEach(div => {
            csv += `"${div.code}","${div.name.replace(/"/g, '""')}","",,"","","${div.subtotal}","${div.weight.toFixed(2)}%"\r\n`;
            (div.items || []).forEach(it => {
              csv += `"${it.wbsCode}","${it.name.replace(/"/g, '""')}","${it.ahspCode}","${it.volume}","${it.unit}","${it.unitPrice}","${it.totalPrice}","${it.weight.toFixed(2)}%"\r\n`;
            });
          });
          csv += `"","TOTAL BIAYA LANGSUNG","","","","","${p.totalDirectCost}","100.00%"\r\n`;
          csv += `"","PPN (${p.info.ppnPercent}%)","","","","","${p.ppnAmount}",""\r\n`;
          csv += `"","TOTAL NILAI KONTRAK","","","","","${p.grandTotal}",""\r\n`;

          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.setAttribute('href', url);
          a.setAttribute('download', `RAB_${(p.info.name || 'Proyek').replace(/\s+/g, '_')}_2026.csv`);
          a.click();
          this.showToast('RAB berhasil diekspor ke format CSV');
        });
      }

      const formAddItem = document.getElementById('formAddItem');
      if (formAddItem) {
        formAddItem.addEventListener('submit', (e) => {
          e.preventDefault();
          this.saveAddItemForm();
        });
      }

      const addItemSourceSelect = document.getElementById('addItemSource');
      if (addItemSourceSelect) {
        addItemSourceSelect.addEventListener('change', () => {
          this.updateAddItemModalSource();
        });
      }

      const formEditAhsp = document.getElementById('formEditAhsp');
      if (formEditAhsp) {
        formEditAhsp.addEventListener('submit', (e) => {
          e.preventDefault();
          this.saveEditAhspForm();
        });
      }

      const btnOpenCustom = document.getElementById('btnOpenCustomFormulaModal');
      if (btnOpenCustom) {
        btnOpenCustom.addEventListener('click', () => {
          this.openCreateCustomFormulaModal();
        });
      }

      const formCustomFormula = document.getElementById('formCustomFormula');
      if (formCustomFormula) {
        formCustomFormula.addEventListener('submit', (e) => {
          e.preventDefault();
          this.saveCustomFormulaForm();
        });
      }

      const formBoq = document.getElementById('formBoqCalculator');
      if (formBoq) {
        formBoq.addEventListener('submit', (e) => {
          e.preventDefault();
          this.applyBoqToRab();
        });
      }

      const btnResetBoq = document.getElementById('btnResetBoqInputs');
      if (btnResetBoq) {
        btnResetBoq.addEventListener('click', () => {
          const activeModel = this.boqEngine.getModelById(this.boqEngine.activeModelId);
          if (activeModel) {
            activeModel.inputs.forEach(inp => {
              const el = document.getElementById('boq_inp_' + inp.key);
              if (el) el.value = inp.default || 1;
            });
            this.updateBoqOutputs();
            this.showToast('Nilai input kalkulator di-reset');
          }
        });
      }

      const formOpname = document.getElementById('formOpname');
      if (formOpname) {
        formOpname.addEventListener('submit', (e) => {
          e.preventDefault();
          this.saveOpnameForm();
        });
      }

      const dbSearch = document.getElementById('dbSearchInput');
      if (dbSearch) {
        dbSearch.addEventListener('input', () => {
          this.dbCurrentPage = 1;
          this.renderDatabase();
        });
      }

      const dbFilter = document.getElementById('dbDivisionFilter');
      if (dbFilter) {
        dbFilter.addEventListener('change', () => {
          this.dbCurrentPage = 1;
          this.renderDatabase();
        });
      }

      const btnDbPrev = document.getElementById('btnDbPrevPage');
      if (btnDbPrev) {
        btnDbPrev.addEventListener('click', () => {
          if (this.dbCurrentPage > 1) {
            this.dbCurrentPage--;
            this.renderDatabase();
          }
        });
      }

      const btnDbNext = document.getElementById('btnDbNextPage');
      if (btnDbNext) {
        btnDbNext.addEventListener('click', () => {
          this.dbCurrentPage++;
          this.renderDatabase();
        });
      }

      const btnResetDb = document.getElementById('btnResetAhspDb');
      if (btnResetDb) {
        btnResetDb.addEventListener('click', () => {
          if (confirm('Reset Master Database AHSP ke standar SE Bina Konstruksi 47/2026?')) {
            this.ahspEngine.resetToDefault();
            this.renderDatabase();
            this.showToast('Database Master AHSP berhasil di-reset');
          }
        });
      }

      // --- EDIT HARGA KOMPONEN ---
      const btnEditHarga = document.getElementById('btnEditHargaKomponen');
      if (btnEditHarga) {
        btnEditHarga.addEventListener('click', () => {
          this.currentKomponenTab = 'upah';
          this.openModal('modalEditHargaKomponen');
          this.renderKomponenEditor();
        });
      }

      const btnSimpanHarga = document.getElementById('btnSimpanHargaKomponen');
      if (btnSimpanHarga) {
        btnSimpanHarga.addEventListener('click', () => {
          this.saveKomponenPrices();
        });
      }

      const btnResetHarga = document.getElementById('btnResetHargaKomponen');
      if (btnResetHarga) {
        btnResetHarga.addEventListener('click', () => {
          if (confirm('Reset semua harga komponen ke nilai standar AHSP 2026?')) {
            this.ahspEngine.resetKomponenPrices();
            this.ahspEngine.initDatabase();
            this.renderDatabase();
            this.renderKomponenEditor();
            this.showToast('Harga komponen telah di-reset ke standar');
          }
        });
      }

      // --- REKAP KEBUTUHAN ---
      const btnCetakRekap = document.getElementById('btnCetakRekkapKebutuhan');
      if (btnCetakRekap) {
        btnCetakRekap.addEventListener('click', () => {
          const bodyEl  = document.getElementById('rekkapKebutuhanBody');
          const titleEl = document.querySelector('#modalRekkapKebutuhan .modal-title');
          if (!bodyEl) return;
          const docTitle = titleEl ? titleEl.textContent : 'Rekap Kebutuhan AHSP';
          const content  = bodyEl.innerHTML;
          const printWin = window.open('', '_blank', 'width=1100,height=800,scrollbars=yes');
          if (!printWin) { alert('Izinkan popup di browser.'); return; }
          printWin.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + docTitle + '</title>' +
            '<style>@page{margin:15mm 12mm;size:A4 portrait;}body{font-family:Arial,sans-serif;font-size:9pt;color:#000;margin:0;padding:0;}' +
            'table{border-collapse:collapse;width:100%;}th,td{border:1px solid #94a3b8;padding:4px 7px;}' +
            'thead{background:#f1f5f9!important;} @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}</style>' +
            '</head><body>' + content + '</body></html>');
          printWin.document.close();
          setTimeout(() => { printWin.focus(); printWin.print(); printWin.close(); }, 600);
        });
      }

      // --- DOCUMENT WORKFLOW & ACTION BUTTON BINDINGS ---
      const btnExportAll = document.getElementById('btnExportAllDocsExcel');
      if (btnExportAll) {
        btnExportAll.addEventListener('click', () => {
          this.exportManager.exportMultiSheetExcel();
          this.showToast('Mengunduh 1 File Excel (5 Sheet Standar PUPR)...');
        });
      }

      const btnPrintAll = document.getElementById('btnPrintAllDocs');
      if (btnPrintAll) {
        btnPrintAll.addEventListener('click', () => {
          this.exportManager.openPreviewModal('all', 'Pratinjau Bundel Dokumen Lengkap (5 Lampiran)');
        });
      }

      const btnPrintBundle = document.getElementById('btnPrintAllDocsBundle');
      if (btnPrintBundle) {
        btnPrintBundle.addEventListener('click', () => {
          this.exportManager.openPreviewModal('all', 'Pratinjau Bundel Dokumen Lengkap (5 Lampiran)');
        });
      }

      const btnOpenRekkap = document.getElementById('btnOpenRekkapKebutuhan');
      if (btnOpenRekkap) {
        btnOpenRekkap.addEventListener('click', () => {
          this.openRekkapModal();
        });
      }

      const btnExportSchedule = document.getElementById('btnExportScheduleExcel');
      if (btnExportSchedule) {
        btnExportSchedule.addEventListener('click', () => {
          this.exportManager.exportMultiSheetExcel();
        });
      }

      // Individual Document Buttons
      const btnPrintRab = document.getElementById('btnPrintRabDoc');
      if (btnPrintRab) {
        btnPrintRab.addEventListener('click', () => {
          this.exportManager.openPreviewModal('rab', 'Pratinjau Lampiran 1: Rencana Anggaran Biaya (RAB)');
        });
      }
      const btnExportRab = document.getElementById('btnExportRabExcel');
      if (btnExportRab) {
        btnExportRab.addEventListener('click', () => {
          this.exportManager.exportSingleExcel('rab', 'LAMPIRAN_1_RAB_' + this.rabEngine.project.info.name);
          this.showToast('Mengunduh Lampiran 1 (RAB)...');
        });
      }

      const btnPrintVol = document.getElementById('btnPrintVolumeDoc');
      if (btnPrintVol) {
        btnPrintVol.addEventListener('click', () => {
          this.exportManager.openPreviewModal('vol', 'Pratinjau Lampiran 2: Perhitungan Volume Pekerjaan (BOQ)');
        });
      }
      const btnExportVol = document.getElementById('btnExportVolumeExcel');
      if (btnExportVol) {
        btnExportVol.addEventListener('click', () => {
          this.exportManager.exportSingleExcel('vol', 'LAMPIRAN_2_BOQ_' + this.rabEngine.project.info.name);
          this.showToast('Mengunduh Lampiran 2 (BOQ)...');
        });
      }

      const btnPrintAnalisa = document.getElementById('btnPrintAnalisaDoc');
      if (btnPrintAnalisa) {
        btnPrintAnalisa.addEventListener('click', () => {
          this.exportManager.openPreviewModal('analisa', 'Pratinjau Lampiran 3: Daftar Analisa AHSP Terpilih PUPR 2026');
        });
      }
      const btnExportAnalisa = document.getElementById('btnExportAnalisaExcel');
      if (btnExportAnalisa) {
        btnExportAnalisa.addEventListener('click', () => {
          this.exportManager.exportSingleExcel('analisa', 'LAMPIRAN_3_AHSP_' + this.rabEngine.project.info.name);
          this.showToast('Mengunduh Lampiran 3 (AHSP Terpilih)...');
        });
      }

      const btnPrintUpah = document.getElementById('btnPrintUpahDoc');
      if (btnPrintUpah) {
        btnPrintUpah.addEventListener('click', () => {
          this.exportManager.openPreviewModal('upah', 'Pratinjau Lampiran 4: Standar Satuan Upah Tenaga Kerja 2026');
        });
      }
      const btnExportUpah = document.getElementById('btnExportUpahExcel');
      if (btnExportUpah) {
        btnExportUpah.addEventListener('click', () => {
          this.exportManager.exportSingleExcel('upah', 'LAMPIRAN_4_UPAH_2026');
          this.showToast('Mengunduh Lampiran 4 (Standar Upah)...');
        });
      }

      const btnPrintBahan = document.getElementById('btnPrintBahanDoc');
      if (btnPrintBahan) {
        btnPrintBahan.addEventListener('click', () => {
          this.exportManager.openPreviewModal('bahan', 'Pratinjau Lampiran 5: Standar Harga Bahan & Transportasi 2026');
        });
      }
      const btnExportBahan = document.getElementById('btnExportBahanExcel');
      if (btnExportBahan) {
        btnExportBahan.addEventListener('click', () => {
          this.exportManager.exportSingleExcel('bahan', 'LAMPIRAN_5_BAHAN_2026');
          this.showToast('Mengunduh Lampiran 5 (Standar Bahan)...');
        });
      }

      const btnExecPrint = document.getElementById('btnExecutePrintModal');
      if (btnExecPrint) {
        btnExecPrint.addEventListener('click', () => {
          const titleEl = document.getElementById('printDocumentPreviewTitle');
          const bodyEl  = document.getElementById('printDocumentPreviewBody');
          if (!bodyEl) return;

          const docTitle = titleEl ? titleEl.textContent : 'Lampiran Dokumen';
          const content  = bodyEl.innerHTML;

          const printWin = window.open('', '_blank', 'width=1100,height=800,scrollbars=yes');
          if (!printWin) {
            alert('Mohon izinkan popup di browser untuk mencetak / menyimpan PDF.');
            return;
          }

          printWin.document.write(
            '<!DOCTYPE html><html><head>' +
            '<meta charset="utf-8">' +
            '<title>' + docTitle + '</title>' +
            '<style>' +
            '  @page { margin: 15mm 12mm; size: A4 portrait; }' +
            '  * { box-sizing: border-box; }' +
            '  body { font-family: Arial, sans-serif; font-size: 9pt; color: #000; margin: 0; padding: 0; background: #fff; }' +
            '  table { border-collapse: collapse; width: 100%; }' +
            '  th, td { border: 1px solid #94a3b8; padding: 4px 6px; }' +
            '  thead tr { background: #f1f5f9 !important; }' +
            '  .text-right { text-align: right; }' +
            '  .text-center { text-align: center; }' +
            '  .font-mono { font-family: "Courier New", monospace; }' +
            '  .font-bold { font-weight: bold; }' +
            '  @media print {' +
            '    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }' +
            '    div[style*="page-break-inside: avoid"] { page-break-inside: avoid; }' +
            '    tr { page-break-inside: avoid; }' +
            '  }' +
            '</style>' +
            '</head><body>' +
            content +
            '</body></html>'
          );
          printWin.document.close();

          // Wait for images/fonts then print
          printWin.onload = function() {
            setTimeout(function() {
              printWin.focus();
              printWin.print();
              printWin.close();
            }, 400);
          };
          // Fallback if onload doesn't fire
          setTimeout(function() {
            try {
              printWin.focus();
              printWin.print();
              printWin.close();
            } catch(e) {}
          }, 1200);
        });
      }

      document.querySelectorAll('.modal-close-btn, .btn-modal-cancel').forEach(btn => {
        btn.addEventListener('click', () => {
          const modal = btn.closest('.modal-backdrop');
          if (modal) modal.classList.remove('active');
        });
      });

      const schedDurInput = document.getElementById('scheduleDurationWeeksInput');
      if (schedDurInput) {
        schedDurInput.addEventListener('change', (e) => {
          const w = Math.max(1, Math.min(52, parseInt(e.target.value) || 16));
          this.rabEngine.project.info.durationWeeks = w;
          this.rabEngine.saveProject();
          this.render();
          this.showToast('Durasi proyek diubah menjadi ' + w + ' Minggu');
        });
      }
    }

    switchView(viewId) {
      this.currentView = viewId;

      // Close mobile drawer if opened
      const appSidebar = document.getElementById('appSidebar');
      const sidebarMobileBackdrop = document.getElementById('sidebarMobileBackdrop');
      if (appSidebar) appSidebar.classList.remove('mobile-open');
      if (sidebarMobileBackdrop) sidebarMobileBackdrop.classList.remove('active');

      document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewId);
      });
      document.querySelectorAll('.view-section').forEach(sec => {
        sec.classList.toggle('active', sec.id === ('view_' + viewId));
      });

      if (viewId === 'settings') {
        this.loadUserProfile();
        const activeSubBtn = document.querySelector('.settings-tab-btn.active');
        const activeTabKey = activeSubBtn ? activeSubBtn.getAttribute('data-tab') : 'tabProfile';
        document.querySelectorAll('.settings-section').forEach(sec => {
          sec.style.display = (sec.id === activeTabKey) ? 'block' : 'none';
        });
      }

      this.render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    render() {
      this.renderHeaderKpi();
      this.renderDashboard();
      this.renderRab();
      this.renderSchedule();
      this.renderSCurve();
      this.renderBoq();
      this.renderDatabase();
      this.renderCashflow();
    }

    renderHeaderKpi() {
      const p = this.rabEngine.project;
      const kpiVal = document.getElementById('kpiContractValue');
      if (kpiVal) kpiVal.textContent = Utils.formatRupiah(p.grandTotal);

      const opnames = p.opnames || [];
      const lastOp = opnames.length > 0 ? opnames[opnames.length - 1] : null;
      const actualPct = lastOp ? lastOp.cumulativePercent : 0;
      
      const sched = this.scheduleEngine.generateScheduleMatrix();
      const currentWeek = lastOp ? lastOp.week : 1;
      const plannedPct = sched.cumulativePlanned[currentWeek - 1] || 0;
      const dev = actualPct - plannedPct;

      const kpiAct = document.getElementById('kpiActualProgress');
      if (kpiAct) kpiAct.textContent = actualPct.toFixed(2) + '%';

      const kpiTgt = document.getElementById('kpiTargetProgress');
      if (kpiTgt) kpiTgt.textContent = 'Target Rencana (M-' + currentWeek + '): ' + plannedPct.toFixed(2) + '%';

      const kpiDev = document.getElementById('kpiDeviation');
      if (kpiDev) {
        kpiDev.textContent = (dev >= 0 ? '+' : '') + dev.toFixed(2) + '%';
        kpiDev.style.color = dev >= 0 ? 'var(--success-700)' : (dev < -5 ? 'var(--danger-600)' : 'var(--warning-600)');
      }

      const topName = document.getElementById('topbarProjectName');
      if (topName) topName.textContent = p.info.name;
    }

    renderDashboard() {
      const p = this.rabEngine.project;
      const nameEl = document.getElementById('dashProjName');
      if (nameEl) nameEl.textContent = p.info.name;

      const ownerEl = document.getElementById('dashProjOwner');
      if (ownerEl) ownerEl.textContent = p.info.kegiatan;

      const locEl = document.getElementById('dashProjLoc');
      if (locEl) locEl.textContent = p.info.location + ' (T.A. ' + p.info.year + ')';

      const durEl = document.getElementById('dashProjDur');
      if (durEl) durEl.textContent = p.info.durationWeeks + ' Minggu (' + (p.info.durationWeeks * 7) + ' Hari Kalender)';

      const listContainer = document.getElementById('dashDivisionsList');
      if (listContainer) {
        let html = '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">';
        p.divisions.forEach(div => {
          html += '<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.85rem;">' +
            '<div style="display:flex; justify-content:space-between; font-weight:bold; font-size:0.85rem; margin-bottom:0.35rem;">' +
            '<span>' + div.code + '</span>' +
            '<span style="color:#0284c7;">' + div.weight.toFixed(2) + '%</span>' +
            '</div>' +
            '<div style="font-size:0.8rem; color:#475569; margin-bottom:0.5rem;">' + div.name + '</div>' +
            '<div style="font-weight:bold; font-family:var(--font-mono); font-size:0.95rem; color:#0f172a;">' + Utils.formatRupiah(div.subtotal) + '</div>' +
            '</div>';
        });
        html += '</div>';
        listContainer.innerHTML = html;
      }
    }

    renderRab() {
      const p = this.rabEngine.project;
      const container = document.getElementById('rabDivisionsContainer');
      if (!container) return;

      let html = '';
      if (!p.divisions || p.divisions.length === 0) {
        html = '<div class="card" style="text-align:center; padding:3.5rem 1.5rem; background:#f8fafc; border:2px dashed #cbd5e1; border-radius:var(--radius-lg);">' +
          '<div style="width:56px; height:56px; background:#e0f2fe; color:var(--primary-600); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 1rem auto;">' +
          '<svg class="icon-svg" style="width:28px; height:28px;" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>' +
          '</div>' +
          '<h3 style="font-size:1.15rem; font-weight:800; color:#0f172a; margin-bottom:0.35rem;">Lembar Kerja RAB Masih Kosong</h3>' +
          '<p style="color:#64748b; font-size:0.875rem; max-width:480px; margin:0 auto 1.5rem auto;">Proyek baru telah disiapkan sebagai lembar kerja kosong. Silakan tambahkan kelompok divisi pekerjaan (misal: Divisi I Pekerjaan Persiapan, Divisi II Pondasi & Struktur, dll) untuk mulai menyusun RAB.</p>' +
          '<button type="button" class="btn btn-primary" id="btnEmptyRabAddDiv" style="font-weight:700; padding:0.6rem 1.25rem;">' +
          '<svg class="icon-svg-sm" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>' +
          '<span>+ Tambah Kelompok Divisi Pertama</span>' +
          '</button>' +
          '</div>';
      } else {
        p.divisions.forEach(div => {
          let itemsHtml = '';
          div.items.forEach((it) => {
            itemsHtml += '<tr>' +
              '<td class="text-center font-mono" style="font-size:0.8rem;">' + it.wbsCode + '</td>' +
              '<td>' +
              '<div style="font-weight:600; color:var(--text-main);">' + it.name + '</div>' +
              '<div style="font-size:0.75rem; color:#64748b;">' +
              'AHSP: <span class="font-mono" style="color:#0284c7; cursor:pointer;" onclick="window.siproApp.openAhspDetailModal(\'' + it.ahspCode + '\')">' + it.ahspCode + '</span>' +
              (it.boq_backup && it.boq_backup.steps ? ' &bull; <span style="color:#166534;">' + it.boq_backup.steps + '</span>' : '') +
              '</div>' +
              '</td>' +
              '<td class="text-center">' +
              '<div style="display:flex; align-items:center; justify-content:center; gap:0.25rem;">' +
              '<button class="btn btn-secondary btn-rab-vol-minus" data-div-id="' + div.id + '" data-item-id="' + it.id + '" style="padding:0.15rem 0.4rem; font-size:0.7rem;" title="Kurangi Volume">-</button>' +
              '<span class="font-mono font-bold" style="min-width:45px; text-align:center;">' + Utils.formatNumber(it.volume, 2) + '</span>' +
              '<button class="btn btn-secondary btn-rab-vol-plus" data-div-id="' + div.id + '" data-item-id="' + it.id + '" style="padding:0.15rem 0.4rem; font-size:0.7rem;" title="Tambah Volume">+</button>' +
              '</div>' +
              '</td>' +
              '<td class="text-center font-mono">' + Utils.formatUnitBadge(it.unit) + '</td>' +
              '<td class="text-right font-mono">' + Utils.formatRupiah(it.unitPrice) + '</td>' +
              '<td class="text-right font-mono font-bold">' + Utils.formatRupiah(it.totalPrice) + '</td>' +
              '<td class="text-right font-mono" style="color:#0284c7;">' + it.weight.toFixed(2) + '%</td>' +
              '<td class="text-center">' +
              '<button class="btn btn-secondary btn-rab-delete-item" data-div-id="' + div.id + '" data-item-id="' + it.id + '" style="padding:0.2rem 0.45rem; color:#dc2626;" title="Hapus Item">' + Icons.trash + '</button>' +
              '</td>' +
              '</tr>';
          });

          html += '<div class="card" style="margin-bottom: 1.25rem;">' +
            '<div class="card-header" style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; flex-wrap:wrap; gap:0.5rem;">' +
            '<div>' +
            '<span class="badge badge-primary">' + div.code + '</span>' +
            '<strong style="margin-left:0.5rem; font-size:0.95rem; color:var(--text-main);">' + div.name + '</strong>' +
            '</div>' +
            '<div style="display:flex; gap:0.5rem; align-items:center;">' +
            '<span class="font-mono font-bold" style="font-size:0.95rem; color:#0f172a;">' + Utils.formatRupiah(div.subtotal) + ' (' + div.weight.toFixed(2) + '%)</span>' +
            '<button class="btn btn-secondary btn-sm btn-rab-add-item-to-div" data-div-id="' + div.id + '">' +
            Icons.plus + '<span>Tambah Item</span>' +
            '</button>' +
            '<button class="btn btn-secondary btn-sm btn-rab-del-div" data-div-id="' + div.id + '" style="color:#dc2626;" title="Hapus Divisi">' + Icons.trash + '</button>' +
            '</div>' +
            '</div>' +
            '<div class="table-wrapper">' +
            '<table class="data-table">' +
            '<thead>' +
            '<tr>' +
            '<th style="width:55px;" class="text-center">WBS</th>' +
            '<th>Uraian Pekerjaan & Analisa AHSP</th>' +
            '<th style="width:130px;" class="text-center">Volume</th>' +
            '<th style="width:65px;" class="text-center">Sat</th>' +
            '<th style="width:135px;" class="text-right">Harga Satuan</th>' +
            '<th style="width:150px;" class="text-right">Total Harga</th>' +
            '<th style="width:75px;" class="text-right">Bobot</th>' +
            '<th style="width:65px;" class="text-center">Aksi</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>' +
            (itemsHtml || '<tr><td colspan="8" class="text-center" style="padding:1.5rem; color:#94a3b8;">Belum ada item pekerjaan di divisi ini. Klik "Tambah Item" untuk menambahkan.</td></tr>') +
            '</tbody>' +
            '</table>' +
            '</div>' +
            '</div>';
        });
      }

      container.innerHTML = html;

      const btnEmptyAdd = document.getElementById('btnEmptyRabAddDiv');
      if (btnEmptyAdd) {
        btnEmptyAdd.addEventListener('click', () => {
          const btnAddDiv = document.getElementById('btnAddDivision');
          if (btnAddDiv) btnAddDiv.click();
        });
      }

      const recap = document.getElementById('rabRecapitulationShowcase');
      if (recap) {
        recap.innerHTML = '<div class="card" style="background:#0f172a; color:#ffffff; padding:1.25rem;">' +
          '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:1.25rem;">' +
          '<div>' +
          '<div style="font-size:0.8rem; color:#94a3b8; text-transform:uppercase;">Jumlah Biaya Fisik Langsung</div>' +
          '<div style="font-size:1.35rem; font-weight:800; font-family:var(--font-mono);">' + Utils.formatRupiah(p.totalDirectCost) + '</div>' +
          '</div>' +
          '<div>' +
          '<div style="font-size:0.8rem; color:#94a3b8; text-transform:uppercase;">PPN (' + p.info.ppnPercent + '%)</div>' +
          '<div style="font-size:1.35rem; font-weight:800; font-family:var(--font-mono); color:#38bdf8;">' + Utils.formatRupiah(p.ppnAmount) + '</div>' +
          '</div>' +
          '<div>' +
          '<div style="font-size:0.8rem; color:#94a3b8; text-transform:uppercase;">Total Nilai Kontrak</div>' +
          '<div style="font-size:1.35rem; font-weight:800; font-family:var(--font-mono); color:#4ade80;">' + Utils.formatRupiah(p.grandTotal) + '</div>' +
          '</div>' +
          '</div>' +
          '</div>';
      }
    }

    renderSchedule() {
      const p = this.rabEngine.project;
      const sched = this.scheduleEngine.generateScheduleMatrix();
      const dur = sched.durationWeeks;

      const durInput = document.getElementById('scheduleDurationWeeksInput');
      if (durInput) durInput.value = dur;

      const statDur = document.getElementById('schedStatDuration');
      if (statDur) statDur.textContent = dur + ' Minggu';

      const statDays = document.getElementById('schedStatDays');
      if (statDays) statDays.textContent = (dur * 7) + ' Hari Kalender';

      let totalItems = 0;
      p.divisions.forEach(d => totalItems += d.items.length);
      const statItems = document.getElementById('schedStatItemCount');
      if (statItems) statItems.textContent = totalItems + ' Item';

      const head = document.getElementById('scheduleMatrixTableHead');
      if (head) {
        let thWeeks = '';
        for (let w = 1; w <= dur; w++) {
          thWeeks += '<th style="width:45px; text-align:center; padding:4px 2px;">M-' + w + '</th>';
        }

        head.innerHTML = '<tr style="background:#f1f5f9;">' +
          '<th style="width:45px;" class="text-center">No</th>' +
          '<th>Uraian Pekerjaan (WBS)</th>' +
          '<th style="width:65px;" class="text-center">Vol</th>' +
          '<th style="width:55px;" class="text-center">Sat</th>' +
          '<th style="width:65px;" class="text-right">Bobot (%)</th>' +
          '<th style="width:75px;" class="text-center">Mulai</th>' +
          '<th style="width:75px;" class="text-center">Selesai</th>' +
          thWeeks +
          '</tr>';
      }

      const body = document.getElementById('scheduleMatrixTableBody');
      if (body) {
        let rowsHtml = '';
        sched.matrixRows.forEach((row) => {
          if (row.isDivision) {
            let divCells = '';
            for (let w = 0; w < dur; w++) {
              const val = row.weeklyWeights[w];
              divCells += '<td style="text-align:center; font-family:monospace; font-size:0.75rem; background:#f1f5f9; font-weight:bold;">' + (val > 0 ? val.toFixed(2) : '-') + '</td>';
            }
            rowsHtml += '<tr style="background:#e2e8f0; font-weight:bold;">' +
              '<td class="text-center">' + row.code + '</td>' +
              '<td colspan="3">' + row.name + '</td>' +
              '<td class="text-right font-mono">' + row.weight.toFixed(2) + '%</td>' +
              '<td colspan="2"></td>' +
              divCells +
              '</tr>';
          } else {
            let weekCells = '';
            for (let w = 1; w <= dur; w++) {
              const isActive = w >= row.startWeek && w <= row.endWeek;
              const val = row.weeklyWeights[w - 1];
              weekCells += '<td style="text-align:center; font-family:monospace; font-size:0.75rem; ' + (isActive ? 'background:#e0f2fe; color:#0369a1; font-weight:bold;' : 'color:#cbd5e1;') + '">' +
                (isActive && val > 0 ? val.toFixed(2) : '') +
                '</td>';
            }

            let startOpts = '', endOpts = '';
            for (let w = 1; w <= dur; w++) {
              startOpts += '<option value="' + w + '" ' + (w === row.startWeek ? 'selected' : '') + '>M-' + w + '</option>';
              endOpts += '<option value="' + w + '" ' + (w === row.endWeek ? 'selected' : '') + '>M-' + w + '</option>';
            }

            rowsHtml += '<tr>' +
              '<td class="text-center font-mono" style="font-size:0.75rem;">' + row.wbsCode + '</td>' +
              '<td><div style="font-weight:600; font-size:0.8rem;">' + row.name + '</div></td>' +
              '<td class="text-center font-mono" style="font-size:0.75rem;">' + Utils.formatNumber(row.volume, 1) + '</td>' +
              '<td class="text-center" style="font-size:0.75rem;">' + Utils.formatUnitBadge(row.unit) + '</td>' +
              '<td class="text-right font-mono font-bold" style="font-size:0.8rem; color:#0284c7;">' + row.weight.toFixed(2) + '%</td>' +
              '<td class="text-center">' +
              '<select class="form-select sched-start-select" data-div-id="' + row.divisionId + '" data-item-id="' + row.id + '" style="padding:0.15rem 0.3rem; font-size:0.75rem;">' + startOpts + '</select>' +
              '</td>' +
              '<td class="text-center">' +
              '<select class="form-select sched-end-select" data-div-id="' + row.divisionId + '" data-item-id="' + row.id + '" style="padding:0.15rem 0.3rem; font-size:0.75rem;">' + endOpts + '</select>' +
              '</td>' +
              weekCells +
              '</tr>';
          }
        });
        body.innerHTML = rowsHtml;

        body.querySelectorAll('.sched-start-select').forEach(sel => {
          sel.addEventListener('change', (e) => {
            const divId = sel.dataset.divId;
            const itemId = sel.dataset.itemId;
            const newStart = parseInt(e.target.value);
            const div = this.rabEngine.project.divisions.find(d => d.id === divId);
            if (div) {
              const it = div.items.find(i => i.id === itemId);
              if (it) {
                it.startWeek = newStart;
                if (it.endWeek < newStart) it.endWeek = newStart;
                this.rabEngine.saveProject();
                this.render();
                this.showToast('Jadwal item berhasil disesuaikan');
              }
            }
          });
        });

        body.querySelectorAll('.sched-end-select').forEach(sel => {
          sel.addEventListener('change', (e) => {
            const divId = sel.dataset.divId;
            const itemId = sel.dataset.itemId;
            const newEnd = parseInt(e.target.value);
            const div = this.rabEngine.project.divisions.find(d => d.id === divId);
            if (div) {
              const it = div.items.find(i => i.id === itemId);
              if (it) {
                it.endWeek = newEnd;
                if (it.startWeek > newEnd) it.startWeek = newEnd;
                this.rabEngine.saveProject();
                this.render();
                this.showToast('Jadwal item berhasil disesuaikan');
              }
            }
          });
        });
      }

      const foot = document.getElementById('scheduleMatrixTableFoot');
      if (foot) {
        let weeklyCells = '', cumCells = '';
        for (let w = 0; w < dur; w++) {
          weeklyCells += '<td style="text-align:center; font-family:monospace; font-size:0.75rem; color:#0284c7;">' + sched.weeklyPlannedTotals[w].toFixed(2) + '%</td>';
          cumCells += '<td style="text-align:center; font-family:monospace; font-size:0.75rem; color:#0f172a; font-weight:800;">' + sched.cumulativePlanned[w].toFixed(2) + '%</td>';
        }

        foot.innerHTML = '<tr>' +
          '<td colspan="7" style="text-align:right; padding:6px 8px;">Jumlah Bobot Mingguan (%):</td>' +
          weeklyCells +
          '</tr>' +
          '<tr style="background:#e0f2fe;">' +
          '<td colspan="7" style="text-align:right; padding:6px 8px; font-weight:800;">Bobot Kumulatif Rencana (%):</td>' +
          cumCells +
          '</tr>';
      }
    }

    renderSCurve() {
      this.scurveChart.render();
      this.populateOpnameWeekSelect();

      const p = this.rabEngine.project;
      const tbody = document.getElementById('opnameHistoryTableBody');
      if (tbody) {
        const sched = this.scheduleEngine.generateScheduleMatrix();
        let rowsHtml = '';
        p.opnames.forEach(op => {
          const planned = sched.cumulativePlanned[op.week - 1] || 0;
          const dev = op.cumulativePercent - planned;
          const devColor = dev >= 0 ? '#16a34a' : (dev < -5 ? '#dc2626' : '#d97706');

          rowsHtml += '<tr>' +
            '<td class="text-center font-mono font-bold">M-' + op.week + '</td>' +
            '<td class="text-right font-mono">' + planned.toFixed(2) + '%</td>' +
            '<td class="text-right font-mono font-bold" style="color:#0f172a;">' + op.cumulativePercent.toFixed(2) + '%</td>' +
            '<td class="text-center font-mono font-bold" style="color:' + devColor + ';">' + (dev >= 0 ? '+' : '') + dev.toFixed(2) + '%</td>' +
            '<td style="font-size:0.8rem;">' + (op.note || '-') + '</td>' +
            '<td class="text-center" style="font-size:0.75rem;">Cerah: ' + op.weatherGood + ' / Hujan: ' + op.weatherRain + '</td>' +
            '</tr>';
        });
        tbody.innerHTML = rowsHtml || '<tr><td colspan="6" class="text-center" style="padding:1rem; color:#94a3b8;">Belum ada data opname fisik. Masukkan melalui form di sebelah kanan.</td></tr>';
      }

      const alertContainer = document.getElementById('scurveScmAlertContainer');
      if (alertContainer) {
        const sched = this.scheduleEngine.generateScheduleMatrix();
        const lastOp = p.opnames.length > 0 ? p.opnames[p.opnames.length - 1] : null;
        if (lastOp) {
          const planned = sched.cumulativePlanned[lastOp.week - 1] || 0;
          const dev = lastOp.cumulativePercent - planned;
          if (dev < -5) {
            alertContainer.innerHTML = '<div style="background:#fef2f2; border:1px solid #f87171; border-radius:8px; padding:1rem; margin-bottom:1.25rem; display:flex; gap:0.75rem; align-items:center;">' +
              '<div style="color:#dc2626;">' + Icons.alert + '</div>' +
              '<div>' +
              '<h4 style="margin:0 0 0.25rem 0; color:#991b1b; font-size:0.95rem;">PERINGATAN DINI KONTRAK: SCM TAHAP I DIPERLUKAN (DEVIASI: ' + dev.toFixed(2) + '%)</h4>' +
              '<p style="margin:0; font-size:0.8rem; color:#b91c1c;">Deviasi keterlambatan fisik pada Minggu ke-' + lastOp.week + ' telah melebihi batas toleransi -5.00%. Segera terbitkan Surat Peringatan (SP) dan laksanakan Show Cause Meeting bersama Penyedia Jasa.</p>' +
              '</div>' +
              '</div>';
          } else {
            alertContainer.innerHTML = '';
          }
        } else {
          alertContainer.innerHTML = '';
        }
      }
    }

    renderBoq() {
      const sidebarMenu = document.getElementById('boqCategoriesList');
      const searchInput = document.getElementById('boqFormulaSearchInput');
      const searchQuery = searchInput ? (searchInput.value || '').trim().toLowerCase() : '';

      if (sidebarMenu) {
        const models = this.boqEngine.getAllModels();
        const filteredModels = searchQuery
          ? models.filter(m => (m.title && m.title.toLowerCase().includes(searchQuery)) ||
                               (m.description && m.description.toLowerCase().includes(searchQuery)) ||
                               (m.categoryName && m.categoryName.toLowerCase().includes(searchQuery)))
          : models;

        let html = '';
        if (filteredModels.length === 0) {
          html = '<div style="padding:1.5rem 1rem; text-align:center; color:#94a3b8; font-size:0.85rem;">Tidak ada rumus yang cocok dengan kata kunci "<em>' + Utils.escapeHtml(searchQuery) + '</em>".</div>';
        } else {
          filteredModels.forEach(m => {
            const isActive = m.id === this.boqEngine.activeModelId;
            const isCustom = m.isCustom === true;

            let actionsHtml = '';
            if (isCustom) {
              actionsHtml = '<div class="boq-item-actions">' +
                '<button type="button" class="btn-boq-action btn-boq-edit" data-id="' + m.id + '" title="Edit Rumus Kustom">' +
                Icons.edit + '<span>Edit</span>' +
                '</button>' +
                '<button type="button" class="btn-boq-action btn-boq-delete" data-id="' + m.id + '" title="Hapus Rumus Kustom">' +
                Icons.trash + '<span>Hapus</span>' +
                '</button>' +
                '</div>';
            }

            html += '<div class="boq-item-card ' + (isActive ? 'active' : '') + '" data-model-id="' + m.id + '">' +
              '<div class="boq-item-top">' +
              '<div style="flex:1;">' +
              '<div class="boq-item-title">' + m.title + '</div>' +
              '<div class="boq-item-sub">' +
              (isCustom ? '<span style="color:#d97706; font-weight:700;">[Kustom]</span> &bull; ' : '') +
              (m.categoryName || 'Model Rumus') +
              '</div>' +
              '</div>' +
              '<div>' + Utils.formatUnitBadge(m.unit) + '</div>' +
              '</div>' +
              actionsHtml +
              '</div>';
          });
        }
        sidebarMenu.innerHTML = html;

        sidebarMenu.querySelectorAll('.boq-item-card').forEach(card => {
          card.addEventListener('click', (e) => {
            if (e.target.closest('.btn-boq-action')) return;
            this.boqEngine.activeModelId = card.dataset.modelId;
            this.renderBoq();
          });
        });

        if (searchInput && !searchInput.dataset.bound) {
          searchInput.dataset.bound = 'true';
          searchInput.addEventListener('input', () => {
            this.renderBoq();
          });
        }
      }

      const activeModel = this.boqEngine.getModelById(this.boqEngine.activeModelId);
      if (!activeModel) return;

      const titleEl = document.getElementById('boqActiveModelTitle');
      if (titleEl) titleEl.textContent = activeModel.title;

      const descEl = document.getElementById('boqActiveModelDesc');
      if (descEl) descEl.textContent = activeModel.description;

      const unitEl = document.getElementById('boqActiveModelUnit');
      if (unitEl) unitEl.innerHTML = Utils.formatUnitHtml(activeModel.unit);

      const badgeEl = document.getElementById('boqActiveModelBadge');
      if (badgeEl) {
        if (activeModel.isCustom) {
          badgeEl.innerHTML = '<span class="badge-custom-formula">' + Icons.bolt + ' Rumus Kustom</span>';
        } else {
          badgeEl.innerHTML = '';
        }
      }

      const actionsEl = document.getElementById('boqActiveCustomActions');
      if (actionsEl) {
        if (activeModel.isCustom) {
          actionsEl.innerHTML = '<button type="button" class="btn btn-secondary btn-sm" id="btnEditActiveCustom" data-id="' + activeModel.id + '">' +
            Icons.edit + '<span>Edit Rumus</span>' +
            '</button>' +
            '<button type="button" class="btn btn-secondary btn-sm" id="btnDeleteActiveCustom" data-id="' + activeModel.id + '" style="color:#dc2626;">' +
            Icons.trash + '<span>Hapus Rumus</span>' +
            '</button>';
        } else {
          actionsEl.innerHTML = '';
        }
      }

      const inputsContainer = document.getElementById('boqInputsContainer');
      if (inputsContainer) {
        let inputsHtml = '';
        activeModel.inputs.forEach(inp => {
          const isSelect = inp.type === 'select' || Array.isArray(inp.options);
          if (isSelect) {
            let optHtml = '';
            inp.options.forEach(opt => {
              const optVal = typeof opt === 'object' ? opt.value : opt;
              const optLabel = typeof opt === 'object' ? opt.label : opt;
              const isSelected = (optVal == (inp.default !== undefined ? inp.default : inp.options[0].value)) ? 'selected' : '';
              optHtml += '<option value="' + optVal + '" ' + isSelected + '>' + optLabel + '</option>';
            });
            inputsHtml += '<div class="form-group" style="grid-column: span ' + (inp.colSpan || 1) + ';">' +
              '<label class="form-label" style="display:flex; justify-content:space-between; align-items:center;">' +
              '<span>' + inp.label + ':</span>' +
              (inp.help ? '<span style="font-size:0.75rem; color:#0284c7; font-weight:600;">' + inp.help + '</span>' : '') +
              '</label>' +
              '<select class="form-select font-mono font-bold boq-dynamic-input" id="boq_inp_' + inp.key + '" data-key="' + inp.key + '" style="cursor:pointer; background-color:#f8fafc;">' +
              optHtml +
              '</select>' +
              '</div>';
          } else {
            inputsHtml += '<div class="form-group" style="grid-column: span ' + (inp.colSpan || 1) + ';">' +
              '<label class="form-label">' + inp.label + ':</label>' +
              '<div style="display:flex; align-items:center; gap:0.35rem;">' +
              '<input type="number" class="form-input font-mono font-bold boq-dynamic-input" id="boq_inp_' + inp.key + '" data-key="' + inp.key + '" value="' + (inp.default !== undefined ? inp.default : 1) + '" step="any" required>' +
              '<span style="font-size:0.8rem; color:#64748b; font-weight:600;">' + Utils.formatUnitHtml(inp.unit) + '</span>' +
              '</div>' +
              '</div>';
          }
        });
        inputsContainer.innerHTML = inputsHtml;

        inputsContainer.querySelectorAll('.boq-dynamic-input').forEach(inp => {
          inp.addEventListener('input', () => this.updateBoqOutputs());
          inp.addEventListener('change', () => this.updateBoqOutputs());
        });
      }

      // Render Technical Reference Table & Guidelines
      const refContainer = document.getElementById('boqFormulaRefTable');
      if (refContainer) {
        if (activeModel.refTable) {
          let refHtml = '<div class="boq-ref-card">' +
            '<div class="boq-ref-header">' +
            Icons.fileText + '<span>' + (activeModel.refTable.title || 'Petunjuk Pengisian & Spesifikasi Standar SNI') + '</span>' +
            '</div>' +
            '<div class="boq-ref-table-wrapper">' +
            '<table class="boq-ref-table">' +
            '<thead><tr>' +
            '<th style="width:28%;">Uraian &amp; Rumus</th>' +
            '<th style="width:25%;">Keterangan Variabel</th>' +
            '<th style="width:22%;">Contoh Nilai &amp; Hasil</th>' +
            '<th style="width:25%;">Petunjuk Pengisian</th>' +
            '</tr></thead><tbody>';

          activeModel.refTable.rows.forEach(r => {
            refHtml += '<tr>' +
              '<td><div style="font-weight:700; color:#0f172a; margin-bottom:0.25rem;">' + r.uraian + '</div><span class="boq-ref-code">' + r.rumus + '</span></td>' +
              '<td style="font-size:0.8rem; line-height:1.5;">' + r.variabel + '</td>' +
              '<td style="font-size:0.8rem; line-height:1.5;">' + r.contoh + '</td>' +
              '<td style="font-size:0.8rem; line-height:1.5; color:#475569;">' + r.petunjuk + '</td>' +
              '</tr>';
          });

          refHtml += '</tbody></table></div></div>';
          refContainer.innerHTML = refHtml;
        } else {
          refContainer.innerHTML = '';
        }
      }

      this.populateBoqTargetSelectors();
      this.updateBoqOutputs();
    }

    updateBoqOutputs() {
      const activeModel = this.boqEngine.getModelById(this.boqEngine.activeModelId);
      if (!activeModel) return;

      const parseVal = (val, defaultVal = 0) => {
        if (val === null || val === undefined || val === '') return defaultVal;
        const num = parseFloat(String(val).trim().replace(',', '.'));
        return isNaN(num) ? defaultVal : num;
      };

      const inputs = {};
      activeModel.inputs.forEach(inp => {
        const el = document.getElementById('boq_inp_' + inp.key);
        inputs[inp.key] = el ? parseVal(el.value, inp.default || 0) : (inp.default || 0);
      });

      const calcRes = activeModel.calculate(inputs);

      const outShowcase = document.getElementById('boqOutputsShowcase');
      if (outShowcase) {
        outShowcase.innerHTML = '<div class="card" style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color:#ffffff; padding:1.15rem; width:100%; max-width:100%; box-sizing:border-box; min-width:0;">' +
          '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">' +
          '<div style="min-width:0; flex:1 1 auto;">' +
          '<div style="font-size:0.75rem; opacity:0.9; text-transform:uppercase; font-weight:700; letter-spacing:0.5px;">HASIL PERHITUNGAN VOLUME PEKERJAAN</div>' +
          '<div style="font-size:1.75rem; font-weight:900; font-family:var(--font-mono); margin-top:0.25rem; line-height:1.2; word-break:break-word;">' +
          calcRes.volume.toFixed(2) + ' <span style="font-size:1.05rem; font-weight:600;">' + Utils.formatUnitHtml(activeModel.unit) + '</span>' +
          '</div>' +
          '</div>' +
          '<div style="background:rgba(255,255,255,0.18); padding:0.45rem 0.85rem; border-radius:6px; font-size:0.8rem; word-break:break-word; max-width:100%;">' +
          'Kode AHSP Acuan: <strong class="font-mono">' + (activeModel.ahspCode || 'PUPR 2026') + '</strong>' +
          '</div>' +
          '</div>' +
          '</div>';
      }

      const stepsContainer = document.getElementById('boqAuditTrailSteps');
      if (stepsContainer && calcRes.steps) {
        stepsContainer.innerHTML = calcRes.steps.map((st, i) => '<div style="margin-bottom:0.45rem; font-size:0.85rem; line-height:1.45; word-break:break-word; overflow-wrap:anywhere;"><strong>Langkah ' + (i + 1) + ':</strong> ' + st + '</div>').join('');
      }
    }

    populateBoqTargetSelectors() {
      const p = this.rabEngine.project;
      const divSelect = document.getElementById('boqTargetDivisionSelect');
      const itemSelect = document.getElementById('boqTargetItemSelect');
      if (!divSelect || !itemSelect) return;

      divSelect.innerHTML = p.divisions.map(d => '<option value="' + d.id + '">' + d.code + ' - ' + d.name + '</option>').join('');

      const updateItems = () => {
        const selectedDivId = divSelect.value;
        const div = p.divisions.find(d => d.id === selectedDivId);
        if (div && div.items.length > 0) {
          itemSelect.innerHTML = div.items.map(i => '<option value="' + i.id + '">' + i.wbsCode + ' ' + i.name + ' (' + i.volume + ' ' + Utils.formatUnitPlain(i.unit) + ')</option>').join('');
        } else {
          itemSelect.innerHTML = '<option value="">(Belum ada item di divisi ini)</option>';
        }
      };

      divSelect.addEventListener('change', updateItems);
      updateItems();
    }

    applyBoqToRab() {
      const activeModel = this.boqEngine.getModelById(this.boqEngine.activeModelId);
      if (!activeModel) return;

      const divSelect = document.getElementById('boqTargetDivisionSelect');
      const itemSelect = document.getElementById('boqTargetItemSelect');
      if (!divSelect || !itemSelect || !divSelect.value || !itemSelect.value) {
        alert('Pilih Divisi dan Item RAB tujuan terlebih dahulu!');
        return;
      }

      const parseVal = (val, defaultVal = 0) => {
        if (val === null || val === undefined || val === '') return defaultVal;
        const num = parseFloat(String(val).trim().replace(',', '.'));
        return isNaN(num) ? defaultVal : num;
      };

      const inputs = {};
      activeModel.inputs.forEach(inp => {
        const el = document.getElementById('boq_inp_' + inp.key);
        inputs[inp.key] = el ? parseVal(el.value, inp.default || 0) : (inp.default || 0);
      });

      const calcRes = activeModel.calculate(inputs);
      const unitPlain = Utils.formatUnitPlain(activeModel.unit);
      const backupData = {
        panjang: calcRes.panjang || inputs.panjang || inputs.P || inputs.keliling || calcRes.volume,
        lebar: calcRes.lebar || inputs.lebar || inputs.L || inputs.sisi || 1,
        tinggi: calcRes.tinggi || inputs.tinggi || inputs.T || inputs.tebal || 1,
        faktor: calcRes.faktor || inputs.faktor || inputs.N || inputs.jumlah || 1,
        rumusTitle: activeModel.title,
        steps: calcRes.steps ? calcRes.steps.join(' | ') : (calcRes.volume + ' ' + unitPlain)
      };

      this.rabEngine.setItemVolume(divSelect.value, itemSelect.value, calcRes.volume, backupData);
      this.render();
      this.showToast('Volume ' + calcRes.volume.toFixed(2) + ' ' + unitPlain + ' berhasil diterapkan ke RAB & Backup Sheet!');
    }

    openCreateCustomFormulaModal() {
      document.getElementById('customFormulaId').value = '';
      document.getElementById('customFormulaModalTitle').textContent = 'Buat Rumus Kustom Perhitungan Volume (Custom Formula)';
      document.getElementById('customFormulaName').value = '';
      document.getElementById('customFormulaCategory').value = 'custom';
      document.getElementById('customFormulaUnit').value = 'm3';
      document.getElementById('customFormulaExpression').value = '';
      document.getElementById('customFormulaVars').value = 'P: Panjang (m)\nL: Lebar (m)\nT: Tinggi / Tebal (m)\nN: Jumlah / Pengali (titik/unit)';
      document.getElementById('btnSubmitCustomFormula').textContent = 'Simpan & Gunakan Rumus';

      this.openModal('modalCustomFormula');
    }

    openEditCustomFormulaModal(formulaId) {
      const formula = this.boqEngine.getModelById(formulaId);
      if (!formula) return;

      document.getElementById('customFormulaId').value = formula.id;
      document.getElementById('customFormulaModalTitle').textContent = 'Edit Rumus Kustom: ' + formula.title;
      document.getElementById('customFormulaName').value = formula.title;
      document.getElementById('customFormulaCategory').value = formula.category || 'custom';
      document.getElementById('customFormulaUnit').value = Utils.formatUnitPlain(formula.unit);
      document.getElementById('customFormulaExpression').value = formula.formulaStr || formula.expression || '';
      
      const varsText = (formula.inputs || []).map(inp => inp.key + ': ' + inp.label).join('\n');
      document.getElementById('customFormulaVars').value = varsText || 'P: Panjang (m)\nL: Lebar (m)';
      document.getElementById('btnSubmitCustomFormula').textContent = 'Simpan Perubahan Rumus';

      this.openModal('modalCustomFormula');
    }

    deleteCustomFormula(formulaId) {
      const formula = this.boqEngine.getModelById(formulaId);
      if (!formula) return;

      if (confirm('Hapus rumus kustom "' + formula.title + '"?')) {
        this.boqEngine.deleteCustomFormula(formulaId);
        this.boqEngine.activeModelId = 'pondasi_batu_kali';
        this.renderBoq();
        this.showToast('Rumus kustom "' + formula.title + '" berhasil dihapus');
      }
    }

    saveCustomFormulaForm() {
      const id = document.getElementById('customFormulaId').value;
      const name = document.getElementById('customFormulaName').value;
      const category = document.getElementById('customFormulaCategory').value;
      const unit = document.getElementById('customFormulaUnit').value;
      const expression = document.getElementById('customFormulaExpression').value;
      const varsText = document.getElementById('customFormulaVars').value;

      const lines = varsText.split('\n').filter(l => l.trim());
      const inputs = [];

      lines.forEach(l => {
        const parts = l.split(':');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const label = parts[1].trim();
          inputs.push({ key, label, unit: unit, default: 1, step: 'any' });
        }
      });

      if (inputs.length === 0) {
        inputs.push({ key: 'P', label: 'Panjang (P)', unit: 'm', default: 10, step: 'any' });
        inputs.push({ key: 'L', label: 'Lebar (L)', unit: 'm', default: 1, step: 'any' });
      }

      const formulaData = {
        name,
        category,
        unit,
        expression,
        inputs
      };

      if (id) {
        const updated = this.boqEngine.updateCustomFormula(id, formulaData);
        this.boqEngine.activeModelId = id;
        this.showToast('Rumus kustom "' + name + '" berhasil diperbarui!');
      } else {
        const created = this.boqEngine.addCustomFormula(formulaData);
        this.boqEngine.activeModelId = created.id;
        this.showToast('Rumus kustom "' + name + '" berhasil dibuat & disimpan!');
      }

      this.closeModal('modalCustomFormula');
      this.renderBoq();
    }

    renderDatabase() {
      const search = document.getElementById('dbSearchInput')?.value || '';
      const division = document.getElementById('dbDivisionFilter')?.value || '';

      const filtered = this.ahspEngine.filter(search, division);
      const totalCount = filtered.length;

      const badge = document.getElementById('dbCountTotal');
      if (badge) badge.textContent = totalCount.toLocaleString('id-ID');

      const totalPages = Math.max(1, Math.ceil(totalCount / this.dbPageSize));
      this.dbCurrentPage = Math.min(this.dbCurrentPage, totalPages);

      const pageInfo = document.getElementById('dbPaginationInfo');
      if (pageInfo) pageInfo.textContent = 'Halaman ' + this.dbCurrentPage + ' / ' + totalPages;

      const tbody = document.getElementById('databaseAhspTableBody');
      if (!tbody) return;

      const startIdx = (this.dbCurrentPage - 1) * this.dbPageSize;
      const pageItems = filtered.slice(startIdx, startIdx + this.dbPageSize);

      let rowsHtml = '';
      pageItems.forEach((it, idx) => {
        rowsHtml += '<tr>' +
          '<td class="text-center font-mono" style="font-size:0.8rem;">' + (startIdx + idx + 1) + '</td>' +
          '<td class="font-mono font-bold" style="font-size:0.8rem; color:#0284c7;">' + (it.kode || '-') + '</td>' +
          '<td>' +
          '<div style="font-weight:600; font-size:0.85rem;">' + (it.nama || '-') + '</div>' +
          '<div style="font-size:0.75rem; color:#64748b;">' + (it.divisi || 'Umum') + '</div>' +
          '</td>' +
          '<td class="text-center font-mono" style="font-size:0.8rem;">' + Utils.formatUnitBadge(it.sat) + '</td>' +
          '<td class="text-right font-mono" style="font-size:0.8rem;">' + Utils.formatRupiah(it.biaya_bahan || 0) + '</td>' +
          '<td class="text-right font-mono" style="font-size:0.8rem;">' + Utils.formatRupiah(it.biaya_upah || 0) + '</td>' +
          '<td class="text-right font-mono font-bold" style="font-size:0.85rem; color:#0f172a;">' + Utils.formatRupiah(it.hsp_final || 0) + '</td>' +
          '<td class="text-center">' +
          '<div style="display:flex; gap:0.25rem; justify-content:center;">' +
          '<button class="btn btn-secondary btn-sm btn-edit-ahsp-row" data-code="' + it.kode + '" style="padding:0.2rem 0.45rem;" title="Edit Harga HSP">' + Icons.edit + '</button>' +
          '<button class="btn btn-secondary btn-sm btn-view-ahsp-detail" data-code="' + it.kode + '" style="padding:0.2rem 0.45rem;" title="Lihat Rincian Koefisien">' + Icons.eye + '</button>' +
          '</div>' +
          '</td>' +
          '</tr>';
      });

      tbody.innerHTML = rowsHtml || '<tr><td colspan="8" class="text-center" style="padding:2rem; color:#94a3b8;">Tidak ada item AHSP yang cocok dengan pencarian.</td></tr>';
    }

    // =====================================================================
    // EDITOR HARGA KOMPONEN METHODS
    // =====================================================================
    switchKomponenTab(tab) {
      this.currentKomponenTab = tab;
      const tabUpah  = document.getElementById('tabKomponenUpah');
      const tabBahan = document.getElementById('tabKomponenBahan');
      if (tab === 'upah') {
        if (tabUpah)  { tabUpah.style.color  = '#0369a1'; tabUpah.style.borderBottom  = '2px solid #0369a1'; tabUpah.style.fontWeight  = '700'; }
        if (tabBahan) { tabBahan.style.color = '#64748b'; tabBahan.style.borderBottom = 'none';              tabBahan.style.fontWeight = '600'; }
      } else {
        if (tabBahan) { tabBahan.style.color = '#166534'; tabBahan.style.borderBottom = '2px solid #16a34a'; tabBahan.style.fontWeight = '700'; }
        if (tabUpah)  { tabUpah.style.color  = '#64748b'; tabUpah.style.borderBottom  = 'none';              tabUpah.style.fontWeight  = '600'; }
      }
      const searchEl = document.getElementById('komponenSearchInput');
      if (searchEl) searchEl.value = '';
      this.renderKomponenEditor();
    }

    renderKomponenEditor() {
      const jenis   = this.currentKomponenTab || 'upah';
      const apiJenis = jenis === 'upah' ? 'tenaga' : 'bahan';
      const search  = (document.getElementById('komponenSearchInput')?.value || '').toLowerCase().trim();
      const priceMap = this.ahspEngine.loadKomponenPrices();
      const tbody    = document.getElementById('komponenEditorBody');
      const badge    = document.getElementById('komponenCountBadge');
      if (!tbody) return;

      let all = this.ahspEngine.getAllUniqueKomponen(apiJenis);
      if (search) all = all.filter(c => c.uraian.toLowerCase().includes(search));

      if (badge) badge.textContent = all.length + ' komponen ditemukan';

      const color = jenis === 'upah' ? '#0369a1' : '#166534';
      let rows = '';
      all.forEach((c, i) => {
        const key        = (apiJenis + '||' + c.uraian.toLowerCase().trim());
        const curHarga   = priceMap[key] !== undefined ? priceMap[key] : c.harga_satuan_default;
        const isModified = priceMap[key] !== undefined;
        rows += '<tr' + (isModified ? ' style="background:#fefce8;"' : '') + '>' +
          '<td class="text-center" style="font-size:0.8rem; color:#64748b;">' + (i + 1) + '</td>' +
          '<td style="font-weight:' + (isModified ? '700' : '500') + '; color:' + (isModified ? '#92400e' : '#0f172a') + ';">' +
            c.uraian + (isModified ? ' <span style="font-size:0.72rem; background:#fde68a; padding:1px 5px; border-radius:3px; color:#78350f;">✎ diubah</span>' : '') +
          '</td>' +
          '<td class="text-center font-mono" style="font-size:0.8rem;">' + c.satuan + '</td>' +
          '<td class="text-right font-mono" style="font-size:0.8rem; color:#64748b;">' + Utils.formatRupiah(c.harga_satuan_default) + '</td>' +
          '<td class="text-right">' +
            '<input type="number" min="0" step="1000" ' +
            'data-key="' + key + '" ' +
            'value="' + curHarga + '" ' +
            'style="width:100%; text-align:right; font-family:var(--font-mono); font-size:0.82rem; ' +
            'padding:0.2rem 0.4rem; border:1px solid ' + (isModified ? '#f59e0b' : '#cbd5e1') + '; border-radius:4px; ' +
            'background:' + (isModified ? '#fffbeb' : '#fff') + ';" ' +
            'onchange="this.style.borderColor=\'#f59e0b\'; this.style.background=\'#fffbeb\';">' +
          '</td>' +
          '</tr>';
      });

      tbody.innerHTML = rows || '<tr><td colspan="5" class="text-center" style="padding:2rem; color:#94a3b8;">Tidak ada komponen ditemukan.</td></tr>';
    }

    saveKomponenPrices() {
      const inputs = document.querySelectorAll('#komponenEditorBody input[data-key]');
      const priceMap = this.ahspEngine.loadKomponenPrices();
      let count = 0;

      inputs.forEach(inp => {
        const key = inp.dataset.key;
        const val = parseFloat(inp.value) || 0;
        if (val > 0) {
          priceMap[key] = val;
          count++;
        } else {
          delete priceMap[key];
        }
      });

      this.ahspEngine.saveKomponenPrices(priceMap);
      this.ahspEngine.initDatabase();
      this.ahspEngine.applyKomponenPrices();
      this.renderDatabase();
      this.renderKomponenEditor();
      this.showToast('✅ ' + count + ' harga komponen berhasil disimpan & diterapkan!');
    }

    // =====================================================================
    // REKAP KEBUTUHAN METHODS
    // =====================================================================
    switchRekkapTab(tab) {
      this.currentRekkapTab = tab;
      const tabBahan  = document.getElementById('tabRekkapBahan');
      const tabTenaga = document.getElementById('tabRekkapTenaga');
      if (tab === 'bahan') {
        if (tabBahan)  { tabBahan.style.color  = '#166534'; tabBahan.style.borderBottom  = '2px solid #16a34a'; tabBahan.style.fontWeight  = '700'; }
        if (tabTenaga) { tabTenaga.style.color = '#64748b'; tabTenaga.style.borderBottom = 'none';              tabTenaga.style.fontWeight = '600'; }
      } else {
        if (tabTenaga) { tabTenaga.style.color = '#0369a1'; tabTenaga.style.borderBottom = '2px solid #0369a1'; tabTenaga.style.fontWeight = '700'; }
        if (tabBahan)  { tabBahan.style.color  = '#64748b'; tabBahan.style.borderBottom  = 'none';              tabBahan.style.fontWeight  = '600'; }
      }
      this.renderRekkapContent(tab === 'bahan' ? 'bahan' : 'tenaga');
    }

    openRekkapModal() {
      this.currentRekkapTab = 'bahan';
      const tabBahan  = document.getElementById('tabRekkapBahan');
      const tabTenaga = document.getElementById('tabRekkapTenaga');
      if (tabBahan)  { tabBahan.style.color  = '#166534'; tabBahan.style.borderBottom  = '2px solid #16a34a'; tabBahan.style.fontWeight  = '700'; }
      if (tabTenaga) { tabTenaga.style.color = '#64748b'; tabTenaga.style.borderBottom = 'none';              tabTenaga.style.fontWeight = '600'; }
      this.openModal('modalRekkapKebutuhan');
      this.renderRekkapContent('bahan');
    }

    renderRekkapContent(jenis = 'bahan') {
      const bodyEl = document.getElementById('rekkapKebutuhanBody');
      if (!bodyEl) return;
      bodyEl.innerHTML = this.exportManager.generateRekkapKebutuhanHtml(null, jenis);
    }

    renderCashflow() {
      const p = this.rabEngine.project;
      const tbody = document.getElementById('cashflowTermijnTableBody');
      if (!tbody) return;

      const stages = [
        { no: 1, name: 'Uang Muka Kerja (Down Payment)', pct: 20, week: 'M-1', status: 'Cair / Approved', desc: 'Jaminan Uang Muka Bank Garansi 20%' },
        { no: 2, name: 'Termijn I (MC 01) - Prestasi Fisik 30%', pct: 25, week: 'M-5', status: 'Terencana', desc: 'Laporan Opname Fisik Lapangan >= 30%' },
        { no: 3, name: 'Termijn II (MC 02) - Prestasi Fisik 60%', pct: 25, week: 'M-10', status: 'Terencana', desc: 'Laporan Opname Fisik Lapangan >= 60%' },
        { no: 4, name: 'Termijn III (MC 03) - Prestasi Fisik 100% (PHO)', pct: 25, week: 'M-16', status: 'Terencana', desc: 'Berita Acara Serah Terima Pertama (PHO)' },
        { no: 5, name: 'Retensi Pemeliharaan (5%)', pct: 5, week: 'Pasca PHO', status: 'Jaminan', desc: 'Masa Pemeliharaan 180 Hari Kalender' }
      ];

      let rowsHtml = '';
      stages.forEach(st => {
        const nominal = (st.pct / 100) * p.grandTotal;
        rowsHtml += '<tr>' +
          '<td class="text-center font-mono">' + st.no + '</td>' +
          '<td style="font-weight:600;">' + st.name + '</td>' +
          '<td class="text-center font-mono font-bold">' + st.pct + '%</td>' +
          '<td class="text-right font-mono font-bold">' + Utils.formatRupiah(nominal) + '</td>' +
          '<td class="text-center font-mono">' + st.week + '</td>' +
          '<td class="text-center"><span class="badge ' + (st.status.includes('Cair') ? 'badge-success' : 'badge-info') + '">' + st.status + '</span></td>' +
          '<td style="font-size:0.8rem; color:#475569;">' + st.desc + '</td>' +
          '</tr>';
      });

      tbody.innerHTML = rowsHtml;
    }

    populateAhspDivisionFilter() {
      const select = document.getElementById('dbDivisionFilter');
      if (!select) return;

      const divs = this.ahspEngine.getDivisionsList();
      select.innerHTML = '<option value="">Semua Divisi / Bidang Pekerjaan</option>' + divs.map(d => '<option value="' + d + '">' + d + '</option>').join('');
    }

    populateOpnameWeekSelect() {
      const select = document.getElementById('opnameWeekSelect');
      if (!select) return;

      const dur = this.rabEngine.project.info.durationWeeks || 16;
      let opts = '';
      for (let w = 1; w <= dur; w++) {
        opts += '<option value="' + w + '">Minggu ke-' + w + ' (M-' + w + ')</option>';
      }
      select.innerHTML = opts;
    }

    openModal(modalId) {
      const el = document.getElementById(modalId);
      if (el) el.classList.add('active');
    }

    closeModal(modalId) {
      const el = document.getElementById(modalId);
      if (el) el.classList.remove('active');
    }

    openCreateProjectModal() {
      const activeProj = this.rabEngine.project;
      const newNameInput = document.getElementById('newProjNameInput');
      if (newNameInput) newNameInput.value = '';
      const yearInput = document.getElementById('newProjYearInput');
      if (yearInput) yearInput.value = '2026';
      const durInput = document.getElementById('newProjDurationInput');
      if (durInput) durInput.value = '16';
      const ppnInput = document.getElementById('newProjPpnInput');
      if (ppnInput) ppnInput.value = '11';
      const regionSelect = document.getElementById('newProjRegionSelect');
      if (regionSelect && activeProj.info && activeProj.info.region) {
        regionSelect.value = activeProj.info.region;
      }
      this.openModal('modalCreateProject');
      setTimeout(() => { if (newNameInput) newNameInput.focus(); }, 80);
    }

    submitCreateProjectForm() {
      const name = document.getElementById('newProjNameInput').value;
      if (!name || !name.trim()) {
        alert('Nama Paket Proyek harus diisi!');
        return;
      }

      const region = document.getElementById('newProjRegionSelect').value || 'MUARA_TEWEH';
      const year = document.getElementById('newProjYearInput').value || '2026';
      const program = document.getElementById('newProjProgramInput').value || 'PROGRAM PENINGKATAN PRASARANA, SARANA, DAN UTILITAS UMUM (PSU)';
      const contractor = document.getElementById('newProjContractorInput').value || 'CV. BARITO UTARA KONSTRUKSI';
      const consultant = document.getElementById('newProjConsultantInput').value || 'CV. KONSULTAN TEKNIK KAL-TENG';
      const durationWeeks = parseInt(document.getElementById('newProjDurationInput').value) || 16;
      const ppnPercent = parseFloat(document.getElementById('newProjPpnInput').value) || 11;
      
      const structureOption = document.querySelector('input[name="newProjStructureOption"]:checked');
      const withDefaultStructure = structureOption ? (structureOption.value === 'template') : false;

      // 1. Create blank project (this auto-saves old project into the saved archive)
      const newProj = this.rabEngine.createNewProject({
        name,
        region,
        year,
        program,
        contractor,
        consultant,
        durationWeeks,
        ppnPercent,
        withDefaultStructure
      });

      // 2. Sync active regional basis
      this.currentRegion = region;
      const topSelect = document.getElementById('regionSelect');
      if (topSelect) topSelect.value = region;
      this.applyRegionalPrices(region);

      this.closeModal('modalCreateProject');
      this.render();
      this.switchView('rab');
      this.showToast('Proyek lama berhasil disimpan ke arsip. Lembar proyek baru siap digunakan!');
    }

    openProjectManagerModal() {
      const searchInput = document.getElementById('projectManagerSearchInput');
      if (searchInput) searchInput.value = '';
      this.renderProjectManagerList('');
      this.openModal('modalProjectManager');
    }

    renderProjectManagerList(filterText = '') {
      const container = document.getElementById('projectManagerListContainer');
      if (!container) return;

      const list = this.rabEngine.getSavedProjectsList();
      const activeProjId = this.rabEngine.project.id || (this.rabEngine.project.info && this.rabEngine.project.info.id);
      const q = (filterText || '').toLowerCase().trim();

      const filtered = list.filter(p => {
        if (!q) return true;
        const name = (p.info && p.info.name) || '';
        const loc = (p.info && p.info.location) || '';
        const yr = (p.info && p.info.year) || '';
        return name.toLowerCase().includes(q) || loc.toLowerCase().includes(q) || yr.includes(q);
      });

      if (filtered.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:2rem 1rem; color:#64748b; background:#f8fafc; border-radius:8px; border:1px dashed #cbd5e1;">' +
          '<div style="font-size:1.1rem; font-weight:700; margin-bottom:0.35rem; color:#1e293b;">Tidak Ada Proyek Ditemukan</div>' +
          '<p style="font-size:0.85rem;">Tidak ada data proyek yang cocok dengan kata kunci pencarian Anda.</p>' +
          '</div>';
        return;
      }

      let html = '';
      filtered.forEach((p, idx) => {
        const info = p.info || {};
        const pId = p.id || info.id || ('proj_' + idx);
        const isActive = (pId === activeProjId);
        
        let totalItems = 0;
        (p.divisions || []).forEach(d => { totalItems += (d.items || []).length; });

        const updatedDate = p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';

        html += '<div class="card" style="margin-bottom:0; padding:1.15rem; border:' + (isActive ? '2px solid var(--primary-600); background:#f0f9ff;' : '1px solid var(--border-subtle);') + ' border-radius:var(--radius-lg); box-shadow:var(--shadow-sm);">' +
          '<div style="display:flex; justify-content:space-between; align-items:flex-start; gap:1rem; flex-wrap:wrap;">' +
          '<div style="flex:1; min-width:240px;">' +
          '<div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.35rem;">' +
          '<h4 style="font-size:1rem; font-weight:800; color:' + (isActive ? 'var(--primary-700);' : '#0f172a;') + ' margin:0;">' + (info.name || 'TANPA NAMA') + '</h4>' +
          (isActive ? '<span class="badge badge-primary" style="font-weight:800; font-size:0.7rem;">SEDANG AKTIF</span>' : '') +
          '</div>' +
          '<div style="font-size:0.8rem; color:#64748b; display:flex; flex-wrap:wrap; gap:0.75rem; margin-bottom:0.5rem;">' +
          '<span>📍 ' + (info.location || 'Kab. Barito Utara') + '</span>' +
          '<span>📅 TA: ' + (info.year || '2026') + '</span>' +
          '<span>⏱️ ' + (info.durationWeeks || 16) + ' Minggu</span>' +
          '<span>📂 ' + (p.divisions || []).length + ' Divisi (' + totalItems + ' Item)</span>' +
          '</div>' +
          '<div style="display:flex; align-items:baseline; gap:0.5rem;">' +
          '<span style="font-size:0.75rem; color:#475569; font-weight:600;">Total Nilai RAB (Kontrak):</span>' +
          '<span style="font-size:1.1rem; font-weight:800; font-family:var(--font-mono); color:var(--primary-700);">' + Utils.formatRupiah(p.grandTotal || 0) + '</span>' +
          '</div>' +
          '<div style="font-size:0.725rem; color:#94a3b8; margin-top:0.35rem;">Terakhir diedit: ' + updatedDate + '</div>' +
          '</div>' +
          '<div style="display:flex; gap:0.4rem; align-items:center; flex-wrap:wrap;">' +
          (isActive ?
            '<button type="button" class="btn btn-secondary btn-sm" disabled style="opacity:0.65; cursor:default;">Sedang Dibuka</button>' :
            '<button type="button" class="btn btn-primary btn-sm btn-open-saved-proj" data-id="' + pId + '" title="Buka dan jadikan proyek aktif untuk diedit">▶ Buka Proyek</button>') +
          '<button type="button" class="btn btn-outline btn-sm btn-dup-saved-proj" data-id="' + pId + '" title="Gandakan / Buat Salinan Proyek">📋 Duplikat</button>' +
          '<button type="button" class="btn btn-outline btn-sm btn-export-saved-proj" data-id="' + pId + '" title="Unduh File Cadangan JSON">💾 Backup</button>' +
          (!isActive ? '<button type="button" class="btn btn-outline btn-sm btn-del-saved-proj" data-id="' + pId + '" style="color:var(--rose-600); border-color:var(--rose-200);" title="Hapus Proyek dari Arsip">🗑️</button>' : '') +
          '</div>' +
          '</div>' +
          '</div>';
      });

      container.innerHTML = html;

      // Attach event clicks for list items
      container.querySelectorAll('.btn-open-saved-proj').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const pId = btn.getAttribute('data-id');
          this.handleOpenSavedProject(pId);
        });
      });

      container.querySelectorAll('.btn-dup-saved-proj').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const pId = btn.getAttribute('data-id');
          this.handleDuplicateSavedProject(pId);
        });
      });

      container.querySelectorAll('.btn-export-saved-proj').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const pId = btn.getAttribute('data-id');
          this.handleExportSavedProject(pId);
        });
      });

      container.querySelectorAll('.btn-del-saved-proj').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const pId = btn.getAttribute('data-id');
          this.handleDeleteSavedProject(pId);
        });
      });
    }

    handleOpenSavedProject(projId) {
      const loaded = this.rabEngine.openSavedProject(projId);
      if (loaded) {
        this.currentRegion = (loaded.info && loaded.info.region) || 'MUARA_TEWEH';
        const topSelect = document.getElementById('regionSelect');
        if (topSelect) topSelect.value = this.currentRegion;
        this.applyRegionalPrices(this.currentRegion);

        this.closeModal('modalProjectManager');
        this.render();
        this.showToast('Proyek "' + (loaded.info.name || '') + '" berhasil dibuka dan dimuat!');
      }
    }

    handleDuplicateSavedProject(projId) {
      const cloned = this.rabEngine.duplicateProject(projId);
      if (cloned) {
        this.renderProjectManagerList(document.getElementById('projectManagerSearchInput')?.value || '');
        this.showToast('Proyek berhasil disalin/diduplikat!');
      }
    }

    handleExportSavedProject(projId) {
      const list = this.rabEngine.getSavedProjectsList();
      const proj = list.find(p => p.id === projId || (p.info && p.info.id === projId)) || this.rabEngine.project;
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(proj, null, 2));
      const dlAnchor = document.createElement('a');
      const filename = (proj.info && proj.info.name ? proj.info.name.replace(/\s+/g, '_') : 'proyek') + '_backup.json';
      dlAnchor.setAttribute('href', dataStr);
      dlAnchor.setAttribute('download', filename);
      dlAnchor.click();
      this.showToast('File backup proyek berhasil diunduh');
    }

    handleDeleteSavedProject(projId) {
      if (confirm('Apakah Anda yakin ingin menghapus proyek ini secara permanen dari daftar arsip?')) {
        this.rabEngine.deleteSavedProject(projId);
        this.renderProjectManagerList(document.getElementById('projectManagerSearchInput')?.value || '');
        this.render();
        this.showToast('Proyek berhasil dihapus dari daftar');
      }
    }

    openProjectInfoModal() {
      const info = this.rabEngine.project.info;
      document.getElementById('projProgramInput').value = info.program || '';
      document.getElementById('projKegiatanInput').value = info.kegiatan || '';
      document.getElementById('projNameInput').value = info.name || '';
      document.getElementById('projLocationInput').value = info.location || '';
      document.getElementById('projYearInput').value = info.year || '';
      document.getElementById('projContractNoInput').value = info.contractNo || '';
      document.getElementById('projContractorInput').value = info.contractor || '';
      document.getElementById('projConsultantInput').value = info.consultant || '';
      document.getElementById('projDurationInput').value = info.durationWeeks || 16;
      document.getElementById('projPpnInput').value = info.ppnPercent || 11;

      this.openModal('modalProjectInfo');
    }

    saveProjectInfoForm() {
      const info = this.rabEngine.project.info;
      info.program = document.getElementById('projProgramInput').value;
      info.kegiatan = document.getElementById('projKegiatanInput').value;
      info.name = document.getElementById('projNameInput').value;
      info.location = document.getElementById('projLocationInput').value;
      info.year = document.getElementById('projYearInput').value;
      info.contractNo = document.getElementById('projContractNoInput').value;
      info.contractor = document.getElementById('projContractorInput').value;
      info.consultant = document.getElementById('projConsultantInput').value;
      info.durationWeeks = parseInt(document.getElementById('projDurationInput').value) || 16;
      info.ppnPercent = parseFloat(document.getElementById('projPpnInput').value) || 11;

      this.rabEngine.saveProject();
      this.closeModal('modalProjectInfo');
      this.render();
      this.showToast('Data Informasi Proyek berhasil diperbarui');
    }

    updateAddItemModalSource() {
      const sourceEl = document.getElementById('addItemSource');
      const ahspGroup = document.getElementById('ahspSelectGroup');
      const customGroup = document.getElementById('customItemFieldsGroup');
      if (!sourceEl || !ahspGroup || !customGroup) return;

      const isCustom = sourceEl.value === 'custom';
      if (isCustom) {
        ahspGroup.style.display = 'none';
        customGroup.style.display = 'block';
        const customNameInput = document.getElementById('addItemCustomName');
        if (customNameInput) {
          setTimeout(() => customNameInput.focus(), 60);
        }
      } else {
        ahspGroup.style.display = 'block';
        customGroup.style.display = 'none';
      }
    }

    openAddItemModal(divId) {
      document.getElementById('addItemDivisionId').value = divId;
      const select = document.getElementById('addItemAhspSelect');
      if (select) {
        const allAhsp = this.ahspEngine.getAll();
        select.innerHTML = allAhsp.slice(0, 500).map(a => '<option value="' + a.kode + '">[' + a.kode + '] ' + a.nama + ' - ' + Utils.formatRupiah(a.hsp_final) + '/' + Utils.formatUnitPlain(a.sat) + '</option>').join('');
      }

      // Reset custom inputs & source selector
      const customName = document.getElementById('addItemCustomName');
      if (customName) customName.value = '';
      const customUnit = document.getElementById('addItemCustomUnit');
      if (customUnit) customUnit.value = '';
      const customPrice = document.getElementById('addItemCustomPrice');
      if (customPrice) customPrice.value = '';

      const sourceSelect = document.getElementById('addItemSource');
      if (sourceSelect) {
        sourceSelect.value = 'ahsp';
      }
      this.updateAddItemModalSource();

      this.openModal('modalAddItem');
    }

    saveAddItemForm() {
      const divId = document.getElementById('addItemDivisionId').value;
      const source = document.getElementById('addItemSource').value;
      let itemData = {};

      if (source === 'ahsp') {
        const code = document.getElementById('addItemAhspSelect').value;
        const ahsp = this.ahspEngine.getByCode(code);
        if (ahsp) {
          itemData = {
            ahspCode: ahsp.kode,
            name: ahsp.nama,
            unit: ahsp.sat,
            unitPrice: ahsp.hsp_final,
            volume: parseFloat(document.getElementById('addItemVolume').value) || 1,
            startWeek: parseInt(document.getElementById('addItemStartWeek').value) || 1,
            endWeek: parseInt(document.getElementById('addItemEndWeek').value) || 4
          };
        }
      } else {
        const customName = (document.getElementById('addItemCustomName').value || '').trim();
        const customUnit = (document.getElementById('addItemCustomUnit').value || '').trim() || 'ls';
        const customPrice = parseFloat(document.getElementById('addItemCustomPrice').value) || 0;

        if (!customName) {
          alert('Silakan masukkan Uraian / Nama Pekerjaan terlebih dahulu!');
          const nameInput = document.getElementById('addItemCustomName');
          if (nameInput) nameInput.focus();
          return;
        }

        itemData = {
          ahspCode: 'CUSTOM',
          name: customName,
          unit: customUnit,
          unitPrice: customPrice,
          volume: parseFloat(document.getElementById('addItemVolume').value) || 1,
          startWeek: parseInt(document.getElementById('addItemStartWeek').value) || 1,
          endWeek: parseInt(document.getElementById('addItemEndWeek').value) || 4
        };
      }

      this.rabEngine.addItem(divId, itemData);
      this.closeModal('modalAddItem');
      this.render();
      this.showToast('Item berhasil dimasukkan ke RAB');
    }

    openEditAhspModal(code) {
      const ahsp = this.ahspEngine.getByCode(code);
      if (!ahsp) return;

      document.getElementById('editAhspCode').value = ahsp.kode;
      document.getElementById('editAhspCodeDisplay').value = ahsp.kode;
      document.getElementById('editAhspDivision').value = ahsp.divisi || 'Umum';
      document.getElementById('editAhspName').value = ahsp.nama || '';
      document.getElementById('editAhspUnit').value = Utils.formatUnitPlain(ahsp.sat) || '';
      document.getElementById('editAhspPrice').value = ahsp.hsp_final || 0;

      this.openModal('modalEditAhsp');
    }

    saveEditAhspForm() {
      const code = document.getElementById('editAhspCode').value;
      const updated = {
        nama: document.getElementById('editAhspName').value,
        sat: document.getElementById('editAhspUnit').value,
        hsp_final: parseFloat(document.getElementById('editAhspPrice').value) || 0
      };

      this.ahspEngine.updateItem(code, updated);

      this.rabEngine.project.divisions.forEach(div => {
        div.items.forEach(it => {
          if (it.ahspCode === code) {
            it.name = updated.nama;
            it.unit = updated.sat;
            it.unitPrice = updated.hsp_final;
          }
        });
      });

      this.rabEngine.saveProject();
      this.closeModal('modalEditAhsp');
      this.render();
      this.showToast('AHSP ' + code + ' berhasil diperbarui');
    }

    openAhspDetailModal(code) {
      const ahsp = this.ahspEngine.getByCode(code);
      if (!ahsp) return;

      const titleEl = document.getElementById('ahspDetailTitle');
      if (titleEl) titleEl.textContent = 'Rincian Analisa [' + ahsp.kode + '] - ' + ahsp.nama;

      const bodyEl = document.getElementById('ahspDetailBody');
      if (bodyEl) {
        const comps = ahsp.components || [];
        const tenagaComps = comps.filter(c => c.jenis === 'tenaga');
        const bahanComps  = comps.filter(c => c.jenis === 'bahan');
        const alatComps   = comps.filter(c => c.jenis === 'alat');
        let compRows = '';
        let totalTenaga = 0, totalBahan = 0, totalAlat = 0;

        if (comps.length > 0) {
          // A. TENAGA KERJA
          if (tenagaComps.length > 0) {
            compRows += '<tr style="background:#eff6ff;"><td colspan="6" style="padding:6px 10px; font-weight:bold; color:#1d4ed8; font-size:0.82rem;">A. TENAGA KERJA</td></tr>';
            tenagaComps.forEach((c, idx) => {
              const jml = c.jumlah_harga || (c.koefisien * c.harga_satuan) || 0;
              totalTenaga += jml;
              compRows += '<tr><td class="text-center font-mono">' + (idx+1) + '</td>' +
                '<td>' + (c.uraian||'-') + '</td>' +
                '<td class="text-center font-mono">' + Utils.formatUnitBadge('OH') + '</td>' +
                '<td class="text-right font-mono">' + Utils.formatNumber(c.koefisien||0, 4) + '</td>' +
                '<td class="text-right font-mono">' + Utils.formatRupiah(c.harga_satuan||0) + '</td>' +
                '<td class="text-right font-mono font-bold">' + Utils.formatRupiah(jml) + '</td></tr>';
            });
            compRows += '<tr style="background:#dbeafe;"><td colspan="5" style="text-align:right; padding:5px 10px; font-weight:bold; color:#1d4ed8;">Jumlah Tenaga Kerja (A):</td>' +
              '<td class="text-right font-mono font-bold" style="color:#1d4ed8;">' + Utils.formatRupiah(totalTenaga) + '</td></tr>';
          }
          // B. BAHAN
          if (bahanComps.length > 0) {
            compRows += '<tr style="background:#f0fdf4;"><td colspan="6" style="padding:6px 10px; font-weight:bold; color:#166534; font-size:0.82rem;">B. BAHAN / MATERIAL</td></tr>';
            bahanComps.forEach((c, idx) => {
              const jml = c.jumlah_harga || (c.koefisien * c.harga_satuan) || 0;
              totalBahan += jml;
              compRows += '<tr><td class="text-center font-mono">' + (idx+1) + '</td>' +
                '<td>' + (c.uraian||'-') + '</td>' +
                '<td class="text-center font-mono">' + Utils.formatUnitBadge(c.satuan||'-') + '</td>' +
                '<td class="text-right font-mono">' + Utils.formatNumber(c.koefisien||0, 4) + '</td>' +
                '<td class="text-right font-mono">' + Utils.formatRupiah(c.harga_satuan||0) + '</td>' +
                '<td class="text-right font-mono font-bold">' + Utils.formatRupiah(jml) + '</td></tr>';
            });
            compRows += '<tr style="background:#dcfce7;"><td colspan="5" style="text-align:right; padding:5px 10px; font-weight:bold; color:#166534;">Jumlah Bahan (B):</td>' +
              '<td class="text-right font-mono font-bold" style="color:#166534;">' + Utils.formatRupiah(totalBahan) + '</td></tr>';
          }
          // C. PERALATAN
          if (alatComps.length > 0) {
            compRows += '<tr style="background:#fffbeb;"><td colspan="6" style="padding:6px 10px; font-weight:bold; color:#92400e; font-size:0.82rem;">C. PERALATAN</td></tr>';
            alatComps.forEach((c, idx) => {
              const jml = c.jumlah_harga || (c.koefisien * c.harga_satuan) || 0;
              totalAlat += jml;
              compRows += '<tr><td class="text-center font-mono">' + (idx+1) + '</td>' +
                '<td>' + (c.uraian||'-') + '</td>' +
                '<td class="text-center font-mono">' + Utils.formatUnitBadge(c.satuan||'-') + '</td>' +
                '<td class="text-right font-mono">' + Utils.formatNumber(c.koefisien||0, 4) + '</td>' +
                '<td class="text-right font-mono">' + Utils.formatRupiah(c.harga_satuan||0) + '</td>' +
                '<td class="text-right font-mono font-bold">' + Utils.formatRupiah(jml) + '</td></tr>';
            });
            compRows += '<tr style="background:#fef9c3;"><td colspan="5" style="text-align:right; padding:5px 10px; font-weight:bold; color:#92400e;">Jumlah Peralatan (C):</td>' +
              '<td class="text-right font-mono font-bold" style="color:#92400e;">' + Utils.formatRupiah(totalAlat) + '</td></tr>';
          } else {
            compRows += '<tr style="background:#fafafa;"><td colspan="6" style="padding:5px 10px; color:#94a3b8; font-style:italic; font-size:0.82rem;">C. Peralatan: -</td></tr>';
          }
          const biayaLangsung = totalTenaga + totalBahan + totalAlat;
          const overhead = ahsp.overhead || Math.round(biayaLangsung * 0.10);
          compRows += '<tr style="background:#f1f5f9; font-weight:bold;"><td colspan="5" style="text-align:right; padding:6px 10px;">D. Jumlah Biaya Langsung (A+B+C):</td>' +
            '<td class="text-right font-mono font-bold">' + Utils.formatRupiah(biayaLangsung) + '</td></tr>' +
            '<tr style="background:#f8fafc;"><td colspan="5" style="text-align:right; padding:6px 10px;">E. Biaya Umum & Keuntungan (10% &times; D):</td>' +
            '<td class="text-right font-mono">' + Utils.formatRupiah(overhead) + '</td></tr>';
        } else {
          const biayaTenaga = ahsp.biaya_upah || 0;
          const biayaBahan  = ahsp.biaya_bahan || 0;
          const biayaAlat   = ahsp.biaya_alat || 0;
          const biayaLangsung = biayaTenaga + biayaBahan + biayaAlat;
          const overhead = ahsp.overhead || Math.round(biayaLangsung * 0.10);
          if (biayaTenaga > 0) compRows += '<tr style="background:#eff6ff;"><td colspan="6" style="padding:6px 10px; font-weight:bold; color:#1d4ed8;">A. TENAGA KERJA</td></tr>' +
            '<tr><td class="text-center">-</td><td>Upah Tenaga Kerja (sesuai koefisien AHSP)</td><td class="text-center">OH</td><td class="text-right">-</td><td class="text-right">-</td><td class="text-right font-mono font-bold">' + Utils.formatRupiah(biayaTenaga) + '</td></tr>';
          if (biayaBahan > 0) compRows += '<tr style="background:#f0fdf4;"><td colspan="6" style="padding:6px 10px; font-weight:bold; color:#166534;">B. BAHAN / MATERIAL</td></tr>' +
            '<tr><td class="text-center">-</td><td>Bahan & Material</td><td class="text-center">-</td><td class="text-right">-</td><td class="text-right">-</td><td class="text-right font-mono font-bold">' + Utils.formatRupiah(biayaBahan) + '</td></tr>';
          if (biayaAlat > 0) compRows += '<tr style="background:#fffbeb;"><td colspan="6" style="padding:6px 10px; font-weight:bold; color:#92400e;">C. PERALATAN</td></tr>' +
            '<tr><td class="text-center">-</td><td>Biaya Sewa Peralatan</td><td class="text-center">-</td><td class="text-right">-</td><td class="text-right">-</td><td class="text-right font-mono font-bold">' + Utils.formatRupiah(biayaAlat) + '</td></tr>';
          compRows += '<tr style="background:#f1f5f9; font-weight:bold;"><td colspan="5" style="text-align:right; padding:6px 10px;">D. Jumlah Biaya Langsung:</td>' +
            '<td class="text-right font-mono font-bold">' + Utils.formatRupiah(biayaLangsung) + '</td></tr>' +
            '<tr style="background:#f8fafc;"><td colspan="5" style="text-align:right; padding:6px 10px;">E. Biaya Umum & Keuntungan (10%):</td>' +
            '<td class="text-right font-mono">' + Utils.formatRupiah(overhead) + '</td></tr>';
        }

        bodyEl.innerHTML = '<div style="margin-bottom:1rem; background:#f8fafc; padding:1rem; border-radius:6px; border:1px solid #e2e8f0;">' +
          '<div style="font-size:0.82rem; color:#64748b;">Standar: <strong>SE Bina Konstruksi No 47 Tahun 2026</strong></div>' +
          '<div style="font-size:1.1rem; font-weight:800; color:#0f172a; margin-top:0.25rem;">' + ahsp.nama + '</div>' +
          '<div style="font-size:0.82rem; margin-top:0.3rem; color:#0284c7;">Satuan: <strong>1 ' + Utils.formatUnitPlain(ahsp.sat) + '</strong> &nbsp;&middot;&nbsp; Divisi: <strong>' + (ahsp.divisi||'-') + '</strong></div>' +
          '</div>' +
          '<table class="data-table" style="font-size:0.82rem;">' +
          '<thead><tr style="background:#f1f5f9;">' +
          '<th style="width:45px;" class="text-center">No</th>' +
          '<th>Uraian Komponen</th>' +
          '<th style="width:65px;" class="text-center">Sat</th>' +
          '<th style="width:90px;" class="text-right">Koefisien</th>' +
          '<th style="width:130px;" class="text-right">Harga Satuan (Rp)</th>' +
          '<th style="width:140px;" class="text-right">Jumlah Harga (Rp)</th>' +
          '</tr></thead>' +
          '<tbody>' + compRows + '</tbody>' +
          '<tfoot><tr style="background:#e0f2fe; font-weight:bold;">' +
          '<td colspan="5" style="text-align:right; padding:7px 10px; color:#0369a1;">F. HARGA SATUAN PEKERJAAN / HSP (D + E):</td>' +
          '<td class="text-right font-mono" style="color:#0369a1; font-size:1rem;">' + Utils.formatRupiah(ahsp.hsp_final) + '</td>' +
          '</tr></tfoot>' +
          '</table>';
      }

      this.openModal('modalAhspDetail');
    }

    showToast(message) {
      const container = document.getElementById('toastContainer');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = 'toast active';
      toast.style.background = '#0f172a';
      toast.style.color = '#ffffff';
      toast.style.padding = '0.75rem 1.25rem';
      toast.style.borderRadius = '6px';
      toast.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.2)';
      toast.style.marginBottom = '0.5rem';
      toast.style.fontSize = '0.85rem';
      toast.style.display = 'flex';
      toast.style.alignItems = 'center';
      toast.style.gap = '0.5rem';
      toast.innerHTML = '<span style="color:#38bdf8;">' + Icons.bolt + '</span><span>' + message + '</span>';

      container.appendChild(toast);
      setTimeout(() => {
        toast.remove();
      }, 3500);
    }

    // =========================================================================
    // AUTHENTICATION & SINGLE-PAGE PORTAL CONTROLLER
    // =========================================================================
    initAuthPortal() {
      window._showAuthOverlay = (msg) => this.showAuthOverlay(msg);
      window._hideAuthOverlay = () => this.hideAuthOverlay();

      const overlay = document.getElementById('authPortalOverlay');
      if (!overlay) return;

      // Tab switcher handlers (Masuk, Daftar Baru, Lupa Sandi)
      const tabBtns = overlay.querySelectorAll('.auth-tab-btn');
      tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetTabId = btn.getAttribute('data-auth-tab');
          this.switchAuthTab(targetTabId);
        });
      });

      const btnGoToForgot = document.getElementById('btnGoToForgot');
      if (btnGoToForgot) {
        btnGoToForgot.addEventListener('click', (e) => {
          e.preventDefault();
          this.switchAuthTab('authTabForgot');
        });
      }

      const btnBackToLogin = document.getElementById('btnBackToLogin');
      if (btnBackToLogin) {
        btnBackToLogin.addEventListener('click', (e) => {
          e.preventDefault();
          this.switchAuthTab('authTabLogin');
        });
      }

      const btnCancel2FA = document.getElementById('btnCancel2FA');
      if (btnCancel2FA) {
        btnCancel2FA.addEventListener('click', (e) => {
          e.preventDefault();
          this.switchAuthTab('authTabLogin');
        });
      }

      // 1. Form Login Submit
      const formLogin = document.getElementById('formPortalLogin');
      if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
          e.preventDefault();
          const emailOrUsername = document.getElementById('loginPortalEmail').value.trim();
          const password = document.getElementById('loginPortalPassword').value;
          const remember = document.getElementById('loginPortalRemember')?.checked || false;
          const btnSubmit = document.getElementById('btnSubmitPortalLogin');

          this.setBtnLoading(btnSubmit, true);
          this.setAuthPortalAlert(null);

          try {
            const res = await API.login({ emailOrUsername, password, remember });
            if (!res.success) {
              this.setAuthPortalAlert('danger', res.message || 'Login gagal. Periksa username dan password Anda.');
              return;
            }
            if (res.requires2FA) {
              this.temp2FAToken = res.tempToken;
              this.switchAuthTab('authTab2FA');
              this.setAuthPortalAlert('info', 'Masukkan 6 digit kode dari Google Authenticator Anda.');
            } else if (res.token || res.accessToken) {
              this.hideAuthOverlay();
              this.showToast('Selamat datang kembali, ' + (res.user ? res.user.name : emailOrUsername) + '!');
              this.loadUserProfile();
              this.switchView('dashboard');
            } else {
              this.setAuthPortalAlert('danger', res.message || 'Login gagal. Periksa username dan password Anda.');
            }
          } catch (err) {
            this.setAuthPortalAlert('danger', err.message || 'Login gagal. Periksa username dan password Anda.');
          } finally {
            this.setBtnLoading(btnSubmit, false);
          }
        });
      }

      // 2. Form Register Submit
      const formRegister = document.getElementById('formPortalRegister');
      if (formRegister) {
        formRegister.addEventListener('submit', async (e) => {
          e.preventDefault();
          const name = document.getElementById('regPortalName').value.trim();
          const email = document.getElementById('regPortalEmail').value.trim();
          const password = document.getElementById('regPortalPassword').value;
          const confirmPassword = document.getElementById('regPortalConfirmPassword').value;
          const btnSubmit = document.getElementById('btnSubmitPortalRegister');

          if (password !== confirmPassword) {
            this.setAuthPortalAlert('danger', 'Konfirmasi kata sandi tidak cocok.');
            return;
          }

          this.setBtnLoading(btnSubmit, true);
          this.setAuthPortalAlert(null);

          try {
            const res = await API.register({ name, email, password, confirmPassword });
            formRegister.reset();
            this.switchAuthTab('authTabLogin');
            const loginEmailInput = document.getElementById('loginPortalEmail');
            if (loginEmailInput) loginEmailInput.value = email;
            const alertMsg = res.message || 'Pendaftaran berhasil! Akun Anda telah aktif secara otomatis (Auto Approve). Silakan masukkan kata sandi untuk masuk.';
            this.setAuthPortalAlert('success', alertMsg);
          } catch (err) {
            this.setAuthPortalAlert('danger', err.message || 'Pendaftaran gagal.');
          } finally {
            this.setBtnLoading(btnSubmit, false);
          }
        });
      }

      // 3. Form Forgot Password Submit
      const formForgot = document.getElementById('formPortalForgot');
      if (formForgot) {
        formForgot.addEventListener('submit', async (e) => {
          e.preventDefault();
          const email = document.getElementById('forgotPortalEmail').value.trim();
          const btnSubmit = document.getElementById('btnSubmitPortalForgot');

          this.setBtnLoading(btnSubmit, true);
          this.setAuthPortalAlert(null);

          try {
            const res = await API.forgotPassword(email);
            this.setAuthPortalAlert('success', res.message || 'Tautan reset kata sandi telah dikirim ke email Anda.');
          } catch (err) {
            this.setAuthPortalAlert('danger', err.message || 'Gagal memproses permintaan reset sandi.');
          } finally {
            this.setBtnLoading(btnSubmit, false);
          }
        });
      }

      // 4. Form 2FA OTP Submit on Login
      const form2FA = document.getElementById('formPortal2FA');
      if (form2FA) {
        form2FA.addEventListener('submit', async (e) => {
          e.preventDefault();
          const code = document.getElementById('login2FACode').value.trim();
          const btnSubmit = document.getElementById('btnSubmitPortal2FA');

          if (!this.temp2FAToken) {
            this.switchAuthTab('authTabLogin');
            this.setAuthPortalAlert('danger', 'Sesi 2FA kedaluwarsa, silakan login kembali.');
            return;
          }

          this.setBtnLoading(btnSubmit, true);
          this.setAuthPortalAlert(null);

          try {
            const res = await API.verifyLogin2FA(this.temp2FAToken, code);
            if (res.token) {
              this.hideAuthOverlay();
              this.showToast('Autentikasi 2FA berhasil!');
              this.loadUserProfile();
              this.switchView('dashboard');
            }
          } catch (err) {
            this.setAuthPortalAlert('danger', err.message || 'Kode OTP tidak valid.');
          } finally {
            this.setBtnLoading(btnSubmit, false);
          }
        });
      }

      // Initial token check
      const token = localStorage.getItem('access_token');
      if (!token) {
        this.showAuthOverlay();
      } else {
        this.hideAuthOverlay();
        this.loadUserProfile();
      }
    }

    switchAuthTab(tabId) {
      const overlay = document.getElementById('authPortalOverlay');
      if (!overlay) return;

      overlay.querySelectorAll('.auth-tab-btn').forEach(btn => {
        const isMatch = btn.getAttribute('data-auth-tab') === tabId;
        btn.classList.toggle('active', isMatch);
        btn.style.background = isMatch ? '#ffffff' : 'transparent';
        btn.style.color = isMatch ? 'var(--slate-900)' : 'var(--slate-600)';
        btn.style.fontWeight = isMatch ? '700' : '600';
        btn.style.boxShadow = isMatch ? 'var(--shadow-sm)' : 'none';
      });

      overlay.querySelectorAll('.auth-tab-content').forEach(content => {
        content.style.display = (content.id === tabId) ? 'block' : 'none';
      });

      this.setAuthPortalAlert(null);
    }

    showAuthOverlay(msg) {
      const overlay = document.getElementById('authPortalOverlay');
      if (overlay) {
        overlay.style.display = 'flex';
        if (msg) {
          this.setAuthPortalAlert('warning', msg);
        }
      }
    }

    hideAuthOverlay() {
      const overlay = document.getElementById('authPortalOverlay');
      if (overlay) {
        overlay.style.display = 'none';
      }
    }

    setAuthPortalAlert(type, message) {
      const alertEl = document.getElementById('authPortalAlert');
      if (!alertEl) return;
      if (!type || !message) {
        alertEl.style.display = 'none';
        alertEl.textContent = '';
        return;
      }
      alertEl.className = 'alert alert-' + type;
      alertEl.style.display = 'block';
      alertEl.textContent = message;
    }

    setBtnLoading(btn, isLoading) {
      if (!btn) return;
      btn.disabled = isLoading;
      const textSpan = btn.querySelector('.btn-text');
      const spinner = btn.querySelector('.spinner');
      if (textSpan) textSpan.style.opacity = isLoading ? '0.4' : '1';
      if (spinner) spinner.style.display = isLoading ? 'inline-block' : 'none';
    }

    // =========================================================================
    // SETTINGS & USER MANAGEMENT CONTROLLER
    // =========================================================================
    initSettingsManager() {
      // Sub-tab switching in Settings View
      const settingsTabBtns = document.querySelectorAll('.settings-tab-btn');
      settingsTabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const tabKey = btn.getAttribute('data-tab');
          if (!tabKey) return;

          settingsTabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          document.querySelectorAll('.settings-section').forEach(sec => {
            sec.style.display = (sec.id === tabKey) ? 'block' : 'none';
          });

          if (tabKey === 'tabSessions') {
            this.loadSessionsList();
          } else if (tabKey === 'tabPreferences') {
            this.loadUserPreferences();
          } else if (tabKey === 'tabAdminUsers') {
            this.loadAdminUsers();
          }
        });
      });

      // 1. Form Profile Save
      const formProfile = document.getElementById('formProfile');
      if (formProfile) {
        formProfile.addEventListener('submit', async (e) => {
          e.preventDefault();
          const name = document.getElementById('profileName').value.trim();
          const phone = document.getElementById('profilePhone').value.trim();
          const bio = document.getElementById('profileBio').value.trim();
          const btnSubmit = document.getElementById('btnSaveProfile');

          this.setBtnLoading(btnSubmit, true);
          try {
            const res = await API.updateProfile({ name, phone, bio });
            this.showToast('Profil berhasil diperbarui!');
            if (res.user) {
              const topbarUserName = document.getElementById('topbarUserName');
              if (topbarUserName) topbarUserName.textContent = res.user.name;
              localStorage.setItem('user_info', JSON.stringify(res.user));
            }
          } catch (err) {
            alert(err.message || 'Gagal memperbarui profil.');
          } finally {
            this.setBtnLoading(btnSubmit, false);
          }
        });
      }

      // Avatar File Upload
      const avatarInput = document.getElementById('avatarFileInput');
      if (avatarInput) {
        avatarInput.addEventListener('change', async (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const formData = new FormData();
          formData.append('avatar', file);

          try {
            const res = await API.uploadAvatar(formData);
            if (res.avatarUrl) {
              const preview = document.getElementById('avatarPreview');
              if (preview) preview.src = res.avatarUrl;
              this.showToast('Foto profil berhasil diunggah!');
            }
          } catch (err) {
            alert(err.message || 'Gagal mengunggah foto profil.');
          }
        });
      }

      // 2. Change Email
      const formChangeEmail = document.getElementById('formChangeEmail');
      if (formChangeEmail) {
        formChangeEmail.addEventListener('submit', async (e) => {
          e.preventDefault();
          const newEmail = document.getElementById('newEmailInput').value.trim();
          const btnSubmit = document.getElementById('btnChangeEmail');

          this.setBtnLoading(btnSubmit, true);
          try {
            const res = await API.changeEmail(newEmail);
            alert(res.message || 'Tautan konfirmasi telah dikirim ke alamat email baru.');
            formChangeEmail.reset();
          } catch (err) {
            alert(err.message || 'Gagal memproses perubahan email.');
          } finally {
            this.setBtnLoading(btnSubmit, false);
          }
        });
      }

      // 3. Change Password
      const formChangePassword = document.getElementById('formChangePassword');
      if (formChangePassword) {
        formChangePassword.addEventListener('submit', async (e) => {
          e.preventDefault();
          const oldPassword = document.getElementById('oldPassword').value;
          const newPassword = document.getElementById('newPasswordInput').value;
          const confirmPassword = document.getElementById('confirmNewPasswordInput').value;
          const btnSubmit = document.getElementById('btnSavePassword');

          if (newPassword !== confirmPassword) {
            alert('Konfirmasi kata sandi baru tidak cocok.');
            return;
          }

          this.setBtnLoading(btnSubmit, true);
          try {
            const res = await API.changePassword(oldPassword, newPassword, confirmPassword);
            this.showToast('Kata sandi berhasil diperbarui!');
            formChangePassword.reset();
          } catch (err) {
            alert(err.message || 'Gagal mengubah kata sandi.');
          } finally {
            this.setBtnLoading(btnSubmit, false);
          }
        });
      }

      // 4. Toggle 2FA Button
      const btnToggle2FA = document.getElementById('btnSettingsToggle2FA');
      if (btnToggle2FA) {
        btnToggle2FA.addEventListener('click', (e) => {
          e.preventDefault();
          if (this.user2FAEnabled) {
            this.openModal('modalDisable2FA');
          } else {
            this.startSetup2FA();
          }
        });
      }

      // 2FA Setup Form
      const formSetup2FA = document.getElementById('formVerifySetup2FA');
      if (formSetup2FA) {
        formSetup2FA.addEventListener('submit', async (e) => {
          e.preventDefault();
          const secret = document.getElementById('setupSecretKey').value;
          const token = document.getElementById('setupOtpCode').value.trim();
          const btnSubmit = document.getElementById('btnSubmitSetup2FA');

          this.setBtnLoading(btnSubmit, true);
          try {
            const res = await API.enable2FA(secret, token);
            this.closeAllModals();
            this.showToast('2FA berhasil diaktifkan pada akun Anda!');
            this.loadUserProfile();
          } catch (err) {
            alert(err.message || 'Kode OTP tidak valid.');
          } finally {
            this.setBtnLoading(btnSubmit, false);
          }
        });
      }

      // 2FA Disable Form
      const formDisable2FA = document.getElementById('formDisable2FA');
      if (formDisable2FA) {
        formDisable2FA.addEventListener('submit', async (e) => {
          e.preventDefault();
          const password = document.getElementById('disablePassword').value;
          const btnSubmit = document.getElementById('btnConfirmDisable');

          this.setBtnLoading(btnSubmit, true);
          try {
            const res = await API.disable2FA(password);
            this.closeAllModals();
            this.showToast('2FA berhasil dinonaktifkan.');
            formDisable2FA.reset();
            this.loadUserProfile();
          } catch (err) {
            alert(err.message || 'Gagal menonaktifkan 2FA. Periksa password Anda.');
          } finally {
            this.setBtnLoading(btnSubmit, false);
          }
        });
      }

      // 5. Revoke All Sessions
      const btnRevokeAll = document.getElementById('btnSettingsRevokeAll');
      if (btnRevokeAll) {
        btnRevokeAll.addEventListener('click', async (e) => {
          e.preventDefault();
          if (confirm('Apakah Anda yakin ingin mengeluarkan seluruh sesi perangkat lain?')) {
            try {
              await API.revokeOtherSessions();
              this.showToast('Semua sesi perangkat lain berhasil dihentikan.');
              this.loadSessionsList();
            } catch (err) {
              alert(err.message || 'Gagal me-revoke sesi.');
            }
          }
        });
      }

      // 6. Preferences Form
      const formPref = document.getElementById('formPreferences');
      if (formPref) {
        formPref.addEventListener('submit', async (e) => {
          e.preventDefault();
          const emailNotif = document.getElementById('prefEmailNotif').checked;
          const pushNotif = document.getElementById('prefPushNotif').checked;
          const btnSubmit = document.getElementById('btnSavePreferences');

          this.setBtnLoading(btnSubmit, true);
          try {
            await API.updatePreferences({ emailNotifications: emailNotif, pushNotifications: pushNotif });
            this.showToast('Preferensi berhasil disimpan!');
          } catch (err) {
            alert(err.message || 'Gagal menyimpan preferensi.');
          } finally {
            this.setBtnLoading(btnSubmit, false);
          }
        });
      }

      // 7. Admin Users Controls
      const btnRefreshAdminUsers = document.getElementById('btnRefreshAdminUsers');
      if (btnRefreshAdminUsers) {
        btnRefreshAdminUsers.addEventListener('click', () => this.loadAdminUsers());
      }
      const filterStatus = document.getElementById('filterAdminUserStatus');
      if (filterStatus) {
        filterStatus.addEventListener('change', () => this.filterAndRenderAdminUsers());
      }
      const searchUsers = document.getElementById('searchAdminUsers');
      if (searchUsers) {
        searchUsers.addEventListener('input', () => this.filterAndRenderAdminUsers());
      }

      // 8. Delete Account Modal & Submit
      const btnOpenDelete = document.getElementById('btnOpenDeleteModal');
      if (btnOpenDelete) {
        btnOpenDelete.addEventListener('click', () => {
          const target = document.getElementById('deleteEmailConfirmTarget');
          if (target && this.currentUser) target.textContent = this.currentUser.email || this.currentUser.name;
          this.openModal('modalDeleteAccount');
        });
      }

      const formConfirmDelete = document.getElementById('formConfirmDelete');
      if (formConfirmDelete) {
        formConfirmDelete.addEventListener('submit', async (e) => {
          e.preventDefault();
          const password = document.getElementById('deletePasswordInput').value;
          const email = document.getElementById('deleteEmailInput').value.trim();
          const btnSubmit = document.getElementById('btnExecuteDelete');

          this.setBtnLoading(btnSubmit, true);
          try {
            await API.deleteAccount({ password, email });
            alert('Akun Anda telah dihapus.');
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_info');
            window.location.reload();
          } catch (err) {
            alert(err.message || 'Gagal menghapus akun.');
          } finally {
            this.setBtnLoading(btnSubmit, false);
          }
        });
      }
    }

    async loadUserProfile() {
      try {
        const res = await API.getProfile();
        const user = res.user || res;
        this.currentUser = user;
        this.user2FAEnabled = !!user.twoFactorEnabled;

        // Topbar
        const topbarUserName = document.getElementById('topbarUserName');
        if (topbarUserName) topbarUserName.textContent = user.name || 'Pengguna';

        // Settings profile fields
        const pName = document.getElementById('profileName');
        if (pName) pName.value = user.name || '';
        const pPhone = document.getElementById('profilePhone');
        if (pPhone) pPhone.value = user.phone || '';
        const pBio = document.getElementById('profileBio');
        if (pBio) pBio.value = user.bio || '';
        const curEmail = document.getElementById('currentEmailDisplay');
        if (curEmail) curEmail.textContent = user.email || '-';

        // Avatar preview
        if (user.avatarUrl) {
          const avatar = document.getElementById('avatarPreview');
          if (avatar) avatar.src = user.avatarUrl;
        }

        // 2FA Badge & Toggle button text
        const badge2FA = document.getElementById('settings2FABadge');
        const btnToggle2FA = document.getElementById('btnSettingsToggle2FA');
        if (badge2FA && btnToggle2FA) {
          if (this.user2FAEnabled) {
            badge2FA.className = 'badge badge-success';
            badge2FA.textContent = 'Aktif (Terlindungi)';
            btnToggle2FA.className = 'btn btn-outline';
            btnToggle2FA.style.color = 'var(--rose-600)';
            btnToggle2FA.style.borderColor = 'var(--rose-200)';
            btnToggle2FA.textContent = 'Nonaktifkan 2FA';
          } else {
            badge2FA.className = 'badge badge-secondary';
            badge2FA.textContent = 'Nonaktif';
            btnToggle2FA.className = 'btn btn-primary';
            btnToggle2FA.style.color = '';
            btnToggle2FA.style.borderColor = '';
            btnToggle2FA.textContent = 'Aktifkan 2FA';
          }
        }

        // Admin Tab Check (Admin: irsyadisty)
        const isAdmin = (user.name && user.name.toLowerCase() === 'irsyadisty') ||
                        (user.email && user.email.toLowerCase().includes('irsyadisty')) ||
                        user.role === 'admin';
        const tabAdminBtn = document.getElementById('tabAdminUsersBtn');
        if (tabAdminBtn) {
          tabAdminBtn.style.display = isAdmin ? 'flex' : 'none';
          if (isAdmin) {
            this.loadAdminUsers();
          }
        }
      } catch (err) {
        console.warn('loadUserProfile error:', err);
      }
    }

    async startSetup2FA() {
      try {
        const res = await API.setup2FA();
        const qrImg = document.getElementById('qrCodeImg');
        const secretTxt = document.getElementById('secretText');
        const secretHidden = document.getElementById('setupSecretKey');

        if (qrImg) qrImg.src = res.qrCodeUrl || '';
        if (secretTxt) secretTxt.textContent = res.secret || '-';
        if (secretHidden) secretHidden.value = res.secret || '';

        this.openModal('modalSetup2FA');
      } catch (err) {
        alert(err.message || 'Gagal memulai setup 2FA.');
      }
    }

    async loadSessionsList() {
      const container = document.getElementById('settingsSessionsList');
      if (!container) return;
      container.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--slate-500);">Memuat daftar sesi...</div>';

      try {
        const res = await API.getSessions();
        const sessions = res.sessions || [];
        if (sessions.length === 0) {
          container.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--slate-500);">Tidak ada data sesi.</div>';
          return;
        }

        container.innerHTML = sessions.map(s => {
          const isCurrent = s.isCurrent;
          return `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem; background: ${isCurrent ? '#f0fdf4' : '#ffffff'}; border: 1px solid ${isCurrent ? '#bbf7d0' : '#e2e8f0'}; border-radius: var(--radius-md);">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div style="width: 36px; height: 36px; border-radius: 50%; background: ${isCurrent ? '#dcfce7' : '#f1f5f9'}; display: flex; align-items: center; justify-content: center; color: ${isCurrent ? '#166534' : '#64748b'};">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                </div>
                <div>
                  <div style="font-weight: 700; font-size: 0.85rem; color: var(--slate-900);">
                    ${s.userAgent || 'Browser / Perangkat Web'}
                    ${isCurrent ? '<span class="badge badge-success" style="font-size: 10px; margin-left: 0.4rem;">Sesi Saat Ini</span>' : ''}
                  </div>
                  <div style="font-size: 0.75rem; color: var(--slate-500);">
                    IP: <strong class="font-mono">${s.ip || '127.0.0.1'}</strong> &bull; Terakhir aktif: ${new Date(s.lastActive || Date.now()).toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
              ${!isCurrent ? `
                <button type="button" class="btn btn-secondary btn-xs" onclick="window._siproApp && window._siproApp.revokeSingleSession('${s.id}')" style="color: var(--rose-600);">
                  Putuskan
                </button>
              ` : ''}
            </div>
          `;
        }).join('');
      } catch (err) {
        container.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--rose-500);">Gagal memuat sesi perangkat.</div>';
      }
    }

    async revokeSingleSession(sessionId) {
      if (!confirm('Putuskan sesi perangkat ini?')) return;
      try {
        await API.revokeSession(sessionId);
        this.showToast('Sesi perangkat berhasil diputuskan.');
        this.loadSessionsList();
      } catch (err) {
        alert(err.message || 'Gagal memutuskan sesi.');
      }
    }

    async loadUserPreferences() {
      try {
        const res = await API.getPreferences();
        const prefs = res.preferences || {};
        const chkEmail = document.getElementById('prefEmailNotif');
        const chkPush = document.getElementById('prefPushNotif');
        if (chkEmail) chkEmail.checked = prefs.emailNotifications !== false;
        if (chkPush) chkPush.checked = prefs.pushNotifications !== false;
      } catch (err) {
        console.warn('loadUserPreferences error:', err);
      }
    }

    // --- ADMIN USER APPROVAL (KHUSUS ADMIN IRSYADISTY) ---
    async loadAdminUsers() {
      const tbody = document.getElementById('adminUsersTableBody');
      if (!tbody) return;

      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--slate-500);">Memuat data pendaftar...</td></tr>';

      try {
        const res = await API.request('/api/settings/admin/users');
        this.cachedAdminUsers = res.data || res.users || [];

        // Update pending count badge
        const pendingCount = this.cachedAdminUsers.filter(u => (u.status || 'PENDING').toUpperCase() === 'PENDING').length;
        const badge = document.getElementById('pendingUsersCountBadge');
        if (badge) {
          badge.textContent = pendingCount;
          badge.style.display = pendingCount > 0 ? 'inline-block' : 'none';
        }

        this.filterAndRenderAdminUsers();
      } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--rose-500);">Gagal memuat daftar pengguna admin.</td></tr>';
      }
    }

    filterAndRenderAdminUsers() {
      const tbody = document.getElementById('adminUsersTableBody');
      if (!tbody || !this.cachedAdminUsers) return;

      const filterStatus = document.getElementById('filterAdminUserStatus')?.value || 'ALL';
      const searchKeyword = (document.getElementById('searchAdminUsers')?.value || '').toLowerCase().trim();

      const filtered = this.cachedAdminUsers.filter(u => {
        const status = (u.status || 'PENDING').toUpperCase();
        const matchesStatus = (filterStatus === 'ALL') || (status === filterStatus);
        const name = (u.name || '').toLowerCase();
        const email = (u.email || '').toLowerCase();
        const matchesSearch = !searchKeyword || name.includes(searchKeyword) || email.includes(searchKeyword);
        return matchesStatus && matchesSearch;
      });

      if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2.5rem; color: var(--slate-500);">Tidak ada data pengguna yang sesuai dengan filter.</td></tr>';
        return;
      }

      tbody.innerHTML = filtered.map(u => {
        const status = (u.status || 'PENDING').toUpperCase();
        let statusBadge = '<span class="badge badge-warning">🟡 Menunggu</span>';
        if (status === 'APPROVED') statusBadge = '<span class="badge badge-success">🟢 Disetujui</span>';
        if (status === 'REJECTED') statusBadge = '<span class="badge badge-danger">🔴 Ditolak</span>';

        const isSuperAdmin = (u.name && u.name.toLowerCase() === 'irsyadisty') || (u.email && u.email.toLowerCase().includes('irsyadisty'));

        const actions = isSuperAdmin ? `
          <span style="font-size: 0.75rem; font-weight: 700; color: #166534;">🛡️ Akun Utama Admin</span>
        ` : `
          <div style="display: flex; gap: 0.4rem; justify-content: flex-end;">
            ${status !== 'APPROVED' ? `
              <button type="button" class="btn btn-success btn-xs" onclick="window._siproApp && window._siproApp.adminApproveUser('${u.id}')" title="Setujui Akun">
                ✓ Setujui
              </button>
            ` : ''}
            ${status !== 'REJECTED' ? `
              <button type="button" class="btn btn-secondary btn-xs" onclick="window._siproApp && window._siproApp.adminRejectUser('${u.id}')" style="color: #b91c1c; border-color: #fca5a5;" title="Tolak Akun">
                ✕ Tolak
              </button>
            ` : ''}
            <button type="button" class="btn btn-outline btn-xs" onclick="window._siproApp && window._siproApp.adminDeleteUser('${u.id}')" style="color: #ef4444;" title="Hapus User">
              🗑️
            </button>
          </div>
        `;

        return `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 0.85rem 1rem;">
              <div style="font-weight: 700; color: var(--slate-900); font-size: 0.875rem;">${u.name || '-'}</div>
              <div style="font-size: 0.75rem; color: var(--slate-500);">Role: <strong>${u.role || 'user'}</strong></div>
            </td>
            <td style="padding: 0.85rem 1rem;">
              <div class="font-mono" style="font-size: 0.825rem; color: var(--slate-800);">${u.email || '-'}</div>
              <div style="font-size: 0.75rem; color: var(--slate-500);">${u.phone || 'No telp: -'}</div>
            </td>
            <td style="padding: 0.85rem 1rem; font-size: 0.775rem; color: var(--slate-600);">
              ${u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
            </td>
            <td style="padding: 0.85rem 1rem; text-align: center;">
              ${statusBadge}
            </td>
            <td style="padding: 0.85rem 1rem; text-align: right;">
              ${actions}
            </td>
          </tr>
        `;
      }).join('');
    }

    async adminApproveUser(userId) {
      if (!confirm('Setujui pendaftaran pengguna ini agar dapat login?')) return;
      try {
        await API.request('/api/settings/admin/users/' + encodeURIComponent(userId) + '/approve', { method: 'POST' });
        this.showToast('Akun pengguna berhasil disetujui!');
        this.loadAdminUsers();
      } catch (err) {
        alert(err.message || 'Gagal menyetujui akun pengguna.');
      }
    }

    async adminRejectUser(userId) {
      if (!confirm('Tolak akses pengguna ini?')) return;
      try {
        await API.request('/api/settings/admin/users/' + encodeURIComponent(userId) + '/reject', { method: 'POST' });
        this.showToast('Akun pengguna ditolak.');
        this.loadAdminUsers();
      } catch (err) {
        alert(err.message || 'Gagal menolak akun pengguna.');
      }
    }

    async adminDeleteUser(userId) {
      if (!confirm('Hapus pengguna ini secara permanen dari sistem?')) return;
      try {
        await API.request('/api/settings/admin/users/' + encodeURIComponent(userId), { method: 'DELETE' });
        this.showToast('Pengguna berhasil dihapus.');
        this.loadAdminUsers();
      } catch (err) {
        alert(err.message || 'Gagal menghapus pengguna.');
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.siproApp = new SiproApp();
    window._siproApp = window.siproApp; // alias for inline onclick calls
  });

})(window, document);