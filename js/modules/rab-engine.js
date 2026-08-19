/**
 * MODUL ESTIMASI BIAYA PROYEK (RAB ENGINE)
 * Mengelola Struktur WBS, Kalkulasi Bobot (%), Rekapitulasi Biaya, PPN, dan Terbilang
 */

export function terbilangRupiah(angka) {
  const bilangan = [
    '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 
    'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'
  ];

  function convert(n) {
    n = Math.floor(n);
    if (n < 12) return bilangan[n];
    if (n < 20) return convert(n - 10) + ' Belas';
    if (n < 100) return convert(Math.floor(n / 10)) + ' Puluh ' + convert(n % 10);
    if (n < 200) return 'Seratus ' + convert(n - 100);
    if (n < 1000) return convert(Math.floor(n / 100)) + ' Ratus ' + convert(n % 100);
    if (n < 2000) return 'Seribu ' + convert(n - 1000);
    if (n < 1000000) return convert(Math.floor(n / 1000)) + ' Ribu ' + convert(n % 1000);
    if (n < 1000000000) return convert(Math.floor(n / 1000000)) + ' Juta ' + convert(n % 1000000);
    if (n < 1000000000000) return convert(Math.floor(n / 1000000000)) + ' Milyar ' + convert(n % 1000000000);
    if (n < 1000000000000000) return convert(Math.floor(n / 1000000000000)) + ' Triliun ' + convert(n % 1000000000000);
    return 'Nilai di luar jangkauan';
  }

  if (!angka || angka <= 0) return 'Nol Rupiah';
  return (convert(angka) + ' Rupiah').replace(/\s+/g, ' ').trim();
}

export function formatRupiah(val) {
  if (val === undefined || val === null || isNaN(val)) return 'Rp 0';
  return 'Rp ' + Math.round(val).toLocaleString('id-ID');
}

export class RabEngine {
  constructor(ahspEngine) {
    this.ahspEngine = ahspEngine;
    this.project = this.createDefaultProject();
  }

