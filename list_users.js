const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const [users] = await conn.execute(
    `SELECT u.user_id, u.username, u.firstname, u.lastname, u.email, u.mobile_no, u.is_active, u.admin_role_id, u.is_supper, u.is_admin, r.admin_role_title
     FROM ci_users u 
     LEFT JOIN ci_admin_roles r ON u.admin_role_id = r.admin_role_id 
     ORDER BY u.user_id`
  );

  console.log('\n===== ALL USERS =====\n');
  users.forEach(u => {
    console.log(`ID: ${u.user_id} | Username: ${u.username} | Name: ${u.firstname} ${u.lastname} | Role: ${u.admin_role_title || 'N/A'} (ID:${u.admin_role_id}) | Active: ${u.is_active} | Super: ${u.is_supper}`);
  });

  const [roles] = await conn.execute('SELECT * FROM ci_admin_roles ORDER BY admin_role_id');
  console.log('\n===== ALL ROLES =====\n');
  roles.forEach(r => {
    console.log(`Role ID: ${r.admin_role_id} | Title: ${r.admin_role_title} | Status: ${r.admin_role_status}`);
  });

  await conn.end();
}

run().catch(err => console.error('❌', err.message));
