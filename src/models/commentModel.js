const { query } = require('../config/db');

exports.createComment = async (userId, commentedUserId, comment) => {
    const sql = 'INSERT INTO comments (user_id, commented_user_id, comment) VALUES (?, ?, ?)';
    const result = await query(sql, [userId, commentedUserId, comment]);
    return result.insertId;
  };
  
exports.getCommentsByUserId = async (commentedUserId) => {
    const sql = `
      SELECT c.id, c.comment, c.created_at, u.name AS commenter_name, u.email AS commenter_email
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.commented_user_id = ?;
    `;
    const results = await query(sql, [commentedUserId]);
    return results;
};

exports.getCommentById = async (commentId) => {
    const sql = 'SELECT * FROM comments WHERE id = ?';
    const [result] = await query(sql, [commentId]);
    return result;
};

exports.updateComment = async (commentId, comment) => {
    const sql = 'UPDATE comments SET comment = ? WHERE id = ?';
    await query(sql, [comment, commentId]);
};

exports.deleteComment = async (commentId) => {
    const sql = 'DELETE FROM comments WHERE id = ?';
    await query(sql, [commentId]);
};