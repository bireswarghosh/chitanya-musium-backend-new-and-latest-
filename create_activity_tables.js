const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  // Activity/Audit Log - tracks every action
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT DEFAULT NULL,
      username VARCHAR(100) DEFAULT 'Guest',
      action VARCHAR(50) NOT NULL,
      page VARCHAR(100) NOT NULL,
      details TEXT,
      ip_address VARCHAR(50),
      user_agent TEXT,
      city VARCHAR(100) DEFAULT '',
      region VARCHAR(100) DEFAULT '',
      country VARCHAR(50) DEFAULT '',
      latitude DECIMAL(10,7) DEFAULT NULL,
      longitude DECIMAL(10,7) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ activity_logs table created');

  // Visitor sessions - tracks page visits & time
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS visitor_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id VARCHAR(100) NOT NULL,
      user_id INT DEFAULT NULL,
      username VARCHAR(100) DEFAULT 'Guest',
      page VARCHAR(100) NOT NULL,
      time_spent INT DEFAULT 0,
      clicks INT DEFAULT 0,
      ip_address VARCHAR(50),
      city VARCHAR(100) DEFAULT '',
      country VARCHAR(50) DEFAULT '',
      device VARCHAR(50) DEFAULT '',
      browser VARCHAR(50) DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ visitor_sessions table created');

  await conn.end();
  console.log('Done!');
}

run().catch(err => console.error('❌', err.message));
