/**
 * MODUL KALKULATOR VOLUME PEKERJAAN (BOQ / QUANTITY TAKE-OFF ENGINE)
 * Rumus Teknis Terintegrasi dengan Standar AHSP PUPR 2026
 */

export const BOQ_CALCULATORS = [
  {
    id: 'calc_galian_lajur',
    category: 'Tanah & Pondasi',
    name: 'Galian Tanah Pondasi Lajur Trapesium',
    description: 'Menghitung volume galian pondasi batu belah / saluran dengan dinding miring atau tegak.',
    targetAhspCodes: ['A.2.3.1.1', 'A.2.3.1.2'],
    inputs: [
      { id: 'b_atas', label: 'Lebar Atas Galian (a)', unit: 'meter', default: 1.0, step: 0.05, min: 0.1 },
      { id: 'b_bawah', label: 'Lebar Bawah Galian (b)', unit: 'meter', default: 0.8, step: 0.05, min: 0.1 },
      { id: 't_galian', label: 'Kedalaman Galian (t)', unit: 'meter', default: 0.9, step: 0.05, min: 0.1 },
      { id: 'p_total', label: 'Total Panjang Galian (P)', unit: 'meter', default: 48.0, step: 0.5, min: 0.5 }
    ],
    formulaDisplay: 'V = \\frac{a + b}{2} \\times t \\times P',
    calculate: (p) => {
      const a = Number(p.b_atas);
      const b = Number(p.b_bawah);
      const t = Number(p.t_galian);
      const P = Number(p.p_total);
      const luasPenampang = ((a + b) / 2) * t;
      const volume = luasPenampang * P;
      return {
        unit: 'm3',
        mainVolume: Number(volume.toFixed(3)),
        steps: [
          `Luas Penampang = ((${a} + ${b}) / 2) × ${t} = ${luasPenampang.toFixed(3)} m²`,
          `Volume Total = ${luasPenampang.toFixed(3)} m² × ${P} m = ${volume.toFixed(3)} m³`
        ],
        outputs: [
          { label: 'Luas Penampang Galian', value: `${luasPenampang.toFixed(3)} m²` },
          { label: 'Volume Galian Tanah', value: `${volume.toFixed(3)} m³`, isMain: true }
        ]
      };
    }
  },
  {
    id: 'calc_galian_tapaktitik',
    category: 'Tanah & Pondasi',
    name: 'Galian Pondasi Tapak (Footplat) / Titik',
    description: 'Menghitung volume galian tanah setempat untuk pondasi telapak kolom gedung.',
    targetAhspCodes: ['A.2.3.1.1', 'A.2.3.1.2'],
    inputs: [
      { id: 'p_lubang', label: 'Panjang Lubang Galian (P)', unit: 'meter', default: 1.2, step: 0.05, min: 0.2 },
      { id: 'l_lubang', label: 'Lebar Lubang Galian (L)', unit: 'meter', default: 1.2, step: 0.05, min: 0.2 },
      { id: 't_lubang', label: 'Kedalaman Galian (t)', unit: 'meter', default: 1.5, step: 0.05, min: 0.2 },
      { id: 'n_titik', label: 'Jumlah Titik Pondasi (n)', unit: 'titik', default: 12, step: 1, min: 1 }
    ],
    formulaDisplay: 'V = P \\times L \\times t \\times n',
    calculate: (p) => {
      const P = Number(p.p_lubang);
      const L = Number(p.l_lubang);
      const t = Number(p.t_lubang);
      const n = Number(p.n_titik);
      const volPerTitik = P * L * t;
      const volTotal = volPerTitik * n;
      return {
        unit: 'm3',
        mainVolume: Number(volTotal.toFixed(3)),
        steps: [
          `Volume per Titik = ${P} × ${L} × ${t} = ${volPerTitik.toFixed(3)} m³`,
          `Volume Total = ${volPerTitik.toFixed(3)} m³ × ${n} titik = ${volTotal.toFixed(3)} m³`
        ],
        outputs: [
          { label: 'Volume per Lubang', value: `${volPerTitik.toFixed(3)} m³` },
          { label: 'Volume Total Galian Tapak', value: `${volTotal.toFixed(3)} m³`, isMain: true }
        ]
      };
    }
  },
  {
    id: 'calc_pondasi_batu_belah',
    category: 'Tanah & Pondasi',
    name: 'Pondasi Batu Belah (Pasangan Batu Gunung)',
    description: 'Menghitung volume pasangan batu belah trapesium dan aanstamping batu kosong.',
    targetAhspCodes: ['A.3.2.1.1', 'A.3.2.1.2'],
    inputs: [
      { id: 'l_atas', label: 'Lebar Atas Pondasi (a)', unit: 'meter', default: 0.30, step: 0.05, min: 0.15 },
      { id: 'l_bawah', label: 'Lebar Bawah Pondasi (b)', unit: 'meter', default: 0.70, step: 0.05, min: 0.30 },
      { id: 't_pondasi', label: 'Tinggi Pas. Batu Belah (t)', unit: 'meter', default: 0.80, step: 0.05, min: 0.30 },
      { id: 'p_pondasi', label: 'Panjang Total Pondasi (P)', unit: 'meter', default: 48.0, step: 0.5, min: 0.5 },
      { id: 't_aanstamping', label: 'Tebal Batu Kosong / Aanstamping', unit: 'meter', default: 0.15, step: 0.05, min: 0.0 }
    ],
    formulaDisplay: 'V_{\\text{batu}} = \\frac{a + b}{2} \\times t \\times P',
    calculate: (p) => {
      const a = Number(p.l_atas);
      const b = Number(p.l_bawah);
      const t = Number(p.t_pondasi);
      const P = Number(p.p_pondasi);
      const tAan = Number(p.t_aanstamping);

      const luasTrapesium = ((a + b) / 2) * t;
      const volBatuBelah = luasTrapesium * P;
      const volAanstamping = b * tAan * P;

      return {
        unit: 'm3',
        mainVolume: Number(volBatuBelah.toFixed(3)),
        secondaryVolumes: [
          { name: 'Aanstamping Batu Kosong', volume: Number(volAanstamping.toFixed(3)), unit: 'm3', targetCode: 'A.3.2.1.9' }
        ],
        steps: [
          `Luas Penampang Batu Belah = ((${a} + ${b}) / 2) × ${t} = ${luasTrapesium.toFixed(3)} m²`,
          `Volume Pasangan Batu Belah = ${luasTrapesium.toFixed(3)} × ${P} = ${volBatuBelah.toFixed(3)} m³`,
          `Volume Aanstamping = ${b} m × ${tAan} m × ${P} m = ${volAanstamping.toFixed(3)} m³`
        ],
        outputs: [
          { label: 'Volume Pas. Batu Belah', value: `${volBatuBelah.toFixed(3)} m³`, isMain: true },
          { label: 'Volume Aanstamping (Batu Kosong)', value: `${volAanstamping.toFixed(3)} m³` }
        ]
      };
    }
  },
  {
    id: 'calc_cerucuk_galam',
    category: 'Tanah & Pondasi',
    name: 'Pancang Cerucuk Kayu Galam / Ulin (Kalteng)',
    description: 'Menghitung kebutuhan batang cerucuk galam untuk perkuatan tanah lunak/gambut.',
    targetAhspCodes: ['A.2.3.1.KL'],
    inputs: [
      { id: 'p_jalur', label: 'Panjang Lajur / Luas Area', unit: 'meter / m²', default: 48.0, step: 0.5, min: 1 },
      { id: 'jarak_pancang', label: 'Jarak Antar Cerucuk', unit: 'meter', default: 0.50, step: 0.05, min: 0.2 },
      { id: 'jumlah_baris', label: 'Jumlah Baris per Lajur (atau titik per m²)', unit: 'baris', default: 2, step: 1, min: 1 }
    ],
    formulaDisplay: 'N = \\left(\\frac{P}{\\text{jarak}} + 1\\right) \\times \\text{baris}',
    calculate: (p) => {
      const P = Number(p.p_jalur);
      const jarak = Number(p.jarak_pancang);
      const baris = Number(p.jumlah_baris);
      const titikPerBaris = Math.floor(P / jarak) + 1;
      const totalBatang = titikPerBaris * baris;

      return {
        unit: 'Batang',
        mainVolume: totalBatang,
        steps: [
          `Jumlah Titik per Baris = (${P} / ${jarak}) + 1 = ${titikPerBaris} titik`,
          `Total Kebutuhan Cerucuk = ${titikPerBaris} × ${baris} baris = ${totalBatang} Batang (4m)`
        ],
        outputs: [
          { label: 'Jumlah per Baris', value: `${titikPerBaris} Batang` },
          { label: 'Total Batang Cerucuk Galam', value: `${totalBatang} Batang`, isMain: true }
        ]
      };
    }
  },
  {
    id: 'calc_urugan_pasir',
    category: 'Tanah & Pondasi',
    name: 'Urugan Pasir Bawah Pondasi & Bawah Lantai',
    description: 'Menghitung volume pasir urug padat bawah pondasi atau lantai bangunan.',
    targetAhspCodes: ['A.2.3.1.11'],
    inputs: [
      { id: 'p_area', label: 'Panjang Jalur / Area (P)', unit: 'meter', default: 48.0, step: 0.5, min: 0.5 },
      { id: 'l_area', label: 'Lebar Jalur / Area (L)', unit: 'meter', default: 0.8, step: 0.05, min: 0.1 },
      { id: 't_pasir', label: 'Tebal Urugan Pasir (t)', unit: 'meter', default: 0.10, step: 0.01, min: 0.03 }
    ],
    formulaDisplay: 'V = P \\times L \\times t',
    calculate: (p) => {
      const P = Number(p.p_area);
      const L = Number(p.l_area);
      const t = Number(p.t_pasir);
      const volume = P * L * t;
      return {
        unit: 'm3',
        mainVolume: Number(volume.toFixed(3)),
        steps: [
          `Volume Pasir Urug = ${P} × ${L} × ${t} = ${volume.toFixed(3)} m³`
        ],
        outputs: [
          { label: 'Volume Pasir Urug', value: `${volume.toFixed(3)} m³`, isMain: true }
        ]
      };
    }
  },

  // ==========================================
  // TRIO STRUKTUR BETON (BETON, BESI, BEKISTING)
  // ==========================================
  {
    id: 'calc_kolom_struktur',
    category: 'Struktur Beton Bertulang',
    name: 'Kolom Struktur / Praktis (Beton + Besi + Bekisting)',
    description: 'Menghitung otomatis 3 item sekaligus: Volume Beton (m³), Pembesian Utama & Begel (kg), dan Bekisting (m²).',
    targetAhspCodes: ['A.4.1.1.5', 'A.4.1.1.17', 'A.4.1.1.18', 'A.4.1.1.22'],
    inputs: [
      { id: 'b_kolom', label: 'Lebar Kolom (b)', unit: 'meter', default: 0.20, step: 0.05, min: 0.10 },
      { id: 'h_kolom', label: 'Tinggi/Kedalaman Kolom (h)', unit: 'meter', default: 0.20, step: 0.05, min: 0.10 },
      { id: 't_kolom', label: 'Tinggi Kolom Bersih (t)', unit: 'meter', default: 3.50, step: 0.1, min: 0.5 },
      { id: 'n_kolom', label: 'Jumlah Titik Kolom (n)', unit: 'unit', default: 12, step: 1, min: 1 },
      { id: 'dia_pokok', label: 'Diameter Tulangan Pokok', unit: 'mm', default: 12, options: [10, 12, 13, 16, 19] },
      { id: 'n_pokok', label: 'Jumlah Tulangan Pokok per Kolom', unit: 'batang', default: 4, options: [4, 6, 8, 10] },
      { id: 'dia_begel', label: 'Diameter Sengkang/Begel', unit: 'mm', default: 8, options: [6, 8, 10] },
      { id: 'jarak_begel', label: 'Jarak Antar Begel (s)', unit: 'meter', default: 0.15, step: 0.01, min: 0.05 }
    ],
    formulaDisplay: 'V_{\\text{beton}} = b \\cdot h \\cdot t \\cdot n \\quad | \\quad W_{\\text{besi}} = \\frac{d^2}{162} \\cdot L_{\\text{total}} \\quad | \\quad A_{\\text{bekisting}} = 2(b+h) \\cdot t \\cdot n',
    calculate: (p) => {
      const b = Number(p.b_kolom);
      const h = Number(p.h_kolom);
      const t = Number(p.t_kolom);
      const n = Number(p.n_kolom);
      const dPokok = Number(p.dia_pokok);
      const nPokok = Number(p.n_pokok);
      const dBegel = Number(p.dia_begel);
      const sBegel = Number(p.jarak_begel);

      // 1. Volume Beton
      const volBetonPerKolom = b * h * t;
      const volBetonTotal = volBetonPerKolom * n;

      // 2. Pembesian Pokok
      const beratPerMeterPokok = (dPokok * dPokok) / 162;
      const pTulanganPokok = (t + 0.40); // + penyaluran/stek 40cm
      const beratPokokTotal = n * nPokok * pTulanganPokok * beratPerMeterPokok * 1.05; // 5% overlap & waste

      // 3. Sengkang / Begel
      const beratPerMeterBegel = (dBegel * dBegel) / 162;
      const selimut = 0.025; // 2.5 cm
      const kelilingBegel = 2 * ((b - 2 * selimut) + (h - 2 * selimut)) + 0.12; // + kait 12cm
      const nBegelPerKolom = Math.floor(t / sBegel) + 1;
      const beratBegelTotal = n * nBegelPerKolom * kelilingBegel * beratPerMeterBegel * 1.05;

      const beratBesiTotal = beratPokokTotal + beratBegelTotal;

      // 4. Bekisting
      const luasBekistingTotal = 2 * (b + h) * t * n;

      return {
        unit: 'm3',
        mainVolume: Number(volBetonTotal.toFixed(3)),
        secondaryVolumes: [
          { name: 'Pembesian Tulangan Kolom', volume: Number(beratBesiTotal.toFixed(2)), unit: 'kg', targetCode: dPokok >= 13 ? 'A.4.1.1.18' : 'A.4.1.1.17' },
          { name: 'Bekisting Kolom Gedung', volume: Number(luasBekistingTotal.toFixed(2)), unit: 'm2', targetCode: 'A.4.1.1.22' }
        ],
        steps: [
          `Volume Beton = ${b} × ${h} × ${t} × ${n} = ${volBetonTotal.toFixed(3)} m³`,
          `Besi Pokok (${nPokok}D${dPokok}) = ${n} × ${nPokok} × ${pTulanganPokok}m × ${beratPerMeterPokok.toFixed(3)}kg/m = ${beratPokokTotal.toFixed(2)} kg`,
          `Besi Begel (Ø${dBegel}-${sBegel * 100}cm) = ${n} × ${nBegelPerKolom} bh × ${kelilingBegel.toFixed(2)}m × ${beratPerMeterBegel.toFixed(3)}kg/m = ${beratBegelTotal.toFixed(2)} kg`,
          `Total Besi Kolom = ${(beratBesiTotal).toFixed(2)} kg`,
          `Luas Bekisting = 2 × (${b} + ${h}) × ${t} × ${n} = ${luasBekistingTotal.toFixed(2)} m²`
        ],
        outputs: [
          { label: 'Volume Beton Kolom', value: `${volBetonTotal.toFixed(3)} m³`, isMain: true },
          { label: 'Berat Besi Tulangan Total', value: `${beratBesiTotal.toFixed(2)} kg` },
          { label: 'Luas Bekisting Kolom (4 Sisi)', value: `${luasBekistingTotal.toFixed(2)} m²` }
        ]
      };
    }
  },
  {
    id: 'calc_balok_sloof',
    category: 'Struktur Beton Bertulang',
    name: 'Balok / Sloof / Ringbalk (Beton + Besi + Bekisting)',
    description: 'Menghitung volume beton, total pembesian (kg), dan luas bekisting balok/sloof.',
    targetAhspCodes: ['A.4.1.1.5', 'A.4.1.1.17', 'A.4.1.1.18', 'A.4.1.1.21', 'A.4.1.1.23'],
    inputs: [
      { id: 'tipe_elemen', label: 'Tipe Elemen Struktur', unit: '', default: 'balok', options: [{ value: 'sloof', label: 'Sloof Pondasi (Bekisting 2 Sisi)' }, { value: 'balok', label: 'Balok Gantung (Bekisting 3 Sisi)' }, { value: 'ringbalk', label: 'Ringbalk Atas (Bekisting 2 Sisi)' }] },
      { id: 'b_balok', label: 'Lebar Penampang (b)', unit: 'meter', default: 0.15, step: 0.05, min: 0.10 },
      { id: 'h_balok', label: 'Tinggi Penampang (h)', unit: 'meter', default: 0.25, step: 0.05, min: 0.10 },
      { id: 'p_balok', label: 'Panjang Total Bentang (P)', unit: 'meter', default: 60.0, step: 0.5, min: 1.0 },
      { id: 'dia_pokok', label: 'Diameter Tulangan Pokok', unit: 'mm', default: 12, options: [10, 12, 13, 16] },
      { id: 'n_pokok', label: 'Jumlah Tulangan Pokok (Total Atas+Bawah)', unit: 'batang', default: 5, options: [4, 5, 6, 8] },
      { id: 'dia_begel', label: 'Diameter Begel/Sengkang', unit: 'mm', default: 8, options: [6, 8, 10] },
      { id: 'jarak_begel', label: 'Jarak Antar Begel (s)', unit: 'meter', default: 0.15, step: 0.01, min: 0.05 }
    ],
    formulaDisplay: 'V_{\\text{beton}} = b \\cdot h \\cdot P \\quad | \\quad W_{\\text{besi}} = L \\cdot \\frac{d^2}{162} \\cdot 1.05 \\quad | \\quad A_{\\text{bekisting}} = (2h + b) \\cdot P',
    calculate: (p) => {
      const tipe = p.tipe_elemen || 'balok';
      const b = Number(p.b_balok);
      const h = Number(p.h_balok);
      const P = Number(p.p_balok);
      const dPokok = Number(p.dia_pokok);
      const nPokok = Number(p.n_pokok);
      const dBegel = Number(p.dia_begel);
      const sBegel = Number(p.jarak_begel);

      // 1. Beton
      const volBeton = b * h * P;

      // 2. Besi Pokok
      const beratPerMPokok = (dPokok * dPokok) / 162;
      const beratPokok = nPokok * P * beratPerMPokok * 1.08; // 8% sambungan lewatan & tekukan

      // 3. Besi Begel
      const selimut = 0.025;
      const kelilingBegel = 2 * ((b - 2 * selimut) + (h - 2 * selimut)) + 0.12;
      const nBegel = Math.floor(P / sBegel) + 1;
      const beratPerMBegel = (dBegel * dBegel) / 162;
      const beratBegel = nBegel * kelilingBegel * beratPerMBegel * 1.05;

      const beratBesiTotal = beratPokok + beratBegel;

      // 4. Bekisting
      let kelilingBekisting = (2 * h + b); // Balok gantung (3 sisi)
      if (tipe === 'sloof' || tipe === 'ringbalk') {
        kelilingBekisting = 2 * h; // Hanya 2 sisi samping
      }
      const luasBekisting = kelilingBekisting * P;

      return {
        unit: 'm3',
        mainVolume: Number(volBeton.toFixed(3)),
        secondaryVolumes: [
          { name: `Pembesian ${tipe.toUpperCase()}`, volume: Number(beratBesiTotal.toFixed(2)), unit: 'kg', targetCode: dPokok >= 13 ? 'A.4.1.1.18' : 'A.4.1.1.17' },
          { name: `Bekisting ${tipe.toUpperCase()}`, volume: Number(luasBekisting.toFixed(2)), unit: 'm2', targetCode: tipe === 'sloof' ? 'A.4.1.1.21' : 'A.4.1.1.23' }
        ],
        steps: [
          `Volume Beton = ${b} × ${h} × ${P} = ${volBeton.toFixed(3)} m³`,
          `Besi Pokok (${nPokok}D${dPokok}) = ${nPokok} × ${P}m × ${beratPerMPokok.toFixed(3)}kg/m = ${beratPokok.toFixed(2)} kg`,
          `Besi Begel (Ø${dBegel}-${sBegel * 100}cm) = ${nBegel} bh × ${kelilingBegel.toFixed(2)}m × ${beratPerMBegel.toFixed(3)}kg/m = ${beratBegel.toFixed(2)} kg`,
          `Total Besi = ${beratBesiTotal.toFixed(2)} kg`,
          `Luas Bekisting (${tipe === 'balok' ? '3 sisi' : '2 sisi'}) = ${kelilingBekisting.toFixed(2)}m × ${P}m = ${luasBekisting.toFixed(2)} m²`
        ],
        outputs: [
          { label: `Volume Beton ${tipe.toUpperCase()}`, value: `${volBeton.toFixed(3)} m³`, isMain: true },
          { label: 'Berat Besi Tulangan Total', value: `${beratBesiTotal.toFixed(2)} kg` },
          { label: `Luas Bekisting ${tipe.toUpperCase()}`, value: `${luasBekisting.toFixed(2)} m²` }
        ]
      };
    }
  },
  {
    id: 'calc_plat_lantai',
    category: 'Struktur Beton Bertulang',
    name: 'Plat Lantai / Dak Beton Bertulang',
    description: 'Menghitung volume beton cor, pembesian 2 layer / wiremesh, dan bekisting alas plat dak.',
    targetAhspCodes: ['A.4.1.1.5', 'A.4.1.1.17', 'A.4.1.1.24'],
    inputs: [
      { id: 'p_plat', label: 'Panjang Plat (P)', unit: 'meter', default: 12.0, step: 0.5, min: 1.0 },
      { id: 'l_plat', label: 'Lebar Plat (L)', unit: 'meter', default: 8.0, step: 0.5, min: 1.0 },
      { id: 't_plat', label: 'Tebal Plat Lantai (t)', unit: 'meter', default: 0.12, step: 0.01, min: 0.08 },
      { id: 'dia_besi', label: 'Diameter Besi Plat (Double Mesh / 2 Lapis)', unit: 'mm', default: 10, options: [8, 10, 12] },
      { id: 'jarak_besi', label: 'Jarak Anyaman Besi (s)', unit: 'meter', default: 0.15, step: 0.01, min: 0.10 }
    ],
    formulaDisplay: 'V_{\\text{beton}} = P \\cdot L \\cdot t \\quad | \\quad A_{\\text{bekisting}} = P \\cdot L',
    calculate: (p) => {
      const P = Number(p.p_plat);
      const L = Number(p.l_plat);
      const t = Number(p.t_plat);
      const d = Number(p.dia_besi);
      const s = Number(p.jarak_besi);

      // Beton
      const volBeton = P * L * t;

      // Bekisting
      const luasBekisting = P * L;

      // Besi 2 Arah x 2 Lapis (Atas & Bawah)
      const beratPerM = (d * d) / 162;
      const nBatangArahP = Math.floor(L / s) + 1;
      const nBatangArahL = Math.floor(P / s) + 1;
      const totalPanjangBesi1Lapis = (nBatangArahP * P) + (nBatangArahL * L);
      const totalBeratBesi = totalPanjangBesi1Lapis * 2 * beratPerM * 1.08; // 2 lapis + 8% sambungan

      return {
        unit: 'm3',
        mainVolume: Number(volBeton.toFixed(3)),
        secondaryVolumes: [
          { name: 'Pembesian Plat Lantai', volume: Number(totalBeratBesi.toFixed(2)), unit: 'kg', targetCode: 'A.4.1.1.17' },
          { name: 'Bekisting Plat Lantai', volume: Number(luasBekisting.toFixed(2)), unit: 'm2', targetCode: 'A.4.1.1.24' }
        ],
        steps: [
          `Volume Beton Plat = ${P} × ${L} × ${t} = ${volBeton.toFixed(3)} m³`,
          `Luas Bekisting Alas Plat = ${P} × ${L} = ${luasBekisting.toFixed(2)} m²`,
          `Berat Besi Plat (Double Mesh Ø${d}-${s * 100}cm) = ${totalBeratBesi.toFixed(2)} kg`
        ],
        outputs: [
          { label: 'Volume Beton Plat', value: `${volBeton.toFixed(3)} m³`, isMain: true },
          { label: 'Berat Besi Tulangan Plat', value: `${totalBeratBesi.toFixed(2)} kg` },
          { label: 'Luas Bekisting Plat', value: `${luasBekisting.toFixed(2)} m²` }
        ]
      };
    }
  },

  // ==========================================
  // ARSITEKTUR: DINDING, PLESTERAN, ACIAN
  // ==========================================
  {
    id: 'calc_dinding_bukaan',
    category: 'Pasangan Dinding & Finishing',
    name: 'Dinding Bata / Hebel (Netto Pengurangan Bukaan)',
    description: 'Menghitung luas bersih pasangan dinding setelah dikurangi luas kusen pintu & jendela.',
    targetAhspCodes: ['A.4.4.1.9', 'A.4.4.1.15'],
    inputs: [
      { id: 'p_dinding', label: 'Panjang Total Dinding (P)', unit: 'meter', default: 42.0, step: 0.5, min: 1.0 },
      { id: 't_dinding', label: 'Tinggi Dinding (T)', unit: 'meter', default: 3.60, step: 0.1, min: 1.0 },
      { id: 'n_pintu_utama', label: 'Jumlah Pintu Utama (P=0.9m, T=2.1m)', unit: 'unit', default: 2, step: 1, min: 0 },
      { id: 'n_pintu_kamar', label: 'Jumlah Pintu Kamar (P=0.8m, T=2.1m)', unit: 'unit', default: 4, step: 1, min: 0 },
      { id: 'n_jendela', label: 'Jumlah Jendela (P=1.2m, T=1.5m)', unit: 'unit', default: 6, step: 1, min: 0 },
      { id: 'luas_bukaan_lain', label: 'Tambahan Luas Bukaan Lainnya', unit: 'm²', default: 0.0, step: 0.5, min: 0.0 }
    ],
    formulaDisplay: 'A_{\\text{netto}} = (P \\times T) - \\sum A_{\\text{bukaan}}',
    calculate: (p) => {
      const P = Number(p.p_dinding);
      const T = Number(p.t_dinding);
      const nPu = Number(p.n_pintu_utama);
      const nPk = Number(p.n_pintu_kamar);
      const nJ = Number(p.n_jendela);
      const lBukaanLain = Number(p.luas_bukaan_lain);

      const luasKotor = P * T;
      const luasPu = nPu * (0.9 * 2.1);
      const luasPk = nPk * (0.8 * 2.1);
      const luasJ = nJ * (1.2 * 1.5);
      const totalBukaan = luasPu + luasPk + luasJ + lBukaanLain;

      const luasNetto = Math.max(0, luasKotor - totalBukaan);
      const luasPlesteran2Sisi = luasNetto * 2;

      return {
        unit: 'm2',
        mainVolume: Number(luasNetto.toFixed(2)),
        secondaryVolumes: [
          { name: 'Plesteran Dinding (2 Sisi)', volume: Number(luasPlesteran2Sisi.toFixed(2)), unit: 'm2', targetCode: 'A.4.4.2.4' },
          { name: 'Acian Semen (2 Sisi)', volume: Number(luasPlesteran2Sisi.toFixed(2)), unit: 'm2', targetCode: 'A.4.4.2.27' },
          { name: 'Cat Tembok Interior/Eksterior', volume: Number(luasPlesteran2Sisi.toFixed(2)), unit: 'm2', targetCode: 'A.4.7.1.10' }
        ],
        steps: [
          `Luas Dinding Kotor = ${P} × ${T} = ${luasKotor.toFixed(2)} m²`,
          `Total Luas Bukaan (Pintu & Jendela) = ${totalBukaan.toFixed(2)} m²`,
          `Luas Pasangan Dinding Netto = ${luasKotor.toFixed(2)} - ${totalBukaan.toFixed(2)} = ${luasNetto.toFixed(2)} m²`,
          `Luas Plesteran & Acian (2 Sisi) = ${luasNetto.toFixed(2)} × 2 = ${luasPlesteran2Sisi.toFixed(2)} m²`
        ],
        outputs: [
          { label: 'Luas Dinding Kotor', value: `${luasKotor.toFixed(2)} m²` },
          { label: 'Total Pengurangan Bukaan', value: `${totalBukaan.toFixed(2)} m²` },
          { label: 'Luas Netto Pasangan Dinding', value: `${luasNetto.toFixed(2)} m²`, isMain: true },
          { label: 'Luas Plesteran & Acian (2 Sisi)', value: `${luasPlesteran2Sisi.toFixed(2)} m²` }
        ]
      };
    }
  },

  // ==========================================
  // ATAP & PLAFON
  // ==========================================
  {
    id: 'calc_atap_miring',
    category: 'Atap & Plafon',
    name: 'Rangka & Penutup Atap Miring (Koreksi Sudut Cosinus)',
    description: 'Menghitung luas bidang miring atap berdasarkan sudut kemiringan (derajat) dan overstek.',
    targetAhspCodes: ['A.4.2.1.21', 'A.4.2.1.22'],
    inputs: [
      { id: 'p_denah', label: 'Panjang Denah Bangunan (P)', unit: 'meter', default: 14.0, step: 0.5, min: 1.0 },
      { id: 'l_denah', label: 'Lebar Denah Bangunan (L)', unit: 'meter', default: 8.0, step: 0.5, min: 1.0 },
      { id: 'overstek', label: 'Lebar Overstek / Tritisan (e)', unit: 'meter', default: 0.80, step: 0.1, min: 0.0 },
      { id: 'sudut_atap', label: 'Sudut Kemiringan Atap (α)', unit: 'derajat', default: 30, step: 1, min: 5, max: 60 }
    ],
    formulaDisplay: 'A_{\\text{atap}} = \\frac{(P + 2e) \\times (L + 2e)}{\\cos(\\alpha)}',
    calculate: (p) => {
      const P = Number(p.p_denah);
      const L = Number(p.l_denah);
      const e = Number(p.overstek);
      const alpha = Number(p.sudut_atap);

      const pTotal = P + 2 * e;
      const lTotal = L + 2 * e;
      const luasDatar = pTotal * lTotal;
      const cosAlpha = Math.cos((alpha * Math.PI) / 180);
      const luasMiring = luasDatar / cosAlpha;
      const kelilingLisplank = 2 * (pTotal + lTotal);

      return {
        unit: 'm2',
        mainVolume: Number(luasMiring.toFixed(2)),
        secondaryVolumes: [
          { name: 'Pemasangan Lisplank Atap', volume: Number(kelilingLisplank.toFixed(2)), unit: 'm1', targetCode: 'A.4.5.1.8' }
        ],
        steps: [
          `Dimensi Luar Atap = ${pTotal.toFixed(2)}m × ${lTotal.toFixed(2)}m`,
          `Luas Bidang Datar = ${pTotal.toFixed(2)} × ${lTotal.toFixed(2)} = ${luasDatar.toFixed(2)} m²`,
          `Cos(${alpha}°) = ${cosAlpha.toFixed(4)}`,
          `Luas Bidang Miring Atap = ${luasDatar.toFixed(2)} / ${cosAlpha.toFixed(4)} = ${luasMiring.toFixed(2)} m²`,
          `Keliling Lisplank = 2 × (${pTotal.toFixed(2)} + ${lTotal.toFixed(2)}) = ${kelilingLisplank.toFixed(2)} m'`
        ],
        outputs: [
          { label: 'Luas Bidang Datar + Overstek', value: `${luasDatar.toFixed(2)} m²` },
          { label: 'Luas Rangka & Penutup Atap Miring', value: `${luasMiring.toFixed(2)} m²`, isMain: true },
          { label: 'Panjang Lisplank Keliling', value: `${kelilingLisplank.toFixed(2)} m'` }
        ]
      };
    }
  },
  {
    id: 'calc_plafon_ruang',
    category: 'Atap & Plafon',
    name: 'Plafon Gypsum & List Profil Ruangan',
    description: 'Menghitung luas bidang plafon dan total panjang list keliling.',
    targetAhspCodes: ['A.4.5.1.7', 'A.4.5.1.8', 'A.4.7.1.PL'],
    inputs: [
      { id: 'p_ruang', label: 'Panjang Total Ruangan (P)', unit: 'meter', default: 12.0, step: 0.5, min: 1.0 },
      { id: 'l_ruang', label: 'Lebar Total Ruangan (L)', unit: 'meter', default: 8.0, step: 0.5, min: 1.0 },
      { id: 'n_sekat', label: 'Jumlah Pembatas/Ruang Terpisah', unit: 'ruang', default: 4, step: 1, min: 1 }
    ],
    formulaDisplay: 'A_{\\text{plafon}} = P \\times L \\quad | \\quad P_{\\text{list}} = 2(P+L) \\times \\text{faktor sekat}',
    calculate: (p) => {
      const P = Number(p.p_ruang);
      const L = Number(p.l_ruang);
      const nSekat = Number(p.n_sekat);

      const luasPlafon = P * L;
      // Perkiraan keliling list jika dibagi n ruang
      const faktorKeliling = Math.sqrt(nSekat);
      const panjangList = 2 * (P + L) * faktorKeliling;

      return {
        unit: 'm2',
        mainVolume: Number(luasPlafon.toFixed(2)),
        secondaryVolumes: [
          { name: 'Pemasangan List Profil Gypsum', volume: Number(panjangList.toFixed(2)), unit: 'm1', targetCode: 'A.4.5.1.8' },
          { name: 'Pengecatan Plafon', volume: Number(luasPlafon.toFixed(2)), unit: 'm2', targetCode: 'A.4.7.1.PL' }
        ],
        steps: [
          `Luas Plafon = ${P} × ${L} = ${luasPlafon.toFixed(2)} m²`,
          `Estimasi Panjang List Profil (untuk ${nSekat} ruangan) = ${panjangList.toFixed(2)} m'`
        ],
        outputs: [
          { label: 'Luas Plafon Gypsum', value: `${luasPlafon.toFixed(2)} m²`, isMain: true },
          { label: 'Panjang List Profil Keliling', value: `${panjangList.toFixed(2)} m'` }
        ]
      };
    }
  },

  // ==========================================
  // LANTAI & FINISHING
  // ==========================================
  {
    id: 'calc_lantai_keramik',
    category: 'Penutup Lantai & Dinding',
    name: 'Lantai Keramik / Granit & Plint Dinding',
    description: 'Menghitung luas pasangan keramik lantai dan panjang plint dinding bawah.',
    targetAhspCodes: ['A.4.4.3.35', 'A.4.4.3.36', 'A.4.4.3.PL'],
    inputs: [
      { id: 'p_lantai', label: 'Panjang Ruangan / Bangunan (P)', unit: 'meter', default: 12.0, step: 0.5, min: 1.0 },
      { id: 'l_lantai', label: 'Lebar Ruangan / Bangunan (L)', unit: 'meter', default: 8.0, step: 0.5, min: 1.0 },
      { id: 'l_pintu', label: 'Total Lebar Bukaan Pintu (Pengurang Plint)', unit: 'meter', default: 4.8, step: 0.2, min: 0.0 }
    ],
    formulaDisplay: 'A_{\\text{lantai}} = P \\times L \\quad | \\quad P_{\\text{plint}} = 2(P+L) - \\Sigma L_{\\text{pintu}}',
    calculate: (p) => {
      const P = Number(p.p_lantai);
      const L = Number(p.l_lantai);
      const lPintu = Number(p.l_pintu);

      const luasLantai = P * L;
      const panjangPlint = Math.max(0, 2 * (P + L) - lPintu);

      return {
        unit: 'm2',
        mainVolume: Number(luasLantai.toFixed(2)),
        secondaryVolumes: [
          { name: 'Plint Lantai Keramik/Granit', volume: Number(panjangPlint.toFixed(2)), unit: 'm1', targetCode: 'A.4.4.3.PL' }
        ],
        steps: [
          `Luas Lantai = ${P} × ${L} = ${luasLantai.toFixed(2)} m²`,
          `Panjang Plint = 2 × (${P} + ${L}) - ${lPintu} = ${panjangPlint.toFixed(2)} m'`
        ],
        outputs: [
          { label: 'Luas Lantai Keramik/Granit', value: `${luasLantai.toFixed(2)} m²`, isMain: true },
          { label: 'Panjang Plint Pembatas', value: `${panjangPlint.toFixed(2)} m'` }
        ]
      };
    }
  }
];

export function getCalculatorById(id) {
  return BOQ_CALCULATORS.find(c => c.id === id);
}
