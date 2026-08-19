const userModel = require('../models/userModel');
const sessionModel = require('../models/sessionModel');
const preferenceModel = require('../models/preferenceModel');
const tokenModel = require('../models/tokenModel');
const db = require('../config/db');
const { hashPassword, comparePassword, hashToken, generateRandomToken } = require('../utils/hash');
const {
  sendPasswordChangedNotification,
  sendEmailChangeVerification,
  sendAccountDeletionNotification,
} = require('../utils/mailer');
const env = require('../config/env');

const COOKIE_NAME = 'jwt_refresh';

function clearRefreshTokenCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: env.COOKIE.secure,
    sameSite: 'lax',
    path: '/',
  });
}

const settingsController = {
  // ==========================================================================
  // 1. PROFIL & AVATAR
  // ==========================================================================

  /**
   * Update Data Profil (Nama, Nomor Telepon, Bio)
   * PUT /api/settings/profile
   */
  async updateProfile(req, res) {
    try {
      const { name, phoneNumber, bio } = req.body;

      if (!name || name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Nama lengkap wajib diisi minimal 2 karakter.',
        });
      }

      const updatedUser = await userModel.updateProfile(req.user.id, {
        name: name.trim(),
        phoneNumber: phoneNumber ? phoneNumber.trim() : null,
        bio: bio ? bio.trim() : null,
      });

      return res.status(200).json({
        success: true,
        message: 'Profil berhasil diperbarui.',
        data: updatedUser,
      });
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal memperbarui profil pengguna.',
      });
    }
  },

  /**
   * Upload Foto Profil (Avatar)
   * POST /api/settings/avatar
   */
  async uploadAvatar(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Harap pilih file gambar avatar untuk diunggah (JPG/PNG/WEBP, maks. 2MB).',
        });
      }

      // Buat URL relatif yang bisa diakses publik
      const avatarUrl = `/uploads/avatars/${req.file.filename}`;

      await userModel.updateAvatar(req.user.id, avatarUrl);

      return res.status(200).json({
        success: true,
        message: 'Foto profil berhasil diperbarui.',
        data: {
          avatarUrl,
        },
      });
    } catch (error) {
      console.error('Error in uploadAvatar:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Gagal mengunggah foto profil.',
      });
    }
  },

  /**
   * Permintaan Ubah Alamat Email
   * PUT /api/settings/email
   */
  async requestEmailChange(req, res) {
    try {
      const { newEmail } = req.body;

      if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Format alamat email baru tidak valid.',
        });
      }

      const normalizedNewEmail = newEmail.toLowerCase().trim();

      // Cek apakah email baru sama dengan email saat ini
      if (normalizedNewEmail === req.user.email) {
        return res.status(400).json({
          success: false,
          message: 'Alamat email baru tidak boleh sama dengan email saat ini.',
        });
      }

      // Cek apakah email sudah digunakan oleh akun lain
      const existingUser = await userModel.findByEmail(normalizedNewEmail);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Alamat email tersebut sudah digunakan oleh akun lain.',
        });
      }

      // Simpan pending_email di user
      await userModel.setPendingEmail(req.user.id, normalizedNewEmail);

      // Buat token verifikasi perubahan email
      const rawToken = generateRandomToken(32);
      const tokenHash = hashToken(rawToken);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      // Invalidate token lama
      await db.query(`UPDATE email_change_tokens SET used = TRUE WHERE user_id = $1`, [req.user.id]);

      await db.query(
        `INSERT INTO email_change_tokens (user_id, new_email, token_hash, expires_at)
         VALUES ($1, $2, $3, $4)`,
        [req.user.id, normalizedNewEmail, tokenHash, expiresAt]
      );

      // Kirim email konfirmasi ke alamat email baru
      sendEmailChangeVerification(normalizedNewEmail, req.user.name, rawToken).catch((err) => {
        console.error('Error kirim email change token:', err);
      });

      return res.status(200).json({
        success: true,
        message: `Tautan verifikasi telah dikirim ke ${normalizedNewEmail}. Email lama Anda tetap aktif sampai verifikasi selesai.`,
        pendingEmail: normalizedNewEmail,
      });
    } catch (error) {
      console.error('Error in requestEmailChange:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal memproses permintaan perubahan email.',
      });
    }
  },

  /**
   * Konfirmasi Perubahan Email (Dipanggil saat user klik link di email baru)
   * POST /api/settings/email/confirm
   */
  async confirmEmailChange(req, res) {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ success: false, message: 'Token konfirmasi wajib disertakan.' });
      }

      const tokenHash = hashToken(token);
      const result = await db.query(
        `SELECT * FROM email_change_tokens
         WHERE token_hash = $1 AND used = FALSE AND expires_at > CURRENT_TIMESTAMP
         LIMIT 1`,
        [tokenHash]
      );

      const record = result.rows[0];
      if (!record) {
        return res.status(400).json({
          success: false,
          message: 'Tautan konfirmasi email tidak valid atau telah kedaluwarsa.',
        });
      }

      // Komit email baru
      await userModel.commitEmailChange(record.user_id, record.new_email);

      // Tandai token used
      await db.query(`UPDATE email_change_tokens SET used = TRUE WHERE id = $1`, [record.id]);

      return res.status(200).json({
        success: true,
        message: 'Alamat email akun Anda berhasil diperbarui!',
      });
    } catch (error) {
      console.error('Error in confirmEmailChange:', error);
      return res.status(500).json({ success: false, message: 'Gagal mengonfirmasi email baru.' });
    }
  },

  // ==========================================================================
  // 2. UBAH PASSWORD
  // ==========================================================================

  /**
   * Ubah Password Akun
   * PUT /api/settings/password
   */
  async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Password lama dan password baru wajib diisi.',
        });
      }

      // Ambil user lengkap beserta password_hash
      const user = await userModel.findByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
      }

      // Verifikasi password lama
      const isMatch = await comparePassword(oldPassword, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Password lama yang Anda masukkan salah.',
          code: 'INVALID_OLD_PASSWORD',
        });
      }

      // Validasi password baru tidak boleh sama dengan password lama
      const isSame = await comparePassword(newPassword, user.password_hash);
      if (isSame) {
        return res.status(400).json({
          success: false,
          message: 'Password baru tidak boleh sama dengan password lama Anda.',
          code: 'SAME_PASSWORD',
        });
      }

      // Validasi kekuatan password baru
      if (newPassword.length < 8 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
        return res.status(400).json({
          success: false,
          message: 'Password baru minimal 8 karakter dan harus mengandung kombinasi huruf besar, huruf kecil, dan angka.',
        });
      }

      // Hash password baru
      const newHash = await hashPassword(newPassword);
      await userModel.updatePassword(req.user.id, newHash);

      // Invalidate semua session LAIN (kecuali session saat ini)
      const currentRefreshToken = req.cookies[COOKIE_NAME];
      if (currentRefreshToken) {
        const currentHash = hashToken(currentRefreshToken);
        await db.query(
          `DELETE FROM sessions WHERE user_id = $1 AND refresh_token_hash != $2`,
          [req.user.id, currentHash]
        );
      }

      // Kirim email notifikasi keamanan
      sendPasswordChangedNotification(user.email, user.name).catch((err) => {
        console.error('Error kirim notifikasi ubah password:', err);
      });

      return res.status(200).json({
        success: true,
        message: 'Password berhasil diperbarui! Seluruh sesi di perangkat lain telah dicabut demi keamanan.',
      });
    } catch (error) {
      console.error('Error in changePassword:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal memperbarui password.',
      });
    }
  },

  // ==========================================================================
  // 3. KELOLA SESI AKTIF (MULTI-DEVICE)
  // ==========================================================================

  /**
   * Dapatkan semua sesi aktif
   * GET /api/settings/sessions
   */
  async getSessions(req, res) {
    try {
      const sessions = await sessionModel.getActiveSessionsByUserId(req.user.id);
      const currentRefreshToken = req.cookies[COOKIE_NAME];
      const currentHash = currentRefreshToken ? hashToken(currentRefreshToken) : null;

      return res.status(200).json({
        success: true,
        data: sessions.map((s) => ({
          id: s.id,
          deviceInfo: s.device_info,
          ipAddress: s.ip_address,
          createdAt: s.created_at,
          lastActiveAt: s.last_active_at,
          isCurrent: currentHash ? s.refresh_token_hash === currentHash : false,
        })),
      });
    } catch (error) {
      console.error('Error in getSessions:', error);
      return res.status(500).json({ success: false, message: 'Gagal mengambil data sesi perangkat.' });
    }
  },

  /**
   * Logout/Cabut sesi perangkat tertentu
   * DELETE /api/settings/sessions/:sessionId
   */
  async revokeSession(req, res) {
    try {
      const { sessionId } = req.params;
      const success = await sessionModel.deleteById(sessionId, req.user.id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Sesi tidak ditemukan atau sudah dicabut.',
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
   * Logout dari semua perangkat kecuali perangkat yang sedang digunakan
   * DELETE /api/settings/sessions/all
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

      const currentHash = hashToken(currentRefreshToken);
      await db.query(
        `DELETE FROM sessions WHERE user_id = $1 AND refresh_token_hash != $2`,
        [req.user.id, currentHash]
      );

      return res.status(200).json({
        success: true,
        message: 'Semua sesi pada perangkat lain berhasil dicabut.',
      });
    } catch (error) {
      console.error('Error in revokeAllOtherSessions:', error);
      return res.status(500).json({ success: false, message: 'Gagal mencabut sesi perangkat lain.' });
    }
  },

  // ==========================================================================
  // 4. PREFERENSI NOTIFIKASI & TEMA
  // ==========================================================================

  /**
   * Dapatkan preferensi pengguna
   * GET /api/settings/preferences
   */
  async getPreferences(req, res) {
    try {
      const prefs = await preferenceModel.getByUserId(req.user.id);
      return res.status(200).json({
        success: true,
        data: prefs,
      });
    } catch (error) {
      console.error('Error in getPreferences:', error);
      return res.status(500).json({ success: false, message: 'Gagal mengambil data preferensi.' });
    }
  },

  /**
   * Update preferensi pengguna
   * PUT /api/settings/preferences
   */
  async updatePreferences(req, res) {
    try {
      const { emailNotifications, pushNotifications, theme } = req.body;

      const updated = await preferenceModel.update(req.user.id, {
        emailNotifications,
        pushNotifications,
        theme,
      });

      return res.status(200).json({
        success: true,
        message: 'Preferensi notifikasi berhasil disimpan.',
        data: updated,
      });
    } catch (error) {
      console.error('Error in updatePreferences:', error);
      return res.status(500).json({ success: false, message: 'Gagal menyimpan preferensi.' });
    }
  },

  // ==========================================================================
  // 5. HAPUS AKUN (SOFT DELETE)
  // ==========================================================================

  /**
   * Hapus Akun Pengguna (Soft Delete)
   * DELETE /api/settings/account
   */
  async deleteAccount(req, res) {
    try {
      const { password, confirmEmail } = req.body;

      const user = await userModel.findByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
      }

      // Verifikasi konfirmasi (wajib password atau ketik ulang email)
      if (password) {
        const isPasswordValid = await comparePassword(password, user.password_hash);
        if (!isPasswordValid) {
          return res.status(401).json({
            success: false,
            message: 'Password konfirmasi salah. Penghapusan akun dibatalkan.',
          });
        }
      } else if (confirmEmail) {
        if (confirmEmail.toLowerCase().trim() !== user.email.toLowerCase().trim()) {
          return res.status(400).json({
            success: false,
            message: 'Email konfirmasi tidak cocok dengan email akun Anda.',
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: 'Masukkan password akun atau konfirmasi email untuk melanjutkan penghapusan akun.',
        });
      }

      // Lakukan Soft Delete di database
      await userModel.softDelete(req.user.id);

      // Invalidate semua session aktif
      await sessionModel.deleteAllByUserId(req.user.id);

      // Bersihkan cookie refresh token
      clearRefreshTokenCookie(res);

      // Kirim email notifikasi
      sendAccountDeletionNotification(user.email, user.name).catch((err) => {
        console.error('Error kirim notifikasi hapus akun:', err);
      });

      return res.status(200).json({
        success: true,
        message: 'Akun Anda berhasil dinonaktifkan (dihapus). Anda akan dialihkan ke halaman utama.',
      });
    } catch (error) {
      console.error('Error in deleteAccount:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal memproses penghapusan akun.',
      });
    }
  },

  /**
   * Endpoint Admin/Cron untuk Hard Delete akun yang melewati 30 hari
   * POST /api/settings/admin/hard-delete-expired
   */
  async hardDeleteExpired(req, res) {
    try {
      const deletedCount = await userModel.hardDeleteExpiredUsers();
      return res.status(200).json({
        success: true,
        message: `Pembersihan berhasil. ${deletedCount} akun yang telah kedaluwarsa (>30 hari) telah dihapus secara permanen.`,
        deletedCount,
      });
    } catch (error) {
      console.error('Error in hardDeleteExpired:', error);
      return res.status(500).json({ success: false, message: 'Gagal menjalankan pembersihan data.' });
    }
  },

  // ==========================================================================
  // 6. ADMIN USER APPROVAL & MANAGEMENT (Khusus Akun Admin: irsyadisty)
  // ==========================================================================

  /**
   * Mengambil seluruh daftar pengguna untuk disetujui / ditinjau oleh Admin
   * GET /api/settings/admin/users
   */
  async getAdminUsersList(req, res) {
    try {
      const isAdmin = req.user.name?.toLowerCase() === 'irsyadisty' || req.user.email?.toLowerCase() === 'irsyadisty@mirstyvanconstruction.com';
      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Akses ditolak. Anda bukan Administrator utama.',
        });
      }

      const users = await userModel.getAllUsers();
      return res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      console.error('Error in getAdminUsersList:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal memuat daftar pengguna.',
      });
    }
  },

  /**
   * Menyetujui pendaftaran akun pengguna oleh Admin
   * POST /api/settings/admin/users/:userId/approve
   */
  async approveUserByAdmin(req, res) {
    try {
      const isAdmin = req.user.name?.toLowerCase() === 'irsyadisty' || req.user.email?.toLowerCase() === 'irsyadisty@mirstyvanconstruction.com';
      if (!isAdmin) {
        return res.status(403).json({ success: false, message: 'Akses ditolak.' });
      }

      const { userId } = req.params;
      const updatedUser = await userModel.updateUserStatus(userId, true, 'APPROVED');

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
      }

      return res.status(200).json({
        success: true,
        message: `Akun "${updatedUser.name}" berhasil disetujui & diaktifkan! Pengguna sekarang dapat masuk ke sistem.`,
        data: updatedUser,
      });
    } catch (error) {
      console.error('Error in approveUserByAdmin:', error);
      return res.status(500).json({ success: false, message: 'Gagal menyetujui akun.' });
    }
  },

  /**
   * Menolak pendaftaran akun pengguna oleh Admin
   * POST /api/settings/admin/users/:userId/reject
   */
  async rejectUserByAdmin(req, res) {
    try {
      const isAdmin = req.user.name?.toLowerCase() === 'irsyadisty' || req.user.email?.toLowerCase() === 'irsyadisty@mirstyvanconstruction.com';
      if (!isAdmin) {
        return res.status(403).json({ success: false, message: 'Akses ditolak.' });
      }

      const { userId } = req.params;
      const updatedUser = await userModel.updateUserStatus(userId, false, 'REJECTED');

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
      }

      return res.status(200).json({
        success: true,
        message: `Pendaftaran akun "${updatedUser.name}" telah ditolak.`,
        data: updatedUser,
      });
    } catch (error) {
      console.error('Error in rejectUserByAdmin:', error);
      return res.status(500).json({ success: false, message: 'Gagal menolak akun.' });
    }
  },

  /**
   * Menghapus akun pengguna oleh Admin
   * DELETE /api/settings/admin/users/:userId
   */
  async deleteUserByAdmin(req, res) {
    try {
      const isAdmin = req.user.name?.toLowerCase() === 'irsyadisty' || req.user.email?.toLowerCase() === 'irsyadisty@mirstyvanconstruction.com';
      if (!isAdmin) {
        return res.status(403).json({ success: false, message: 'Akses ditolak.' });
      }

      const { userId } = req.params;
      if (userId === req.user.id) {
        return res.status(400).json({ success: false, message: 'Admin tidak dapat menghapus akunnya sendiri melalui panel ini.' });
      }

      await userModel.deleteUserByAdmin(userId);
      await sessionModel.deleteAllByUserId(userId);

      return res.status(200).json({
        success: true,
        message: 'Pengguna berhasil dihapus dari sistem.',
      });
    } catch (error) {
      console.error('Error in deleteUserByAdmin:', error);
      return res.status(500).json({ success: false, message: 'Gagal menghapus pengguna.' });
    }
  },
};

module.exports = settingsController;
