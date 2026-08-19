/**
 * MASTER KATALOG ANALISA HARGA SATUAN PEKERJAAN (AHSP) 2026
 * Sesuai Pedoman Permen PUPR No. 1 / 2022 & Pembaruan Standar 2026
 * Terkoneksi dinamis ke Master Bahan, Upah, dan Alat Muara Teweh & Palangka Raya
 */

export const AHSP_DIVISIONS = [
  { id: 'DIV_01', code: 'DIV.01', name: 'Pekerjaan Persiapan & K3 Proyek' },
  { id: 'DIV_02', code: 'DIV.02', name: 'Pekerjaan Tanah & Pondasi' },
  { id: 'DIV_03', code: 'DIV.03', name: 'Pekerjaan Struktur Beton Bertulang' },
  { id: 'DIV_04', code: 'DIV.04', name: 'Pekerjaan Pasangan Dinding & Plesteran' },
  { id: 'DIV_05', code: 'DIV.05', name: 'Pekerjaan Penutup Lantai & Dinding' },
  { id: 'DIV_06', code: 'DIV.06', name: 'Pekerjaan Atap & Plafon' },
  { id: 'DIV_07', code: 'DIV.07', name: 'Pekerjaan Pengecatan & Finishing' },
  { id: 'DIV_08', code: 'DIV.08', name: 'Pekerjaan Mekanikal, Elektrikal & Sanitasi (MEP)' }
];

