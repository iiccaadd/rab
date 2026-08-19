/**
 * Centralized API Fetch Wrapper with Automatic JWT Token Injection & Refresh Rotation
 */
const API = (() => {
  const BASE_URL = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
    ? '' // Same origin
    : '';

  let accessToken = localStorage.getItem('access_token') || null;
  let isRefreshing = false;
  let refreshSubscribers = [];

  function setAccessToken(token) {
    accessToken = token;
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  }

  function getAccessToken() {
    return accessToken || localStorage.getItem('access_token');
  }

  function clearAuth() {
    accessToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
  }

  function onRefreshed(newAccessToken) {
    refreshSubscribers.forEach((callback) => callback(newAccessToken));
    refreshSubscribers = [];
  }

  function addRefreshSubscriber(callback) {
    refreshSubscribers.push(callback);
  }

  /**
   * Main request method
   */
  async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest', // Anti-CSRF Header
      ...(options.headers || {}),
    };

    const token = getAccessToken();
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
      credentials: 'include', // Wajib untuk kirim/terima httpOnly cookie refresh token
    };

    try {
      let response = await fetch(url, config);

      // Handle 401 Token Expired -> Coba auto-refresh token
      if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
              },
              credentials: 'include',
            });

            const refreshData = await refreshRes.json();

            if (refreshRes.ok && refreshData.success && refreshData.accessToken) {
              setAccessToken(refreshData.accessToken);
              if (refreshData.user) {
                localStorage.setItem('user_info', JSON.stringify(refreshData.user));
              }
              isRefreshing = false;
              onRefreshed(refreshData.accessToken);
            } else {
              isRefreshing = false;
              clearAuth();
              if (typeof window._showAuthOverlay === 'function') {
                window._showAuthOverlay('Sesi Anda telah berakhir. Silakan login kembali.');
              } else if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html') && !window.location.pathname.includes('index.html')) {
                window.location.href = 'index.html?session_expired=true';
              }
              return refreshData;
            }
          } catch (err) {
            isRefreshing = false;
            clearAuth();
            return { success: false, message: 'Gagal memperbarui sesi.' };
          }
        }

        // Tunggu refresh token selesai lalu ulangi request asli
        const retryPromise = new Promise((resolve) => {
          addRefreshSubscriber(async (newToken) => {
            headers['Authorization'] = `Bearer ${newToken}`;
            const retryRes = await fetch(url, { ...config, headers });
            const retryData = await retryRes.json();
            resolve({ ...retryData, _status: retryRes.status, _ok: retryRes.ok });
          });
        });

        return await retryPromise;
      }

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { success: response.ok, message: await response.text() };
      }

      data._status = response.status;
      data._ok = response.ok;
      return data;
    } catch (error) {
      console.error('Fetch error on API request:', error);
      return {
        success: false,
        message: 'Gagal terhubung ke server. Periksa koneksi jaringan Anda.',
        _ok: false,
      };
    }
  }

  /**
   * Method upload file FormData (multipart/form-data)
   */
  async function upload(endpoint, formData) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      'X-Requested-With': 'XMLHttpRequest',
    };
    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include',
      });
      const data = await response.json();
      data._status = response.status;
      data._ok = response.ok;
      return data;
    } catch (error) {
      console.error('Upload error:', error);
      return { success: false, message: 'Gagal mengunggah file ke server.' };
    }
  }

  /**
   * Method logout
   */
  async function logout() {
    try {
      await fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...(getAccessToken() ? { Authorization: `Bearer ${getAccessToken()}` } : {}),
        },
        credentials: 'include',
      });
    } catch (e) {
      console.warn('Logout network error:', e);
    }
    clearAuth();
    window.location.href = 'login.html';
  }

  function getUser() {
    try {
      const userStr = localStorage.getItem('user_info');
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  }

  return {
    get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint, body, options) => request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
    upload: (endpoint, formData) => upload(endpoint, formData),
    logout,
    getUser,
    setAccessToken,
    getAccessToken,
    clearAuth,
  };
})();
