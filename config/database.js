const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

// Log env status without exposing password
console.log('🔧 DB Config check:', {
  host: process.env.DB_HOST || 'MISSING',
  user: process.env.DB_USER || 'MISSING',
  database: process.env.DB_NAME || 'MISSING',
  hasPassword: !!process.env.DB_PASSWORD,
  port: process.env.PORT || 'MISSING'
});

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully!');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.error('❌ Full error:', JSON.stringify({ message: err.message, code: err.code, errno: err.errno, sqlMessage: err.sqlMessage, sqlState: err.sqlState, stack: err.stack }, null, 2));
  });

module.exports = pool;
