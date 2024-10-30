const { query } = require('../config/db');

exports.recordAttempt = async (email) => {
    const [existingRecord] = await query('SELECT * FROM attempts WHERE email = ?', [email]);

    if (existingRecord) {
        await query('UPDATE attempts SET attempts = attempts + 1, last_attempt = NOW() WHERE email = ?', [email]);
    } else {
        await query('INSERT INTO attempts (email, attempts, last_attempt) VALUES (?, 1, NOW())', [email]);
    }
};

exports.resetAttempts = async (email) => {
    await query('DELETE FROM attempts WHERE email = ?', [email]);
};

exports.getAttempts = async (email) => {
    const [attemptRecord] = await query('SELECT * FROM attempts WHERE email = ?', [email]);
    return attemptRecord;
};