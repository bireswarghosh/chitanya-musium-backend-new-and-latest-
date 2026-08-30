const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      fullname VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(255) DEFAULT '',
      address TEXT DEFAULT '',
      booking_date DATE NOT NULL,
      booking_time VARCHAR(50) DEFAULT '',
      hours INT DEFAULT 3,
      extra_hours INT DEFAULT 0,
      service_charge INT DEFAULT 1000,
      booking_charge INT DEFAULT 3000,
      extra_charge INT DEFAULT 0,
      total_amt INT NOT NULL,
      payment VARCHAR(10) DEFAULT '0',
      txn_id VARCHAR(255) DEFAULT '',
      created_at DATE,
      created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ bookings table created');
  await conn.end();
}

run().catch(err => console.error('❌', err.message));
