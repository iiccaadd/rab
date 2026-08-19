const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env located at project root or backend
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5000',

  // Database
  DB: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'auth_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    connectionString: process.env.DATABASE_URL || null,
  },

  // JWT
  JWT: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'default_jwt_access_secret_key_12345',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_jwt_refresh_secret_key_67890',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    tempSecret: process.env.JWT_TEMP_SECRET || 'default_jwt_temp_secret_key_abcde',
    tempExpiresIn: process.env.JWT_TEMP_EXPIRES_IN || '5m',
  },

  // Cookie
  COOKIE: {
    secret: process.env.COOKIE_SECRET || 'default_cookie_secret_change_me',
    secure: process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production',
  },

  // SMTP Email
  SMTP: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || '"Sistem Autentikasi" <noreply@auth.local>',
  }
};
