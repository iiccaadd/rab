const rateLimit = require('express-rate-limit');

/**
 * Rate Limiter Ketat untuk Endpoint Login (Maksimal 5 percobaan per 15 menit)
 */
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 15, // Toleransi login
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false, xForwardedForHeader: false },
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login gagal dari IP Anda. Silakan coba lagi setelah 15 menit.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});

/**
 * Rate Limiter untuk Permintaan Lupa Password
 */
const forgotPasswordRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false, xForwardedForHeader: false },
  message: {
    success: false,
    message: 'Terlalu banyak permintaan reset password. Silakan coba lagi setelah 15 menit.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});

/**
 * Rate Limiter untuk Verifikasi OTP 2FA
 */
const twoFactorRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 15,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false, xForwardedForHeader: false },
  message: {
    success: false,
    message: 'Terlalu banyak percobaan kode OTP yang salah. Silakan coba lagi beberapa saat lagi.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});

/**
 * General API Limiter
 */
const apiGeneralLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: false, xForwardedForHeader: false },
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
