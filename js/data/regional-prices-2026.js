/**
 * MASTER DATABASE HARGA SATUAN BARANG & JASA (SSH / HSP)
 * Wilayah: Muara Teweh (Kab. Barito Utara) & Kota Palangka Raya
 * Periode: Semester II (2) Tahun Anggaran 2026
 * Standar Acuan: Dinas PUPR Provinsi Kalteng & Standar Regional Barito
 */

export const REGIONS = {
  MUARA_TEWEH: {
    id: 'MUARA_TEWEH',
    name: 'Muara Teweh (Kab. Barito Utara)',
    shortName: 'Muara Teweh',
    description: 'Standar Satuan Harga Semester II 2026 (Zona Aliran Sungai Barito / Pedalaman Kalteng)',
    logisticsFactor: 1.08, // Faktor indeks pengangkutan sungai/darat
  },
  PALANGKA_RAYA: {
    id: 'PALANGKA_RAYA',
    name: 'Kota Palangka Raya',
    shortName: 'Palangka Raya',
    description: 'Standar Satuan Harga Semester II 2026 (Ibukota Provinsi Kalimantan Tengah)',
    logisticsFactor: 1.00, // Basis logistik utama
  }
};

/**
 * MASTER UPAH TENAGA KERJA (OH = Orang Hari / 7 Jam Kerja)
 */
export const MASTER_UPAH = [
  {
    code: 'L.01',
    name: 'Pekerja Terampil / Biasa',
    unit: 'OH',
    category: 'Tenaga Kerja',
    prices: {
      PALANGKA_RAYA: 135000,
      MUARA_TEWEH: 145000
    }
  },
  {
    code: 'L.02',
    name: 'Tukang Batu',
    unit: 'OH',
    category: 'Tenaga Kerja',
    prices: {
      PALANGKA_RAYA: 165000,
      MUARA_TEWEH: 175000
    }
  },
  {
    code: 'L.03',
    name: 'Tukang Kayu',
    unit: 'OH',
    category: 'Tenaga Kerja',
    prices: {
      PALANGKA_RAYA: 170000,
      MUARA_TEWEH: 180000
    }
  },
  {
    code: 'L.04',
    name: 'Tukang Besi / Pembesian',
    unit: 'OH',
    category: 'Tenaga Kerja',
    prices: {
      PALANGKA_RAYA: 170000,
      MUARA_TEWEH: 180000
    }
  },
  {
    code: 'L.05',
    name: 'Tukang Cat / Finishing',
    unit: 'OH',
    category: 'Tenaga Kerja',
    prices: {
      PALANGKA_RAYA: 165000,
      MUARA_TEWEH: 175000
    }
  },
  {
    code: 'L.06',
    name: 'Tukang Listrik / MEP',
    unit: 'OH',
    category: 'Tenaga Kerja',
    prices: {
      PALANGKA_RAYA: 180000,
      MUARA_TEWEH: 195000
    }
  },
  {
    code: 'L.07',
    name: 'Kepala Tukang',
    unit: 'OH',
    category: 'Tenaga Kerja',
    prices: {
      PALANGKA_RAYA: 190000,
      MUARA_TEWEH: 205000
    }
  },
  {
    code: 'L.08',
    name: 'Mandor Lapangan',
    unit: 'OH',
    category: 'Tenaga Kerja',
    prices: {
      PALANGKA_RAYA: 210000,
      MUARA_TEWEH: 225000
    }
  }
];

/**
 * MASTER BAHAN & MATERIAL KONSTRUKSI
 */
