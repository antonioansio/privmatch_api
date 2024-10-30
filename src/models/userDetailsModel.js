const { query } = require('../config/db');

exports.getUserDetailsByUserId = async (userId) => {
  const sql = 'SELECT * FROM details WHERE user_id = ?';
  const results = await query(sql, [userId]);
  return results.length > 0 ? results[0] : null;
};

exports.createUserDetails = async (userId, userDetails) => {
  const columns = ['user_id', ...Object.keys(userDetails)];
  const placeholders = columns.map(() => '?').join(', ');
  const values = [userId, ...Object.values(userDetails)];

  const sql = `INSERT INTO details (${columns.join(', ')}) VALUES (${placeholders})`;

  const result = await query(sql, values);
  return result.insertId;
};

exports.updateUserDetails = async (userId, updateData) => {
  const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updateData);

  if (fields.length === 0) {
    throw new Error('No data to update');
  }

  const sql = `UPDATE details SET ${fields}, updated_at = NOW() WHERE user_id = ?`;

  const result = await query(sql, [...values, userId]);

  return result.affectedRows;
};