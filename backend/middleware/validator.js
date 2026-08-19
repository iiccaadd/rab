const { body, query, validationResult } = require('express-validator');

/**
 * Helper middleware untuk mengecek hasil validasi express-validator
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg, // Pesan error pertama yang ramah pengguna
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
      code: 'VALIDATION_ERROR',
    });
  }
  next();
}

/**
 * Aturan Validasi Registrasi
 */
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nama lengkap wajib diisi.')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nama lengkap harus antara 2 sampai 100 karakter.')
    .escape(),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Alamat email wajib diisi.')
    .isEmail()
    .withMessage('Format alamat email tidak valid.')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password wajib diisi.')
    .isLength({ min: 8 })
    .withMessage('Password minimal 8 karakter.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password harus mengandung kombinasi huruf besar, huruf kecil, dan angka.'),

  handleValidationErrors,
];

/**
 * Aturan Validasi Login
 */
const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Username atau email wajib diisi.')
    .isLength({ min: 3 })
    .withMessage('Username atau email minimal 3 karakter.'),

  body('password')
    .notEmpty()
    .withMessage('Password wajib diisi.'),

  handleValidationErrors,
];

/**
 * Aturan Validasi Lupa Password
 */
const forgotPasswordValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Alamat email wajib diisi.')
    .isEmail()
    .withMessage('Format alamat email tidak valid.')
    .normalizeEmail(),

  handleValidationErrors,
];

/**
 * Aturan Validasi Reset Password
 */
const resetPasswordValidation = [
  body('token')
    .trim()
    .notEmpty()
    .withMessage('Token reset password tidak valid atau tidak ditemukan.'),

  body('newPassword')
    .notEmpty()
    .withMessage('Password baru wajib diisi.')
    .isLength({ min: 8 })
    .withMessage('Password baru minimal 8 karakter.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password baru harus mengandung kombinasi huruf besar, huruf kecil, dan angka.'),

  handleValidationErrors,
];

/**
 * Aturan Validasi Verifikasi Email
 */
const verifyEmailValidation = [
  query('token')
    .trim()
    .notEmpty()
    .withMessage('Token verifikasi email wajib disertakan.'),

  handleValidationErrors,
];

/**
 * Aturan Validasi OTP 2FA
 */
const otpValidation = [
  body('otp')
    .trim()
    .notEmpty()
    .withMessage('Kode OTP 6 digit wajib diisi.')
    .isLength({ min: 6, max: 6 })
    .withMessage('Kode OTP harus terdiri dari 6 digit angka.')
    .isNumeric()
    .withMessage('Kode OTP hanya boleh berisi angka.'),

  handleValidationErrors,
];

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  verifyEmailValidation,
  otpValidation,
  handleValidationErrors,
};
