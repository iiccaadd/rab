const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const twoFactorController = require('../controllers/twoFactorController');

const authMiddleware = require('../middleware/authMiddleware');
const csrfProtection = require('../middleware/csrfMiddleware');
const {
  loginRateLimiter,
  forgotPasswordRateLimiter,
  twoFactorRateLimiter,
} = require('../middleware/rateLimiter');
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  verifyEmailValidation,
  otpValidation,
} = require('../middleware/validator');

// 1. Register
router.post('/register', registerValidation, authController.register);

// 2. Verify Email
router.get('/verify-email', verifyEmailValidation, authController.verifyEmail);
router.post('/verify-email', authController.verifyEmail);

// 3. Login (Rate limited)
router.post('/login', loginRateLimiter, loginValidation, authController.login);

// 4. Refresh Token (CSRF protected)
router.post('/refresh', csrfProtection, authController.refresh);

// 5. Logout
router.post('/logout', csrfProtection, authController.logout);

// 6. Forgot Password (Rate limited)
router.post('/forgot-password', forgotPasswordRateLimiter, forgotPasswordValidation, authController.forgotPassword);

// 7. Reset Password
router.post('/reset-password', resetPasswordValidation, authController.resetPassword);

// ==========================================
// TWO-FACTOR AUTHENTICATION (2FA) ROUTES
// ==========================================

// Enable 2FA: Generate secret and QR code (Protected)
router.post('/2fa/enable', authMiddleware, twoFactorController.generateSetup);

// Verify 2FA setup with OTP code (Protected)
router.post('/2fa/verify-setup', authMiddleware, otpValidation, twoFactorController.verifySetup);

// Verify 2FA during Login (Rate limited)
router.post('/2fa/verify-login', twoFactorRateLimiter, otpValidation, twoFactorController.verifyLogin);

// Disable 2FA with password confirmation (Protected)
router.post('/2fa/disable', authMiddleware, twoFactorController.disable);

module.exports = router;