  createDefaultProject() {
    return {
      info: {
        id: 'proj_' + Date.now(),
        name: 'Pembangunan Gedung Kantor Pelayanan Terpadu Barito',
        owner: 'Dinas Pekerjaan Umum dan Penataan Ruang (PUPR)',
        location: 'Muara Teweh, Kab. Barito Utara',
        regionId: 'MUARA_TEWEH',
        fiscalYear: '2026 (Semester II)',
        contractNo: '600/08.KONTRAK/DPUPR-CK/2026',
        contractor: 'PT. Barito Prima Konstruksi',
        consultant: 'CV. Mahakam Mandiri Konsultan',
        durationWeeks: 16,
        startDate: '2026-08-01',
        overheadProfitRate: 10, // 10%
        ppnRate: 11, // 11% (atau 12%)
      },
      divisions: [
        {
          id: 'div_1',
          code: 'DIV.01',
          name: 'PEKERJAAN PERSIAPAN & K3',
          items: [
            { id: 'item_1_1', ahspCode: 'A.2.2.1.1', name: 'Pembersihan dan Perataan Lapangan', unit: 'm2', volume: 450, unitPrice: 0, startWeek: 1, endWeek: 2 },
            { id: 'item_1_2', ahspCode: 'A.2.2.1.4', name: 'Pengukuran dan Pemasangan Bouwplank', unit: 'm1', volume: 96, unitPrice: 0, startWeek: 1, endWeek: 2 },
            { id: 'item_1_3', ahspCode: 'A.2.2.1.9', name: 'Pemasangan Pagar Pengaman Sementara Seng Gelombang t=2m', unit: 'm1', volume: 120, unitPrice: 0, startWeek: 1, endWeek: 3 }
          ]
        },
        {
          id: 'div_2',
          code: 'DIV.02',
          name: 'PEKERJAAN TANAH & PONDASI',
          items: [
            { id: 'item_2_1', ahspCode: 'A.2.3.1.1', name: 'Galian Tanah Biasa Kedalaman s/d 1 meter', unit: 'm3', volume: 85.5, unitPrice: 0, startWeek: 2, endWeek: 4 },
            { id: 'item_2_2', ahspCode: 'A.2.3.1.KL', name: 'Pemancangan Cerucuk Kayu Galam Dia. 8-10 cm p=4m', unit: 'Batang', volume: 320, unitPrice: 0, startWeek: 3, endWeek: 5 },
            { id: 'item_2_3', ahspCode: 'A.2.3.1.11', name: 'Pengurugan Pasir Urug Bawah Pondasi & Lantai', unit: 'm3', volume: 14.8, unitPrice: 0, startWeek: 4, endWeek: 6 },
            { id: 'item_2_4', ahspCode: 'A.3.2.1.9', name: 'Pemasangan Batu Kosong / Aanstamping', unit: 'm3', volume: 12.5, unitPrice: 0, startWeek: 4, endWeek: 6 },
            { id: 'item_2_5', ahspCode: 'A.3.2.1.1', name: 'Pemasangan Pondasi Batu Belah Campuran 1 SP : 4 PP', unit: 'm3', volume: 42.6, unitPrice: 0, startWeek: 5, endWeek: 8 },
            { id: 'item_2_6', ahspCode: 'A.2.3.1.9', name: 'Pengurugan Kembali Bekas Galian Tanah', unit: 'm3', volume: 28.5, unitPrice: 0, startWeek: 7, endWeek: 9 }
          ]
        },
        {
          id: 'div_3',
          code: 'DIV.03',
          name: 'PEKERJAAN STRUKTUR BETON BERTULANG',
          items: [
            { id: 'item_3_1', ahspCode: 'A.4.1.1.21', name: 'Pemasangan Bekisting Sloof', unit: 'm2', volume: 48.0, unitPrice: 0, startWeek: 6, endWeek: 8 },
            { id: 'item_3_2', ahspCode: 'A.4.1.1.17', name: 'Pembesian Tulangan Polos BJTP 280 (Sloof & Praktis)', unit: 'kg', volume: 850.0, unitPrice: 0, startWeek: 6, endWeek: 8 },
            { id: 'item_3_3', ahspCode: 'A.4.1.1.5', name: 'Membuat Beton Mutu K-225 untuk Sloof Struktur', unit: 'm3', volume: 9.6, unitPrice: 0, startWeek: 7, endWeek: 9 },
            { id: 'item_3_4', ahspCode: 'A.4.1.1.22', name: 'Pemasangan Bekisting Kolom Struktur', unit: 'm2', volume: 67.2, unitPrice: 0, startWeek: 8, endWeek: 11 },
            { id: 'item_3_5', ahspCode: 'A.4.1.1.18', name: 'Pembesian Tulangan Ulir BJTS 420B (Kolom & Balok)', unit: 'kg', volume: 1650.0, unitPrice: 0, startWeek: 8, endWeek: 11 },
            { id: 'item_3_6', ahspCode: 'A.4.1.1.5', name: 'Membuat Beton Mutu K-225 untuk Kolom Struktur', unit: 'm3', volume: 8.4, unitPrice: 0, startWeek: 9, endWeek: 11 },
            { id: 'item_3_7', ahspCode: 'A.4.1.1.23', name: 'Pemasangan Bekisting Balok & Ringbalk', unit: 'm2', volume: 54.0, unitPrice: 0, startWeek: 10, endWeek: 12 },
            { id: 'item_3_8', ahspCode: 'A.4.1.1.5', name: 'Membuat Beton Mutu K-225 untuk Balok & Ringbalk', unit: 'm3', volume: 7.2, unitPrice: 0, startWeek: 11, endWeek: 13 }
          ]
        },
        {
          id: 'div_4',
          code: 'DIV.04',
          name: 'PEKERJAAN PASANGAN DINDING & PLESTERAN',
          items: [
            { id: 'item_4_1', ahspCode: 'A.4.4.1.15', name: 'Pemasangan Dinding Bata Ringan / Hebel t=10cm', unit: 'm2', volume: 195.0, unitPrice: 0, startWeek: 9, endWeek: 13 },
            { id: 'item_4_2', ahspCode: 'A.4.4.2.4', name: 'Plesteran 1 SP : 4 PP Tebal 15 mm', unit: 'm2', volume: 390.0, unitPrice: 0, startWeek: 10, endWeek: 14 },
            { id: 'item_4_3', ahspCode: 'A.4.4.2.27', name: 'Acian Semen PC / Mortar Instan', unit: 'm2', volume: 390.0, unitPrice: 0, startWeek: 11, endWeek: 15 }
          ]
        },
        {
          id: 'div_5',
          code: 'DIV.05',
          name: 'PEKERJAAN ATAP & PLAFON',
          items: [
            { id: 'item_5_1', ahspCode: 'A.4.2.1.21', name: 'Pemasangan Rangka Atap Baja Ringan Kanal C 0.75 mm', unit: 'm2', volume: 165.0, unitPrice: 0, startWeek: 11, endWeek: 13 },
            { id: 'item_5_2', ahspCode: 'A.4.2.1.22', name: 'Pemasangan Penutup Atap Spandek Zincalume 0.30 mm', unit: 'm2', volume: 165.0, unitPrice: 0, startWeek: 12, endWeek: 14 },
            { id: 'item_5_3', ahspCode: 'A.4.5.1.7', name: 'Pemasangan Plafon Gypsum Board 9 mm + Rangka Hollow', unit: 'm2', volume: 140.0, unitPrice: 0, startWeek: 13, endWeek: 15 },
            { id: 'item_5_4', ahspCode: 'A.4.5.1.8', name: 'Pemasangan List Profil Gypsum', unit: 'm1', volume: 92.0, unitPrice: 0, startWeek: 14, endWeek: 16 }
          ]
        },
        {
          id: 'div_6',
          code: 'DIV.06',
          name: 'PEKERJAAN PENUTUP LANTAI & DINDING',
          items: [
            { id: 'item_6_1', ahspCode: 'A.4.4.3.36', name: 'Pemasangan Lantai Granit Tile 60x60 cm Polish', unit: 'm2', volume: 135.0, unitPrice: 0, startWeek: 12, endWeek: 15 },
            { id: 'item_6_2', ahspCode: 'A.4.4.3.PL', name: 'Pemasangan Plint Keramik 10x40 cm', unit: 'm1', volume: 78.0, unitPrice: 0, startWeek: 13, endWeek: 15 }
          ]
        },
        {
          id: 'div_7',
          code: 'DIV.07',
          name: 'PEKERJAAN PENGECATAN & FINISHING',
          items: [
            { id: 'item_7_1', ahspCode: 'A.4.7.1.10', name: 'Pengecatan Tembok Baru Interior (3 Lapis)', unit: 'm2', volume: 280.0, unitPrice: 0, startWeek: 13, endWeek: 16 },
            { id: 'item_7_2', ahspCode: 'A.4.7.1.11', name: 'Pengecatan Tembok Luar Eksterior / Weathershield', unit: 'm2', volume: 110.0, unitPrice: 0, startWeek: 14, endWeek: 16 },
            { id: 'item_7_3', ahspCode: 'A.4.7.1.PL', name: 'Pengecatan Plafon Gypsum', unit: 'm2', volume: 140.0, unitPrice: 0, startWeek: 14, endWeek: 16 }
          ]
        },
        {
          id: 'div_8',
          code: 'DIV.08',
          name: 'PEKERJAAN MEKANIKAL, ELEKTRIKAL & SANITASI',
          items: [
            { id: 'item_8_1', ahspCode: 'A.6.1.1.1', name: 'Pemasangan Titik Instalasi Penerangan Lampu + Kabel NYM', unit: 'Titik', volume: 18, unitPrice: 0, startWeek: 11, endWeek: 14 },
            { id: 'item_8_2', ahspCode: 'A.6.1.1.2', name: 'Pemasangan Stop Kontak / Saklar Dinding', unit: 'Titik', volume: 14, unitPrice: 0, startWeek: 12, endWeek: 14 },
            { id: 'item_8_3', ahspCode: 'A.5.1.1.19', name: 'Pemasangan Pipa PVC AW dia. 1/2 inch untuk Air Bersih', unit: 'm1', volume: 45.0, unitPrice: 0, startWeek: 10, endWeek: 13 },
            { id: 'item_8_4', ahspCode: 'A.5.1.1.25', name: 'Pemasangan Pipa PVC D dia. 4 inch untuk Air Kotor', unit: 'm1', volume: 32.0, unitPrice: 0, startWeek: 10, endWeek: 13 },
            { id: 'item_8_5', ahspCode: 'A.5.1.1.1', name: 'Pemasangan Kloset Duduk Keramik Standar', unit: 'Unit', volume: 2, unitPrice: 0, startWeek: 14, endWeek: 16 }
          ]
        }
      ],
      // Input opname aktual mingguan
      actualWeeklyProgress: {
        1: { date: '2026-08-07', note: 'Mobilisasi, pembersihan lapangan, dan pengukuran bouwplank', percentage: 2.10, weatherGood: 6, weatherRain: 1 },
        2: { date: '2026-08-14', note: 'Pagar pengaman selesai, galian tanah pondasi lajur dimulai', percentage: 4.85, weatherGood: 5, weatherRain: 2 },
        3: { date: '2026-08-21', note: 'Galian tanah berlanjut, pemancangan cerucuk galam di Barito', percentage: 8.20, weatherGood: 6, weatherRain: 1 },
        4: { date: '2026-08-28', note: 'Pemancangan galam selesai, urugan pasir dan aanstamping', percentage: 14.50, weatherGood: 7, weatherRain: 0 },
        5: { date: '2026-09-04', note: 'Pondasi batu belah 1:4 berjalan lancar', percentage: 22.10, weatherGood: 5, weatherRain: 2 }
      }
    };
  }

