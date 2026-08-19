const { Pool } = require('pg');
const env = require('./env');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const poolConfig = env.DB.connectionString
  ? {
      connectionString: env.DB.connectionString,
      ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }
  : {
      host: env.DB.host,
      port: env.DB.port,
      database: env.DB.database,
      user: env.DB.user,
      password: env.DB.password,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 3000,
    };

const pool = new Pool(poolConfig);
let isPgAvailable = null;

pool.on('error', () => {
  isPgAvailable = false;
});

// Fallback Local Storage Helper
const localDbFile = process.env.VERCEL
  ? path.join('/tmp', 'local_db.json')
  : path.resolve(__dirname, '../database/local_db.json');

// Generate static / verified hash for default admin: irsyadisty / 11nov2026
const ADMIN_NAME = 'irsyadisty';
const ADMIN_EMAIL = 'irsyadisty@mirstyvanconstruction.com';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('11nov2026', 10);

function getDefaultAdmin() {
  return {
    id: '00000000-0000-0000-0000-000000000001',
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password_hash: ADMIN_PASSWORD_HASH,
    phone_number: '081234567890',
    bio: 'Administrator Utama Mirstyvan Construction',
    avatar_url: null,
    pending_email: null,
    email_verified: true,
    is_approved: true,
    status: 'APPROVED',
    role: 'admin',
    two_factor_enabled: false,
    two_factor_secret: null,
    deleted_at: null,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  };
}

