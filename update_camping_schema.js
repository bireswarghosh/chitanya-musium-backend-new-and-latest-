const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateSchema() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    // Check if status column exists
    const [columns] = await connection.execute("SHOW COLUMNS FROM campings LIKE 'status'");
    if (columns.length === 0) {
      await connection.execute("ALTER TABLE campings ADD COLUMN status VARCHAR(20) DEFAULT 'Active'");
      console.log("✅ Added 'status' column to campings table");
    } else {
      console.log("ℹ️ 'status' column already exists in campings table");
    }
  } catch (err) {
    console.error("Error updating schema:", err);
  } finally {
    await connection.end();
  }
}

updateSchema();
