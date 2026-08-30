const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateExistingRows() {
  console.log("Connecting to Database:", process.env.DB_HOST);
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    const [result] = await connection.execute("UPDATE campings SET status = 'Active' WHERE status IS NULL OR status = ''");
    console.log(`✅ Updated ${result.affectedRows} existing rows to have status = 'Active'.`);
  } catch (err) {
    console.error("❌ DB Error:", err);
  } finally {
    await connection.end();
  }
}

updateExistingRows();
