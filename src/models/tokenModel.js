const { query } = require('../config/db');

exports.saveToken = async (userId, token, expiresAt) => {
    const sql = 'INSERT INTO tokens (user_id, token, expires_at) VALUES (?, ?, ?)';
    await query(sql, [userId, token, expiresAt]);
};

exports.deleteToken = async (token) => {
    const sql = 'DELETE FROM tokens WHERE token = ?';
    await query(sql, [token]);
};

exports.deleteOldestTokenIfLimitExceeded = async (userId, limit) => {
    const sqlCount = 'SELECT COUNT(*) AS tokenCount FROM tokens WHERE user_id = ?';
    const [result] = await query(sqlCount, [userId]);
  
    const tokenCount = result.tokenCount;
  
    if (tokenCount >= limit) {
      const sqlDelete = 'DELETE FROM tokens WHERE user_id = ? ORDER BY expires_at ASC LIMIT 1';
      await query(sqlDelete, [userId]);
    }
};

exports.getToken = async (token) => {
    const sql = 'SELECT token FROM tokens WHERE token = ?';
    const result = await query(sql, [token]);
    return result.length > 0;
};