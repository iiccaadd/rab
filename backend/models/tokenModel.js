const db = require('../config/db');

const tokenModel = {
  // ==========================================
  // EMAIL VERIFICATION TOKENS
  // ==========================================

  async createVerificationToken({ userId, tokenHash, expiresAt }) {
    // Invalidate previous tokens for this user first
    await db.query(`UPDATE email_verification_tokens SET used = TRUE WHERE user_id = $1`, [userId]);

    const query = `
      INSERT INTO email_verification_tokens (user_id, token_hash, expires_at)
      VALUES ($1, $2, $3)
      RETURNING id, user_id, expires_at
    `;
    const result = await db.query(query, [userId, tokenHash, expiresAt]);
    return result.rows[0];
  },

  async findValidVerificationToken(tokenHash) {
    const query = `
      SELECT t.*, u.email, u.name, u.email_verified
      FROM email_verification_tokens t
      JOIN users u ON u.id = t.user_id
      WHERE t.token_hash = $1
        AND t.used = FALSE
        AND t.expires_at > CURRENT_TIMESTAMP
      LIMIT 1
    `;
    const result = await db.query(query, [tokenHash]);
    return result.rows[0] || null;
  },

  async markVerificationTokenUsed(tokenId) {
    const query = `UPDATE email_verification_tokens SET used = TRUE WHERE id = $1`;
    await db.query(query, [tokenId]);
  },

  // ==========================================
  // PASSWORD RESET TOKENS
  // ==========================================

  async createPasswordResetToken({ userId, tokenHash, expiresAt }) {
    // Invalidate previous reset tokens for this user
    await db.query(`UPDATE password_reset_tokens SET used = TRUE WHERE user_id = $1`, [userId]);

    const query = `
      INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
      VALUES ($1, $2, $3)
      RETURNING id, user_id, expires_at
    `;
    const result = await db.query(query, [userId, tokenHash, expiresAt]);
    return result.rows[0];
  },

  async findValidPasswordResetToken(tokenHash) {
    const query = `
      SELECT t.*, u.email, u.name
      FROM password_reset_tokens t
      JOIN users u ON u.id = t.user_id
      WHERE t.token_hash = $1
        AND t.used = FALSE
        AND t.expires_at > CURRENT_TIMESTAMP
      LIMIT 1
    `;
    const result = await db.query(query, [tokenHash]);
    return result.rows[0] || null;
  },

  async markPasswordResetTokenUsed(tokenId) {
    const query = `UPDATE password_reset_tokens SET used = TRUE WHERE id = $1`;
    await db.query(query, [tokenId]);
  },
};

module.exports = tokenModel;
