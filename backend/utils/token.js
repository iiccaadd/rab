const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Generate Access Token (JWT - Expired 15 menit)
 * @param {Object} payload 
 * @returns {string}
 */
function generateAccessToken(payload) {
  return jwt.sign(
    {
      sub: payload.id,
      email: payload.email,
      name: payload.name,
    },
    env.JWT.accessSecret,
    { expiresIn: env.JWT.accessExpiresIn }
  );
}

/**
 * Generate Refresh Token (JWT - Expired 7 hari)
 * @param {Object} payload 
 * @returns {string}
 */
function generateRefreshToken(payload) {
  return jwt.sign(
    {
      sub: payload.id,
      tokenType: 'refresh',
    },
    env.JWT.refreshSecret,
    { expiresIn: env.JWT.refreshExpiresIn }
  );
}

/**
 * Generate Temporary Token for 2FA verification (JWT - Expired 5 menit)
 * @param {Object} payload 
 * @returns {string}
 */
function generateTempToken(payload) {
  return jwt.sign(
    {
      sub: payload.id,
      tokenType: '2fa_temp',
    },
    env.JWT.tempSecret,
    { expiresIn: env.JWT.tempExpiresIn }
  );
}

/**
 * Verifikasi Access Token
 * @param {string} token 
 * @returns {Object} decoded payload
 */
function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT.accessSecret);
}

/**
 * Verifikasi Refresh Token
 * @param {string} token 
 * @returns {Object} decoded payload
 */
function verifyRefreshToken(token) {
  return jwt.verify(token, env.JWT.refreshSecret);
}

/**
 * Verifikasi Temp 2FA Token
 * @param {string} token 
 * @returns {Object} decoded payload
 */
function verifyTempToken(token) {
  return jwt.verify(token, env.JWT.tempSecret);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTempToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyTempToken,
};
