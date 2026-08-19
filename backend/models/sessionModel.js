const db = require('../config/db');

const sessionModel = {
  /**
   * Buat session baru saat login/refresh token
   */
  async create({ userId, refreshTokenHash, deviceInfo, ipAddress, expiresAt }) {
    const query = `
      INSERT INTO sessions (user_id, refresh_token_hash, device_info, ip_address, expires_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, device_info, ip_address, created_at, expires_at
    `;
    const result = await db.query(query, [
      userId,
      refreshTokenHash,
      deviceInfo || 'Unknown Device',
      ipAddress || '127.0.0.1',
      expiresAt,
    ]);
    return result.rows[0];
  },

  /**
   * Cari session valid berdasarkan hash refresh token
   */
  async findValidByTokenHash(refreshTokenHash) {
    const query = `
      SELECT s.*, u.email, u.name, u.email_verified, u.two_factor_enabled
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.refresh_token_hash = $1
        AND s.expires_at > CURRENT_TIMESTAMP
      LIMIT 1
    `;
    const result = await db.query(query, [refreshTokenHash]);
    return result.rows[0] || null;
  },

  /**
   * Update waktu aktivitas terakhir session
   */
  async updateLastActive(sessionId) {
    const query = `
      UPDATE sessions
      SET last_active_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await db.query(query, [sessionId]);
  },

  /**
   * Hapus session berdasarkan hash refresh token (saat logout)
   */
  async deleteByTokenHash(refreshTokenHash) {
    const query = `
      DELETE FROM sessions
      WHERE refresh_token_hash = $1
      RETURNING id, user_id
    `;
    const result = await db.query(query, [refreshTokenHash]);
    return result.rowCount > 0;
  },

  /**
   * Hapus session berdasarkan ID session tertentu
   */
  async deleteById(sessionId, userId) {
    const query = `
      DELETE FROM sessions
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `;
    const result = await db.query(query, [sessionId, userId]);
    return result.rowCount > 0;
  },

  /**
   * Invalidate semua session aktif milik user (saat reset password atau logout all)
   */
  async deleteAllByUserId(userId) {
    const query = `
      DELETE FROM sessions
      WHERE user_id = $1
      RETURNING id
    `;
    const result = await db.query(query, [userId]);
    return result.rowCount;
  },

  /**
   * Dapatkan seluruh daftar session aktif milik user (fitur multi-device dashboard)
   */
  async getActiveSessionsByUserId(userId) {
    const query = `
      SELECT id, device_info, ip_address, created_at, expires_at, last_active_at
      FROM sessions
      WHERE user_id = $1 AND expires_at > CURRENT_TIMESTAMP
      ORDER BY last_active_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  },
};

module.exports = sessionModel;
