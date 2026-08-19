const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const csrfProtection = require('../middleware/csrfMiddleware');

// Dapatkan profil user saat ini (Protected)
router.get('/profile', authMiddleware, userController.getProfile);

// Dapatkan daftar session/perangkat aktif milik user (Protected)
router.get('/sessions', authMiddleware, userController.getSessions);

// Cabut session perangkat tertentu (Protected)
router.delete('/sessions/:sessionId', authMiddleware, userController.revokeSession);

// Cabut semua session di perangkat lain (Protected)
router.post('/sessions/revoke-others', authMiddleware, csrfProtection, userController.revokeAllOtherSessions);

module.exports = router;
