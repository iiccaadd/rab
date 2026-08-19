const userModel = require('../models/userModel');
const sessionModel = require('../models/sessionModel');
const { hashToken } = require('../utils/hash');

const COOKIE_NAME = 'jwt_refresh';

const userController = {
  /**
   * Dapatkan profil user saat ini
   * GET /api/user/profile
   */
  async getProfile(req, res) {
    try {
      const user = await userModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.email_verified,
          twoFactorEnabled: user.two_factor_enabled,
          createdAt: user.created_at,
        },
      });
    } catch (error) {
      console.error('Error in getProfile:', error);
      return res.status(500).json({ success: false, message: 'Gagal mengambil data profil.' });
    }
  },

  /**
   * Dapatkan daftar session/perangkat aktif milik user
   * GET /api/user/sessions
   */
  async getSessions(req, res) {
    try {
      const sessions = await sessionModel.getActiveSessionsByUserId(req.user.id);

      // Tandai session saat ini (jika refresh token cocok)
      const currentRefreshToken = req.cookies[COOKIE_NAME];
      const currentTokenHash = currentRefreshToken ? hashToken(currentRefreshToken) : null;

      return res.status(200).json({
        success: true,
        data: sessions.map((s) => ({
          id: s.id,
          deviceInfo: s.device_info,
          ipAddress: s.ip_address,
          createdAt: s.created_at,
          lastActiveAt: s.last_active_at,
          isCurrent: currentTokenHash ? s.refresh_token_hash === currentTokenHash : false,
        })),
      });
    } catch (error) {
      console.error('Error in getSessions:', error);
      return res.status(500).json({ success: false, message: 'Gagal mengambil data sesi perangkat.' });
    }
  },

  /**
   * Cabut sesi perangkat tertentu
   * DELETE /api/user/sessions/:sessionId
   */
  async revokeSession(req, res) {
    try {
      const { sessionId } = req.params;
      const success = await sessionModel.deleteById(sessionId, req.user.id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Sesi perangkat tidak ditemukan atau sudah tidak aktif.',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Sesi perangkat berhasil dicabut.',
      });
    } catch (error) {
      console.error('Error in revokeSession:', error);
      return res.status(500).json({ success: false, message: 'Gagal mencabut sesi perangkat.' });
    }
  },

  /**
   * Cabut semua sesi di perangkat lain
   * POST /api/user/sessions/revoke-others
   */
  async revokeAllOtherSessions(req, res) {
    try {
      const currentRefreshToken = req.cookies[COOKIE_NAME];
      if (!currentRefreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Sesi saat ini tidak dapat diidentifikasi.',
        });
      }

      const currentTokenHash = hashToken(currentRefreshToken);

      // Hapus semua session kecuali session dengan hash token saat ini
      const query = `
        DELETE FROM sessions
        WHERE user_id = $1 AND refresh_token_hash != $2
      `;
      const db = require('../config/db');
      await db.query(query, [req.user.id, currentTokenHash]);

      return res.status(200).json({
        success: true,
        message: 'Semua sesi pada perangkat lain berhasil dicabut.',
      });
    } catch (error) {
      console.error('Error in revokeAllOtherSessions:', error);
      return res.status(500).json({ success: false, message: 'Gagal mencabut sesi perangkat lain.' });
    }
  },
};

module.exports = userController;
