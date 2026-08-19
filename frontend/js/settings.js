document.addEventListener('DOMContentLoaded', () => {
  let currentUser = null;

  // Tab switching elements
  const tabButtons = document.querySelectorAll('.settings-tab-btn');
  const sections = document.querySelectorAll('.settings-section');
  const globalAlert = document.getElementById('settingsGlobalAlert');

  // Profile elements
  const formProfile = document.getElementById('formProfile');
  const profileName = document.getElementById('profileName');
  const profilePhone = document.getElementById('profilePhone');
  const profileBio = document.getElementById('profileBio');
  const avatarPreview = document.getElementById('avatarPreview');
  const avatarFileInput = document.getElementById('avatarFileInput');
  const btnSaveProfile = document.getElementById('btnSaveProfile');

  // Change email elements
  const formChangeEmail = document.getElementById('formChangeEmail');
  const currentEmailDisplay = document.getElementById('currentEmailDisplay');
  const newEmailInput = document.getElementById('newEmailInput');
  const btnChangeEmail = document.getElementById('btnChangeEmail');

  // Password elements
  const formChangePassword = document.getElementById('formChangePassword');
  const oldPassword = document.getElementById('oldPassword');
  const newPasswordInput = document.getElementById('newPasswordInput');
  const confirmNewPasswordInput = document.getElementById('confirmNewPasswordInput');
  const btnSavePassword = document.getElementById('btnSavePassword');

  // 2FA elements
  const settings2FABadge = document.getElementById('settings2FABadge');
  const btnSettingsToggle2FA = document.getElementById('btnSettingsToggle2FA');
  const modalSetup2FA = document.getElementById('modalSetup2FA');
  const btnClose2FAModal = document.getElementById('btnClose2FAModal');
  const qrCodeImg = document.getElementById('qrCodeImg');
  const secretText = document.getElementById('secretText');
  const setupSecretKey = document.getElementById('setupSecretKey');
  const setupOtpCode = document.getElementById('setupOtpCode');
  const formVerifySetup2FA = document.getElementById('formVerifySetup2FA');
  const btnSubmitSetup2FA = document.getElementById('btnSubmitSetup2FA');
  const modal2FAAlert = document.getElementById('modal2FAAlert');

  const modalDisable2FA = document.getElementById('modalDisable2FA');
  const btnCloseDisableModal = document.getElementById('btnCloseDisableModal');
  const btnCancelDisable = document.getElementById('btnCancelDisable');
  const formDisable2FA = document.getElementById('formDisable2FA');
  const disablePassword = document.getElementById('disablePassword');
  const btnConfirmDisable = document.getElementById('btnConfirmDisable');
  const modalDisableAlert = document.getElementById('modalDisableAlert');

  // Sessions elements
  const settingsSessionsList = document.getElementById('settingsSessionsList');
  const btnSettingsRevokeAll = document.getElementById('btnSettingsRevokeAll');

  // Preferences elements
  const formPreferences = document.getElementById('formPreferences');
  const prefEmailNotif = document.getElementById('prefEmailNotif');
  const prefPushNotif = document.getElementById('prefPushNotif');
  const prefTheme = document.getElementById('prefTheme');
  const btnSavePreferences = document.getElementById('btnSavePreferences');

  // Delete account elements
  const btnOpenDeleteModal = document.getElementById('btnOpenDeleteModal');
  const modalDeleteAccount = document.getElementById('modalDeleteAccount');
  const btnCloseDeleteModal = document.getElementById('btnCloseDeleteModal');
  const btnCancelDelete = document.getElementById('btnCancelDelete');
  const formConfirmDelete = document.getElementById('formConfirmDelete');
  const deletePasswordInput = document.getElementById('deletePasswordInput');
  const deleteEmailInput = document.getElementById('deleteEmailInput');
  const deleteEmailConfirmTarget = document.getElementById('deleteEmailConfirmTarget');
  const modalDeleteAlert = document.getElementById('modalDeleteAlert');
  const btnExecuteDelete = document.getElementById('btnExecuteDelete');
  const btnLogout = document.getElementById('btnLogout');

  // ==========================================================================
  // HELPERS & ALERTS
  // ==========================================================================

  function showGlobalAlert(message, type = 'success') {
    globalAlert.textContent = message;
    globalAlert.className = `alert alert-${type}`;
    globalAlert.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      globalAlert.style.display = 'none';
    }, 5000);
  }

  function showModalAlert(element, message, type = 'error') {
    element.textContent = message;
    element.className = `alert alert-${type}`;
    element.style.display = 'block';
  }

  function hideModalAlert(element) {
    element.style.display = 'none';
  }

  function setLoading(button, isLoading, text = 'Menyimpan...') {
    const textSpan = button.querySelector('.btn-text');
    const spinner = button.querySelector('.spinner');
    button.disabled = isLoading;

    if (isLoading) {
      if (textSpan) textSpan.textContent = text;
      if (spinner) spinner.style.display = 'inline-block';
    } else {
      if (textSpan) textSpan.textContent = text;
      if (spinner) spinner.style.display = 'none';
    }
  }

  function formatDate(isoString) {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function escapeHtml(str) {
    return (str || '').replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }[m]));
  }

  // Admin User Approval elements
  const tabAdminUsersBtn = document.getElementById('tabAdminUsersBtn');
  const pendingUsersCountBadge = document.getElementById('pendingUsersCountBadge');
  const adminUsersTableBody = document.getElementById('adminUsersTableBody');
  const btnRefreshAdminUsers = document.getElementById('btnRefreshAdminUsers');
  const searchAdminUsers = document.getElementById('searchAdminUsers');
  const filterAdminUserStatus = document.getElementById('filterAdminUserStatus');
  const adminUsersAlert = document.getElementById('adminUsersAlert');
  let adminUsersList = [];

  // ==========================================================================
  // 1. TAB SWITCHING
  // ==========================================================================

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;

      tabButtons.forEach((b) => b.classList.remove('active'));
      sections.forEach((s) => s.classList.remove('active'));

      btn.classList.add('active');
      const targetSection = document.getElementById(targetTab);
      if (targetSection) {
        targetSection.classList.add('active');
        targetSection.style.display = 'block';
      }
    });
  });

  // ==========================================================================
  // 2. LOAD USER PROFILE & SETTINGS
  // ==========================================================================

  async function loadInitialData() {
    try {
      const res = await API.get('/api/user/profile');
      if (res.success && res.data) {
        currentUser = res.data;
        populateProfile(currentUser);

        const isAdmin = currentUser.name?.toLowerCase() === 'irsyadisty' || currentUser.email?.toLowerCase() === 'irsyadisty@mirstyvanconstruction.com';
        if (isAdmin) {
          if (tabAdminUsersBtn) tabAdminUsersBtn.style.display = 'flex';
          loadAdminUsers();
        }
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    }

    loadPreferences();
    loadSessions();
  }

  function populateProfile(user) {
    profileName.value = user.name || '';
    profilePhone.value = user.phoneNumber || '';
    profileBio.value = user.bio || '';
    currentEmailDisplay.textContent = user.email || '';
    deleteEmailConfirmTarget.textContent = user.email || '';

    if (user.avatarUrl) {
      avatarPreview.src = user.avatarUrl;
    }

    if (user.twoFactorEnabled) {
      settings2FABadge.innerHTML = '<span class="badge badge-success">✓ Aktif</span>';
      btnSettingsToggle2FA.textContent = 'Nonaktifkan 2FA';
      btnSettingsToggle2FA.className = 'btn btn-danger';
    } else {
      settings2FABadge.innerHTML = '<span class="badge badge-secondary">Nonaktif</span>';
      btnSettingsToggle2FA.textContent = 'Aktifkan 2FA';
      btnSettingsToggle2FA.className = 'btn btn-primary';
    }
  }

  // ==========================================================================
  // 3. EDIT PROFILE & AVATAR
  // ==========================================================================

  formProfile.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = profileName.value.trim();
    const phoneNumber = profilePhone.value.trim();
    const bio = profileBio.value.trim();

    if (!name) {
      showGlobalAlert('Nama lengkap wajib diisi.', 'error');
      return;
    }

    setLoading(btnSaveProfile, true, 'Menyimpan...');

    try {
      const res = await API.put('/api/settings/profile', { name, phoneNumber, bio });
      if (res.success) {
        showGlobalAlert(res.message || 'Profil berhasil diperbarui.', 'success');
        if (currentUser) {
          currentUser.name = name;
          currentUser.phoneNumber = phoneNumber;
          currentUser.bio = bio;
        }
      } else {
        showGlobalAlert(res.message || 'Gagal memperbarui profil.', 'error');
      }
    } catch (err) {
      showGlobalAlert('Terjadi kesalahan koneksi server.', 'error');
    } finally {
      setLoading(btnSaveProfile, false, 'Simpan Perubahan Profil');
    }
  });

  // Avatar Upload Listener
  avatarFileInput.addEventListener('change', async () => {
    const file = avatarFileInput.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showGlobalAlert('Ukuran foto maksimal 2MB.', 'error');
      avatarFileInput.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      showGlobalAlert('Mengunggah foto profil...', 'warning');
      const res = await API.upload('/api/settings/avatar', formData);

      if (res.success && res.data && res.data.avatarUrl) {
        avatarPreview.src = res.data.avatarUrl;
        showGlobalAlert('Foto profil berhasil diunggah dan disimpan.', 'success');
      } else {
        showGlobalAlert(res.message || 'Gagal mengunggah foto profil.', 'error');
      }
    } catch (err) {
      showGlobalAlert('Terjadi kesalahan saat mengunggah avatar.', 'error');
    }
  });

  // Change Email Listener
  formChangeEmail.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newEmail = newEmailInput.value.trim();

    if (!newEmail) {
      showGlobalAlert('Masukkan alamat email baru.', 'error');
      return;
    }

    setLoading(btnChangeEmail, true, 'Mengirim Tautan...');

    try {
      const res = await API.put('/api/settings/email', { newEmail });
      if (res.success) {
        showGlobalAlert(res.message || 'Tautan konfirmasi telah dikirim ke email baru.', 'success');
        newEmailInput.value = '';
      } else {
        showGlobalAlert(res.message || 'Gagal memproses perubahan email.', 'error');
      }
    } catch (err) {
      showGlobalAlert('Terjadi kesalahan jaringan.', 'error');
    } finally {
      setLoading(btnChangeEmail, false, 'Kirim Tautan Verifikasi Email Baru');
    }
  });

  // ==========================================================================
  // 4. UBAH PASSWORD
  // ==========================================================================

  formChangePassword.addEventListener('submit', async (e) => {
    e.preventDefault();
    const oldPwd = oldPassword.value;
    const newPwd = newPasswordInput.value;
    const confirmPwd = confirmNewPasswordInput.value;

    if (!oldPwd || !newPwd) {
      showGlobalAlert('Semua kolom password wajib diisi.', 'error');
      return;
    }

    if (newPwd.length < 8 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPwd)) {
      showGlobalAlert('Password baru minimal 8 karakter dan kombinasi huruf besar, kecil, dan angka.', 'error');
      return;
    }

    if (newPwd !== confirmPwd) {
      showGlobalAlert('Konfirmasi password baru tidak cocok.', 'error');
      return;
    }

    setLoading(btnSavePassword, true, 'Menyimpan...');

    try {
      const res = await API.put('/api/settings/password', {
        oldPassword: oldPwd,
        newPassword: newPwd,
      });

      if (res.success) {
        showGlobalAlert(res.message || 'Password berhasil diubah.', 'success');
        formChangePassword.reset();
      } else {
        showGlobalAlert(res.message || 'Gagal mengubah password.', 'error');
      }
    } catch (err) {
      showGlobalAlert('Terjadi kesalahan saat mengubah password.', 'error');
    } finally {
      setLoading(btnSavePassword, false, 'Perbarui Password');
    }
  });

  // ==========================================================================
  // 5. 2FA (ENABLE / DISABLE)
  // ==========================================================================

  btnSettingsToggle2FA.addEventListener('click', async () => {
    if (currentUser && currentUser.twoFactorEnabled) {
      // Disable modal
      disablePassword.value = '';
      hideModalAlert(modalDisableAlert);
      modalDisable2FA.classList.add('active');
      disablePassword.focus();
    } else {
      // Enable modal
      hideModalAlert(modal2FAAlert);
      setupOtpCode.value = '';

      try {
        const res = await API.post('/api/auth/2fa/enable');
        if (res.success && res.data) {
          qrCodeImg.src = res.data.qrCode;
          secretText.textContent = res.data.secret;
          setupSecretKey.value = res.data.secret;
          modalSetup2FA.classList.add('active');
          setupOtpCode.focus();
        } else {
          showGlobalAlert(res.message || 'Gagal membuat konfigurasi 2FA.', 'error');
        }
      } catch (err) {
        showGlobalAlert('Terjadi kesalahan koneksi 2FA.', 'error');
      }
    }
  });

  btnClose2FAModal.addEventListener('click', () => modalSetup2FA.classList.remove('active'));
  btnCloseDisableModal.addEventListener('click', () => modalDisable2FA.classList.remove('active'));
  btnCancelDisable.addEventListener('click', () => modalDisable2FA.classList.remove('active'));

  formVerifySetup2FA.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideModalAlert(modal2FAAlert);

    const secret = setupSecretKey.value;
    const otp = setupOtpCode.value.trim();

    if (!otp || otp.length !== 6) {
      showModalAlert(modal2FAAlert, 'Masukkan 6 digit angka kode OTP.');
      return;
    }

    btnSubmitSetup2FA.disabled = true;

    try {
      const res = await API.post('/api/auth/2fa/verify-setup', { secret, otp });
      if (res.success) {
        modalSetup2FA.classList.remove('active');
        showGlobalAlert('2FA berhasil diaktifkan untuk akun Anda.', 'success');
        if (currentUser) currentUser.twoFactorEnabled = true;
        populateProfile(currentUser);
      } else {
        showModalAlert(modal2FAAlert, res.message || 'Kode OTP salah.');
      }
    } catch (err) {
      showModalAlert(modal2FAAlert, 'Gagal memverifikasi 2FA.');
    } finally {
      btnSubmitSetup2FA.disabled = false;
    }
  });

  formDisable2FA.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideModalAlert(modalDisableAlert);

    const password = disablePassword.value;
    if (!password) {
      showModalAlert(modalDisableAlert, 'Masukkan password Anda.');
      return;
    }

    btnConfirmDisable.disabled = true;

    try {
      const res = await API.post('/api/auth/2fa/disable', { password });
      if (res.success) {
        modalDisable2FA.classList.remove('active');
        showGlobalAlert('2FA berhasil dinonaktifkan.', 'success');
        if (currentUser) currentUser.twoFactorEnabled = false;
        populateProfile(currentUser);
      } else {
        showModalAlert(modalDisableAlert, res.message || 'Password salah.');
      }
    } catch (err) {
      showModalAlert(modalDisableAlert, 'Gagal menonaktifkan 2FA.');
    } finally {
      btnConfirmDisable.disabled = false;
    }
  });

  // ==========================================================================
  // 6. KELOLA SESI AKTIF (MULTI-DEVICE)
  // ==========================================================================

  async function loadSessions() {
    try {
      const res = await API.get('/api/settings/sessions');
      if (res.success && Array.isArray(res.data)) {
        renderSessions(res.data);
      }
    } catch (err) {
      console.error('Error loading sessions:', err);
    }
  }

  function renderSessions(sessions) {
    if (sessions.length === 0) {
      settingsSessionsList.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--slate-400); padding: 1.5rem;">Tidak ada sesi aktif.</td>
        </tr>
      `;
      return;
    }

    settingsSessionsList.innerHTML = sessions.map((s) => {
      const isCurrent = s.isCurrent;
      return `
        <tr>
          <td>
            <div style="font-weight: 600; color: var(--slate-900); font-size: 0.875rem;">${escapeHtml(s.deviceInfo)}</div>
          </td>
          <td><code style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--slate-600);">${s.ipAddress}</code></td>
          <td style="color: var(--slate-600); font-size: 0.825rem;">${formatDate(s.lastActiveAt)}</td>
          <td>
            ${isCurrent
              ? '<span class="badge badge-success">Perangkat Ini (Aktif)</span>'
              : '<span class="badge badge-secondary">Aktif</span>'
            }
          </td>
          <td>
            ${isCurrent
              ? '<span style="font-size: 0.775rem; color: var(--slate-400);">-</span>'
              : `<button class="btn btn-secondary btn-revoke-session" data-id="${s.id}" style="width: auto; padding: 0.25rem 0.6rem; font-size: 0.75rem;">Cabut</button>`
            }
          </td>
        </tr>
      `;
    }).join('');

    document.querySelectorAll('.btn-revoke-session').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const sessionId = btn.dataset.id;
        if (confirm('Cabut sesi perangkat ini?')) {
          try {
            const res = await API.delete(`/api/settings/sessions/${sessionId}`);
            if (res.success) {
              showGlobalAlert('Sesi perangkat berhasil dicabut.', 'success');
              loadSessions();
            } else {
              showGlobalAlert(res.message || 'Gagal mencabut sesi.', 'error');
            }
          } catch (err) {
            showGlobalAlert('Terjadi kesalahan koneksi.', 'error');
          }
        }
      });
    });
  }

  btnSettingsRevokeAll.addEventListener('click', async () => {
    if (confirm('Apakah Anda yakin ingin logout dari semua perangkat lain?')) {
      try {
        const res = await API.delete('/api/settings/sessions/all');
        if (res.success) {
          showGlobalAlert(res.message || 'Sesi pada perangkat lain berhasil dicabut.', 'success');
          loadSessions();
        } else {
          showGlobalAlert(res.message || 'Gagal mencabut sesi.', 'error');
        }
      } catch (err) {
        showGlobalAlert('Terjadi kesalahan jaringan.', 'error');
      }
    }
  });

  // ==========================================================================
  // 7. PREFERENSI NOTIFIKASI & TEMA
  // ==========================================================================

  async function loadPreferences() {
    try {
      const res = await API.get('/api/settings/preferences');
      if (res.success && res.data) {
        prefEmailNotif.checked = res.data.email_notifications;
        prefPushNotif.checked = res.data.push_notifications;
        if (res.data.theme) prefTheme.value = res.data.theme;
      }
    } catch (err) {
      console.error('Error loading preferences:', err);
    }
  }

  formPreferences.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailNotifications = prefEmailNotif.checked;
    const pushNotifications = prefPushNotif.checked;
    const theme = prefTheme.value;

    setLoading(btnSavePreferences, true, 'Menyimpan...');

    try {
      const res = await API.put('/api/settings/preferences', {
        emailNotifications,
        pushNotifications,
        theme,
      });

      if (res.success) {
        showGlobalAlert(res.message || 'Preferensi berhasil disimpan.', 'success');
      } else {
        showGlobalAlert(res.message || 'Gagal menyimpan preferensi.', 'error');
      }
    } catch (err) {
      showGlobalAlert('Terjadi kesalahan jaringan.', 'error');
    } finally {
      setLoading(btnSavePreferences, false, 'Simpan Preferensi');
    }
  });

  // ==========================================================================
  // 8. HAPUS AKUN (SOFT DELETE)
  // ==========================================================================

  btnOpenDeleteModal.addEventListener('click', () => {
    deletePasswordInput.value = '';
    deleteEmailInput.value = '';
    hideModalAlert(modalDeleteAlert);
    modalDeleteAccount.classList.add('active');
  });

  btnCloseDeleteModal.addEventListener('click', () => modalDeleteAccount.classList.remove('active'));
  btnCancelDelete.addEventListener('click', () => modalDeleteAccount.classList.remove('active'));

  formConfirmDelete.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideModalAlert(modalDeleteAlert);

    const password = deletePasswordInput.value;
    const confirmEmail = deleteEmailInput.value.trim();

    if (!password && !confirmEmail) {
      showModalAlert(modalDeleteAlert, 'Masukkan password akun atau ketik ulang email Anda.');
      return;
    }

    setLoading(btnExecuteDelete, true, 'Menghapus Akun...');

    try {
      const res = await API.delete('/api/settings/account', {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, confirmEmail }),
      });

      if (res.success) {
        modalDeleteAccount.classList.remove('active');
        alert('Akun Anda telah dinonaktifkan. Terima kasih telah menggunakan layanan kami.');
        API.clearAuth();
        window.location.href = 'login.html';
      } else {
        showModalAlert(modalDeleteAlert, res.message || 'Konfirmasi salah. Gagal menghapus akun.');
      }
    } catch (err) {
      showModalAlert(modalDeleteAlert, 'Terjadi kesalahan server saat menghapus akun.');
    } finally {
      setLoading(btnExecuteDelete, false, 'Ya, Hapus Akun');
    }
  });

  // ==========================================================================
  // 9. ADMIN USER MANAGEMENT & APPROVAL (Khusus Admin irsyadisty)
  // ==========================================================================

  async function loadAdminUsers() {
    if (!adminUsersTableBody) return;
    adminUsersTableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 2rem; color: var(--slate-500);">
          <span class="spinner" style="display: inline-block; margin-right: 0.5rem;"></span> Memuat daftar pendaftar...
        </td>
      </tr>
    `;

    try {
      const res = await API.get('/api/settings/admin/users');
      if (res.success && Array.isArray(res.data)) {
        adminUsersList = res.data;

        // Hitung pengguna yang berstatus pending
        const pendingCount = adminUsersList.filter(
          (u) => (u.status === 'PENDING' || !u.is_approved) && u.name?.toLowerCase() !== 'irsyadisty'
        ).length;

        if (pendingUsersCountBadge) {
          if (pendingCount > 0) {
            pendingUsersCountBadge.textContent = pendingCount;
            pendingUsersCountBadge.style.display = 'inline-block';
          } else {
            pendingUsersCountBadge.style.display = 'none';
          }
        }

        renderAdminUsersTable();
      } else {
        adminUsersTableBody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align: center; padding: 2rem; color: #ef4444;">
              Gagal memuat data pengguna: ${res.message || 'Akses ditolak.'}
            </td>
          </tr>
        `;
      }
    } catch (err) {
      console.error('Error in loadAdminUsers:', err);
      adminUsersTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 2rem; color: #ef4444;">
            Terjadi kesalahan koneksi saat memuat daftar pengguna.
          </td>
        </tr>
      `;
    }
  }

  function renderAdminUsersTable() {
    if (!adminUsersTableBody) return;

    const searchTerm = (searchAdminUsers?.value || '').toLowerCase().trim();
    const statusFilter = filterAdminUserStatus?.value || 'ALL';

    const filtered = adminUsersList.filter((u) => {
      const matchSearch =
        !searchTerm ||
        (u.name && u.name.toLowerCase().includes(searchTerm)) ||
        (u.email && u.email.toLowerCase().includes(searchTerm)) ||
        (u.phone_number && u.phone_number.includes(searchTerm));

      const isPending = (u.status === 'PENDING' || !u.is_approved) && u.name?.toLowerCase() !== 'irsyadisty';
      const isApproved = (u.status === 'APPROVED' || u.is_approved) || u.name?.toLowerCase() === 'irsyadisty';
      const isRejected = u.status === 'REJECTED';

      let matchStatus = true;
      if (statusFilter === 'PENDING') matchStatus = isPending;
      else if (statusFilter === 'APPROVED') matchStatus = isApproved;
      else if (statusFilter === 'REJECTED') matchStatus = isRejected;

      return matchSearch && matchStatus;
    });

    if (filtered.length === 0) {
      adminUsersTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 2.5rem 1rem; color: var(--slate-500);">
            <div style="font-size: 1.5rem; margin-bottom: 0.35rem;">📋</div>
            <div style="font-weight: 600;">Tidak ada pendaftar yang sesuai filter</div>
            <div style="font-size: 0.8rem; color: var(--slate-400);">Coba ubah kata kunci pencarian atau filter status.</div>
          </td>
        </tr>
      `;
      return;
    }

    adminUsersTableBody.innerHTML = filtered
      .map((u) => {
        const isSelfAdmin = u.name?.toLowerCase() === 'irsyadisty' || u.email?.toLowerCase() === 'irsyadisty@mirstyvanconstruction.com';
        const isApproved = (u.status === 'APPROVED' || u.is_approved) || isSelfAdmin;
        const isPending = (u.status === 'PENDING' || (!u.is_approved && u.status !== 'REJECTED')) && !isSelfAdmin;
        const isRejected = u.status === 'REJECTED';

        let statusBadge = '';
        if (isSelfAdmin) {
          statusBadge = '<span class="badge" style="background: #dbeafe; color: #1e40af; font-weight: 700; padding: 3px 8px; border-radius: 9999px;">👑 Admin Utama</span>';
        } else if (isApproved) {
          statusBadge = '<span class="badge" style="background: #dcfce7; color: #15803d; font-weight: 700; padding: 3px 8px; border-radius: 9999px;">🟢 Disetujui (Aktif)</span>';
        } else if (isPending) {
          statusBadge = '<span class="badge" style="background: #fef3c7; color: #b45309; font-weight: 700; padding: 3px 8px; border-radius: 9999px;">🟡 Menunggu Persetujuan</span>';
        } else if (isRejected) {
          statusBadge = '<span class="badge" style="background: #fee2e2; color: #b91c1c; font-weight: 700; padding: 3px 8px; border-radius: 9999px;">🔴 Ditolak</span>';
        }

        let actionButtons = '';
        if (isSelfAdmin) {
          actionButtons = '<span style="color: var(--slate-400); font-size: 0.8rem;">(Akun Anda)</span>';
        } else {
          actionButtons = `
            <div style="display: flex; gap: 0.35rem; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
              ${
                !isApproved
                  ? `<button class="btn btn-sm btn-approve-user" data-id="${u.id}" data-name="${escapeHtml(u.name)}" style="background: #16a34a; color: white; border: none; padding: 0.3rem 0.65rem; border-radius: 6px; font-size: 0.775rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.25rem;">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <span>Setujui</span>
                    </button>`
                  : `<button class="btn btn-sm btn-reject-user" data-id="${u.id}" data-name="${escapeHtml(u.name)}" style="background: #f59e0b; color: white; border: none; padding: 0.3rem 0.65rem; border-radius: 6px; font-size: 0.775rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.25rem;">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></polyline><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                      <span>Nonaktifkan</span>
                    </button>`
              }
              ${
                isPending
                  ? `<button class="btn btn-sm btn-reject-user" data-id="${u.id}" data-name="${escapeHtml(u.name)}" style="background: #ef4444; color: white; border: none; padding: 0.3rem 0.65rem; border-radius: 6px; font-size: 0.775rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.25rem;">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      <span>Tolak</span>
                    </button>`
                  : ''
              }
              <button class="btn btn-sm btn-delete-user" data-id="${u.id}" data-name="${escapeHtml(u.name)}" style="background: #f1f5f9; color: #64748b; border: 1px solid #cbd5e1; padding: 0.3rem 0.5rem; border-radius: 6px; font-size: 0.775rem; cursor: pointer;" title="Hapus Pengguna">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          `;
        }

        return `
          <tr style="border-bottom: 1px solid var(--border-subtle); transition: background 0.15s ease;">
            <td style="padding: 0.85rem 1rem;">
              <div style="font-weight: 700; color: var(--slate-900); font-size: 0.925rem;">${escapeHtml(u.name || '-')}</div>
              <div style="font-size: 0.75rem; color: var(--slate-500); margin-top: 0.1rem;">${escapeHtml(u.bio || 'Tidak ada deskripsi')}</div>
            </td>
            <td style="padding: 0.85rem 1rem;">
              <div style="font-family: var(--font-mono); color: var(--slate-800); font-weight: 500;">${escapeHtml(u.email || '-')}</div>
              <div style="font-size: 0.75rem; color: var(--slate-500); margin-top: 0.15rem;">${escapeHtml(u.phone_number || '-')}</div>
            </td>
            <td style="padding: 0.85rem 1rem; color: var(--slate-600); white-space: nowrap;">
              ${formatDate(u.created_at)}
            </td>
            <td style="padding: 0.85rem 1rem; text-align: center; white-space: nowrap;">
              ${statusBadge}
            </td>
            <td style="padding: 0.85rem 1rem; text-align: right;">
              ${actionButtons}
            </td>
          </tr>
        `;
      })
      .join('');

    // Attach Event Listeners on dynamic action buttons
    adminUsersTableBody.querySelectorAll('.btn-approve-user').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        if (confirm(`Setujui pendaftaran dan aktifkan akun "${name}"? Pengguna akan langsung dapat masuk ke aplikasi RAB.`)) {
          try {
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner" style="display:inline-block;"></span>';
            const res = await API.post(`/api/settings/admin/users/${id}/approve`);
            if (res.success) {
              showAdminAlert(`✓ Akun "${name}" berhasil disetujui & diaktifkan!`, 'success');
              loadAdminUsers();
            } else {
              showAdminAlert(res.message || 'Gagal menyetujui akun.', 'error');
            }
          } catch (e) {
            showAdminAlert('Terjadi kesalahan saat menyetujui akun.', 'error');
          }
        }
      });
    });

    adminUsersTableBody.querySelectorAll('.btn-reject-user').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        if (confirm(`Tolak / nonaktifkan akses untuk pengguna "${name}"?`)) {
          try {
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner" style="display:inline-block;"></span>';
            const res = await API.post(`/api/settings/admin/users/${id}/reject`);
            if (res.success) {
              showAdminAlert(`Akun "${name}" telah ditolak/dinonaktifkan.`, 'success');
              loadAdminUsers();
            } else {
              showAdminAlert(res.message || 'Gagal menolak akun.', 'error');
            }
          } catch (e) {
            showAdminAlert('Terjadi kesalahan saat menolak akun.', 'error');
          }
        }
      });
    });

    adminUsersTableBody.querySelectorAll('.btn-delete-user').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        if (confirm(`Hapus akun "${name}" secara permanen dari sistem?`)) {
          try {
            btn.disabled = true;
            const res = await API.delete(`/api/settings/admin/users/${id}`);
            if (res.success) {
              showAdminAlert(`Akun "${name}" telah dihapus.`, 'success');
              loadAdminUsers();
            } else {
              showAdminAlert(res.message || 'Gagal menghapus akun.', 'error');
            }
          } catch (e) {
            showAdminAlert('Terjadi kesalahan saat menghapus akun.', 'error');
          }
        }
      });
    });
  }

  function showAdminAlert(msg, type = 'success') {
    if (!adminUsersAlert) return;
    adminUsersAlert.textContent = msg;
    adminUsersAlert.className = `alert alert-${type}`;
    adminUsersAlert.style.display = 'block';
    setTimeout(() => {
      adminUsersAlert.style.display = 'none';
    }, 5000);
  }

  if (btnRefreshAdminUsers) {
    btnRefreshAdminUsers.addEventListener('click', loadAdminUsers);
  }
  if (searchAdminUsers) {
    searchAdminUsers.addEventListener('input', renderAdminUsersTable);
  }
  if (filterAdminUserStatus) {
    filterAdminUserStatus.addEventListener('change', renderAdminUsersTable);
  }

  // ==========================================================================
  // 10. LOGOUT
  // ==========================================================================

  btnLogout.addEventListener('click', async () => {
    if (confirm('Apakah Anda yakin ingin logout?')) {
      try {
        await API.post('/api/auth/logout');
      } catch (e) {
        // Ignore network errors on logout
      } finally {
        API.clearAuth();
        window.location.href = 'login.html';
      }
    }
  });

  // Init
  loadInitialData();
});
