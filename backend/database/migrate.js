const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function runMigration() {
  console.log('--- Memulai Migrasi Database PostgreSQL ---');
  try {
    const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Mengeksekusi file schema.sql...');
    await db.query(sql);

    console.log('✅ Migrasi database berhasil dibuat/diperbarui.');
    console.log('Tabel yang tersedia: users, sessions, password_reset_tokens, email_verification_tokens.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Gagal menjalankan migrasi database:', error.message);
    console.error('Pastikan PostgreSQL sudah berjalan dan kredensial di .env sudah sesuai.');
    process.exit(1);
  }
}

runMigration();
