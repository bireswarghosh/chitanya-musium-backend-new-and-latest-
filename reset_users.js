const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  // Delete all existing users
  await conn.execute('DELETE FROM ci_users');
  console.log('🗑️ All old users deleted');

  const password = await bcrypt.hash('123456', 10);

  // Create Super Admin
  await conn.execute(
    `INSERT INTO ci_users (username, firstname, lastname, email, mobile_no, password, admin_role_id, is_admin, is_supper, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    ['superadmin', 'Super', 'Admin', 'superadmin@museum.com', '9999999999', password, 1, 1, 1, 1]
  );
  console.log('✅ Super Admin created: username=superadmin, password=123456');

  // Create Admin
  await conn.execute(
    `INSERT INTO ci_users (username, firstname, lastname, email, mobile_no, password, admin_role_id, is_admin, is_supper, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    ['admin', 'Admin', 'User', 'admin@museum.com', '8888888888', password, 2, 1, 0, 1]
  );
  console.log('✅ Admin created: username=admin, password=123456');

  // Create User
  await conn.execute(
    `INSERT INTO ci_users (username, firstname, lastname, email, mobile_no, password, admin_role_id, is_admin, is_supper, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    ['user', 'Normal', 'User', 'user@museum.com', '7777777777', password, 5, 0, 0, 1]
  );
  console.log('✅ User created: username=user, password=123456');

  await conn.end();
  console.log('\n🎉 Done! All accounts ready.');
}

run().catch(err => console.error('❌', err.message));
