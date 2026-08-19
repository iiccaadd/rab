const db = require('../config/db');

const preferenceModel = {
  /**
   * Dapatkan preferensi notifikasi & tema user (atau buat default jika belum ada)
   */
  async getByUserId(userId) {
    const query = `
      SELECT email_notifications, push_notifications, theme, updated_at
      FROM user_preferences
      WHERE user_id = $1
      LIMIT 1
    `;
    const result = await db.query(query, [userId]);

    if (result.rows[0]) {
      return result.rows[0];
    }

    // Buat record default jika belum ada
    const insertQuery = `
      INSERT INTO user_preferences (user_id, email_notifications, push_notifications, theme)
      VALUES ($1, TRUE, TRUE, 'light')
      RETURNING email_notifications, push_notifications, theme, updated_at
    `;
    const insertResult = await db.query(insertQuery, [userId]);
    return insertResult.rows[0];
  },

  /**
   * Update preferensi user
   */
  async update(userId, { emailNotifications, pushNotifications, theme }) {
    const query = `
      INSERT INTO user_preferences (user_id, email_notifications, push_notifications, theme, updated_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id)
      DO UPDATE SET
        email_notifications = COALESCE(EXCLUDED.email_notifications, user_preferences.email_notifications),
        push_notifications = COALESCE(EXCLUDED.push_notifications, user_preferences.push_notifications),
        theme = COALESCE(EXCLUDED.theme, user_preferences.theme),
        updated_at = CURRENT_TIMESTAMP
      RETURNING email_notifications, push_notifications, theme, updated_at
    `;
    const result = await db.query(query, [
      userId,
      emailNotifications !== undefined ? emailNotifications : true,
      pushNotifications !== undefined ? pushNotifications : true,
      theme || 'light',
    ]);
    return result.rows[0];
  },
};

module.exports = preferenceModel;