  getProject() {
    return this.project;
  }

  setProject(projectData) {
    this.project = projectData;
    if (projectData.info && projectData.info.regionId) {
      this.ahspEngine.setRegion(projectData.info.regionId);
    }
    this.recalculateAll();
  }

  setRegion(regionId) {
    this.project.info.regionId = regionId;
    this.ahspEngine.setRegion(regionId);
    this.recalculateAll();
  }

  /**
   * Menghitung ulang seluruh tabel RAB, bobot, dan rekapitulasi
   */
  recalculateAll() {
    const regionId = this.project.info.regionId || 'MUARA_TEWEH';
    let totalDirectCost = 0;

    // 1. Hitung subtotal tiap item
    this.project.divisions.forEach(div => {
      div.subtotal = 0;
      div.items.forEach(item => {
        // Ambil harga satuan dari AHSP Engine jika ada ahspCode
        if (item.ahspCode && item.ahspCode !== 'CUSTOM') {
          const ahspRes = this.ahspEngine.calculateItemPrice(item.ahspCode, regionId);
          if (ahspRes) {
            item.unitPrice = ahspRes.unitPrice;
          }
        }
        item.subtotal = (Number(item.volume) || 0) * (Number(item.unitPrice) || 0);
        div.subtotal += item.subtotal;
        totalDirectCost += item.subtotal;
      });
    });

    // 2. Hitung bobot (%) tiap item & divisi
    this.project.divisions.forEach(div => {
      div.weight = totalDirectCost > 0 ? (div.subtotal / totalDirectCost) * 100 : 0;
      div.items.forEach(item => {
        item.weight = totalDirectCost > 0 ? (item.subtotal / totalDirectCost) * 100 : 0;
      });
    });

    // 3. Rekapitulasi Finansial
    const overheadRate = Number(this.project.info.overheadProfitRate) || 0;
    const ppnRate = Number(this.project.info.ppnRate) || 11;

    const overheadCost = totalDirectCost * (overheadRate / 100);
    const subtotalWithOverhead = totalDirectCost + overheadCost;
    const ppnCost = subtotalWithOverhead * (ppnRate / 100);
    const grandTotal = Math.round(subtotalWithOverhead + ppnCost);

    this.project.summary = {
      totalDirectCost,
      overheadRate,
      overheadCost,
      subtotalWithOverhead,
      ppnRate,
      ppnCost,
      grandTotal,
      terbilang: terbilangRupiah(grandTotal)
    };

    return this.project;
  }

