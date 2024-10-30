const { query } = require('../config/db');

exports.updatePassword = async (userId, hashedPassword) => {
  const sql = 'UPDATE users SET password = ? WHERE id = ?';
  await query(sql, [hashedPassword, userId]);
};