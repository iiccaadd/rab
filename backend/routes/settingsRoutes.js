const express = require('express');
const router = express.Router();

const settingsController = require('../controllers/settingsController');
const authMiddleware = require('../middleware/authMiddleware');
const csrfProtection = require('../middleware/csrfMiddleware');
const { uploadAvatar } = require('../utils/upload');

// 1. Profil & Avatar
router.put('/profile', authMiddleware, settingsController.updateProfile);
router.post('/avatar', authMiddleware, uploadAvatar.single('avatar'), settingsController.uploadAvatar);
router.put('/email', authMiddleware, settingsController.requestEmailChange);
router.post('/email/confirm', settingsController.confirmEmailChange);

// 2. Ubah Password
router.put('/password', authMiddleware, settingsController.changePassword);

// 3. Kelola Sesi Aktif
router.get('/sessions', authMiddleware, settingsController.getSessions);
router.delete('/sessions/all', authMiddleware, csrfProtection, settingsController.revokeAllOtherSessions);
router.delete('/sessions/:sessionId', authMiddleware, settingsController.revokeSession);

// 4. Preferensi Notifikasi & Tema
router.get('/preferences', authMiddleware, settingsController.getPreferences);
router.put('/preferences', authMiddleware, settingsController.updatePreferences);

// 5. Hapus Akun (Soft Delete)
router.delete('/account', authMiddleware, csrfProtection, settingsController.deleteAccount);

// 6. Pembersihan Hard Delete (Opsional Admin/Cron)
router.post('/admin/hard-delete-expired', settingsController.hardDeleteExpired);

// 7. Kelola Pengguna & Persetujuan Akun (Khusus Admin: irsyadisty)
router.get('/admin/users', authMiddleware, settingsController.getAdminUsersList);
router.post('/admin/users/:userId/approve', authMiddleware, settingsController.approveUserByAdmin);
router.post('/admin/users/:userId/reject', authMiddleware, settingsController.rejectUserByAdmin);
router.delete('/admin/users/:userId', authMiddleware, settingsController.deleteUserByAdmin);

module.exports = router;
