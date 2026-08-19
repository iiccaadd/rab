document.addEventListener('DOMContentLoaded', () => {
  const formResetPassword = document.getElementById('formResetPassword');
  const btnReset = document.getElementById('btnReset');
  const newPasswordInput = document.getElementById('newPassword');
  const confirmNewPasswordInput = document.getElementById('confirmNewPassword');
  const alertBox = document.getElementById('alertBox');

  // Ambil token dari query string ?token=xxx
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (!token) {
    showAlert('Token reset password tidak ditemukan di URL. Silakan minta tautan baru.', 'error');
    btnReset.disabled = true;
    newPasswordInput.disabled = true;
    confirmNewPasswordInput.disabled = true;
  }

  function showAlert(message, type = 'error') {
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type}`;
    alertBox.style.display = 'block';
  }

  function hideAlert() {
    alertBox.style.display = 'none';
  }

  function setLoading(isLoading) {
    const textSpan = btnReset.querySelector('.btn-text');
    const spinner = btnReset.querySelector('.spinner');
    btnReset.disabled = isLoading;

    if (isLoading) {
      if (textSpan) textSpan.textContent = 'Menyimpan...';
      if (spinner) spinner.style.display = 'inline-block';
    } else {
      if (textSpan) textSpan.textContent = 'Simpan Password Baru';
      if (spinner) spinner.style.display = 'none';
    }
  }

  formResetPassword.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();

    const newPassword = newPasswordInput.value;
    const confirmNewPassword = confirmNewPasswordInput.value;

    if (!token) {
      showAlert('Token reset password tidak valid.');
      return;
    }

    if (newPassword.length < 8) {
      showAlert('Password baru minimal 8 karakter.');
      newPasswordInput.focus();
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      showAlert('Password baru harus mengandung huruf besar, huruf kecil, dan angka.');
      newPasswordInput.focus();
      return;
    }

    if (newPassword !== confirmNewPassword) {
      showAlert('Konfirmasi password tidak cocok.');
      confirmNewPasswordInput.focus();
      return;
    }

    setLoading(true);

    try {
      const res = await API.post('/api/auth/reset-password', {
        token,
        newPassword,
      });

      if (res.success) {
        showAlert('Password berhasil diatur ulang! Mengalihkan ke login...', 'success');
        formResetPassword.reset();

        setTimeout(() => {
          window.location.href = 'login.html?reset=true';
        }, 1500);
      } else {
        showAlert(res.message || 'Gagal mereset password.');
      }
    } catch (err) {
      showAlert('Terjadi kesalahan koneksi saat mereset password.');
    } finally {
      setLoading(false);
    }
  });
});
