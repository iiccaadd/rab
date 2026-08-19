document.addEventListener('DOMContentLoaded', () => {
  const formForgotPassword = document.getElementById('formForgotPassword');
  const btnForgot = document.getElementById('btnForgot');
  const emailInput = document.getElementById('email');
  const alertBox = document.getElementById('alertBox');

  function showAlert(message, type = 'error') {
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type}`;
    alertBox.style.display = 'block';
  }

  function hideAlert() {
    alertBox.style.display = 'none';
  }

  function setLoading(isLoading) {
    const textSpan = btnForgot.querySelector('.btn-text');
    const spinner = btnForgot.querySelector('.spinner');
    btnForgot.disabled = isLoading;

    if (isLoading) {
      if (textSpan) textSpan.textContent = 'Mengirimkan...';
      if (spinner) spinner.style.display = 'inline-block';
    } else {
      if (textSpan) textSpan.textContent = 'Kirim Tautan Reset Password';
      if (spinner) spinner.style.display = 'none';
    }
  }

  formForgotPassword.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();

    const email = emailInput.value.trim();
    if (!email) {
      showAlert('Alamat email wajib diisi.');
      return;
    }

    setLoading(true);

    try {
      const res = await API.post('/api/auth/forgot-password', { email });

      if (res.success) {
        showAlert(res.message || 'Tautan pemulihan telah dikirimkan ke email Anda.', 'success');
        formForgotPassword.reset();
      } else {
        showAlert(res.message || 'Gagal memproses permintaan lupa password.');
      }
    } catch (err) {
      showAlert('Terjadi kesalahan saat menghubungi server.');
    } finally {
      setLoading(false);
    }
  });
});
