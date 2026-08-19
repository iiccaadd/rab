/**
 * Auth Guard: Memproteksi portal & halaman aplikasi RAB
 */
(async function initAuthGuard() {
  const currentPath = window.location.pathname;
  const isAuthPage = currentPath.includes('login.html') ||
                     currentPath.includes('register.html') ||
                     currentPath.includes('forgot-password.html') ||
                     currentPath.includes('reset-password.html');

  const token = typeof API !== 'undefined' ? API.getAccessToken() : localStorage.getItem('access_token');

  // Helper untuk redirect ke login dengan query redirect target
  function redirectToLogin() {
    if (!isAuthPage && !currentPath.includes('verify-email.html')) {
      const target = window.location.pathname.split('/').pop() || 'index.html';
      const search = window.location.search || '';
      const redirectParam = target !== 'index.html' ? `?redirect=${encodeURIComponent(target + search)}` : '';
      window.location.href = `login.html${redirectParam}`;
    }
  }

  // Helper untuk redirect ke aplikasi utama jika sudah login
  function redirectToApp() {
    if (isAuthPage) {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get('redirect') || 'index.html';
      window.location.href = redirectUrl;
    }
  }

  if (!token) {
    // Coba refresh token secara background dari httpOnly cookie
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok && data.success && data.accessToken) {
        if (typeof API !== 'undefined') {
          API.setAccessToken(data.accessToken);
        } else {
          localStorage.setItem('access_token', data.accessToken);
        }
        if (data.user) {
          localStorage.setItem('user_info', JSON.stringify(data.user));
        }

        // Sudah terautentikasi: jika sedang di halaman login, langsung arahkan ke app RAB
        redirectToApp();
      } else {
        // Belum login: arahkan ke portal login
        redirectToLogin();
      }
    } catch (err) {
      redirectToLogin();
    }
  } else {
    // Token ada di client
    if (isAuthPage) {
      redirectToApp();
    }
  }
})();
