document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.getElementById('formLogin');
  const form2FA = document.getElementById('form2FA');
  const btnLogin = document.getElementById('btnLogin');
  const btnVerify2FA = document.getElementById('btnVerify2FA');
  const btnBackToLogin = document.getElementById('btnBackToLogin');
  const alertBox = document.getElementById('alertBox');
  const pageTitle = document.getElementById('pageTitle');
  const pageSubtitle = document.getElementById('pageSubtitle');
  const authFooter = document.getElementById('authFooter');
  const tempTokenInput = document.getElementById('tempToken');
  const otpCodeInput = document.getElementById('otpCode');

  // Cek jika ada notifikasi dari query parameter (misal: verifikasi berhasil atau session expired)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('pending') === 'true') {
    showAlert('Pendaftaran berhasil! Akun Anda sedang menunggu persetujuan dari Administrator (irsyadisty). Mohon tunggu hingga akun diaktifkan oleh admin.', 'warning');
  } else if (urlParams.get('registered') === 'true') {
    showAlert('Registrasi berhasil! Silakan periksa email untuk verifikasi atau masuk langsung.', 'success');
  } else if (urlParams.get('verified') === 'true') {
    showAlert('Alamat email berhasil diverifikasi! Silakan masuk.', 'success');
  } else if (urlParams.get('reset') === 'true') {
    showAlert('Password berhasil diubah. Silakan masuk dengan password baru Anda.', 'success');
  } else if (urlParams.get('session_expired') === 'true') {
    showAlert('Sesi Anda telah berakhir. Silakan masuk kembali.', 'warning');
  }

  function showAlert(message, type = 'error') {
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type}`;
    alertBox.style.display = 'block';
  }

  function hideAlert() {
    alertBox.style.display = 'none';
  }

  function setLoading(button, isLoading, originalText = 'Masuk') {
    const textSpan = button.querySelector('.btn-text');
    const spinner = button.querySelector('.spinner');
    button.disabled = isLoading;

    if (isLoading) {
      if (textSpan) textSpan.textContent = 'Memproses...';
      if (spinner) spinner.style.display = 'inline-block';
    } else {
      if (textSpan) textSpan.textContent = originalText;
      if (spinner) spinner.style.display = 'none';
    }
  }

  // 1. Submit Form Login Utama
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      showAlert('Email dan password wajib diisi.');
      return;
    }

    setLoading(btnLogin, true, 'Masuk');

    try {
      const res = await API.post('/api/auth/login', { email, password });

      if (res.success) {
        // Cek jika membutuhkan 2FA
        if (res.require2FA && res.tempToken) {
          tempTokenInput.value = res.tempToken;

          // Beralih ke Step 2FA
          formLogin.style.display = 'none';
          form2FA.style.display = 'block';
          authFooter.style.display = 'none';
          pageTitle.textContent = 'Autentikasi 2FA';
          pageSubtitle.textContent = 'Verifikasi kode keamanan tambahan akun Anda';
          otpCodeInput.value = '';
          otpCodeInput.focus();

          showAlert(res.message || 'Masukkan kode OTP 2FA Anda.', 'warning');
        } else {
          // Login berhasil tanpa 2FA
          API.setAccessToken(res.accessToken);
          if (res.user) {
            localStorage.setItem('user_info', JSON.stringify(res.user));
          }

          const redirectUrl = urlParams.get('redirect') || 'index.html';
          showAlert('Login berhasil! Mengalihkan ke aplikasi RAB...', 'success');
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 800);
        }
      } else {
        showAlert(res.message || 'Email atau password salah.');
      }
    } catch (err) {
      showAlert('Terjadi kesalahan koneksi server.');
    } finally {
      setLoading(btnLogin, false, 'Masuk');
    }
  });

  // 2. Submit Form 2FA OTP
  form2FA.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();

    const tempToken = tempTokenInput.value;
    const otp = otpCodeInput.value.trim();

    if (!otp || otp.length !== 6) {
      showAlert('Masukkan 6-digit kode OTP angka yang valid.');
      return;
    }

    setLoading(btnVerify2FA, true, 'Verifikasi Kode 2FA');

    try {
      const res = await API.post('/api/auth/2fa/verify-login', { tempToken, otp });

      if (res.success && res.accessToken) {
        API.setAccessToken(res.accessToken);
        if (res.user) {
          localStorage.setItem('user_info', JSON.stringify(res.user));
        }

        const redirectUrl = urlParams.get('redirect') || 'index.html';
        showAlert('Verifikasi 2FA berhasil! Mengalihkan ke aplikasi RAB...', 'success');
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 800);
      } else {
        showAlert(res.message || 'Kode OTP salah atau telah kedaluwarsa.');
      }
    } catch (err) {
      showAlert('Terjadi kesalahan saat memverifikasi 2FA.');
    } finally {
      setLoading(btnVerify2FA, false, 'Verifikasi Kode 2FA');
    }
  });

  // 3. Tombol Kembali dari 2FA ke Form Login
  btnBackToLogin.addEventListener('click', () => {
    form2FA.style.display = 'none';
    formLogin.style.display = 'block';
    authFooter.style.display = 'block';
    pageTitle.textContent = 'Selamat Datang';
    pageSubtitle.textContent = 'Masukkan kredensial akun Anda untuk masuk';
    hideAlert();
  });
});