export const MASTER_BAHAN = [
  // Material Semen & Agregat
  {
    code: 'M.01',
    name: 'Portland Cement (PC) 50 kg (Semen Gresik/Tonasa)',
    unit: 'Zak',
    unitEquivalent: { unit: 'kg', ratio: 50 },
    category: 'Semen & Agregat',
    prices: {
      PALANGKA_RAYA: 82000, // Rp 1.640/kg
      MUARA_TEWEH: 92000    // Rp 1.840/kg
    }
  },
  {
    code: 'M.01.KG',
    name: 'Semen Portland (PC) per kg',
    unit: 'kg',
    category: 'Semen & Agregat',
    prices: {
      PALANGKA_RAYA: 1640,
      MUARA_TEWEH: 1840
    }
  },
  {
    code: 'M.02',
    name: 'Pasir Pasang / Pasir Cor Berkualitas',
    unit: 'm3',
    category: 'Semen & Agregat',
    prices: {
      PALANGKA_RAYA: 180000,
      MUARA_TEWEH: 220000
    }
  },
  {
    code: 'M.03',
    name: 'Pasir Urug Bawah Pondasi/Lantai',
    unit: 'm3',
    category: 'Semen & Agregat',
    prices: {
      PALANGKA_RAYA: 140000,
      MUARA_TEWEH: 175000
    }
  },
  {
    code: 'M.04',
    name: 'Batu Belah / Batu Gunung (15/20 cm)',
    unit: 'm3',
    category: 'Semen & Agregat',
    prices: {
      PALANGKA_RAYA: 380000,
      MUARA_TEWEH: 340000 // Muara Teweh lebih dekat ke tambang batu Barito Utara
    }
  },
  {
    code: 'M.05',
    name: 'Batu Pecah / Split Cor (2/3 atau 1/2 cm)',
    unit: 'm3',
    category: 'Semen & Agregat',
    prices: {
      PALANGKA_RAYA: 420000,
      MUARA_TEWEH: 450000
    }
  },
  {
    code: 'M.06',
    name: 'Tanah Urug Pilihan / Timbunan Pilihan',
    unit: 'm3',
    category: 'Semen & Agregat',
    prices: {
      PALANGKA_RAYA: 125000,
      MUARA_TEWEH: 140000
    }
  },
  {
    code: 'M.07',
    name: 'Air Bersih Kerja Konstruksi',
    unit: 'Liter',
    category: 'Semen & Agregat',
    prices: {
      PALANGKA_RAYA: 80,
      MUARA_TEWEH: 100
    }
  },

  // Besi, Baja & Logam
  {
    code: 'M.10',
    name: 'Besi Beton Polos SNI (BJTP 280)',
    unit: 'kg',
    category: 'Besi & Logam',
    prices: {
      PALANGKA_RAYA: 16500,
      MUARA_TEWEH: 18200
    }
  },
  {
    code: 'M.11',
    name: 'Besi Beton Ulir/Sirip SNI (BJTS 420B)',
    unit: 'kg',
    category: 'Besi & Logam',
    prices: {
      PALANGKA_RAYA: 17500,
      MUARA_TEWEH: 19200
    }
  },
  {
    code: 'M.12',
    name: 'Kawat Bendrat / Kawat Beton Ikat',
    unit: 'kg',
    category: 'Besi & Logam',
    prices: {
      PALANGKA_RAYA: 26000,
      MUARA_TEWEH: 29000
    }
  },
  {
    code: 'M.13',
    name: 'Paku Usuk / Paku Kayu Campur (5 - 10 cm)',
    unit: 'kg',
    category: 'Besi & Logam',
    prices: {
      PALANGKA_RAYA: 24000,
      MUARA_TEWEH: 27000
    }
  },
  {
    code: 'M.14',
    name: 'Baja Ringan Kanal C 0.75 mm',
    unit: 'Batang',
    category: 'Besi & Logam',
    prices: {
      PALANGKA_RAYA: 115000,
      MUARA_TEWEH: 128000
    }
  },
  {
    code: 'M.15',
    name: 'Reng Baja Ringan 0.45 mm',
    unit: 'Batang',
    category: 'Besi & Logam',
    prices: {
      PALANGKA_RAYA: 55000,
      MUARA_TEWEH: 62000
    }
  },

  // Kayu & Cerucuk (Karakteristik Kalteng)
  {
    code: 'M.20',
    name: 'Kayu Cerucuk Galam dia. 8-10 cm panjang 4m',
    unit: 'Batang',
    category: 'Kayu & Cerucuk',
    prices: {
      PALANGKA_RAYA: 22000,
      MUARA_TEWEH: 26000
    }
  },
  {
    code: 'M.21',
    name: 'Kayu Cerucuk Galam dia. 10-12 cm panjang 4m',
    unit: 'Batang',
    category: 'Kayu & Cerucuk',
    prices: {
      PALANGKA_RAYA: 30000,
      MUARA_TEWEH: 35000
    }
  },
  {
    code: 'M.22',
    name: 'Kayu Ulin Balok / Tongkat 10x10 cm (Grade A)',
    unit: 'm3',
    category: 'Kayu & Cerucuk',
    prices: {
      PALANGKA_RAYA: 16500000,
      MUARA_TEWEH: 15500000 // Muara Teweh lebih dekat sentra kayu hulu
    }
  },
  {
    code: 'M.23',
    name: 'Kayu Meranti / Bekisting Kelas III/IV (Papan/Kaso)',
    unit: 'm3',
    category: 'Kayu & Cerucuk',
    prices: {
      PALANGKA_RAYA: 3400000,
      MUARA_TEWEH: 3200000
    }
  },
  {
    code: 'M.24',
    name: 'Plywood / Multiplek Tebal 9 mm (120x240 cm)',
    unit: 'Lembar',
    category: 'Kayu & Cerucuk',
    prices: {
      PALANGKA_RAYA: 135000,
      MUARA_TEWEH: 148000
    }
  },
  {
    code: 'M.25',
    name: 'Minyak Bekisting / Pelumas Cetakan',
    unit: 'Liter',
    category: 'Kayu & Cerucuk',
    prices: {
      PALANGKA_RAYA: 22000,
      MUARA_TEWEH: 25000
    }
  },

  // Pasangan Dinding & Lantai
  {
    code: 'M.30',
    name: 'Bata Merah Bakar Lokal Kualitas Baik',
    unit: 'Buah',
    category: 'Dinding & Lantai',
    prices: {
      PALANGKA_RAYA: 1100,
      MUARA_TEWEH: 1300
    }
  },
  {
    code: 'M.31',
    name: 'Bata Ringan / Hebel Tebal 10 cm (60x20x10 cm)',
    unit: 'm3',
    category: 'Dinding & Lantai',
    prices: {
      PALANGKA_RAYA: 880000,
      MUARA_TEWEH: 980000
    }
  },
  {
    code: 'M.32',
    name: 'Semen Mortar Perekat Hebel (40 kg)',
    unit: 'Zak',
    category: 'Dinding & Lantai',
    prices: {
      PALANGKA_RAYA: 95000,
      MUARA_TEWEH: 108000
    }
  },
  {
    code: 'M.33',
    name: 'Semen Mortar Acian (40 kg)',
    unit: 'Zak',
    category: 'Dinding & Lantai',
    prices: {
      PALANGKA_RAYA: 90000,
      MUARA_TEWEH: 102000
    }
  },
  {
    code: 'M.34',
    name: 'Keramik Lantai 40x40 cm Polos/Motif Standar',
    unit: 'm2',
    category: 'Dinding & Lantai',
    prices: {
      PALANGKA_RAYA: 78000,
      MUARA_TEWEH: 88000
    }
  },
  {
    code: 'M.35',
    name: 'Granit Tile 60x60 cm Polish',
    unit: 'm2',
    category: 'Dinding & Lantai',
    prices: {
      PALANGKA_RAYA: 195000,
      MUARA_TEWEH: 220000
    }
  },
  {
    code: 'M.36',
    name: 'Semen Warna / Grout Pengisi Nat Keramik',
    unit: 'kg',
    category: 'Dinding & Lantai',
    prices: {
      PALANGKA_RAYA: 18000,
      MUARA_TEWEH: 21000
    }
  },

  // Atap & Plafon
  {
    code: 'M.40',
    name: 'Atap Seng Gelombang BJLS 0.20 mm',
    unit: 'Lembar',
    category: 'Atap & Plafon',
    prices: {
      PALANGKA_RAYA: 68000,
      MUARA_TEWEH: 76000
    }
  },
  {
    code: 'M.41',
    name: 'Atap Spandek Zincalume 0.30 mm',
    unit: 'm2',
    category: 'Atap & Plafon',
    prices: {
      PALANGKA_RAYA: 65000,
      MUARA_TEWEH: 74000
    }
  },
  {
    code: 'M.42',
    name: 'Papan Gypsum Board 9 mm (120x240 cm)',
    unit: 'Lembar',
    category: 'Atap & Plafon',
    prices: {
      PALANGKA_RAYA: 78000,
      MUARA_TEWEH: 88000
    }
  },
  {
    code: 'M.43',
    name: 'Rangka Hollow Galvanis 40x40 mm & 20x40 mm',
    unit: 'm1',
    category: 'Atap & Plafon',
    prices: {
      PALANGKA_RAYA: 12000,
      MUARA_TEWEH: 14000
    }
  },
  {
    code: 'M.44',
    name: 'List Profil Gypsum Standar',
    unit: 'm1',
    category: 'Atap & Plafon',
    prices: {
      PALANGKA_RAYA: 15000,
      MUARA_TEWEH: 17500
    }
  },

  // Cat & Finishing
  {
    code: 'M.50',
    name: 'Cat Dinding Interior Standar (Avitex/Catylac)',
    unit: 'kg',
    category: 'Cat & Finishing',
    prices: {
      PALANGKA_RAYA: 34000,
      MUARA_TEWEH: 38000
    }
  },
  {
    code: 'M.51',
    name: 'Cat Dinding Eksterior / Weathershield (Dulux/Jotun)',
    unit: 'kg',
    category: 'Cat & Finishing',
    prices: {
      PALANGKA_RAYA: 88000,
      MUARA_TEWEH: 96000
    }
  },
  {
    code: 'M.52',
    name: 'Plamir Dinding / Wall Putty',
    unit: 'kg',
    category: 'Cat & Finishing',
    prices: {
      PALANGKA_RAYA: 16000,
      MUARA_TEWEH: 18500
    }
  },
  {
    code: 'M.53',
    name: 'Cat Dasar Alkali Resisting Primer',
    unit: 'kg',
    category: 'Cat & Finishing',
    prices: {
      PALANGKA_RAYA: 42000,
      MUARA_TEWEH: 48000
    }
  },
  {
    code: 'M.54',
    name: 'Kertas Gosok / Amplas Dinding & Kayu',
    unit: 'Lembar',
    category: 'Cat & Finishing',
    prices: {
      PALANGKA_RAYA: 6000,
      MUARA_TEWEH: 7500
    }
  },

  // Sanitair & MEP
  {
    code: 'M.60',
    name: 'Kloset Duduk Standar (TOTO/Ina + Aksesoris)',
    unit: 'Unit',
    category: 'Sanitair & MEP',
    prices: {
      PALANGKA_RAYA: 1850000,
      MUARA_TEWEH: 2100000
    }
  },
  {
    code: 'M.61',
    name: 'Kloset Jongkok Keramik (Ina/Standar)',
    unit: 'Unit',
    category: 'Sanitair & MEP',
    prices: {
      PALANGKA_RAYA: 260000,
      MUARA_TEWEH: 310000
    }
  },
  {
    code: 'M.62',
    name: 'Pipa PVC AW dia. 1/2 inch',
    unit: 'Batang',
    category: 'Sanitair & MEP',
    prices: {
      PALANGKA_RAYA: 38000,
      MUARA_TEWEH: 44000
    }
  },
  {
    code: 'M.63',
    name: 'Pipa PVC AW dia. 3/4 inch',
    unit: 'Batang',
    category: 'Sanitair & MEP',
    prices: {
      PALANGKA_RAYA: 52000,
      MUARA_TEWEH: 59000
    }
  },
  {
    code: 'M.64',
    name: 'Pipa PVC D dia. 3 inch',
    unit: 'Batang',
    category: 'Sanitair & MEP',
    prices: {
      PALANGKA_RAYA: 125000,
      MUARA_TEWEH: 142000
    }
  },
  {
    code: 'M.65',
    name: 'Pipa PVC D dia. 4 inch',
    unit: 'Batang',
    category: 'Sanitair & MEP',
    prices: {
      PALANGKA_RAYA: 175000,
      MUARA_TEWEH: 198000
    }
  },
  {
    code: 'M.66',
    name: 'Titik Lampu + Kabel NYM 3x2.5 mm + Fitting (SNI)',
    unit: 'Titik',
    category: 'Sanitair & MEP',
    prices: {
      PALANGKA_RAYA: 185000,
      MUARA_TEWEH: 215000
    }
  },
  {
    code: 'M.67',
    name: 'Stop Kontak / Saklar Broco Standar',
    unit: 'Titik',
    category: 'Sanitair & MEP',
    prices: {
      PALANGKA_RAYA: 165000,
      MUARA_TEWEH: 190000
    }
  }
];

