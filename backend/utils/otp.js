const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

/**
 * Generate 2FA Secret Key & QR Code Data URL
 * @param {string} email 
 * @param {string} issuer default 'SistemAuth'
 * @returns {Promise<{secret: string, otpauthUrl: string, qrCodeDataUrl: string}>}
 */
async function generate2FASecret(email, issuer = 'SistemAutentikasi') {
  const secret = speakeasy.generateSecret({
    length: 20,
    name: `${issuer} (${email})`,
    issuer,
  });

  const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url);

  return {
    secret: secret.base32,
    otpauthUrl: secret.otpauth_url,
    qrCodeDataUrl,
  };
}

/**
 * Verifikasi 6-digit TOTP Token
 * @param {string} token 6-digit OTP
 * @param {string} secret base32 secret
 * @returns {boolean}
 */
function verifyTOTPToken(token, secret) {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token: String(token).trim(),
    window: 1, // Allow 1 step (30s) tolerance for clock drift
  });
}

module.exports = {
  generate2FASecret,
  verifyTOTPToken,
};