  // Helper CRUD Item RAB
  addItem(divisionId, itemData) {
    const div = this.project.divisions.find(d => d.id === divisionId);
    if (!div) throw new Error('Divisi tidak ditemukan');
    
    const newItem = {
      id: 'item_' + Date.now(),
      ahspCode: itemData.ahspCode || 'CUSTOM',
      name: itemData.name || 'Item Pekerjaan Baru',
      unit: itemData.unit || 'm2',
      volume: Number(itemData.volume) || 0,
      unitPrice: Number(itemData.unitPrice) || 0,
      startWeek: itemData.startWeek || 1,
      endWeek: itemData.endWeek || Math.min(4, this.project.info.durationWeeks),
      boqRef: itemData.boqRef || null
    };

    div.items.push(newItem);
    this.recalculateAll();
    return newItem;
  }

  updateItem(itemId, updatedFields) {
    for (const div of this.project.divisions) {
      const itIndex = div.items.findIndex(i => i.id === itemId);
      if (itIndex !== -1) {
        div.items[itIndex] = { ...div.items[itIndex], ...updatedFields };
        this.recalculateAll();
        return div.items[itIndex];
      }
    }
    return null;
  }

  deleteItem(itemId) {
    for (const div of this.project.divisions) {
      const itIndex = div.items.findIndex(i => i.id === itemId);
      if (itIndex !== -1) {
        div.items.splice(itIndex, 1);
        this.recalculateAll();
        return true;
      }
    }
    return false;
  }

  addDivision(name, code = '') {
    const newDiv = {
      id: 'div_' + Date.now(),
      code: code || `DIV.0${this.project.divisions.length + 1}`,
      name: name.toUpperCase(),
      items: []
    };
    this.project.divisions.push(newDiv);
    this.recalculateAll();
    return newDiv;
  }

  deleteDivision(divisionId) {
    const idx = this.project.divisions.findIndex(d => d.id === divisionId);
    if (idx !== -1) {
      this.project.divisions.splice(idx, 1);
      this.recalculateAll();
      return true;
    }
    return false;
  }
}