function getLocalData() {
  let data = null;
  if (fs.existsSync(localDbFile)) {
    try {
      data = JSON.parse(fs.readFileSync(localDbFile, 'utf8'));
    } catch (e) {
      data = null;
    }
  }

  if (!data || !Array.isArray(data.users)) {
    data = {
      users: [getDefaultAdmin()],
      sessions: [],
      tokens: [],
      preferences: [],
    };
    try {
      fs.writeFileSync(localDbFile, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {}
    return data;
  }

  // Ensure admin irsyadisty exists and has valid password_hash
  const adminIdx = data.users.findIndex(
    (u) =>
      !u.deleted_at &&
      (u.name?.toLowerCase() === ADMIN_NAME.toLowerCase() ||
        u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
        u.email?.toLowerCase() === 'admin@mirstyvanconstruction.com')
  );

  if (adminIdx < 0) {
    data.users.unshift(getDefaultAdmin());
    saveLocalData(data);
  } else {
    // Verify password hash is valid bcrypt hash for 11nov2026 if corrupted
    const currentAdmin = data.users[adminIdx];
    const isPwValid = bcrypt.compareSync('11nov2026', currentAdmin.password_hash || '');
    if (!isPwValid) {
      currentAdmin.password_hash = ADMIN_PASSWORD_HASH;
      currentAdmin.is_approved = true;
      currentAdmin.status = 'APPROVED';
      currentAdmin.email_verified = true;
      saveLocalData(data);
    }
  }

  // Remove duplicate entries of irsyadisty if any
  const uniqueUsers = [];
  const seen = new Set();
  for (const u of data.users) {
    const key = (u.name || '').toLowerCase() + '|' + (u.email || '').toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueUsers.push(u);
    }
  }
  data.users = uniqueUsers;

  return data;
}

function saveLocalData(data) {
  try {
    fs.writeFileSync(localDbFile, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {}
}

/**
 * Emulasi eksekusi query untuk fallback storage
 */
function executeLocalQuery(text, params = []) {
  const sql = text.trim();
  const lower = sql.toLowerCase();
  const data = getLocalData();

  // 1. SELECT * FROM users
  if (lower.startsWith('select') && lower.includes('from users')) {
    if (lower.includes('deleted_at is null')) {
      if (lower.includes('email = $1') || lower.includes('lower(name) = $1')) {
        const target = (params[0] || '').toLowerCase().trim();
        const user = data.users.find(
          (u) =>
            !u.deleted_at &&
            (u.email?.toLowerCase() === target ||
              u.name?.toLowerCase() === target ||
              (target === 'admin@mirstyvanconstruction.com' && u.name?.toLowerCase() === ADMIN_NAME) ||
              (target === ADMIN_NAME && u.email?.toLowerCase() === ADMIN_EMAIL))
        );
        return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
      }

      if (lower.includes('id = $1') || lower.includes('id =')) {
        const id = params[0];
        const user = data.users.find((u) => !u.deleted_at && u.id === id);
        return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
      }

      // General user list (Admin users list)
      const activeUsers = data.users.filter((u) => !u.deleted_at);
      return { rows: activeUsers, rowCount: activeUsers.length };
    }

    // Include deleted / check query
    if (lower.includes('id from users') && params.length >= 2) {
      const emailTarget = (params[0] || '').toLowerCase().trim();
      const nameTarget = (params[1] || '').toLowerCase().trim();
      const user = data.users.find(
        (u) =>
          u.email?.toLowerCase() === emailTarget ||
          u.name?.toLowerCase() === nameTarget
      );
      return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
    }
  }

  // 2. INSERT INTO users (Auto Approve Aktif)
  if (lower.startsWith('insert into users')) {
    const isApproved = true; // Auto Approve
    const status = 'APPROVED';
    const newUser = {
      id: crypto.randomUUID(),
      name: params[0],
      email: params[1],
      password_hash: params[2],
      phone_number: null,
      bio: null,
      avatar_url: null,
      pending_email: null,
      email_verified: true,
      is_approved: isApproved,
      status: status,
      role: 'user',
      two_factor_enabled: false,
      two_factor_secret: null,
      deleted_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    data.users.push(newUser);
    saveLocalData(data);
    return { rows: [newUser], rowCount: 1 };
  }

  // 3. UPDATE users
  if (lower.startsWith('update users')) {
    const userId = params[0];
    const userIndex = data.users.findIndex((u) => u.id === userId && !u.deleted_at);

    if (userIndex >= 0) {
      const user = data.users[userIndex];

      // a. Admin approval / rejection: UPDATE users SET is_approved = $2, status = $3 WHERE id = $1
      if (lower.includes('is_approved = $2') || lower.includes('status = $3')) {
        user.is_approved = params[1] !== undefined ? params[1] : true;
        user.status = params[2] || (user.is_approved ? 'APPROVED' : 'REJECTED');
        if (user.is_approved) {
          user.email_verified = true;
        }
      }

      // b. Update profile: UPDATE users SET name = COALESCE($2, name), phone_number = $3, bio = $4 WHERE id = $1
      if (lower.includes('name = coalesce($2') || lower.includes('bio = $4') || lower.includes('phone_number = $3')) {
        if (params[1]) user.name = params[1];
        user.phone_number = params[2] !== undefined ? params[2] : user.phone_number;
        user.bio = params[3] !== undefined ? params[3] : user.bio;
      }

      // c. Update avatar: UPDATE users SET avatar_url = $2 WHERE id = $1
      if (lower.includes('avatar_url = $2')) {
        user.avatar_url = params[1];
      }

      // d. Update password: UPDATE users SET password_hash = $2 WHERE id = $1
      if (lower.includes('password_hash = $2') || lower.includes('password_hash =')) {
        user.password_hash = params[1] || params[0];
      }

      // e. Pending email change: UPDATE users SET pending_email = $2 WHERE id = $1
      if (lower.includes('pending_email = $2')) {
        user.pending_email = params[1];
      }

      // f. Commit email change: UPDATE users SET email = $2, pending_email = NULL, email_verified = TRUE WHERE id = $1
      if (lower.includes('email = $2') && lower.includes('pending_email = null')) {
        user.email = params[1];
        user.pending_email = null;
        user.email_verified = true;
      }

      // g. Enable 2FA: UPDATE users SET two_factor_enabled = TRUE, two_factor_secret = $2 WHERE id = $1
      if (lower.includes('two_factor_enabled = true') && lower.includes('two_factor_secret = $2')) {
        user.two_factor_enabled = true;
        user.two_factor_secret = params[1];
      }

      // h. Disable 2FA: UPDATE users SET two_factor_enabled = FALSE, two_factor_secret = NULL WHERE id = $1
      if (lower.includes('two_factor_enabled = false') && lower.includes('two_factor_secret = null')) {
        user.two_factor_enabled = false;
        user.two_factor_secret = null;
      }

      // i. Soft delete: UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1
      if (lower.includes('deleted_at = current_timestamp')) {
        user.deleted_at = new Date().toISOString();
      }

      user.updated_at = new Date().toISOString();
      saveLocalData(data);
      return { rows: [user], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // DELETE users (Admin hard delete)
  if (lower.startsWith('delete from users')) {
    const userId = params[0];
    data.users = data.users.filter((u) => u.id !== userId);
    saveLocalData(data);
    return { rows: [], rowCount: 1 };
  }

  // 4. SESSIONS (Multi-device)
  if (lower.startsWith('insert into sessions')) {
    const newSession = {
      id: crypto.randomUUID(),
      user_id: params[0],
      refresh_token_hash: params[1],
      device_info: params[2] || 'Desktop / Browser',
      ip_address: params[3] || '127.0.0.1',
      expires_at: params[4] || new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      last_active_at: new Date().toISOString(),
    };
    data.sessions.push(newSession);
    saveLocalData(data);
    return { rows: [newSession], rowCount: 1 };
  }

  if (lower.startsWith('select') && lower.includes('from sessions')) {
    if (lower.includes('refresh_token_hash = $1')) {
      const hash = params[0];
      const session = data.sessions.find((s) => s.refresh_token_hash === hash);
      return { rows: session ? [session] : [], rowCount: session ? 1 : 0 };
    }
    if (lower.includes('user_id = $1')) {
      const uid = params[0];
      const userSessions = data.sessions.filter((s) => s.user_id === uid);
      return { rows: userSessions, rowCount: userSessions.length };
    }
  }

  if (lower.startsWith('delete from sessions')) {
    if (lower.includes('user_id = $1') && lower.includes('refresh_token_hash != $2')) {
      const uid = params[0];
      const curHash = params[1];
      data.sessions = data.sessions.filter((s) => s.user_id === uid && s.refresh_token_hash === curHash);
      saveLocalData(data);
      return { rows: [], rowCount: 1 };
    }
    if (lower.includes('user_id = $1')) {
      const uid = params[0];
      const before = data.sessions.length;
      data.sessions = data.sessions.filter((s) => s.user_id !== uid);
      saveLocalData(data);
      return { rows: [], rowCount: before - data.sessions.length };
    }
    if (lower.includes('id = $1')) {
      const sid = params[0];
      data.sessions = data.sessions.filter((s) => s.id !== sid);
      saveLocalData(data);
      return { rows: [], rowCount: 1 };
    }
  }

  // 5. USER PREFERENCES
  if (lower.includes('user_preferences')) {
    if (lower.startsWith('select')) {
      const uid = params[0];
      const pref = data.preferences.find((p) => p.user_id === uid) || {
        user_id: uid,
        email_notifications: true,
        push_notifications: true,
        theme: 'light',
      };
      return { rows: [pref], rowCount: 1 };
    }
    if (lower.startsWith('insert') || lower.startsWith('update')) {
      const uid = params[0];
      const existing = data.preferences.find((p) => p.user_id === uid);
      if (existing) {
        existing.email_notifications = params[1] !== undefined ? params[1] : existing.email_notifications;
        existing.push_notifications = params[2] !== undefined ? params[2] : existing.push_notifications;
        existing.theme = params[3] || existing.theme;
      } else {
        data.preferences.push({
          id: crypto.randomUUID(),
          user_id: uid,
          email_notifications: params[1] !== undefined ? params[1] : true,
          push_notifications: params[2] !== undefined ? params[2] : true,
          theme: params[3] || 'light',
        });
      }
      saveLocalData(data);
      return { rows: [existing || data.preferences[data.preferences.length - 1]], rowCount: 1 };
    }
  }

  // 6. TOKENS
  if (lower.includes('tokens')) {
    return { rows: [], rowCount: 0 };
  }

  return { rows: [], rowCount: 0 };
}

module.exports = {
  query: async (text, params) => {
    if (isPgAvailable === false) {
      return executeLocalQuery(text, params);
    }
    try {
      const res = await pool.query(text, params);
      isPgAvailable = true;
      return res;
    } catch (err) {
      if (err.code === 'ECONNREFUSED' || err.message.includes('connect') || err.message.includes('timeout')) {
        isPgAvailable = false;
        return executeLocalQuery(text, params);
      }
      // If table doesn't exist yet, fallback
      if (err.code === '42P01') {
        return executeLocalQuery(text, params);
      }
      throw err;
    }
  },
  getClient: () => pool.connect(),
  pool,
};
