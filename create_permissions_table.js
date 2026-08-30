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
    CREATE TABLE IF NOT EXISTS role_permissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      role_id INT NOT NULL,
      page_key VARCHAR(100) NOT NULL,
      can_view TINYINT DEFAULT 0,
      can_add TINYINT DEFAULT 0,
      can_edit TINYINT DEFAULT 0,
      can_delete TINYINT DEFAULT 0,
      can_download TINYINT DEFAULT 0,
      can_print TINYINT DEFAULT 0,
      is_public TINYINT DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY unique_role_page (role_id, page_key)
    )
  `);
  console.log('✅ role_permissions table created');
  await conn.end();
}

run().catch(err => console.error('❌', err.message));
