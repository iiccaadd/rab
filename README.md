# MIRSTYVANCONSTRUCTION 2026
### Sistem Informasi Manajemen Proyek Konstruksi, RAB Dinamis, Kalkulator Volume BOQ, Kurva S & Sistem Autentikasi Pengguna
**Wilayah Acuan:** Muara Teweh (Kab. Barito Utara) & Kota Palangka Raya  
**Periode Anggaran:** Semester II (2) Tahun 2026  
**Standar Analisa:** Pedoman Analisa Harga Satuan Pekerjaan (AHSP) Permen PUPR & Standar Satuan Harga (SSH) Regional

---

## 🌟 Fitur Utama Aplikasi

### 1. 🔐 Sistem Autentikasi & Pengaturan Akun (Production-Ready)
- **Autentikasi JWT**: Access Token (15m) + Refresh Token (7d) tersimpan aman di `httpOnly` Cookie.
- **Autentikasi Dua Faktor (2FA - TOTP)**: Integrasi Google Authenticator / Authy dengan QR Code scanner.
- **Multi-Device Session Management**: Deteksi perangkat aktif, IP address, waktu login, dan tombol *Cabut Sesi Jarak Jauh*.
- **Halaman Pengaturan Lengkap (`settings.html`)**:
  - Edit profil (nama, telepon, bio) & upload foto profil (avatar maks 2MB).
  - Ubah password dengan verifikasi password lama & pencabutan sesi di perangkat lain otomatis.
  - Permintaan ubah email dengan konfirmasi email baru.
  - Preferensi notifikasi (Email, Push browser) & pemilihan tema (*Light/Dark*).
  - Hapus akun (*Soft delete* dengan masa tenggang 30 hari).

### 2. 📱 Tampilan Responsif Handphone & iPad (Mobile Friendly)
- **Navigasi Mobile Off-Canvas**: Sidebar otomatis menjadi menu geser (*drawer*) dengan tombol hamburger pada layar smartphone dan tablet.
- **Tabel Responsif Touch-Scroll**: Tabel RAB, AHSP, BOQ, Jadwal Waktu, dan Sesi dilengkapi pengguliran horizontal halus (*smooth touch scrolling*).
- **KPI Cards & Formulir Adaptif**: Grid indikator kinerja menyesuaikan otomatis menjadi 1 kolom (Handphone) atau 2 kolom (iPad).

### 3. 📐 Kalkulator Volume Pekerjaan (BOQ Parametrik & Custom Rumus)
- Dilengkapi formula geometris dan matematis lengkap:
  - Galian tanah, pondasi batu kali, cerucuk galam/ulin, struktur beton (kolom, balok, plat, tangga).
  - Dropdown pembesian SNI ($\varnothing 6$ s/d $\varnothing 25\text{ mm}$ beserta berat $kg/m$).
  - Konstruksi baja (WF/H-Beam, Baseplate, Hollow, Baut HTB, Cat Galvanis) dengan tabel spesifikasi teknis dan petunjuk pengisian.
  - Pembuatan rumus kustom matematika tak terbatas dengan tombol **"Terapkan ke RAB"**.

### 4. 📋 Penyusun RAB Dinamis & Rekapitulasi Otomatis
- Struktur WBS divisi pekerjaan, penambahan item dari katalog AHSP PUPR atau input manual.
- Subtotal biaya, bobot persentase (%), PPN, Jasa Kontraktor/Overhead, dan format terbilang rupiah otomatis.

### 5. 📈 Dashboard Kurva S & Monitoring Realisasi (Opname Fisik)
- Grafik Kurva S interaktif HiDPI Retina Canvas (Rencana vs Realisasi kumulatif).
- Sistem peringatan dini (*Early Warning System / Show Cause Meeting alert*) bila deviasi mencapai batas kritis.

### 6. 📄 Modul Dokumen Resmi & Ekspor (5 Format Standar PUPR)
- Lampiran 1: Rencana Anggaran Biaya (RAB).
- Lampiran 2: Rekapitulasi Rincian BOQ.
- Lampiran 3: Analisa Harga Satuan Pekerjaan (AHSP) Terpilih.
- Lampiran 4: Daftar Satuan Upah Tenaga Kerja.
- Lampiran 5: Daftar Satuan Bahan Material & Transportasi.
- Unduh Excel (.xls) dan Pratinjau / Cetak PDF per lampiran independen.

---

## 🚀 Cara Menjalankan Aplikasi

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Konfigurasi Environment**:
   Salin `.env.example` ke `.env` dan atur kredensial database PostgreSQL Anda.

3. **Jalankan Migrasi Database**:
   ```bash
   npm run migrate
   ```

4. **Jalankan Server**:
   ```bash
   npm run dev
   ```

5. **Akses Aplikasi**:
   - **Aplikasi Konstruksi Utama**: [`http://localhost:5000/index.html`](http://localhost:5000/index.html)
   - **Login**: [`http://localhost:5000/login.html`](http://localhost:5000/login.html)
   - **Pengaturan Akun**: [`http://localhost:5000/settings.html`](http://localhost:5000/settings.html)
