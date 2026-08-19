const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');

const env = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const { apiGeneralLimiter } = require('./middleware/rateLimiter');

const app = express();

// Trust proxy for Vercel & reverse proxy
app.set('trust proxy', 1);

// 1. Security Headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// 2. CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    origin: true, // Allow all origins including Vercel domains dynamically with credentials
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Protection'],
  })
);

// 3. Body & Cookie Parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser(env.COOKIE.secret));

// 4. Rate Limiting Umum untuk seluruh API
app.use('/api', apiGeneralLimiter);

// 5. Static Files untuk Frontend, Root App & Uploads
const frontendPath = path.resolve(__dirname, '../frontend');
const rootPath = path.resolve(__dirname, '..');
const uploadsPath = path.resolve(__dirname, '../uploads');

app.use(express.static(frontendPath));
app.use(express.static(rootPath));
app.use('/uploads', express.static(uploadsPath));

// 6. API Routes (Mounted on both /api/ and direct paths for serverless compatibility)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/user', userRoutes);
app.use('/user', userRoutes);

app.use('/api/settings', settingsRoutes);
app.use('/settings', settingsRoutes);

// Health check endpoint
app.get(['/api/health', '/health'], (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV,
    serverless: !!process.env.VERCEL,
  });
});

// Root endpoint: arahkan langsung ke index.html (Portal Single Page App All-in-One)
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../index.html'));
});

// 7. 404 Handler untuk API
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint API tidak ditemukan.',
    code: 'NOT_FOUND',
  });
});

// 8. Global Error Handler
app.use((err, req, res, next) => {
  console.error('[UNHANDLED ERROR]:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan internal pada server.';

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 9. Start Server (Only when not running in Vercel serverless environment)
if (!process.env.VERCEL) {
  const server = app.listen(env.PORT, () => {
    console.log('======================================================');
    console.log(`🚀 Server Autentikasi berjalan di PORT: ${env.PORT}`);
    console.log(`🌍 Environment : ${env.NODE_ENV}`);
    console.log(`🔗 Frontend URL: ${env.FRONTEND_URL}`);
    console.log(`📄 Portal RAB: ${env.FRONTEND_URL}/index.html`);
    console.log('======================================================');
  });

  // Graceful Shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
    });
  });
}

module.exports = app;
