/**
 * SIPRO-KALTENG 2026 - MODUL DOKUMEN RESMI & EXPORT ENGINE (5 TEMPLATE STANDAR PUPR)
 * Format Ekspor Excel (.xls / HTML Table) & Cetak PDF Presisi Sesuai Template Resmi:
 * 1. Rencana Anggaran Biaya (RAB) & Rekapitulasi (Foto 1)
 * 2. Perhitungan Volume / BOQ Take-Off Dimensi (Foto 2)
 * 3. Daftar Analisa Harga Satuan AHSP Terpilih (Foto 3)
 * 4. Daftar Satuan Upah Tenaga Kerja (Foto 4)
 * 5. Daftar Satuan Bahan & Perincian Biaya Transportasi Material (Foto 5)
 */

export class OfficialDocExportManager {
  
  // =========================================================================
  // HELPER: DOWNLOAD EXCEL / HTML SPREADSHEET
  // =========================================================================
  static downloadExcel(htmlContent, filename = 'Dokumen_Proyek.xls') {
    const excelTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Sheet1</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          body { font-family: Arial, sans-serif; font-size: 10pt; }
          table { border-collapse: collapse; width: 100%; }
          th { background-color: #d1d5db; color: #000; font-weight: bold; border: 1px solid #000; padding: 6px; text-align: center; }
          td { border: 1px solid #000; padding: 5px; }
          .header-title { font-size: 14pt; font-weight: bold; text-align: center; margin-bottom: 15px; }
          .meta-table td { border: none !important; padding: 2px 5px; font-weight: bold; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .text-left { text-align: left; }
          .font-bold { font-weight: bold; }
          .bg-subtotal { background-color: #e5e7eb; font-weight: bold; }
          .bg-yellow { background-color: #fef08a; font-weight: bold; }
          .num-fmt { mso-number-format:"\\#\\,\\#\\#0\\.00"; text-align: right; }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;

    const blob = new Blob([excelTemplate], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // =========================================================================
  // 1. TEMPLATE 1: RENCANA ANGGARAN BIAYA (RAB) & REKAPITULASI (FOTO 1)
  // =========================================================================
  static generateRabHtml(project) {
    const info = project.info || {};
    const summary = project.summary || {};
    const divisions = project.divisions || [];

    let rowsHtml = '';
    divisions.forEach((div, dIdx) => {
      // Header Divisi (Baris Tebal)
      rowsHtml += `
        <tr style="background-color: #f3f4f6; font-weight: bold;">
          <td style="text-align: center; border: 1px solid #000;">${div.code || `DIV.${dIdx+1}`}</td>
          <td colspan="6" style="border: 1px solid #000;">${div.name}</td>
        </tr>
      `;

      // Item Pekerjaan
      div.items.forEach((item, iIdx) => {
        rowsHtml += `
          <tr>
            <td style="text-align: center; border: 1px solid #000;">${iIdx + 1}</td>
            <td style="border: 1px solid #000; padding-left: 12px;">${item.name}</td>
            <td style="text-align: center; border: 1px solid #000;">${item.ahspCode || '-'}</td>
            <td style="text-align: right; border: 1px solid #000;">${Number(item.volume).toLocaleString('id-ID', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            <td style="text-align: center; border: 1px solid #000;">${item.unit}</td>
            <td style="text-align: right; border: 1px solid #000;">${Number(item.unitPrice).toLocaleString('id-ID', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            <td style="text-align: right; border: 1px solid #000; font-weight: 500;">${Number(item.subtotal).toLocaleString('id-ID', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          </tr>
        `;
      });

      // Subtotal Divisi (Angka Romawi di kolom 6)
      const romanNums = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
      const roman = romanNums[dIdx] || `${dIdx+1}`;
      rowsHtml += `
        <tr style="background-color: #e5e7eb; font-weight: bold;">
          <td colspan="5" style="border: 1px solid #000;"></td>
          <td style="text-align: center; border: 1px solid #000;">${roman}</td>
          <td style="text-align: right; border: 1px solid #000;">${Number(div.subtotal || 0).toLocaleString('id-ID', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
        </tr>
      `;
    });

    // Rekapitulasi Biaya Fisik Table Rows
    let recapRowsHtml = '';
    const romanNums = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    divisions.forEach((div, dIdx) => {
      const roman = romanNums[dIdx] || `${dIdx+1}`;
      recapRowsHtml += `
        <tr>
          <td style="text-align: center; width: 40px; border: 1px solid #000;">${roman}</td>
          <td style="border: 1px solid #000; padding-left: 8px;">${div.name}</td>
          <td style="text-align: center; width: 60px; border: 1px solid #000;">Rp.</td>
          <td style="text-align: right; width: 160px; border: 1px solid #000; font-weight: bold;">${Number(div.subtotal || 0).toLocaleString('id-ID', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
        </tr>
      `;
    });

    return `
      <div style="font-family: Arial, sans-serif; color: #000;">
        <div style="text-align: center; font-size: 14pt; font-weight: bold; margin-bottom: 12px;">RENCANA ANGGARAN BIAYA (RAB)</div>
        
        <table style="width: 100%; margin-bottom: 15px; font-size: 9.5pt; font-weight: bold; border-collapse: collapse;">
          <tr><td style="width: 180px;">PROGRAM</td><td style="width: 15px;">:</td><td>${info.program || 'PENINGKATAN PRASARANA, SARANA, DAN UTILITAS UMUM (PSU)'}</td></tr>
          <tr><td>KEGIATAN PROGRAM</td><td>:</td><td>${info.kegiatan || 'URUSAN PENYELENGGARAAN PSU PERUMAHAN'}</td></tr>
          <tr><td>PEKERJAAN</td><td>:</td><td>${info.name || 'PEMBANGUNAN KANTOR BPD'}</td></tr>
          <tr><td>LOKASI</td><td>:</td><td>${info.location || 'KAB. BARITO UTARA'}</td></tr>
          <tr><td>TAHUN</td><td>:</td><td>${info.fiscalYear || '2026'}</td></tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; font-size: 9pt; margin-bottom: 25px;">
          <thead>
            <tr style="background-color: #d1d5db; text-align: center; font-weight: bold;">
              <th style="width: 40px; border: 1px solid #000; padding: 6px;">No.</th>
              <th style="border: 1px solid #000; padding: 6px;">URAIAN PEKERJAAN</th>
              <th style="width: 90px; border: 1px solid #000; padding: 6px;">KODE</th>
              <th style="width: 80px; border: 1px solid #000; padding: 6px;">KUANTITAS</th>
              <th style="width: 70px; border: 1px solid #000; padding: 6px;">SATUAN</th>
              <th style="width: 120px; border: 1px solid #000; padding: 6px;">HARGA SATUAN<br>( Rp )</th>
              <th style="width: 130px; border: 1px solid #000; padding: 6px;">JUMLAH</th>
            </tr>
            <tr style="background-color: #e5e7eb; text-align: center; font-size: 8pt; font-weight: bold;">
              <td style="border: 1px solid #000;">1</td>
              <td style="border: 1px solid #000;">2</td>
              <td style="border: 1px solid #000;">3</td>
              <td style="border: 1px solid #000;">4</td>
              <td style="border: 1px solid #000;">5</td>
              <td style="border: 1px solid #000;">6</td>
              <td style="border: 1px solid #000;">7</td>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <!-- REKAPITULASI BIAYA (PAGE 2 STYLE) -->
        <div style="page-break-before: auto; margin-top: 20px;">
          <div style="font-weight: bold; text-decoration: underline; margin-bottom: 6px; font-size: 10pt;">REKAPITULASI BIAYA</div>
          <div style="font-weight: bold; margin-bottom: 6px; font-size: 9.5pt;">A. BIAYA FISIK</div>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 9pt; margin-bottom: 15px;">
            <tbody>
              ${recapRowsHtml}
              <tr style="background-color: #e5e7eb; font-weight: bold;">
                <td colspan="2" style="text-align: center; border: 1px solid #000;">TOTAL</td>
                <td style="text-align: center; border: 1px solid #000;">Rp.</td>
                <td style="text-align: right; border: 1px solid #000;">${Number(summary.totalDirectCost || 0).toLocaleString('id-ID', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              </tr>
              <tr style="background-color: #f3f4f6; font-weight: bold;">
                <td colspan="2" style="text-align: center; border: 1px solid #000;">PPN ${summary.ppnRate || 11}%</td>
                <td style="text-align: center; border: 1px solid #000;"></td>
                <td style="text-align: right; border: 1px solid #000;">${Number(summary.ppnCost || 0).toLocaleString('id-ID', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              </tr>
              <tr style="background-color: #d1d5db; font-weight: 900; font-size: 9.5pt;">
                <td colspan="2" style="text-align: center; border: 1px solid #000;">TOTAL + PPN</td>
                <td style="text-align: center; border: 1px solid #000;">Rp.</td>
                <td style="text-align: right; border: 1px solid #000;">${Number(summary.grandTotal || 0).toLocaleString('id-ID', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              </tr>
            </tbody>
          </table>

          <div style="font-size: 9pt; font-weight: bold; margin-top: 10px;">
            Terbilang : <em>${summary.terbilang || ''}</em>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // 2. TEMPLATE 2: PERHITUNGAN VOLUME / BOQ (FOTO 2)
  // =========================================================================
  static generateVolumeHtml(project) {
    const info = project.info || {};
    const divisions = project.divisions || [];

    let rowsHtml = '';
    divisions.forEach((div, dIdx) => {
      // Divisi Header
      const romanNums = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
      const roman = romanNums[dIdx] || `${dIdx+1}`;

      rowsHtml += `
        <tr style="background-color: #e5e7eb; font-weight: bold;">
          <td style="text-align: center; border: 1px solid #000;">${roman}.</td>
          <td colspan="10" style="border: 1px solid #000;">${div.name}</td>
          <td style="border: 1px solid #000;"></td>
          <td style="border: 1px solid #000;"></td>
        </tr>
      `;

      div.items.forEach((item, iIdx) => {
        // Contoh detail formula geometris default jika tidak ada rumus kompleks
        const volVal = Number(item.volume) || 0;
        rowsHtml += `
          <tr>
            <td style="text-align: center; border: 1px solid #000;">${iIdx + 1}</td>
            <td style="border: 1px solid #000;">${item.name}</td>
            <td style="text-align: center; border: 1px solid #000;">-</td>
            <td style="text-align: center; border: 1px solid #000;">x</td>
            <td style="text-align: center; border: 1px solid #000;">-</td>
            <td style="text-align: center; border: 1px solid #000;">x</td>
            <td style="text-align: center; border: 1px solid #000;">-</td>
            <td style="text-align: center; border: 1px solid #000;">x</td>
            <td style="text-align: center; border: 1px solid #000;">1,00</td>
            <td style="text-align: center; border: 1px solid #000;">=</td>
            <td style="text-align: right; border: 1px solid #000;">${volVal.toLocaleString('id-ID', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            <td style="text-align: right; font-weight: bold; border: 1px solid #000;">${volVal.toLocaleString('id-ID', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            <td style="text-align: center; font-weight: bold; border: 1px solid #000;">${item.unit}</td>
          </tr>
        `;
      });
    });

    return `
      <div style="font-family: Arial, sans-serif; color: #000;">
        <div style="text-align: center; font-size: 14pt; font-weight: bold; margin-bottom: 12px;">PERHITUNGAN VOLUME</div>
        
        <table style="width: 100%; margin-bottom: 15px; font-size: 9.5pt; font-weight: bold; border-collapse: collapse;">
          <tr><td style="width: 180px;">PROGRAM</td><td style="width: 15px;">:</td><td>${info.program || 'PROGRAM PENINGKATAN PRASARANA, SARANA DAN UTILITAS UMUM (PSU)'}</td></tr>
          <tr><td>KEGIATAN PROGRAM</td><td>:</td><td>${info.kegiatan || 'URUSAN PENYELENGGARAAN PSU PERUMAHAN'}</td></tr>
          <tr><td>PEKERJAAN</td><td>:</td><td>${info.name || 'REHAB BAGUNAN'}</td></tr>
          <tr><td>LOKASI</td><td>:</td><td>${info.location || 'KAB. BARITO UTARA'}</td></tr>
          <tr><td>TAHUN</td><td>:</td><td>${info.fiscalYear || '2026'}</td></tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; font-size: 8.5pt;">
          <thead>
            <tr style="background-color: #d1d5db; text-align: center; font-weight: bold;">
              <th rowspan="2" style="width: 35px; border: 1px solid #000;">No</th>
              <th rowspan="2" style="border: 1px solid #000;">Uraian Pekerjaan</th>
              <th colspan="9" style="border: 1px solid #000; padding: 4px;">Perhitungan Volume</th>
              <th colspan="2" style="border: 1px solid #000; padding: 4px;">Volume Pekerjaan</th>
            </tr>
            <tr style="background-color: #e5e7eb; text-align: center; font-weight: bold;">
              <th style="width: 45px; border: 1px solid #000;">P</th>
              <th style="width: 20px; border: 1px solid #000;">x</th>
              <th style="width: 45px; border: 1px solid #000;">L</th>
              <th style="width: 20px; border: 1px solid #000;">x</th>
              <th style="width: 60px; border: 1px solid #000;">Tinggi/Tebal</th>
              <th style="width: 20px; border: 1px solid #000;">x</th>
              <th style="width: 45px; border: 1px solid #000;">Jumlah</th>
              <th style="width: 20px; border: 1px solid #000;">=</th>
              <th style="width: 55px; border: 1px solid #000;">Vol</th>
              <th style="width: 65px; border: 1px solid #000;">Vol</th>
              <th style="width: 45px; border: 1px solid #000;">Sat</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }

  // =========================================================================
  // 3. TEMPLATE 3: DAFTAR ANALISA HARGA SATUAN PEKERJAAN TERPILIH (FOTO 3)
  // =========================================================================
  static generateAnalisaHtml(project, ahspEngine) {
    const info = project.info || {};
    const regionId = info.regionId || 'MUARA_TEWEH';

    // Kumpulkan semua AHSP yang dipakai dalam RAB (Unik)
    const usedCodes = new Set();
    (project.divisions || []).forEach(div => {
      (div.items || []).forEach(item => {
        if (item.ahspCode && item.ahspCode !== 'CUSTOM') {
          usedCodes.add(item.ahspCode);
        }
      });
    });

    let analisaSheetsHtml = '';
    usedCodes.forEach(code => {
      const b = ahspEngine.calculateItemPrice(code, regionId);
      if (!b) return;

      const tenagaRows = b.breakdown.filter(c => c.type === 'upah');
      const bahanRows = b.breakdown.filter(c => c.type === 'bahan');
      const alatRows = b.breakdown.filter(c => c.type === 'alat');

      const overheadRate = 15; // 15% sesuai template PUPR
      const totalDirect = b.directCost;
      const overheadCost = totalDirect * (overheadRate / 100);
      const grandHsp = totalDirect + overheadCost;

      analisaSheetsHtml += `
        <div style="margin-bottom: 30px; page-break-after: auto;">
          <div style="background-color: #fef08a; font-weight: bold; padding: 4px 8px; border: 1px solid #000; font-size: 10pt; margin-bottom: 6px;">
            <span style="font-family: monospace;">${b.code}</span> ${b.name}
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 9pt;">
            <thead>
              <tr style="background-color: #f3f4f6; text-align: center; font-weight: bold;">
                <th style="width: 35px; border: 1px solid #000;">No</th>
                <th style="border: 1px solid #000;">Uraian</th>
                <th style="width: 80px; border: 1px solid #000;">Kode</th>
                <th style="width: 60px; border: 1px solid #000;">Satuan</th>
                <th style="width: 80px; border: 1px solid #000;">Koefisien</th>
                <th style="width: 130px; border: 1px solid #000;">Harga Satuan (Rp.)</th>
                <th style="width: 140px; border: 1px solid #000;">Jumlah Harga (Rp.)</th>
              </tr>
            </thead>
            <tbody>
              <!-- A. TENAGA -->
              <tr style="font-weight: bold; background-color: #f9fafb;">
                <td style="border: 1px solid #000; text-align: center;">A</td>
                <td colspan="6" style="border: 1px solid #000;">TENAGA</td>
              </tr>
              ${tenagaRows.map(r => `
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 12px;">${r.name || r.code}</td>
                  <td style="border: 1px solid #000; text-align: center;">${r.code}</td>
                  <td style="border: 1px solid #000; text-align: center;">OH</td>
                  <td style="border: 1px solid #000; text-align: right;">${r.coeff.toLocaleString('id-ID', {minimumFractionDigits: 3})}</td>
                  <td style="border: 1px solid #000; text-align: right;">${r.unitPrice.toLocaleString('id-ID', {minimumFractionDigits: 2})}</td>
                  <td style="border: 1px solid #000; text-align: right;">${r.subtotal.toLocaleString('id-ID', {minimumFractionDigits: 2})}</td>
                </tr>
              `).join('')}
              <tr style="font-weight: bold; background-color: #f3f4f6;">
                <td colspan="6" style="border: 1px solid #000; text-align: right;">JUMLAH TENAGA KERJA</td>
                <td style="border: 1px solid #000; text-align: right;">${b.totalUpah.toLocaleString('id-ID', {minimumFractionDigits: 2})}</td>
              </tr>

              <!-- B. BAHAN -->
              <tr style="font-weight: bold; background-color: #f9fafb;">
                <td style="border: 1px solid #000; text-align: center;">B</td>
                <td colspan="6" style="border: 1px solid #000;">BAHAN</td>
              </tr>
              ${bahanRows.map(r => `
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 12px;">${r.name || r.code}</td>
                  <td style="border: 1px solid #000; text-align: center;">${r.code}</td>
                  <td style="border: 1px solid #000; text-align: center;">-</td>
                  <td style="border: 1px solid #000; text-align: right;">${r.coeff.toLocaleString('id-ID', {minimumFractionDigits: 3})}</td>
                  <td style="border: 1px solid #000; text-align: right;">${r.unitPrice.toLocaleString('id-ID', {minimumFractionDigits: 2})}</td>
                  <td style="border: 1px solid #000; text-align: right;">${r.subtotal.toLocaleString('id-ID', {minimumFractionDigits: 2})}</td>
                </tr>
              `).join('')}
              <tr style="font-weight: bold; background-color: #f3f4f6;">
                <td colspan="6" style="border: 1px solid #000; text-align: right;">JUMLAH HARGA BAHAN</td>
                <td style="border: 1px solid #000; text-align: right;">${b.totalBahan.toLocaleString('id-ID', {minimumFractionDigits: 2})}</td>
              </tr>

              <!-- C. PERALATAN -->
              <tr style="font-weight: bold; background-color: #f9fafb;">
                <td style="border: 1px solid #000; text-align: center;">C</td>
                <td colspan="6" style="border: 1px solid #000;">PERALATAN</td>
              </tr>
              ${alatRows.map(r => `
                <tr>
                  <td style="border: 1px solid #000;"></td>
                  <td style="border: 1px solid #000; padding-left: 12px;">${r.name || r.code}</td>
                  <td style="border: 1px solid #000; text-align: center;">${r.code}</td>
                  <td style="border: 1px solid #000; text-align: center;">-</td>
                  <td style="border: 1px solid #000; text-align: right;">${r.coeff.toLocaleString('id-ID', {minimumFractionDigits: 3})}</td>
                  <td style="border: 1px solid #000; text-align: right;">${r.unitPrice.toLocaleString('id-ID', {minimumFractionDigits: 2})}</td>
                  <td style="border: 1px solid #000; text-align: right;">${r.subtotal.toLocaleString('id-ID', {minimumFractionDigits: 2})}</td>
                </tr>
              `).join('')}
              <tr style="font-weight: bold; background-color: #f3f4f6;">
                <td colspan="6" style="border: 1px solid #000; text-align: right;">JUMLAH HARGA ALAT</td>
                <td style="border: 1px solid #000; text-align: right;">${b.totalAlat.toLocaleString('id-ID', {minimumFractionDigits: 2})}</td>
              </tr>

              <!-- TOTAL D, E, F -->
              <tr style="font-weight: bold;">
                <td style="border: 1px solid #000; text-align: center;">D</td>
                <td colspan="5" style="border: 1px solid #000;">Jumlah (A+B+C)</td>
                <td style="border: 1px solid #000; text-align: right;">${totalDirect.toLocaleString('id-ID', {minimumFractionDigits: 2})}</td>
              </tr>
              <tr style="font-style: italic;">
                <td style="border: 1px solid #000; text-align: center;">E</td>
                <td colspan="4" style="border: 1px solid #000;">Overhead & Profit 15 %</td>
                <td style="border: 1px solid #000; text-align: center;">15%</td>
                <td style="border: 1px solid #000; text-align: right;">${overheadCost.toLocaleString('id-ID', {minimumFractionDigits: 2})}</td>
              </tr>
              <tr style="font-weight: bold; background-color: #e5e7eb; font-size: 9.5pt;">
                <td style="border: 1px solid #000; text-align: center;">F</td>
                <td colspan="5" style="border: 1px solid #000;">Harga Satuan Pekerjaan (D+E)</td>
                <td style="border: 1px solid #000; text-align: right; font-weight: 900;">${grandHsp.toLocaleString('id-ID', {minimumFractionDigits: 2})}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    });

    return `
      <div style="font-family: Arial, sans-serif; color: #000;">
        <div style="text-align: center; font-size: 14pt; font-weight: bold; margin-bottom: 12px;">DAFTAR ANALISA</div>
        
        <table style="width: 100%; margin-bottom: 15px; font-size: 9.5pt; font-weight: bold; border-collapse: collapse;">
          <tr><td style="width: 180px;">PROGRAM</td><td style="width: 15px;">:</td><td>${info.program || 'PROGRAM PENINGKATAN PRASARANA, SARANA DAN UTILITAS UMUM (PSU)'}</td></tr>
          <tr><td>KEGIATAN PROGRAM</td><td>:</td><td>${info.kegiatan || 'URUSAN PENYELENGGARAAN PSU PERUMAHAN'}</td></tr>
          <tr><td>PEKERJAAN</td><td>:</td><td>${info.name || 'PEMBANGUNAN KANTOR BPD'}</td></tr>
          <tr><td>LOKASI</td><td>:</td><td>${info.location || 'KAB. BARITO UTARA'}</td></tr>
        </table>

        ${analisaSheetsHtml}
      </div>
    `;
  }

  // =========================================================================
  // 4. TEMPLATE 4: DAFTAR SATUAN UPAH (FOTO 4)
  // =========================================================================
  static generateUpahHtml(project, masterUpah) {
    const info = project.info || {};
    const regionId = info.regionId || 'MUARA_TEWEH';

    const rowsHtml = masterUpah.map((u, idx) => {
      const price = u.prices[regionId] || 0;
      return `
        <tr>
          <td style="text-align: center; border: 1px solid #000; width: 45px;">${idx + 1}</td>
          <td style="border: 1px solid #000; padding-left: 8px;">${u.name}</td>
          <td style="text-align: center; border: 1px solid #000; width: 100px;">${u.unit || 'Oh'}</td>
          <td style="text-align: right; border: 1px solid #000; width: 160px; font-weight: 500;">${price.toLocaleString('id-ID', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
        </tr>
      `;
    }).join('');

    return `
      <div style="font-family: Arial, sans-serif; color: #000;">
        <div style="text-align: center; font-size: 14pt; font-weight: bold; margin-bottom: 15px;">DAFTAR SATUAN UPAH</div>
        
        <table style="width: 100%; margin-bottom: 15px; font-size: 9.5pt; font-weight: bold; border-collapse: collapse;">
          <tr><td style="width: 140px;">Program</td><td style="width: 15px;">:</td><td>${info.program || 'PENINGKATAN PRASARANA, SARANA, DAN UTILITAS UMUM (PSU)'}</td></tr>
          <tr><td>Kegiatan</td><td>:</td><td>${info.kegiatan || 'URUSAN PENYELENGGARAAN PSU PERUMAHAN'}</td></tr>
          <tr><td>Pekerjaan</td><td>:</td><td>${info.name || 'PEMBANGUNAN KANTOR BPD'}</td></tr>
          <tr><td>Lokasi</td><td>:</td><td>${info.location || 'KAB. BARITO UTARA'}</td></tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; font-size: 9pt;">
          <thead>
            <tr style="background-color: #d1d5db; text-align: center; font-weight: bold;">
              <th style="border: 1px solid #000; padding: 6px;">No.</th>
              <th style="border: 1px solid #000; padding: 6px;">Nama Upah</th>
              <th style="border: 1px solid #000; padding: 6px;">Satuan</th>
              <th style="border: 1px solid #000; padding: 6px;">Harga Satuan (Rp.)</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }

  // =========================================================================
  // 5. TEMPLATE 5: DAFTAR SATUAN BAHAN & TRANSPORTASI BARITO UTARA (FOTO 5)
  // =========================================================================
  static generateBahanHtml(project, masterBahan) {
    const info = project.info || {};
    const regionId = info.regionId || 'MUARA_TEWEH';

    // Urutkan bahan secara alfabetis
    const sortedBahan = [...masterBahan].sort((a, b) => a.name.localeCompare(b.name));

    const rowsHtml = sortedBahan.map((b, idx) => {
      const price = b.prices[regionId] || 0;
      return `
        <tr>
          <td style="text-align: center; border: 1px solid #000; width: 45px;">${idx + 1}</td>
          <td style="border: 1px solid #000; padding-left: 8px;">${b.name}</td>
          <td style="text-align: center; border: 1px solid #000; width: 90px;">${b.unit}</td>
          <td style="text-align: right; border: 1px solid #000; width: 150px;">${price.toLocaleString('id-ID', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
        </tr>
      `;
    }).join('');

    return `
      <div style="font-family: Arial, sans-serif; color: #000;">
        <div style="text-align: center; font-size: 14pt; font-weight: bold; margin-bottom: 15px;">DAFTAR SATUAN BAHAN</div>
        
        <table style="width: 100%; margin-bottom: 15px; font-size: 9.5pt; font-weight: bold; border-collapse: collapse;">
          <tr><td style="width: 140px;">Program</td><td style="width: 15px;">:</td><td>${info.program || 'PROGRAM PENINGKATAN PRASARANA, SARANA DAN UTILITAS UMUM (PSU)'}</td></tr>
          <tr><td>Kegiatan</td><td>:</td><td>${info.kegiatan || 'URUSAN PENYELENGGARAAN PSU PERUMAHAN'}</td></tr>
          <tr><td>Pekerjaan</td><td>:</td><td>${info.name || 'PEMBANGUNAN KANTOR BPD'}</td></tr>
          <tr><td>Lokasi</td><td>:</td><td>${info.location || 'KAB. BARITO UTARA'}</td></tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; font-size: 8.5pt; margin-bottom: 25px;">
          <thead>
            <tr style="background-color: #d1d5db; text-align: center; font-weight: bold;">
              <th style="border: 1px solid #000; padding: 5px;">No.</th>
              <th style="border: 1px solid #000; padding: 5px;">Nama Bahan</th>
              <th style="border: 1px solid #000; padding: 5px;">Satuan</th>
              <th style="border: 1px solid #000; padding: 5px;">Harga Satuan (Rp.)</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <!-- PERINCIAN BIAYA TRANSPORTASI MATERIAL KHAS BARITO UTARA (FOTO 5 HALAMAN 3) -->
        <div style="margin-top: 20px; page-break-before: auto;">
          <div style="font-weight: bold; font-size: 10pt; margin-bottom: 8px;">Perincian biaya transportasi material</div>

          <table style="width: 100%; border-collapse: collapse; font-size: 8.5pt;">
            <!-- 1. Pasir Pasang -->
            <tr>
              <td style="width: 25px; font-weight: bold; vertical-align: top;">1</td>
              <td colspan="2" style="font-weight: bold;">Pasir Pasang/Pasir Beton (Pasir Sungai)</td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td style="width: 20px;">-</td>
              <td>Lokasi Pasir (Quarry) berada di Lahei Barat</td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td>-</td>
              <td>Harga pasir di quarry</td>
              <td style="text-align: right; width: 140px;">329.000,00</td>
            </tr>
            <tr>
              <td></td>
              <td>-</td>
              <td>Biaya Angkut ke lokasi ±</td>
              <td style="text-align: right; border-bottom: 1px solid #000;">350.100,00</td>
            </tr>
            <tr style="font-weight: bold;">
              <td></td>
              <td colspan="2" style="text-align: right; padding-right: 15px;">Jumlah Harga per m3</td>
              <td style="text-align: right; border-bottom: 2px solid #000;">679.100,00</td>
            </tr>

            <!-- 2. Batu Split -->
            <tr>
              <td style="font-weight: bold; vertical-align: top; padding-top: 8px;">2</td>
              <td colspan="2" style="font-weight: bold; padding-top: 8px;">Batu split 2/3</td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td>-</td>
              <td>Lokasi (Quarry) berada di T Mayang</td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td>-</td>
              <td>Harga koral di quarry (Muara Teweh Km. 7 - P. Cahu) (Ton)</td>
              <td style="text-align: right;">450.000,00</td>
            </tr>
            <tr>
              <td></td>
              <td>-</td>
              <td>Biaya Angkut ke lokasi ±</td>
              <td style="text-align: right; border-bottom: 1px solid #000;">350.100,00</td>
            </tr>
            <tr style="font-weight: bold;">
              <td></td>
              <td colspan="2" style="text-align: right; padding-right: 15px;">Jumlah Harga per m3</td>
              <td style="text-align: right; border-bottom: 2px solid #000;">800.100,00</td>
            </tr>

            <!-- 3. Semen PC -->
            <tr>
              <td style="font-weight: bold; vertical-align: top; padding-top: 8px;">3</td>
              <td colspan="2" style="font-weight: bold; padding-top: 8px;">Semen Portland (PC)</td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td>-</td>
              <td>Lokasi semen (Quarry) berada di Muara Teweh</td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td>-</td>
              <td>Harga Semen di Muara Teweh</td>
              <td style="text-align: right;">74.000,00</td>
            </tr>
            <tr>
              <td></td>
              <td>-</td>
              <td>Biaya Angkut ke lokasi</td>
              <td style="text-align: right; border-bottom: 1px solid #000;">12.480,00</td>
            </tr>
            <tr style="font-weight: bold;">
              <td></td>
              <td colspan="2" style="text-align: right; padding-right: 15px;">Jumlah Harga per zak</td>
              <td style="text-align: right;">86.480,00</td>
            </tr>
            <tr style="font-weight: bold;">
              <td></td>
              <td colspan="2" style="text-align: right; padding-right: 15px;">Jumlah Harga per Kg</td>
              <td style="text-align: right; border-bottom: 2px solid #000;">1.729,60</td>
            </tr>

            <!-- 4. Besi Beton -->
            <tr>
              <td style="font-weight: bold; vertical-align: top; padding-top: 8px;">4</td>
              <td colspan="2" style="font-weight: bold; padding-top: 8px;">Besi Beton Polos</td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td>-</td>
              <td>Lokasi besi beton (Quarry) berada di Muara Teweh</td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td>-</td>
              <td>Harga besi beton di Muara Teweh</td>
              <td style="text-align: right;">12.670,00</td>
            </tr>
            <tr>
              <td></td>
              <td>-</td>
              <td>Biaya Angkut ke lokasi</td>
              <td style="text-align: right; border-bottom: 1px solid #000;">1.267,00</td>
            </tr>
            <tr style="font-weight: bold;">
              <td></td>
              <td colspan="2" style="text-align: right; padding-right: 15px;">Jumlah Harga per Kg</td>
              <td style="text-align: right; border-bottom: 2px solid #000;">13.937,00</td>
            </tr>

            <!-- 5. Pasir Urug -->
            <tr>
              <td style="font-weight: bold; vertical-align: top; padding-top: 8px;">5</td>
              <td colspan="2" style="font-weight: bold; padding-top: 8px;">Pasir Urug</td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td>-</td>
              <td>Lokasi Pasir (Quarry) berada di Lahei Barat</td>
              <td style="text-align: right;">226.000,00</td>
            </tr>
            <tr>
              <td></td>
              <td>-</td>
              <td>Biaya Angkut ke lokasi ±</td>
              <td style="text-align: right; border-bottom: 1px solid #000;">350.100,00</td>
            </tr>
            <tr style="font-weight: bold;">
              <td></td>
              <td colspan="2" style="text-align: right; padding-right: 15px;">Jumlah Harga per m3</td>
              <td style="text-align: right; border-bottom: 2px solid #000;">576.100,00</td>
            </tr>

            <!-- 6. Batu Belah -->
            <tr>
              <td style="font-weight: bold; vertical-align: top; padding-top: 8px;">6</td>
              <td colspan="2" style="font-weight: bold; padding-top: 8px;">Batu Belah</td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td>-</td>
              <td>Lokasi batu (Quarry) di KM. 7 Muara Teweh (60 Km)</td>
              <td style="text-align: right;">350.000,00</td>
            </tr>
            <tr>
              <td></td>
              <td>-</td>
              <td>Biaya Angkut ke lokasi ±</td>
              <td style="text-align: right; border-bottom: 1px solid #000;">350.100,00</td>
            </tr>
            <tr style="font-weight: bold;">
              <td></td>
              <td colspan="2" style="text-align: right; padding-right: 15px;">Jumlah Harga per m3</td>
              <td style="text-align: right; border-bottom: 2px solid #000;">700.100,00</td>
            </tr>
          </table>
        </div>
      </div>
    `;
  }
}
