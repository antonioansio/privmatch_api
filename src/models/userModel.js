const { query } = require('../config/db');
const bcrypt = require('bcryptjs');

exports.createUser = async (name, email, password, gender, phone, age) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = 'INSERT INTO users (name, email, password, gender, phone, age) VALUES (?, ?, ?, ?, ?, ?)';
  const result = await query(sql, [name, email, hashedPassword, gender, phone, age]);
  return result.insertId;
};

exports.getUserByEmail = async (email) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  const result = await query(sql, [email]);
  return result[0];
};

exports.getUserById = async (userId) => {
  const sql = 'SELECT id, name, email, password, gender, phone, age, is_approved, created_at, updated_at FROM users WHERE id = ?';
  const results = await query(sql, [userId]);
  return results.length > 0 ? results[0] : null;
};

exports.getAllUsers = async () => {
  const sql = `
    SELECT u.id, u.name, u.email, u.created_at, u.updated_at,
           COUNT(DISTINCT f.follower_id) AS followers_count,
           COUNT(DISTINCT l.user_id) AS likes_count
    FROM users u
    LEFT JOIN follows f ON u.id = f.followed_id
    LEFT JOIN likes l ON u.id = l.liked_user_id
    GROUP BY u.id
  `;  
  const results = await query(sql);
  return results;
};

exports.followUser = async (followerId, followedId) => {
  const sql = 'INSERT INTO follows (follower_id, followed_id) VALUES (?, ?)';
  const result = await query(sql, [followerId, followedId]);
  return result.insertId;
};

exports.unfollowUser = async (followerId, followedId) => {
  const sql = 'DELETE FROM follows WHERE follower_id = ? AND followed_id = ?';
  await query(sql, [followerId, followedId]);
};

exports.likeUser = async (userId, likedUserId) => {
  const sql = 'INSERT INTO likes (user_id, liked_user_id) VALUES (?, ?)';
  const result = await query(sql, [userId, likedUserId]);
  return result.insertId;
};

exports.unlikeUser = async (userId, likedUserId) => {
  const sql = 'DELETE FROM likes WHERE user_id = ? AND liked_user_id = ?';
  await query(sql, [userId, likedUserId]);
};

exports.getUserFollowers = async (userId) => {
  const sql = `
    SELECT u.id, u.name, u.email, f.created_at AS follow_date
    FROM follows f
    JOIN users u ON f.follower_id = u.id
    WHERE f.followed_id = ?;
  `;
  const results = await query(sql, [userId]);
  return results;
};