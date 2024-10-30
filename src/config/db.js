const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const checkConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL connection successfully established.');
    connection.release();
  } catch (error) {
    console.error('Error connecting to MySQL:', error.message);
  }
};

checkConnection();

const query = async (sql, params) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Error executing query:', error.message);
    throw error;
  }
};

module.exports = { query };
