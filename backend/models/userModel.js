const db = require('../config/db');

const userModel = {
  /**
   * Buat user baru di database
   */
  async create({ name, email, passwordHash }) {
    const isAdmin = name?.toLowerCase() === 'irsyadisty' || email?.toLowerCase() === 'irsyadisty@mirstyvanconstruction.com';
    const isApproved = isAdmin;
    const status = isAdmin ? 'APPROVED' : 'PENDING';

    const query = `
      INSERT INTO users (name, email, password_hash, is_approved, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, email_verified, is_approved, status, two_factor_enabled, created_at
    `;
    const result = await db.query(query, [name, email.toLowerCase().trim(), passwordHash, isApproved, status]);
    return result.rows[0];
  },

  /**
   * Cari user aktif berdasarkan email atau username
   */
  async findByEmail(identifier) {
    if (!identifier) return null;
    const clean = identifier.toLowerCase().trim();
    const query = `
      SELECT * FROM users
      WHERE (LOWER(email) = $1 OR LOWER(name) = $1) AND deleted_at IS NULL
      LIMIT 1
    `;
    const result = await db.query(query, [clean]);
    return result.rows[0] || null;
  },

  /**
   * Cari user berdasarkan ID (hanya yang aktif)
   */
  async findById(id) {
    const query = `
      SELECT id, name, email, phone_number, bio, avatar_url, pending_email,
             email_verified, two_factor_enabled, two_factor_secret, created_at, updated_at
      FROM users
      WHERE id = $1 AND deleted_at IS NULL
      LIMIT 1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  },

  /**
   * Update data profil umum (nama, nomor telepon, bio)
   */
  async updateProfile(userId, { name, phoneNumber, bio }) {
    const query = `
      UPDATE users
      SET name = COALESCE($2, name),
          phone_number = $3,
          bio = $4,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id, name, email, phone_number, bio, avatar_url, updated_at
    `;
    const result = await db.query(query, [userId, name, phoneNumber || null, bio || null]);
    return result.rows[0] || null;
  },

  /**
   * Update URL foto profil (Avatar)
   */
  async updateAvatar(userId, avatarUrl) {
    const query = `
      UPDATE users
      SET avatar_url = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id, avatar_url
    `;
    const result = await db.query(query, [userId, avatarUrl]);
    return result.rows[0] || null;
  },

  /**
   * Set pending email untuk proses verifikasi perubahan email
   */
  async setPendingEmail(userId, pendingEmail) {
    const query = `
      UPDATE users
      SET pending_email = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id, email, pending_email
    `;
    const result = await db.query(query, [userId, pendingEmail ? pendingEmail.toLowerCase().trim() : null]);
    return result.rows[0] || null;
  },

  /**
   * Komit perubahan email setelah token verifikasi email baru divalidasi
   */
  async commitEmailChange(userId, newEmail) {
    const query = `
      UPDATE users
      SET email = $2,
          pending_email = NULL,
          email_verified = TRUE,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id, email, email_verified
    `;
    const result = await db.query(query, [userId, newEmail.toLowerCase().trim()]);
    return result.rows[0] || null;
  },

  /**
   * Update status verifikasi email
   */
  async updateEmailVerified(userId, verified = true) {
    const query = `
      UPDATE users
      SET email_verified = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id, name, email, email_verified
    `;
    const result = await db.query(query, [userId, verified]);
    return result.rows[0] || null;
  },

  /**
   * Update password hash user
   */
  async updatePassword(userId, passwordHash) {
    const query = `
      UPDATE users
      SET password_hash = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id, email
    `;
    const result = await db.query(query, [userId, passwordHash]);
    return result.rows[0] || null;
  },

  /**
   * Aktifkan 2FA dengan secret key
   */
  async enable2FA(userId, secret) {
    const query = `
      UPDATE users
      SET two_factor_enabled = TRUE, two_factor_secret = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id, email, two_factor_enabled
    `;
    const result = await db.query(query, [userId, secret]);
    return result.rows[0] || null;
  },

  /**
   * Nonaktifkan 2FA
   */
  async disable2FA(userId) {
    const query = `
      UPDATE users
      SET two_factor_enabled = FALSE, two_factor_secret = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id, email, two_factor_enabled
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0] || null;
  },

  /**
   * Soft Delete akun pengguna
   */
  async softDelete(userId) {
    const query = `
      UPDATE users
      SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, email, deleted_at
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0] || null;
  },

  /**
   * Hard delete akun yang sudah lebih dari 30 hari di-soft delete
   */
  async hardDeleteExpiredUsers() {
    const query = `
      DELETE FROM users
      WHERE deleted_at IS NOT NULL
        AND deleted_at < CURRENT_TIMESTAMP - INTERVAL '30 days'
      RETURNING id, email
    `;
    const result = await db.query(query);
    return result.rowCount;
  },

  /**
   * Mengambil seluruh daftar pengguna (Khusus Admin)
   */
  async getAllUsers() {
    const query = `
      SELECT id, name, email, phone_number, bio, avatar_url,
             email_verified, is_approved, status, two_factor_enabled, created_at, updated_at
      FROM users
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
  },

  /**
   * Update status persetujuan akun pengguna (Khusus Admin)
   */
  async updateUserStatus(userId, isApproved, status) {
    const query = `
      UPDATE users
      SET is_approved = $2,
          status = $3,
          email_verified = (CASE WHEN $2 = TRUE THEN TRUE ELSE email_verified END),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id, name, email, is_approved, status, email_verified, updated_at
    `;
    const result = await db.query(query, [userId, isApproved, status]);
    return result.rows[0] || null;
  },

  /**
   * Hapus pengguna oleh admin
   */
  async deleteUserByAdmin(userId) {
    const query = `
      UPDATE users
      SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, name, email
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0] || null;
  },
};

module.exports = userModel;
