const { Pool } = require('pg');
const env = require('./env');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

function getLocalData() {
  if (!fs.existsSync(localDbFile)) {
    // Seed initial structure with local_users.json if available
    const localUsersFile = path.resolve(__dirname, '../database/local_users.json');
    let users = [];
    if (fs.existsSync(localUsersFile)) {
      try {
        users = JSON.parse(fs.readFileSync(localUsersFile, 'utf8'));
      } catch (e) {}
    }
    const initial = {
      users,
      sessions: [],
      tokens: [],
      preferences: [],
    };
    try {
      fs.writeFileSync(localDbFile, JSON.stringify(initial, null, 2), 'utf8');
    } catch (e) {}
    return initial;
  }
  try {
    return JSON.parse(fs.readFileSync(localDbFile, 'utf8'));
  } catch (e) {
    return { users: [], sessions: [], tokens: [], preferences: [] };
  }
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

  // 1. SELECT * FROM users WHERE (LOWER(email) = $1 OR LOWER(name) = $1)
  if (lower.startsWith('select') && lower.includes('from users') && lower.includes('deleted_at is null')) {
    if (lower.includes('email = $1') || lower.includes('lower(name) = $1')) {
      const target = (params[0] || '').toLowerCase().trim();
      const user = data.users.find(
        (u) =>
          !u.deleted_at &&
          (u.email?.toLowerCase() === target || u.name?.toLowerCase() === target)
      );
      return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
    }
    if (lower.includes('id = $1') || lower.includes('id =')) {
      const id = params[0];
      const user = data.users.find((u) => !u.deleted_at && u.id === id);
      return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
    }
    // general list
    const activeUsers = data.users.filter((u) => !u.deleted_at);
    return { rows: activeUsers, rowCount: activeUsers.length };
  }

  // 2. INSERT INTO users
  if (lower.startsWith('insert into users')) {
    const isAdmin = (params[0] || '').toLowerCase() === 'irsyadisty' || (params[1] || '').toLowerCase() === 'irsyadisty@mirstyvanconstruction.com';
    const isApproved = params[3] !== undefined ? params[3] : isAdmin;
    const status = params[4] || (isAdmin ? 'APPROVED' : 'PENDING');
    const newUser = {
      id: crypto.randomUUID(),
      name: params[0],
      email: params[1],
      password_hash: params[2],
      phone_number: null,
      bio: null,
      avatar_url: null,
      pending_email: null,
      email_verified: isAdmin,
      is_approved: isApproved,
      status: status,
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
    const userIndex = data.users.findIndex((u) => (u.id === params[0] || u.id === params[params.length - 1]) && !u.deleted_at);
    if (userIndex >= 0) {
      if (lower.includes('is_approved =') || lower.includes('status =')) {
        data.users[userIndex].is_approved = params[1] !== undefined ? params[1] : params[0];
        data.users[userIndex].status = params[2] !== undefined ? params[2] : (params[0] === true ? 'APPROVED' : 'REJECTED');
        if (data.users[userIndex].is_approved) {
          data.users[userIndex].email_verified = true;
        }
      }
      if (lower.includes('password_hash = $1') || lower.includes('password_hash =')) {
        data.users[userIndex].password_hash = params[0];
      }
      if (lower.includes('bio =') || lower.includes('phone_number =')) {
        data.users[userIndex].name = params[0] || data.users[userIndex].name;
        data.users[userIndex].phone_number = params[1] || data.users[userIndex].phone_number;
        data.users[userIndex].bio = params[2] || data.users[userIndex].bio;
      }
      if (lower.includes('avatar_url =')) {
        data.users[userIndex].avatar_url = params[0];
      }
      if (lower.includes('two_factor_enabled = true') || lower.includes('two_factor_secret =')) {
        data.users[userIndex].two_factor_enabled = true;
        data.users[userIndex].two_factor_secret = params[0];
      }
      if (lower.includes('two_factor_enabled = false')) {
        data.users[userIndex].two_factor_enabled = false;
        data.users[userIndex].two_factor_secret = null;
      }
      if (lower.includes('deleted_at = current_timestamp')) {
        data.users[userIndex].deleted_at = new Date().toISOString();
      }
      data.users[userIndex].updated_at = new Date().toISOString();
      saveLocalData(data);
      return { rows: [data.users[userIndex]], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
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
