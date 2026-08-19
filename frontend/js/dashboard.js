document.addEventListener('DOMContentLoaded', () => {
  let currentUser = null;

  // DOM Elements
  const navUserName = document.getElementById('navUserName');
  const profName = document.getElementById('profName');
  const profEmail = document.getElementById('profEmail');
  const profEmailStatus = document.getElementById('profEmailStatus');
  const profCreatedAt = document.getElementById('profCreatedAt');
  const twoFactorStatusBadge = document.getElementById('twoFactorStatusBadge');
  const btnToggle2FA = document.getElementById('btnToggle2FA');
  const sessionsTableBody = document.getElementById('sessionsTableBody');
  const btnRevokeOthers = document.getElementById('btnRevokeOthers');
  const btnLogout = document.getElementById('btnLogout');
  const globalAlert = document.getElementById('globalAlert');

  // Modal 2FA Setup
  const modalSetup2FA = document.getElementById('modalSetup2FA');
  const btnClose2FAModal = document.getElementById('btnClose2FAModal');
  const qrCodeImg = document.getElementById('qrCodeImg');
  const secretText = document.getElementById('secretText');
  const setupSecretKey = document.getElementById('setupSecretKey');
  const setupOtpCode = document.getElementById('setupOtpCode');
  const formVerifySetup2FA = document.getElementById('formVerifySetup2FA');
  const btnSubmitSetup2FA = document.getElementById('btnSubmitSetup2FA');
  const modal2FAAlert = document.getElementById('modal2FAAlert');

  // Modal 2FA Disable
  const modalDisable2FA = document.getElementById('modalDisable2FA');
  const btnCloseDisableModal = document.getElementById('btnCloseDisableModal');
  const btnCancelDisable = document.getElementById('btnCancelDisable');
  const formDisable2FA = document.getElementById('formDisable2FA');
  const disablePassword = document.getElementById('disablePassword');
  const btnConfirmDisable = document.getElementById('btnConfirmDisable');
  const modalDisableAlert = document.getElementById('modalDisableAlert');

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

  // 1. Load User Profile
  async function loadProfile() {
    try {
      const res = await API.get('/api/user/profile');
      if (res.success && res.data) {
        currentUser = res.data;
        renderProfile(currentUser);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  }

  function renderProfile(user) {
    navUserName.textContent = `Halo, ${user.name}`;
    profName.textContent = user.name;
    profEmail.textContent = user.email;
    profCreatedAt.textContent = formatDate(user.createdAt);

    if (user.emailVerified) {
      profEmailStatus.innerHTML = '<span class="badge badge-success">✓ Terverifikasi</span>';
    } else {
      profEmailStatus.innerHTML = '<span class="badge badge-secondary" style="background:#fee2e2; color:#b91c1c; border-color:#fecdd3;">Belum Diverifikasi</span>';
    }

    if (user.twoFactorEnabled) {
      twoFactorStatusBadge.innerHTML = '<span class="badge badge-success">✓ Aktif</span>';
      btnToggle2FA.textContent = 'Nonaktifkan 2FA';
      btnToggle2FA.className = 'btn btn-danger';
    } else {
      twoFactorStatusBadge.innerHTML = '<span class="badge badge-secondary">Nonaktif</span>';
      btnToggle2FA.textContent = 'Aktifkan 2FA';
      btnToggle2FA.className = 'btn btn-primary';
    }
  }

  // 2. Load Active Device Sessions
  async function loadSessions() {
    try {
      const res = await API.get('/api/user/sessions');
      if (res.success && Array.isArray(res.data)) {
        renderSessions(res.data);
      }
    } catch (err) {
      console.error('Error loading sessions:', err);
    }
  }

  function renderSessions(sessions) {
    if (sessions.length === 0) {
      sessionsTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--slate-400); padding: 1.5rem;">Tidak ada sesi aktif.</td>
        </tr>
      `;
      return;
    }

    sessionsTableBody.innerHTML = sessions.map((s) => {
      const isCurrent = s.isCurrent;
      return `
        <tr>
          <td>
            <div style="font-weight: 600; color: var(--slate-900); font-size: 0.875rem;">${escapeHtml(s.deviceInfo)}</div>
          </td>
          <td><code style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--slate-600);">${s.ipAddress}</code></td>
          <td style="color: var(--slate-600);">${formatDate(s.lastActiveAt)}</td>
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

    // Attach revoke buttons
    document.querySelectorAll('.btn-revoke-session').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const sessionId = btn.dataset.id;
        if (confirm('Apakah Anda yakin ingin mencabut sesi dari perangkat ini?')) {
          try {
            const res = await API.delete(`/api/user/sessions/${sessionId}`);
            if (res.success) {
              showGlobalAlert('Sesi perangkat berhasil dicabut.', 'success');
              loadSessions();
            } else {
              showGlobalAlert(res.message || 'Gagal mencabut sesi.', 'error');
            }
          } catch (err) {
            showGlobalAlert('Terjadi kesalahan jaringan.', 'error');
          }
        }
      });
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

  // 3. Toggle 2FA Handler
  btnToggle2FA.addEventListener('click', async () => {
    if (currentUser && currentUser.twoFactorEnabled) {
      // Buka modal nonaktifkan
      disablePassword.value = '';
      hideModalAlert(modalDisableAlert);
      modalDisable2FA.classList.add('active');
      disablePassword.focus();
    } else {
      // Buka modal setup 2FA
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
          showGlobalAlert(res.message || 'Gagal memulai konfigurasi 2FA.', 'error');
        }
      } catch (err) {
        showGlobalAlert('Terjadi kesalahan koneksi.', 'error');
      }
    }
  });

  // Close Modals
  btnClose2FAModal.addEventListener('click', () => modalSetup2FA.classList.remove('active'));
  btnCloseDisableModal.addEventListener('click', () => modalDisable2FA.classList.remove('active'));
  btnCancelDisable.addEventListener('click', () => modalDisable2FA.classList.remove('active'));

  // 4. Submit Setup 2FA Verification
  formVerifySetup2FA.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideModalAlert(modal2FAAlert);

    const secret = setupSecretKey.value;
    const otp = setupOtpCode.value.trim();

    if (!otp || otp.length !== 6) {
      showModalAlert(modal2FAAlert, 'Masukkan 6 digit angka OTP.');
      return;
    }

    btnSubmitSetup2FA.disabled = true;

    try {
      const res = await API.post('/api/auth/2fa/verify-setup', { secret, otp });
      if (res.success) {
        modalSetup2FA.classList.remove('active');
        showGlobalAlert('Autentikasi dua faktor (2FA) berhasil diaktifkan!', 'success');
        loadProfile();
      } else {
        showModalAlert(modal2FAAlert, res.message || 'Kode OTP salah.');
      }
    } catch (err) {
      showModalAlert(modal2FAAlert, 'Gagal memverifikasi OTP.');
    } finally {
      btnSubmitSetup2FA.disabled = false;
    }
  });

  // 5. Submit Disable 2FA
  formDisable2FA.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideModalAlert(modalDisableAlert);

    const password = disablePassword.value;
    if (!password) {
      showModalAlert(modalDisableAlert, 'Masukkan password akun Anda.');
      return;
    }

    btnConfirmDisable.disabled = true;

    try {
      const res = await API.post('/api/auth/2fa/disable', { password });
      if (res.success) {
        modalDisable2FA.classList.remove('active');
        showGlobalAlert('Autentikasi dua faktor (2FA) berhasil dinonaktifkan.', 'success');
        loadProfile();
      } else {
        showModalAlert(modalDisableAlert, res.message || 'Password salah.');
      }
    } catch (err) {
      showModalAlert(modalDisableAlert, 'Gagal menonaktifkan 2FA.');
    } finally {
      btnConfirmDisable.disabled = false;
    }
  });

  // 6. Revoke All Other Sessions
  btnRevokeOthers.addEventListener('click', async () => {
    if (confirm('Apakah Anda yakin ingin mencabut seluruh sesi login di perangkat lain?')) {
      try {
        const res = await API.post('/api/user/sessions/revoke-others');
        if (res.success) {
          showGlobalAlert(res.message || 'Sesi di perangkat lain berhasil dicabut.', 'success');
          loadSessions();
        } else {
          showGlobalAlert(res.message || 'Gagal mencabut sesi.', 'error');
        }
      } catch (err) {
        showGlobalAlert('Terjadi kesalahan jaringan.', 'error');
      }
    }
  });

  // 7. Logout
  btnLogout.addEventListener('click', async () => {
    if (confirm('Apakah Anda yakin ingin logout?')) {
      try {
        await API.post('/api/auth/logout');
      } catch (e) {
        // Abaikan error jaringan saat logout
      } finally {
        API.clearAuth();
        window.location.href = 'login.html';
      }
    }
  });

  // Initial Data Load
  loadProfile();
  loadSessions();
});
