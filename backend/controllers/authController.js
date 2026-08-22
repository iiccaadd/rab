const userModel = require('../models/userModel');
const sessionModel = require('../models/sessionModel');
const tokenModel = require('../models/tokenModel');
const { hashPassword, comparePassword, hashToken, generateRandomToken } = require('../utils/hash');
const { generateAccessToken, generateRefreshToken, generateTempToken, verifyRefreshToken } = require('../utils/token');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/mailer');
const env = require('../config/env');

const COOKIE_NAME = 'jwt_refresh';
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 hari

/**
 * Helper untuk menyetel cookie Refresh Token
 */
function setRefreshTokenCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.COOKIE.secure,
    sameSite: 'lax', // 'lax' / 'strict'
    path: '/',
    maxAge: REFRESH_TOKEN_EXPIRY_MS,
  });
}

/**
 * Helper untuk membersihkan cookie Refresh Token
 */
function clearRefreshTokenCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: env.COOKIE.secure,
    sameSite: 'lax',
    path: '/',
  });
}

const authController = {
  /**
   * 1. REGISTER
   * POST /api/auth/register
   */
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Cek apakah email sudah terdaftar
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Alamat email sudah terdaftar. Silakan gunakan email lain atau login.',
          code: 'EMAIL_ALREADY_EXISTS',
        });
      }

      // Hash password dengan bcrypt salt round 12
      const passwordHash = await hashPassword(password);

      // Simpan user baru ke database
      const newUser = await userModel.create({
        name,
        email,
        passwordHash,
      });

      // Buat token verifikasi email (berlaku 24 jam)
      const rawVerificationToken = generateRandomToken(32);
      const tokenHash = hashToken(rawVerificationToken);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await tokenModel.createVerificationToken({
        userId: newUser.id,
        tokenHash,
        expiresAt,
      });

      // Kirim email verifikasi (atau simulasi console log)
      sendVerificationEmail(newUser.email, newUser.name, rawVerificationToken).catch((err) => {
        console.error('Error saat kirim email async:', err);
      });

      return res.status(201).json({
        success: true,
        message: 'Pendaftaran berhasil! Akun Anda sedang menunggu persetujuan dari Administrator (irsyadisty). Mohon tunggu hingga akun disetujui admin untuk dapat masuk.',
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          emailVerified: false,
          isApproved: false,
          status: 'PENDING',
        },
      });
    } catch (error) {
      console.error('Error in register:', error);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server saat melakukan registrasi.',
      });
    }
  },

  /**
   * 2. VERIFIKASI EMAIL
   * GET /api/auth/verify-email?token=xxx
   */
  async verifyEmail(req, res) {
    try {
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token verifikasi tidak ditemukan.',
          code: 'TOKEN_REQUIRED',
        });
      }

      const tokenHash = hashToken(token);
      const record = await tokenModel.findValidVerificationToken(tokenHash);

      if (!record) {
        return res.status(400).json({
          success: false,
          message: 'Token verifikasi tidak valid atau telah kedaluwarsa.',
          code: 'INVALID_TOKEN',
        });
      }

      // Tandai email user sebagai verified
      await userModel.verifyEmail(record.user_id);

      // Hapus token yang sudah digunakan
      await tokenModel.deleteToken(record.id);

      return res.status(200).json({
        success: true,
        message: 'Alamat email berhasil diverifikasi.',
      });
    } catch (error) {
      console.error('Error in verifyEmail:', error);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server saat verifikasi email.',
      });
    }
  },

  /**
   * 3. LOGIN
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Cari user berdasarkan email
      const user = await userModel.findByEmail(email);

      // Generic error message untuk proteksi keamanan (mencegah user enumeration)
      const genericErrorMessage = 'Email atau password salah.';

      if (!user) {
        return res.status(401).json({
          success: false,
          message: genericErrorMessage,
          code: 'INVALID_CREDENTIALS',
        });
      }

      // Verifikasi password hash
      const isPasswordValid = await comparePassword(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: genericErrorMessage,
          code: 'INVALID_CREDENTIALS',
        });
      }

      // Cek status persetujuan akun oleh administrator
      if (user.status === 'PENDING' || user.is_approved === false || user.isApproved === false) {
        return res.status(403).json({
          success: false,
          message: 'Akun Anda sedang menunggu persetujuan (approval) dari Administrator (irsyadisty). Silakan hubungi admin untuk aktivasi.',
          code: 'ACCOUNT_PENDING_APPROVAL',
        });
      }

      // Cek status penolakan akun jika diblokir oleh admin
      if (user.status === 'REJECTED') {
        return res.status(403).json({
          success: false,
          message: 'Pendaftaran akun Anda telah ditolak oleh Administrator.',
          code: 'ACCOUNT_REJECTED',
        });
      }

      // Cek apakah 2FA aktif untuk user ini
      if (user.two_factor_enabled && user.two_factor_secret) {
        // Jangan langsung beri access token; buat temporary 2FA token (5 menit)
        const tempToken = generateTempToken({
          id: user.id,
          email: user.email,
        });

        return res.status(200).json({
          success: true,
          require2FA: true,
          tempToken,
          message: 'Autentikasi dua faktor aktif. Masukkan kode 6-digit OTP dari aplikasi authenticator Anda.',
        });
      }

      // Jika 2FA tidak aktif, proses login normal
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Hash refresh token sebelum disimpan ke tabel sessions
      const refreshTokenHash = hashToken(refreshToken);
      const deviceInfo = req.headers['user-agent'] || 'Unknown Browser/Device';
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);

      await sessionModel.create({
        userId: user.id,
        refreshTokenHash,
        deviceInfo,
        ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
        expiresAt,
      });

      // Simpan refresh token di httpOnly Cookie
      setRefreshTokenCookie(res, refreshToken);

      return res.status(200).json({
        success: true,
        message: 'Login berhasil.',
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.email_verified,
          twoFactorEnabled: user.two_factor_enabled,
        },
      });
    } catch (error) {
      console.error('Error in login:', error);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server saat melakukan login.',
      });
    }
  },

  /**
   * 4. REFRESH TOKEN
   * POST /api/auth/refresh
   */
  async refresh(req, res) {
    try {
      const refreshToken = req.cookies[COOKIE_NAME];

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token tidak ditemukan di cookie.',
          code: 'REFRESH_TOKEN_MISSING',
        });
      }

      // Verifikasi signature JWT refresh token
      let decoded;
      try {
        decoded = verifyRefreshToken(refreshToken);
      } catch (err) {
        clearRefreshTokenCookie(res);
        return res.status(401).json({
          success: false,
          message: 'Refresh token tidak valid atau telah kedaluwarsa.',
          code: 'REFRESH_TOKEN_INVALID',
        });
      }

      // Cari session aktif di database
      const refreshTokenHash = hashToken(refreshToken);
      const session = await sessionModel.findValidByTokenHash(refreshTokenHash);

      if (!session) {
        clearRefreshTokenCookie(res);
        return res.status(401).json({
          success: false,
          message: 'Sesi login tidak valid atau telah dicabut.',
          code: 'SESSION_REVOKED',
        });
      }

      // Update aktivitas session terakhir
      await sessionModel.updateLastActive(session.id);

      // Generate Access Token baru
      const newAccessToken = generateAccessToken({
        id: session.user_id,
        email: session.email,
        name: session.name,
      });

      // Optional: Refresh Token Rotation (Ganti refresh token lama dengan yang baru)
      const newRefreshToken = generateRefreshToken({ id: session.user_id });
      const newRefreshTokenHash = hashToken(newRefreshToken);

      // Hapus session lama & buat session baru atau update hash
      await sessionModel.deleteByTokenHash(refreshTokenHash);
      const deviceInfo = req.headers['user-agent'] || session.device_info;
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || session.ip_address;
      const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);

      await sessionModel.create({
        userId: session.user_id,
        refreshTokenHash: newRefreshTokenHash,
        deviceInfo,
        ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
        expiresAt,
      });

      setRefreshTokenCookie(res, newRefreshToken);

      return res.status(200).json({
        success: true,
        accessToken: newAccessToken,
        user: {
          id: session.user_id,
          name: session.name,
          email: session.email,
          emailVerified: session.email_verified,
          twoFactorEnabled: session.two_factor_enabled,
        },
      });
    } catch (error) {
      console.error('Error in refresh token:', error);
      clearRefreshTokenCookie(res);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server saat memperbarui token.',
      });
    }
  },

  /**
   * 5. LOGOUT
   * POST /api/auth/logout
   */
  async logout(req, res) {
    try {
      const refreshToken = req.cookies[COOKIE_NAME];

      if (refreshToken) {
        const refreshTokenHash = hashToken(refreshToken);
        await sessionModel.deleteByTokenHash(refreshTokenHash);
      }

      clearRefreshTokenCookie(res);

      return res.status(200).json({
        success: true,
        message: 'Berhasil logout.',
      });
    } catch (error) {
      console.error('Error in logout:', error);
      clearRefreshTokenCookie(res);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server saat logout.',
      });
    }
  },

  /**
   * 6. LUPA PASSWORD
   * POST /api/auth/forgot-password
   */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await userModel.findByEmail(email);

      // Untuk keamanan: kembalikan pesan generik meskipun email tidak terdaftar
      const genericResponse = {
        success: true,
        message: 'Jika alamat email terdaftar, tautan untuk mereset password telah dikirimkan ke kotak masuk Anda.',
      };

      if (!user) {
        return res.status(200).json(genericResponse);
      }

      // Buat token reset (berlaku 1 jam)
      const rawResetToken = generateRandomToken(32);
      const tokenHash = hashToken(rawResetToken);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 jam

      await tokenModel.createPasswordResetToken({
        userId: user.id,
        tokenHash,
        expiresAt,
      });

      // Kirim email reset password (atau simulasi console)
      sendPasswordResetEmail(user.email, user.name, rawResetToken).catch((err) => {
        console.error('Error kirim email reset async:', err);
      });

      return res.status(200).json(genericResponse);
    } catch (error) {
      console.error('Error in forgotPassword:', error);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server saat memproses permintaan reset password.',
      });
    }
  },

  /**
   * 7. RESET PASSWORD
   * POST /api/auth/reset-password
   */
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      const tokenHash = hashToken(token);
      const record = await tokenModel.findValidPasswordResetToken(tokenHash);

      if (!record) {
        return res.status(400).json({
          success: false,
          message: 'Tautan reset password tidak valid atau telah kedaluwarsa.',
          code: 'TOKEN_INVALID_OR_EXPIRED',
        });
      }

      // Hash password baru
      const newPasswordHash = await hashPassword(newPassword);

      // Update password user di database
      await userModel.updatePassword(record.user_id, newPasswordHash);

      // Tandai token reset sebagai used
      await tokenModel.markPasswordResetTokenUsed(record.id);

      // Invalidate semua session aktif user tersebut (demi keamanan setelah password diganti)
      await sessionModel.deleteAllByUserId(record.user_id);

      // Bersihkan cookie refresh token pada request saat ini jika ada
      clearRefreshTokenCookie(res);

      return res.status(200).json({
        success: true,
        message: 'Password Anda berhasil diperbarui! Silakan login menggunakan password baru Anda.',
      });
    } catch (error) {
      console.error('Error in resetPassword:', error);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server saat mereset password.',
      });
    }
  },
};

module.exports = authController;
