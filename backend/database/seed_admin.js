const { hashPassword } = require('../utils/hash');
const db = require('../config/db');
const fs = require('fs');
const path = require('path');

async function seedAdmin() {
  const adminData = {
    name: 'irsyadisty',
    email: 'irsyadisty@mirstyvanconstruction.com',
    password: '11nov2026',
    phoneNumber: '081234567890',
    bio: 'Administrator Utama Mirstyvan Construction',
  };

  console.log('=======================================================');
  console.log('Seeding Akun Admin MIRSTYVANCONSTRUCTION...');
  console.log(`Username : ${adminData.name}`);
  console.log(`Email    : ${adminData.email}`);
  console.log(`Password : ${adminData.password}`);
  console.log('=======================================================');

  const passwordHash = await hashPassword(adminData.password);

  // 1. Simpan ke local json fallback
  const localUsersPath = path.resolve(__dirname, 'local_users.json');
  let localUsers = [];
  if (fs.existsSync(localUsersPath)) {
    try {
      localUsers = JSON.parse(fs.readFileSync(localUsersPath, 'utf8'));
    } catch (e) {
      localUsers = [];
    }
  }

  const existingIndex = localUsers.findIndex(
    (u) => u.name.toLowerCase() === adminData.name.toLowerCase() || u.email.toLowerCase() === adminData.email.toLowerCase()
  );

  const adminUserObj = {
    id: '00000000-0000-0000-0000-000000000001',
    name: adminData.name,
    email: adminData.email,
    password_hash: passwordHash,
    phone_number: adminData.phoneNumber,
    bio: adminData.bio,
    avatar_url: null,
    pending_email: null,
    email_verified: true,
    is_approved: true,
    status: 'APPROVED',
    two_factor_enabled: false,
    two_factor_secret: null,
    deleted_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    localUsers[existingIndex] = { ...localUsers[existingIndex], ...adminUserObj };
  } else {
    localUsers.push(adminUserObj);
  }

  fs.writeFileSync(localUsersPath, JSON.stringify(localUsers, null, 2), 'utf8');
  console.log('✓ Akun admin disimpan ke fallback database lokal (local_users.json)');

  // 2. Coba simpan ke PostgreSQL jika koneksi aktif
  try {
    // Jalankan migration skema tabel
    const schemaSqlPath = path.resolve(__dirname, '../../database/schema.sql');
    if (fs.existsSync(schemaSqlPath)) {
      const sql = fs.readFileSync(schemaSqlPath, 'utf8');
      await db.query(sql);
      console.log('✓ Skema database PostgreSQL berhasil diverifikasi');
    }

    const checkQuery = `
      SELECT id FROM users 
      WHERE LOWER(email) = LOWER($1) OR LOWER(name) = LOWER($2)
      LIMIT 1
    `;
    const existing = await db.query(checkQuery, [adminData.email, adminData.name]);

    if (existing.rows.length > 0) {
      const updateQuery = `
        UPDATE users 
        SET password_hash = $1, email_verified = true, is_approved = true, status = 'APPROVED', bio = $2, phone_number = $3, updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING id, name, email, email_verified, is_approved, status, bio, phone_number
      `;
      const res = await db.query(updateQuery, [passwordHash, adminData.bio, adminData.phoneNumber, existing.rows[0].id]);
      console.log('✓ Akun admin berhasil diperbarui di PostgreSQL:', res.rows[0]);
    } else {
      const insertQuery = `
        INSERT INTO users (name, email, password_hash, email_verified, is_approved, status, bio, phone_number)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, name, email, email_verified, is_approved, status, bio, phone_number
      `;
      const res = await db.query(insertQuery, [adminData.name, adminData.email, passwordHash, true, true, 'APPROVED', adminData.bio, adminData.phoneNumber]);
      console.log('✓ Akun admin berhasil dibuat di PostgreSQL:', res.rows[0]);
    }
  } catch (err) {
    console.log('ℹ PostgreSQL belum aktif di localhost:5432 (server akan menggunakan fallback storage terintegrasi):', err.message);
  }

  console.log('=======================================================');
  console.log('SUKSES! Akun Admin siap digunakan.');
  console.log('=======================================================');
}

seedAdmin().catch(console.error);
