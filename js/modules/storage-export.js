/**
 * MODUL STORAGE & EXPORT MANAGER
 * Auto-save LocalStorage, Ekspor JSON Proyek, Ekspor Excel/CSV, dan Mode Cetak PDF
 */

const STORAGE_KEY = 'SIPRO_KALTENG_PROJECT_DATA';

export class StorageExportManager {
  static saveProject(projectData) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projectData));
      return true;
    } catch (e) {
      console.error('Gagal menyimpan ke LocalStorage:', e);
      return false;
    }
  }

  static loadProject() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Gagal memuat dari LocalStorage:', e);
    }
    return null;
  }

  static exportToJson(projectData, filename = 'Proyek_RAB_KurvaS_2026.json') {
    const jsonStr = JSON.stringify(projectData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static importFromJson(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (!parsed.divisions || !parsed.info) {
            reject(new Error('Format file proyek tidak valid.'));
          } else {
            resolve(parsed);
          }
        } catch (err) {
          reject(new Error('File bukan file JSON yang valid.'));
        }
      };
      reader.onerror = () => reject(new Error('Gagal membaca file.'));
      reader.readAsText(file);
    });
  }

  static exportRabToCsv(projectData, filename = 'RAB_Proyek_2026.csv') {
    let csvContent = `\uFEFF`; // UTF-8 BOM untuk Excel
    csvContent += `RENCANA ANGGARAN BIAYA (RAB)\n`;
    csvContent += `Nama Proyek,"${projectData.info.name}"\n`;
    csvContent += `Pemilik / Instansi,"${projectData.info.owner}"\n`;
    csvContent += `Lokasi / Wilayah Acuan,"${projectData.info.location} (${projectData.info.regionId})"\n`;
    csvContent += `Tahun Anggaran,"${projectData.info.fiscalYear}"\n\n`;

    csvContent += `No,Uraian Pekerjaan,Kode AHSP,Satuan,Volume,Harga Satuan (Rp),Jumlah Harga (Rp),Bobot (%)\n`;

    projectData.divisions.forEach((div, dIdx) => {
      csvContent += `"${div.code}","${div.name}","","","","","${div.subtotal || 0}","${(div.weight || 0).toFixed(2)}%"\n`;
      div.items.forEach((item, iIdx) => {
        csvContent += `"${dIdx + 1}.${iIdx + 1}","${item.name.replace(/"/g, '""')}","${item.ahspCode || '-'}","${item.unit}","${item.volume}","${item.unitPrice}","${item.subtotal}","${(item.weight || 0).toFixed(2)}%"\n`;
      });
    });

    const sum = projectData.summary || {};
    csvContent += `\n`;
    csvContent += `,"JUMLAH REAL COST FISIK","","","","","${sum.totalDirectCost || 0}","100.00%"\n`;
    csvContent += `,"JASA KONTRAKTOR / OVERHEAD (${sum.overheadRate || 0}%)","","","","","${sum.overheadCost || 0}",""\n`;
    csvContent += `,"PPN (${sum.ppnRate || 11}%)","","","","","${sum.ppnCost || 0}",""\n`;
    csvContent += `,"GRAND TOTAL NILAI KONTRAK","","","","","${sum.grandTotal || 0}",""\n`;
    csvContent += `,"TERBILANG: ${sum.terbilang || ''}","","","","","",""\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static triggerPrint() {
    window.print();
  }
}
