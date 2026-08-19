const rateLimit = require('express-rate-limit');

/**
 * Rate Limiter Ketat untuk Endpoint Login (Maksimal 5 percobaan per 15 menit)
 */
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // Maksimal 5 permintaan gagal
  skipSuccessfulRequests: true, // Hanya hitung percobaan yang gagal (status >= 400)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login gagal dari IP Anda. Silakan coba lagi setelah 15 menit.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});

/**
 * Rate Limiter untuk Permintaan Lupa Password (Maksimal 3 permintaan per 15 menit)
 */
const forgotPasswordRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak permintaan reset password. Silakan coba lagi setelah 15 menit.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});

/**
 * Rate Limiter untuk Verifikasi OTP 2FA (Maksimal 5 percobaan per 10 menit)
 */
const twoFactorRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak percobaan kode OTP yang salah. Silakan coba lagi beberapa saat lagi.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});

/**
 * General API Limiter (100 permintaan per 15 menit)
 */
const apiGeneralLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak permintaan ke server. Silakan perlambat aktivitas Anda.',
    code: 'TOO_MANY_REQUESTS',
  },
});

module.exports = {
  loginRateLimiter,
  forgotPasswordRateLimiter,
  twoFactorRateLimiter,
  apiGeneralLimiter,
};
