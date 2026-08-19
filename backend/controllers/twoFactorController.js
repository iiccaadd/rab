const userModel = require('../models/userModel');
const sessionModel = require('../models/sessionModel');
const { generate2FASecret, verifyTOTPToken } = require('../utils/otp');
const { verifyTempToken, generateAccessToken, generateRefreshToken } = require('../utils/token');
const { comparePassword, hashToken } = require('../utils/hash');
const env = require('../config/env');

const COOKIE_NAME = 'jwt_refresh';
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

function setRefreshTokenCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.COOKIE.secure,
    sameSite: 'lax',
    path: '/',
    maxAge: REFRESH_TOKEN_EXPIRY_MS,
  });
}

const twoFactorController = {
  /**
   * 1. GENERATE SETUP 2FA (Secret + QR Code)
   * POST /api/auth/2fa/enable
   * Protected route (authMiddleware)
   */
  async generateSetup(req, res) {
    try {
      const user = await userModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
      }

      if (user.two_factor_enabled) {
        return res.status(400).json({
          success: false,
          message: 'Autentikasi dua faktor (2FA) sudah aktif pada akun ini.',
        });
      }

      // Generate secret & QR Code
      const { secret, qrCodeDataUrl } = await generate2FASecret(user.email, 'SistemAutentikasi');

      return res.status(200).json({
        success: true,
        message: 'Secret 2FA berhasil dibuat. Pindai QR Code dengan Google Authenticator atau aplikasi sejenis.',
        data: {
          secret,
          qrCode: qrCodeDataUrl,
        },
      });
    } catch (error) {
      console.error('Error in generateSetup 2FA:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal membuat QR Code 2FA.',
      });
    }
  },

  /**
   * 2. VERIFIKASI SAAT SETUP 2FA
   * POST /api/auth/2fa/verify-setup
   * Protected route (authMiddleware)
   */
  async verifySetup(req, res) {
    try {
      const { secret, otp } = req.body;

      if (!secret || !otp) {
        return res.status(400).json({
          success: false,
          message: 'Secret key dan kode OTP 6-digit wajib disertakan.',
        });
      }

      // Verifikasi kode OTP terhadap secret
      const isValid = verifyTOTPToken(otp, secret);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Kode OTP tidak valid atau telah kedaluwarsa. Pastikan jam perangkat Anda akurat.',
          code: 'INVALID_OTP',
        });
      }

      // Simpan secret dan aktifkan 2FA di database
      await userModel.enable2FA(req.user.id, secret);

      return res.status(200).json({
        success: true,
        message: 'Autentikasi dua faktor (2FA) berhasil diaktifkan untuk akun Anda.',
      });
    } catch (error) {
      console.error('Error in verifySetup 2FA:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal memverifikasi dan mengaktifkan 2FA.',
      });
    }
  },

  /**
   * 3. VERIFIKASI 2FA SAAT LOGIN
   * POST /api/auth/2fa/verify-login
   * Public route (menggunakan tempToken)
   */
  async verifyLogin(req, res) {
    try {
      const { tempToken, otp } = req.body;

      if (!tempToken || !otp) {
        return res.status(400).json({
          success: false,
          message: 'Token sementara dan kode OTP wajib disertakan.',
        });
      }

      // Verifikasi temporary 2FA token
      let decoded;
      try {
        decoded = verifyTempToken(tempToken);
      } catch (err) {
        return res.status(401).json({
          success: false,
          message: 'Sesi verifikasi 2FA telah berakhir. Silakan ulangi proses login.',
          code: 'TEMP_TOKEN_EXPIRED',
        });
      }

      const user = await userModel.findById(decoded.sub);
      if (!user || !user.two_factor_enabled || !user.two_factor_secret) {
        return res.status(400).json({
          success: false,
          message: 'Konfigurasi 2FA tidak ditemukan untuk pengguna ini.',
        });
      }

      // Verifikasi kode OTP
      const isOtpValid = verifyTOTPToken(otp, user.two_factor_secret);
      if (!isOtpValid) {
        return res.status(401).json({
          success: false,
          message: 'Kode OTP 2FA salah atau telah kedaluwarsa.',
          code: 'INVALID_OTP',
        });
      }

      // Jika valid, keluarkan final Access Token dan Refresh Token
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

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

      setRefreshTokenCookie(res, refreshToken);

      return res.status(200).json({
        success: true,
        message: 'Verifikasi 2FA berhasil. Selamat datang kembali!',
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
      console.error('Error in verifyLogin 2FA:', error);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server saat memverifikasi 2FA.',
      });
    }
  },

  /**
   * 4. NONAKTIFKAN 2FA
   * POST /api/auth/2fa/disable
   * Protected route (authMiddleware) - Wajib konfirmasi password
   */
  async disable(req, res) {
    try {
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({
          success: false,
          message: 'Password akun wajib dimasukkan untuk menonaktifkan 2FA.',
        });
      }

      const user = await userModel.findByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
      }

      // Verifikasi password sebelum menonaktifkan 2FA
      const isPasswordValid = await comparePassword(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Password salah. Autentikasi dua faktor gagal dinonaktifkan.',
        });
      }

      await userModel.disable2FA(req.user.id);

      return res.status(200).json({
        success: true,
        message: 'Autentikasi dua faktor (2FA) berhasil dinonaktifkan.',
      });
    } catch (error) {
      console.error('Error in disable 2FA:', error);
      return res.status(500).json({
        success: false,
        message: 'Gagal menonaktifkan 2FA.',
      });
    }
  },
};

module.exports = twoFactorController;