/**
 * MASTER SEWA PERALATAN KERJA
 */
export const MASTER_ALAT = [
  {
    code: 'E.01',
    name: 'Concrete Mixer / Molen Beton (0.3 - 0.5 m3)',
    unit: 'Hari',
    category: 'Peralatan',
    prices: {
      PALANGKA_RAYA: 250000,
      MUARA_TEWEH: 280000
    }
  },
  {
    code: 'E.02',
    name: 'Concrete Vibrator (Pemadat Beton)',
    unit: 'Hari',
    category: 'Peralatan',
    prices: {
      PALANGKA_RAYA: 150000,
      MUARA_TEWEH: 175000
    }
  },
  {
    code: 'E.03',
    name: 'Excavator Standar (0.8 - 0.9 m3) inc. BBM & Operator',
    unit: 'Jam',
    category: 'Peralatan',
    prices: {
      PALANGKA_RAYA: 550000,
      MUARA_TEWEH: 620000
    }
  },
  {
    code: 'E.04',
    name: 'Dump Truck 4-5 m3',
    unit: 'Hari',
    category: 'Peralatan',
    prices: {
      PALANGKA_RAYA: 650000,
      MUARA_TEWEH: 750000
    }
  },
  {
    code: 'E.05',
    name: 'Stamper Kuda / Plate Compactor (Pemadat Tanah)',
    unit: 'Hari',
    category: 'Peralatan',
    prices: {
      PALANGKA_RAYA: 180000,
      MUARA_TEWEH: 210000
    }
  },
  {
    code: 'E.06',
    name: 'Genset 5 kVA untuk Kerja Lapangan',
    unit: 'Hari',
    category: 'Peralatan',
    prices: {
      PALANGKA_RAYA: 150000,
      MUARA_TEWEH: 180000
    }
  },
  {
    code: 'E.07',
    name: 'Jack Hammer / Bor Beton Elektrik',
    unit: 'Hari',
    category: 'Peralatan',
    prices: {
      PALANGKA_RAYA: 120000,
      MUARA_TEWEH: 140000
    }
  },
  {
    code: 'E.08',
    name: 'Waterpass / Theodolite Survey Set',
    unit: 'Hari',
    category: 'Peralatan',
    prices: {
      PALANGKA_RAYA: 125000,
      MUARA_TEWEH: 150000
    }
  }
];

/**
 * Helper untuk mengambil harga berdasarkan kode dan wilayah
 */
export function getPriceByCode(code, regionId = 'MUARA_TEWEH') {
  const targetRegion = regionId in REGIONS ? regionId : 'MUARA_TEWEH';
  
  const upah = MASTER_UPAH.find(item => item.code === code);
  if (upah) return upah.prices[targetRegion] || 0;

  const bahan = MASTER_BAHAN.find(item => item.code === code);
  if (bahan) return bahan.prices[targetRegion] || 0;

  const alat = MASTER_ALAT.find(item => item.code === code);
  if (alat) return alat.prices[targetRegion] || 0;

  return 0;
}
