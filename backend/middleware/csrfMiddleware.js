const env = require('../config/env');

/**
 * CSRF Protection Middleware
 * Memastikan request yang bergantung pada cookie (seperti refresh token / logout)
 * menyertakan header proteksi kustom atau berasal dari origin yang valid.
 */
function csrfProtection(req, res, next) {
  // Lewati metode GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const origin = req.headers.origin || req.headers.referer;
  const customHeader = req.headers['x-requested-with'] || req.headers['x-csrf-protection'];

  // Jika ada custom header atau origin cocok dengan FRONTEND_URL
  if (customHeader === 'XMLHttpRequest' || customHeader === '1') {
    return next();
  }

  if (origin && origin.startsWith(env.FRONTEND_URL)) {
    return next();
  }

  // Dalam development mode lokal localhost diperbolehkan
  if (env.NODE_ENV === 'development') {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Akses ditolak oleh proteksi CSRF. Header permintaan tidak valid.',
    code: 'CSRF_BLOCKED',
  });
}

module.exports = csrfProtection;
