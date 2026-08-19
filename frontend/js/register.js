document.addEventListener('DOMContentLoaded', () => {
  const formRegister = document.getElementById('formRegister');
  const btnRegister = document.getElementById('btnRegister');
  const alertBox = document.getElementById('alertBox');

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');

  const nameFeedback = document.getElementById('nameFeedback');
  const emailFeedback = document.getElementById('emailFeedback');
  const passwordFeedback = document.getElementById('passwordFeedback');
  const confirmPasswordFeedback = document.getElementById('confirmPasswordFeedback');

  const bar1 = document.getElementById('bar1');
  const bar2 = document.getElementById('bar2');
  const bar3 = document.getElementById('bar3');
  const bar4 = document.getElementById('bar4');
  const strengthText = document.getElementById('strengthText');

  function showAlert(message, type = 'error') {
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type}`;
    alertBox.style.display = 'block';
  }

  function hideAlert() {
    alertBox.style.display = 'none';
  }

  function setLoading(isLoading) {
    const textSpan = btnRegister.querySelector('.btn-text');
    const spinner = btnRegister.querySelector('.spinner');
    btnRegister.disabled = isLoading;

    if (isLoading) {
      if (textSpan) textSpan.textContent = 'Mendaftarkan...';
      if (spinner) spinner.style.display = 'inline-block';
    } else {
      if (textSpan) textSpan.textContent = 'Daftar Akun';
      if (spinner) spinner.style.display = 'none';
    }
  }

  // 1. Password Strength Evaluator
  function evaluatePasswordStrength(pwd) {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    // Reset bars
    [bar1, bar2, bar3, bar4].forEach((b) => {
      b.style.backgroundColor = 'var(--slate-200)';
    });

    if (pwd.length === 0) {
      strengthText.textContent = 'Kekuatan password: Belum diisi';
      strengthText.style.color = 'var(--slate-500)';
      return false;
    }

    if (pwd.length < 8) {
      bar1.style.backgroundColor = 'var(--rose-500)';
      strengthText.textContent = 'Kekuatan password: Terlalu pendek (min. 8 karakter)';
      strengthText.style.color = 'var(--rose-600)';
      return false;
    }

    if (score <= 2) {
      bar1.style.backgroundColor = 'var(--rose-500)';
      bar2.style.backgroundColor = 'var(--rose-500)';
      strengthText.textContent = 'Kekuatan password: Lemah (tambahkan huruf besar & angka)';
      strengthText.style.color = 'var(--rose-600)';
      return false;
    } else if (score === 3 || score === 4) {
      bar1.style.backgroundColor = 'var(--amber-500)';
      bar2.style.backgroundColor = 'var(--amber-500)';
      bar3.style.backgroundColor = 'var(--amber-500)';
      strengthText.textContent = 'Kekuatan password: Sedang / Cukup Kuat';
      strengthText.style.color = 'var(--amber-600)';
      return true;
    } else {
      bar1.style.backgroundColor = 'var(--emerald-500)';
      bar2.style.backgroundColor = 'var(--emerald-500)';
      bar3.style.backgroundColor = 'var(--emerald-500)';
      bar4.style.backgroundColor = 'var(--emerald-500)';
      strengthText.textContent = 'Kekuatan password: Sangat Kuat & Aman';
      strengthText.style.color = 'var(--emerald-600)';
      return true;
    }
  }

  // 2. Real-time Input Listeners
  passwordInput.addEventListener('input', () => {
    evaluatePasswordStrength(passwordInput.value);
    validateConfirmPassword();
  });

  confirmPasswordInput.addEventListener('input', () => {
    validateConfirmPassword();
  });

  function validateConfirmPassword() {
    const pwd = passwordInput.value;
    const confirm = confirmPasswordInput.value;

    if (!confirm) {
      confirmPasswordFeedback.className = 'input-feedback';
      confirmPasswordFeedback.textContent = '';
      confirmPasswordInput.classList.remove('is-invalid', 'is-valid');
      return false;
    }

    if (pwd !== confirm) {
      confirmPasswordFeedback.className = 'input-feedback show error';
      confirmPasswordFeedback.textContent = 'Konfirmasi password tidak cocok.';
      confirmPasswordInput.classList.add('is-invalid');
      confirmPasswordInput.classList.remove('is-valid');
      return false;
    } else {
      confirmPasswordFeedback.className = 'input-feedback show success';
      confirmPasswordFeedback.textContent = '✓ Password cocok.';
      confirmPasswordInput.classList.add('is-valid');
      confirmPasswordInput.classList.remove('is-invalid');
      return true;
    }
  }

  // 3. Form Submit
  formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Client-side validations
    if (!name || name.length < 2) {
      showAlert('Nama lengkap wajib diisi minimal 2 karakter.');
      nameInput.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showAlert('Masukkan format alamat email yang valid.');
      emailInput.focus();
      return;
    }

    if (!evaluatePasswordStrength(password)) {
      showAlert('Password harus minimal 8 karakter dan mengandung huruf besar, huruf kecil, serta angka.');
      passwordInput.focus();
      return;
    }

    if (password !== confirmPassword) {
      showAlert('Konfirmasi password tidak cocok.');
      confirmPasswordInput.focus();
      return;
    }

    setLoading(true);

    try {
      const res = await API.post('/api/auth/register', {
        name,
        email,
        password,
      });

      if (res.success) {
        showAlert(res.message || 'Pendaftaran berhasil! Akun Anda sedang menunggu persetujuan dari Administrator (irsyadisty).', 'success');
        formRegister.reset();

        setTimeout(() => {
          window.location.href = 'login.html?pending=true';
        }, 3000);
      } else {
        showAlert(res.message || 'Gagal melakukan registrasi.');
      }
    } catch (err) {
      showAlert('Terjadi kesalahan saat menghubungi server.');
    } finally {
      setLoading(false);
    }
  });
});