export const AHSP_ITEMS = [
  // ==========================================
  // DIVISI 1: PEKERJAAN PERSIAPAN
  // ==========================================
  {
    code: 'A.2.2.1.1',
    divisionId: 'DIV_01',
    name: 'Pembersihan dan Perataan Lapangan (1 m2)',
    unit: 'm2',
    description: 'Pembersihan rumput, semak, dan perataan kontur tanah ringan',
    components: [
      { code: 'L.01', coeff: 0.100, type: 'upah' }, // Pekerja
      { code: 'L.08', coeff: 0.050, type: 'upah' }  // Mandor
    ]
  },
  {
    code: 'A.2.2.1.4',
    divisionId: 'DIV_01',
    name: 'Pengukuran dan Pemasangan Bouwplank (1 m1)',
    unit: 'm1',
    description: 'Pemasangan patok kayu meranti/kaso dan papan bouwplank',
    components: [
      { code: 'M.23', coeff: 0.012, type: 'bahan' }, // Kayu Meranti 5/7
      { code: 'M.13', coeff: 0.020, type: 'bahan' }, // Paku
      { code: 'L.01', coeff: 0.100, type: 'upah' },  // Pekerja
      { code: 'L.03', coeff: 0.100, type: 'upah' },  // Tukang Kayu
      { code: 'L.07', coeff: 0.010, type: 'upah' },  // Kepala Tukang
      { code: 'L.08', coeff: 0.005, type: 'upah' }   // Mandor
    ]
  },
  {
    code: 'A.2.2.1.9',
    divisionId: 'DIV_01',
    name: 'Pembuatan Pagar Pengaman Sementara Seng Gelombang t=2m (1 m1)',
    unit: 'm1',
    description: 'Pagar proyek seng gelombang rangka kayu',
    components: [
      { code: 'M.40', coeff: 1.200, type: 'bahan' }, // Seng Gelombang
      { code: 'M.23', coeff: 0.072, type: 'bahan' }, // Kayu Meranti
      { code: 'M.13', coeff: 0.060, type: 'bahan' }, // Paku
      { code: 'M.01.KG', coeff: 2.50, type: 'bahan' }, // Semen pondasi tiang
      { code: 'M.05', coeff: 0.005, type: 'bahan' }, // Split
      { code: 'L.01', coeff: 0.200, type: 'upah' },
      { code: 'L.03', coeff: 0.400, type: 'upah' },
      { code: 'L.07', coeff: 0.040, type: 'upah' },
      { code: 'L.08', coeff: 0.020, type: 'upah' }
    ]
  },

  // ==========================================
  // DIVISI 2: PEKERJAAN TANAH & PONDASI
  // ==========================================
  {
    code: 'A.2.3.1.1',
    divisionId: 'DIV_02',
    name: 'Galian Tanah Biasa Kedalaman s/d 1 meter (1 m3)',
    unit: 'm3',
    description: 'Galian tanah biasa manual untuk pondasi lajur / tapak',
    components: [
      { code: 'L.01', coeff: 0.750, type: 'upah' },
      { code: 'L.08', coeff: 0.025, type: 'upah' }
    ]
  },
  {
    code: 'A.2.3.1.2',
    divisionId: 'DIV_02',
    name: 'Galian Tanah Biasa Kedalaman 1 s/d 2 meter (1 m3)',
    unit: 'm3',
    description: 'Galian tanah pondasi dalam / basement manual',
    components: [
      { code: 'L.01', coeff: 0.900, type: 'upah' },
      { code: 'L.08', coeff: 0.045, type: 'upah' }
    ]
  },
  {
    code: 'A.2.3.1.9',
    divisionId: 'DIV_02',
    name: 'Pengurugan Kembali Bekas Galian Tanah (1 m3)',
    unit: 'm3',
    description: 'Pengurugan dan pemadatan tanah kembali sisa galian pondasi',
    components: [
      { code: 'L.01', coeff: 0.250, type: 'upah' },
      { code: 'L.08', coeff: 0.025, type: 'upah' }
    ]
  },
  {
    code: 'A.2.3.1.11',
    divisionId: 'DIV_02',
    name: 'Pengurugan Pasir Urug Bawah Pondasi & Lantai (1 m3)',
    unit: 'm3',
    description: 'Urugan pasir padat tebal 5-10 cm bawah lantai dan pondasi',
    components: [
      { code: 'M.03', coeff: 1.200, type: 'bahan' }, // Pasir Urug
      { code: 'L.01', coeff: 0.300, type: 'upah' },
      { code: 'L.08', coeff: 0.010, type: 'upah' }
    ]
  },
  {
    code: 'A.3.2.1.1',
    divisionId: 'DIV_02',
    name: 'Pemasangan Pondasi Batu Belah Campuran 1 SP : 4 PP (1 m3)',
    unit: 'm3',
    description: 'Pondasi batu belah lajur bangunan gedung 1 SP : 4 PP',
    components: [
      { code: 'M.04', coeff: 1.200, type: 'bahan' },  // Batu Belah
      { code: 'M.01.KG', coeff: 163.0, type: 'bahan' },// Semen PC (kg)
      { code: 'M.02', coeff: 0.520, type: 'bahan' },  // Pasir Pasang
      { code: 'L.01', coeff: 1.500, type: 'upah' },
      { code: 'L.02', coeff: 0.750, type: 'upah' },
      { code: 'L.07', coeff: 0.075, type: 'upah' },
      { code: 'L.08', coeff: 0.075, type: 'upah' }
    ]
  },
  {
    code: 'A.3.2.1.2',
    divisionId: 'DIV_02',
    name: 'Pemasangan Pondasi Batu Belah Campuran 1 SP : 5 PP (1 m3)',
    unit: 'm3',
    description: 'Pondasi batu belah lajur standar 1 SP : 5 PP',
    components: [
      { code: 'M.04', coeff: 1.200, type: 'bahan' },
      { code: 'M.01.KG', coeff: 136.0, type: 'bahan' },
      { code: 'M.02', coeff: 0.544, type: 'bahan' },
      { code: 'L.01', coeff: 1.500, type: 'upah' },
      { code: 'L.02', coeff: 0.750, type: 'upah' },
      { code: 'L.07', coeff: 0.075, type: 'upah' },
      { code: 'L.08', coeff: 0.075, type: 'upah' }
    ]
  },
  {
    code: 'A.3.2.1.9',
    divisionId: 'DIV_02',
    name: 'Pemasangan Batu Kosong / Aanstamping (1 m3)',
    unit: 'm3',
    description: 'Lapisan batu kosong bawah pondasi batu belah',
    components: [
      { code: 'M.04', coeff: 1.200, type: 'bahan' },
      { code: 'M.03', coeff: 0.432, type: 'bahan' },
      { code: 'L.01', coeff: 0.780, type: 'upah' },
      { code: 'L.02', coeff: 0.390, type: 'upah' },
      { code: 'L.07', coeff: 0.039, type: 'upah' },
      { code: 'L.08', coeff: 0.039, type: 'upah' }
    ]
  },
  {
    code: 'A.2.3.1.KL',
    divisionId: 'DIV_02',
    name: 'Pemancangan Cerucuk Kayu Galam Dia. 8-10 cm p=4m (1 Batang)',
    unit: 'Batang',
    description: 'Perkuatan tanah lunak gambut / rawa khas Kalimantan Tengah',
    components: [
      { code: 'M.20', coeff: 1.000, type: 'bahan' }, // Kayu Galam
      { code: 'L.01', coeff: 0.150, type: 'upah' },
      { code: 'L.03', coeff: 0.050, type: 'upah' },
      { code: 'L.08', coeff: 0.010, type: 'upah' }
    ]
  },

  // ==========================================
  // DIVISI 3: STRUKTUR BETON BERTULANG
  // ==========================================
  {
    code: 'A.4.1.1.4',
    divisionId: 'DIV_03',
    name: 'Membuat Beton Mutu K-175 / fc = 14.5 MPa Manual (1 m3)',
    unit: 'm3',
    description: 'Beton praktis, rabat lantai, sloof praktis',
    components: [
      { code: 'M.01.KG', coeff: 326.0, type: 'bahan' }, // Semen PC
      { code: 'M.02', coeff: 0.543, type: 'bahan' },    // Pasir Cor
      { code: 'M.05', coeff: 0.762, type: 'bahan' },    // Split 2/3
      { code: 'M.07', coeff: 215.0, type: 'bahan' },    // Air
      { code: 'E.01', coeff: 0.250, type: 'alat' },     // Molen (hari/m3)
      { code: 'L.01', coeff: 1.650, type: 'upah' },
      { code: 'L.02', coeff: 0.275, type: 'upah' },
      { code: 'L.07', coeff: 0.028, type: 'upah' },
      { code: 'L.08', coeff: 0.083, type: 'upah' }
    ]
  },
  {
    code: 'A.4.1.1.5',
    divisionId: 'DIV_03',
    name: 'Membuat Beton Mutu K-225 / fc = 19.3 MPa Manual (1 m3)',
    unit: 'm3',
    description: 'Beton struktur kolom, balok, plat lantai gedung 2 lantai',
    components: [
      { code: 'M.01.KG', coeff: 371.0, type: 'bahan' },
      { code: 'M.02', coeff: 0.499, type: 'bahan' },
      { code: 'M.05', coeff: 0.776, type: 'bahan' },
      { code: 'M.07', coeff: 215.0, type: 'bahan' },
      { code: 'E.01', coeff: 0.250, type: 'alat' },
      { code: 'L.01', coeff: 1.650, type: 'upah' },
      { code: 'L.02', coeff: 0.275, type: 'upah' },
      { code: 'L.07', coeff: 0.028, type: 'upah' },
      { code: 'L.08', coeff: 0.083, type: 'upah' }
    ]
  },
  {
    code: 'A.4.1.1.6',
    divisionId: 'DIV_03',
    name: 'Membuat Beton Mutu K-250 / fc = 21.7 MPa Manual (1 m3)',
    unit: 'm3',
    description: 'Beton struktur utama gedung bertingkat dan jembatan standar',
    components: [
      { code: 'M.01.KG', coeff: 384.0, type: 'bahan' },
      { code: 'M.02', coeff: 0.494, type: 'bahan' },
      { code: 'M.05', coeff: 0.769, type: 'bahan' },
      { code: 'M.07', coeff: 215.0, type: 'bahan' },
      { code: 'E.01', coeff: 0.250, type: 'alat' },
      { code: 'L.01', coeff: 1.650, type: 'upah' },
      { code: 'L.02', coeff: 0.275, type: 'upah' },
      { code: 'L.07', coeff: 0.028, type: 'upah' },
      { code: 'L.08', coeff: 0.083, type: 'upah' }
    ]
  },
  {
    code: 'A.4.1.1.17',
    divisionId: 'DIV_03',
    name: 'Pembesian dengan Besi Polos BJTP 280 (1 kg)',
    unit: 'kg',
    description: 'Pemotongan, pembengkokan, dan perakitan besi tulangan polos',
    components: [
      { code: 'M.10', coeff: 1.050, type: 'bahan' }, // Besi polos (+ waste 5%)
      { code: 'M.12', coeff: 0.015, type: 'bahan' }, // Kawat beton
      { code: 'L.01', coeff: 0.007, type: 'upah' },
      { code: 'L.04', coeff: 0.007, type: 'upah' },
      { code: 'L.07', coeff: 0.0007, type: 'upah' },
      { code: 'L.08', coeff: 0.0004, type: 'upah' }
    ]
  },
  {
    code: 'A.4.1.1.18',
    divisionId: 'DIV_03',
    name: 'Pembesian dengan Besi Ulir / Sirip BJTS 420B (1 kg)',
    unit: 'kg',
    description: 'Pemotongan, pembengkokan, dan perakitan besi tulangan ulir',
    components: [
      { code: 'M.11', coeff: 1.050, type: 'bahan' }, // Besi ulir (+ waste 5%)
      { code: 'M.12', coeff: 0.015, type: 'bahan' },
      { code: 'L.01', coeff: 0.007, type: 'upah' },
      { code: 'L.04', coeff: 0.007, type: 'upah' },
      { code: 'L.07', coeff: 0.0007, type: 'upah' },
      { code: 'L.08', coeff: 0.0004, type: 'upah' }
    ]
  },
  {
    code: 'A.4.1.1.21',
    divisionId: 'DIV_03',
    name: 'Pemasangan Bekisting untuk Pondasi / Sloof (1 m2)',
    unit: 'm2',
    description: 'Bekisting kayu meranti/papan kelas III untuk sloof',
    components: [
      { code: 'M.23', coeff: 0.040, type: 'bahan' }, // Kayu meranti
      { code: 'M.13', coeff: 0.300, type: 'bahan' }, // Paku
      { code: 'M.25', coeff: 0.100, type: 'bahan' }, // Minyak bekisting
      { code: 'L.01', coeff: 0.520, type: 'upah' },
      { code: 'L.03', coeff: 0.260, type: 'upah' },
      { code: 'L.07', coeff: 0.026, type: 'upah' },
      { code: 'L.08', coeff: 0.026, type: 'upah' }
    ]
  },
  {
    code: 'A.4.1.1.22',
    divisionId: 'DIV_03',
    name: 'Pemasangan Bekisting untuk Kolom Gedung (1 m2)',
    unit: 'm2',
    description: 'Bekisting plywood 9mm dan perancah balok kayu',
    components: [
      { code: 'M.23', coeff: 0.040, type: 'bahan' },
      { code: 'M.13', coeff: 0.400, type: 'bahan' },
      { code: 'M.24', coeff: 0.350, type: 'bahan' }, // Plywood 9mm
      { code: 'M.25', coeff: 0.200, type: 'bahan' },
      { code: 'L.01', coeff: 0.660, type: 'upah' },
      { code: 'L.03', coeff: 0.330, type: 'upah' },
      { code: 'L.07', coeff: 0.033, type: 'upah' },
      { code: 'L.08', coeff: 0.033, type: 'upah' }
    ]
  },
  {
    code: 'A.4.1.1.23',
    divisionId: 'DIV_03',
    name: 'Pemasangan Bekisting untuk Balok Gedung (1 m2)',
    unit: 'm2',
    description: 'Bekisting plywood 9mm dengan skur penopang',
    components: [
      { code: 'M.23', coeff: 0.040, type: 'bahan' },
      { code: 'M.13', coeff: 0.400, type: 'bahan' },
      { code: 'M.24', coeff: 0.350, type: 'bahan' },
      { code: 'M.25', coeff: 0.200, type: 'bahan' },
      { code: 'L.01', coeff: 0.660, type: 'upah' },
      { code: 'L.03', coeff: 0.330, type: 'upah' },
      { code: 'L.07', coeff: 0.033, type: 'upah' },
      { code: 'L.08', coeff: 0.033, type: 'upah' }
    ]
  },
  {
    code: 'A.4.1.1.24',
    divisionId: 'DIV_03',
    name: 'Pemasangan Bekisting untuk Plat Lantai / Dak Beton (1 m2)',
    unit: 'm2',
    description: 'Bekisting plat lantai dengan perancah scafolding / dolken galam',
    components: [
      { code: 'M.23', coeff: 0.040, type: 'bahan' },
      { code: 'M.13', coeff: 0.400, type: 'bahan' },
      { code: 'M.24', coeff: 0.350, type: 'bahan' },
      { code: 'M.25', coeff: 0.200, type: 'bahan' },
      { code: 'M.20', coeff: 2.000, type: 'bahan' }, // Cerucuk / Dolken perancah
      { code: 'L.01', coeff: 0.660, type: 'upah' },
      { code: 'L.03', coeff: 0.330, type: 'upah' },
      { code: 'L.07', coeff: 0.033, type: 'upah' },
      { code: 'L.08', coeff: 0.033, type: 'upah' }
    ]
  },

  // ==========================================
  // DIVISI 4: DINDING & PLESTERAN
  // ==========================================
  {
    code: 'A.4.4.1.9',
    divisionId: 'DIV_04',
    name: 'Pemasangan Dinding Bata Merah Tebal 1/2 Bata Camp. 1 SP : 4 PP (1 m2)',
    unit: 'm2',
    description: 'Pasangan bata merah standar spesi 1:4',
    components: [
      { code: 'M.30', coeff: 70.0, type: 'bahan' },  // Bata merah (bh)
      { code: 'M.01.KG', coeff: 11.50, type: 'bahan' }, // Semen PC (kg)
      { code: 'M.02', coeff: 0.043, type: 'bahan' }, // Pasir pasang
      { code: 'L.01', coeff: 0.300, type: 'upah' },
      { code: 'L.02', coeff: 0.100, type: 'upah' },
      { code: 'L.07', coeff: 0.010, type: 'upah' },
      { code: 'L.08', coeff: 0.015, type: 'upah' }
    ]
  },
  {
    code: 'A.4.4.1.15',
    divisionId: 'DIV_04',
    name: 'Pemasangan Dinding Bata Ringan / Hebel t=10cm dengan Mortar (1 m2)',
    unit: 'm2',
    description: 'Pasangan bata ringan hebel presisi dengan perekat thinbed',
    components: [
      { code: 'M.31', coeff: 0.100, type: 'bahan' }, // Hebel m3 (0.1 m3 per m2)
      { code: 'M.32', coeff: 0.100, type: 'bahan' }, // Mortar zak (4 kg / 0.1 zak)
      { code: 'L.01', coeff: 0.200, type: 'upah' },
      { code: 'L.02', coeff: 0.080, type: 'upah' },
      { code: 'L.07', coeff: 0.008, type: 'upah' },
      { code: 'L.08', coeff: 0.010, type: 'upah' }
    ]
  },
  {
    code: 'A.4.4.2.4',
    divisionId: 'DIV_04',
    name: 'Plesteran 1 SP : 4 PP Tebal 15 mm (1 m2)',
    unit: 'm2',
    description: 'Plesteran dinding spesi 1:4 tebal rata-rata 1.5 cm',
    components: [
      { code: 'M.01.KG', coeff: 6.24, type: 'bahan' },
      { code: 'M.02', coeff: 0.024, type: 'bahan' },
      { code: 'L.01', coeff: 0.300, type: 'upah' },
      { code: 'L.02', coeff: 0.150, type: 'upah' },
      { code: 'L.07', coeff: 0.015, type: 'upah' },
      { code: 'L.08', coeff: 0.015, type: 'upah' }
    ]
  },
  {
    code: 'A.4.4.2.27',
    divisionId: 'DIV_04',
    name: 'Acian Semen PC / Mortar Instan (1 m2)',
    unit: 'm2',
    description: 'Acian halus permukaan plesteran siap cat',
    components: [
      { code: 'M.01.KG', coeff: 3.25, type: 'bahan' },
      { code: 'L.01', coeff: 0.200, type: 'upah' },
      { code: 'L.02', coeff: 0.100, type: 'upah' },
      { code: 'L.07', coeff: 0.010, type: 'upah' },
      { code: 'L.08', coeff: 0.010, type: 'upah' }
    ]
  },
  {
    code: 'A.4.4.2.BN',
    divisionId: 'DIV_04',
    name: 'Pekerjaan Benangan / Tali Air Sudut Dinding & Kusen (1 m1)',
    unit: 'm1',
    description: 'Benangan sudut lurus presisi',
    components: [
      { code: 'M.01.KG', coeff: 0.50, type: 'bahan' },
      { code: 'L.01', coeff: 0.080, type: 'upah' },
      { code: 'L.02', coeff: 0.050, type: 'upah' },
      { code: 'L.07', coeff: 0.005, type: 'upah' },
      { code: 'L.08', coeff: 0.004, type: 'upah' }
    ]
  },

  // ==========================================
  // DIVISI 5: PENUTUP LANTAI & DINDING
  // ==========================================
  {
    code: 'A.4.4.3.35',
    divisionId: 'DIV_05',
    name: 'Pemasangan Lantai Keramik 40x40 cm Polos (1 m2)',
    unit: 'm2',
    description: 'Pemasangan keramik lantai 40x40 termasuk nat semen warna',
    components: [
      { code: 'M.34', coeff: 1.050, type: 'bahan' }, // Keramik (+ 5% cutting waste)
      { code: 'M.01.KG', coeff: 10.0, type: 'bahan' },
      { code: 'M.02', coeff: 0.045, type: 'bahan' },
      { code: 'M.36', coeff: 0.500, type: 'bahan' }, // Semen nat
      { code: 'L.01', coeff: 0.700, type: 'upah' },
      { code: 'L.02', coeff: 0.350, type: 'upah' },
      { code: 'L.07', coeff: 0.035, type: 'upah' },
      { code: 'L.08', coeff: 0.035, type: 'upah' }
    ]
  },
  {
    code: 'A.4.4.3.36',
    divisionId: 'DIV_05',
    name: 'Pemasangan Lantai Granit Tile 60x60 cm Polish (1 m2)',
    unit: 'm2',
    description: 'Pemasangan homogenous granit tile 60x60 presisi tinggi',
    components: [
      { code: 'M.35', coeff: 1.050, type: 'bahan' },
      { code: 'M.01.KG', coeff: 9.80, type: 'bahan' },
      { code: 'M.02', coeff: 0.040, type: 'bahan' },
      { code: 'M.36', coeff: 0.400, type: 'bahan' },
      { code: 'L.01', coeff: 0.750, type: 'upah' },
      { code: 'L.02', coeff: 0.400, type: 'upah' },
      { code: 'L.07', coeff: 0.040, type: 'upah' },
      { code: 'L.08', coeff: 0.038, type: 'upah' }
    ]
  },
  {
    code: 'A.4.4.3.PL',
    divisionId: 'DIV_05',
    name: 'Pemasangan Plint Keramik 10x40 cm (1 m1)',
    unit: 'm1',
    description: 'Pemasangan plint pembatas dinding bawah',
    components: [
      { code: 'M.34', coeff: 0.120, type: 'bahan' },
      { code: 'M.01.KG', coeff: 1.15, type: 'bahan' },
      { code: 'M.02', coeff: 0.005, type: 'bahan' },
      { code: 'M.36', coeff: 0.100, type: 'bahan' },
      { code: 'L.01', coeff: 0.090, type: 'upah' },
      { code: 'L.02', coeff: 0.090, type: 'upah' },
      { code: 'L.07', coeff: 0.009, type: 'upah' },
      { code: 'L.08', coeff: 0.005, type: 'upah' }
    ]
  },

  // ==========================================
  // DIVISI 6: ATAP & PLAFON
  // ==========================================
  {
    code: 'A.4.2.1.21',
    divisionId: 'DIV_06',
    name: 'Pemasangan Rangka Atap Baja Ringan Kanal C 0.75 mm (1 m2)',
    unit: 'm2',
    description: 'Rangka kuda-kuda dan reng baja ringan bentang standar',
    components: [
      { code: 'M.14', coeff: 0.650, type: 'bahan' }, // Kanal C (batang)
      { code: 'M.15', coeff: 0.750, type: 'bahan' }, // Reng (batang)
      { code: 'L.01', coeff: 0.200, type: 'upah' },
      { code: 'L.03', coeff: 0.250, type: 'upah' },
      { code: 'L.07', coeff: 0.025, type: 'upah' },
      { code: 'L.08', coeff: 0.010, type: 'upah' }
    ]
  },
  {
    code: 'A.4.2.1.22',
    divisionId: 'DIV_06',
    name: 'Pemasangan Penutup Atap Spandek Zincalume 0.30 mm (1 m2)',
    unit: 'm2',
    description: 'Penutup atap spandek zincalume anti karat',
    components: [
      { code: 'M.41', coeff: 1.050, type: 'bahan' }, // Spandek m2
      { code: 'M.13', coeff: 0.040, type: 'bahan' }, // Baut roofing
      { code: 'L.01', coeff: 0.150, type: 'upah' },
      { code: 'L.03', coeff: 0.150, type: 'upah' },
      { code: 'L.07', coeff: 0.015, type: 'upah' },
      { code: 'L.08', coeff: 0.008, type: 'upah' }
    ]
  },
  {
    code: 'A.4.5.1.7',
    divisionId: 'DIV_06',
    name: 'Pemasangan Plafon Gypsum Board 9 mm + Rangka Hollow (1 m2)',
    unit: 'm2',
    description: 'Plafon gypsum rangka hollow galvanis 40x40 & 20x40',
    components: [
      { code: 'M.42', coeff: 0.364, type: 'bahan' }, // Gypsum board lembar
      { code: 'M.43', coeff: 3.500, type: 'bahan' }, // Rangka Hollow (m1)
      { code: 'L.01', coeff: 0.200, type: 'upah' },
      { code: 'L.03', coeff: 0.250, type: 'upah' },
      { code: 'L.07', coeff: 0.025, type: 'upah' },
      { code: 'L.08', coeff: 0.010, type: 'upah' }
    ]
  },
  {
    code: 'A.4.5.1.8',
    divisionId: 'DIV_06',
    name: 'Pemasangan List Profil Gypsum (1 m1)',
    unit: 'm1',
    description: 'List profil gypsum tepi plafon',
    components: [
      { code: 'M.44', coeff: 1.050, type: 'bahan' }, // List gypsum
      { code: 'L.01', coeff: 0.050, type: 'upah' },
      { code: 'L.03', coeff: 0.080, type: 'upah' },
      { code: 'L.07', coeff: 0.008, type: 'upah' },
      { code: 'L.08', coeff: 0.003, type: 'upah' }
    ]
  },

  // ==========================================
  // DIVISI 7: PENGECATAN & FINISHING
  // ==========================================
  {
    code: 'A.4.7.1.10',
    divisionId: 'DIV_07',
    name: 'Pengecatan Tembok Baru Interior (1 Lapis Cat Dasar + 2 Lapis Cat Penutup) (1 m2)',
    unit: 'm2',
    description: 'Pengecatan dinding dalam dengan cat emulsi berkualitas',
    components: [
      { code: 'M.52', coeff: 0.100, type: 'bahan' }, // Plamir
      { code: 'M.53', coeff: 0.100, type: 'bahan' }, // Cat dasar primer
      { code: 'M.50', coeff: 0.260, type: 'bahan' }, // Cat penutup
      { code: 'M.54', coeff: 0.200, type: 'bahan' }, // Amplas
      { code: 'L.01', coeff: 0.063, type: 'upah' },
      { code: 'L.05', coeff: 0.083, type: 'upah' },
      { code: 'L.07', coeff: 0.008, type: 'upah' },
      { code: 'L.08', coeff: 0.004, type: 'upah' }
    ]
  },
  {
    code: 'A.4.7.1.11',
    divisionId: 'DIV_07',
    name: 'Pengecatan Tembok Luar Eksterior / Weathershield (1 m2)',
    unit: 'm2',
    description: 'Pengecatan tahan cuaca ekstrem tropis Kalimantan',
    components: [
      { code: 'M.53', coeff: 0.120, type: 'bahan' },
      { code: 'M.51', coeff: 0.280, type: 'bahan' },
      { code: 'M.54', coeff: 0.200, type: 'bahan' },
      { code: 'L.01', coeff: 0.070, type: 'upah' },
      { code: 'L.05', coeff: 0.090, type: 'upah' },
      { code: 'L.07', coeff: 0.009, type: 'upah' },
      { code: 'L.08', coeff: 0.005, type: 'upah' }
    ]
  },
  {
    code: 'A.4.7.1.PL',
    divisionId: 'DIV_07',
    name: 'Pengecatan Plafon Gypsum (1 m2)',
    unit: 'm2',
    description: 'Pengecatan plafon 2 lapis',
    components: [
      { code: 'M.50', coeff: 0.200, type: 'bahan' },
      { code: 'M.54', coeff: 0.100, type: 'bahan' },
      { code: 'L.01', coeff: 0.050, type: 'upah' },
      { code: 'L.05', coeff: 0.070, type: 'upah' },
      { code: 'L.07', coeff: 0.007, type: 'upah' },
      { code: 'L.08', coeff: 0.003, type: 'upah' }
    ]
  },

  // ==========================================
  // DIVISI 8: MEP & SANITASI
  // ==========================================
  {
    code: 'A.5.1.1.1',
    divisionId: 'DIV_08',
    name: 'Pemasangan Kloset Duduk Keramik Standar (1 Unit)',
    unit: 'Unit',
    description: 'Pemasangan kloset duduk lengkap stop kran & flexible hose',
    components: [
      { code: 'M.60', coeff: 1.000, type: 'bahan' },
      { code: 'M.01.KG', coeff: 6.00, type: 'bahan' },
      { code: 'M.02', coeff: 0.010, type: 'bahan' },
      { code: 'L.01', coeff: 1.000, type: 'upah' },
      { code: 'L.02', coeff: 1.500, type: 'upah' },
      { code: 'L.07', coeff: 0.150, type: 'upah' },
      { code: 'L.08', coeff: 0.050, type: 'upah' }
    ]
  },
  {
    code: 'A.5.1.1.2',
    divisionId: 'DIV_08',
    name: 'Pemasangan Kloset Jongkok Keramik Standar (1 Unit)',
    unit: 'Unit',
    description: 'Pemasangan kloset jongkok lantai',
    components: [
      { code: 'M.61', coeff: 1.000, type: 'bahan' },
      { code: 'M.01.KG', coeff: 6.00, type: 'bahan' },
      { code: 'M.02', coeff: 0.010, type: 'bahan' },
      { code: 'L.01', coeff: 1.000, type: 'upah' },
      { code: 'L.02', coeff: 1.000, type: 'upah' },
      { code: 'L.07', coeff: 0.100, type: 'upah' },
      { code: 'L.08', coeff: 0.050, type: 'upah' }
    ]
  },
  {
    code: 'A.5.1.1.19',
    divisionId: 'DIV_08',
    name: 'Pemasangan Pipa PVC AW dia. 1/2 inch untuk Air Bersih (1 m1)',
    unit: 'm1',
    description: 'Instalasi pipa air bersih bertekanan',
    components: [
      { code: 'M.62', coeff: 0.300, type: 'bahan' }, // Batang (1/4 batang per meter)
      { code: 'L.01', coeff: 0.036, type: 'upah' },
      { code: 'L.02', coeff: 0.060, type: 'upah' },
      { code: 'L.07', coeff: 0.006, type: 'upah' },
      { code: 'L.08', coeff: 0.002, type: 'upah' }
    ]
  },
  {
    code: 'A.5.1.1.25',
    divisionId: 'DIV_08',
    name: 'Pemasangan Pipa PVC D dia. 4 inch untuk Air Kotor / Limbah (1 m1)',
    unit: 'm1',
    description: 'Instalasi pipa pembuangan air kotor & limbah WC',
    components: [
      { code: 'M.65', coeff: 0.300, type: 'bahan' },
      { code: 'L.01', coeff: 0.081, type: 'upah' },
      { code: 'L.02', coeff: 0.135, type: 'upah' },
      { code: 'L.07', coeff: 0.013, type: 'upah' },
      { code: 'L.08', coeff: 0.004, type: 'upah' }
    ]
  },
  {
    code: 'A.6.1.1.1',
    divisionId: 'DIV_08',
    name: 'Pemasangan Titik Instalasi Penerangan Lampu + Kabel NYM 3x2.5 (1 Titik)',
    unit: 'Titik',
    description: 'Instalasi titik lampu standar SNI dalam pipa conduit',
    components: [
      { code: 'M.66', coeff: 1.000, type: 'bahan' },
      { code: 'L.01', coeff: 0.200, type: 'upah' },
      { code: 'L.06', coeff: 0.350, type: 'upah' }, // Tukang Listrik
      { code: 'L.07', coeff: 0.035, type: 'upah' },
      { code: 'L.08', coeff: 0.010, type: 'upah' }
    ]
  },
  {
    code: 'A.6.1.1.2',
    divisionId: 'DIV_08',
    name: 'Pemasangan Stop Kontak / Saklar Dinding (1 Titik)',
    unit: 'Titik',
    description: 'Pemasangan inbow stop kontak atau saklar',
    components: [
      { code: 'M.67', coeff: 1.000, type: 'bahan' },
      { code: 'L.01', coeff: 0.150, type: 'upah' },
      { code: 'L.06', coeff: 0.250, type: 'upah' },
      { code: 'L.07', coeff: 0.025, type: 'upah' },
      { code: 'L.08', coeff: 0.008, type: 'upah' }
    ]
  }
];

/**
 * Menghitung rincian biaya AHSP per unit untuk wilayah tertentu
 */
export function calculateAhspBreakdown(ahspItem, regionId = 'MUARA_TEWEH', getPriceFn) {
  let totalUpah = 0;
  let totalBahan = 0;
  let totalAlat = 0;

  const breakdown = ahspItem.components.map(comp => {
    const unitPrice = getPriceFn(comp.code, regionId);
    const subtotal = comp.coeff * unitPrice;

    if (comp.type === 'upah') totalUpah += subtotal;
    else if (comp.type === 'bahan') totalBahan += subtotal;
    else if (comp.type === 'alat') totalAlat += subtotal;

    return {
      code: comp.code,
      type: comp.type,
      coeff: comp.coeff,
      unitPrice,
      subtotal
    };
  });

  const directCost = totalUpah + totalBahan + totalAlat;

  return {
    code: ahspItem.code,
    name: ahspItem.name,
    unit: ahspItem.unit,
    regionId,
    totalUpah,
    totalBahan,
    totalAlat,
    directCost,
    unitPrice: Math.round(directCost),
    breakdown
  };
}
