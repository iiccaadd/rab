const { verifyAccessToken } = require('../utils/token');
const userModel = require('../models/userModel');

/**
 * Middleware untuk memverifikasi JWT Access Token dari Header Authorization
 */
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Token autentikasi tidak ditemukan.',
        code: 'TOKEN_MISSING',
      });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Sesi akses telah berakhir. Silakan perbarui token Anda.',
          code: 'TOKEN_EXPIRED',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Token autentikasi tidak valid.',
        code: 'TOKEN_INVALID',
      });
    }

    // Pastikan user masih ada di database
    const user = await userModel.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Pengguna tidak ditemukan atau telah dihapus.',
        code: 'USER_NOT_FOUND',
      });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.email_verified,
      twoFactorEnabled: user.two_factor_enabled,
    };

    next();
  } catch (error) {
    console.error('Error on authMiddleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada verifikasi autentikasi.',
    });
  }
}

module.exports = authMiddleware;
