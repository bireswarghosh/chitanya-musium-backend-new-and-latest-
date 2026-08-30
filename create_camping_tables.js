const mysql = require('mysql2/promise');
require('dotenv').config();

async function createTables() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS campings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      camping_name VARCHAR(255) NOT NULL,
      location VARCHAR(255) DEFAULT '',
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      organizer_name VARCHAR(255) NOT NULL,
      contact_details VARCHAR(255) NOT NULL,
      participants_count INT DEFAULT 0,
      remarks TEXT,
      doctors TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ campings table created');

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS camping_leads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      camping_id INT NOT NULL,
      patient_name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) DEFAULT '',
      email VARCHAR(255) DEFAULT '',
      age VARCHAR(10) DEFAULT '',
      interest VARCHAR(255) DEFAULT '',
      source VARCHAR(255) DEFAULT '',
      date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (camping_id) REFERENCES campings(id)
    )
  `);
  console.log('✅ camping_leads table created');

  await connection.end();
  console.log('Done!');
}

createTables().catch(err => console.error('❌ Error:', err.message));
