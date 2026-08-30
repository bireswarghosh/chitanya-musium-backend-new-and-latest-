const express = require('express');
const router = express.Router();
const db = require('../config/database');

// LOG ACTIVITY
router.post('/log', async (req, res) => {
  try {
    const { user_id, username, action, page, details, city, region, country, latitude, longitude } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const user_agent = req.headers['user-agent'] || '';

    await db.execute(
      `INSERT INTO activity_logs (user_id, username, action, page, details, ip_address, user_agent, city, region, country, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id || null, username || 'Guest', action, page, details || '', ip, user_agent, city || '', region || '', country || '', latitude || null, longitude || null]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LOG VISITOR SESSION
router.post('/session', async (req, res) => {
  try {
    const { session_id, user_id, username, page, time_spent, clicks, city, country, device, browser } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

    await db.execute(
      `INSERT INTO visitor_sessions (session_id, user_id, username, page, time_spent, clicks, ip_address, city, country, device, browser) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [session_id, user_id || null, username || 'Guest', page, time_spent || 0, clicks || 0, ip, city || '', country || '', device || '', browser || '']
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ACTIVITY LOGS (with filters)
router.get('/logs', async (req, res) => {
  try {
    const { username, action, page, from_date, to_date, limit } = req.query;
    let query = 'SELECT * FROM activity_logs WHERE 1=1';
    let params = [];

    if (username) { query += ' AND username LIKE ?'; params.push(`%${username}%`); }
    if (action) { query += ' AND action = ?'; params.push(action); }
    if (page) { query += ' AND page LIKE ?'; params.push(`%${page}%`); }
    if (from_date) { query += ' AND DATE(created_at) >= ?'; params.push(from_date); }
    if (to_date) { query += ' AND DATE(created_at) <= ?'; params.push(to_date); }

    query += ' ORDER BY id DESC LIMIT ?';
    params.push(parseInt(limit) || 200);

    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET VISITOR SESSIONS
router.get('/sessions', async (req, res) => {
  try {
    const { limit } = req.query;
    const [rows] = await db.execute(
      'SELECT * FROM visitor_sessions ORDER BY id DESC LIMIT ?',
      [parseInt(limit) || 100]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET STATS/SUMMARY
router.get('/stats', async (req, res) => {
  try {
    const [totalLogs] = await db.execute('SELECT COUNT(*) as total FROM activity_logs');
    const [todayLogs] = await db.execute("SELECT COUNT(*) as total FROM activity_logs WHERE DATE(created_at) = CURDATE()");
    const [uniqueUsers] = await db.execute('SELECT COUNT(DISTINCT username) as total FROM activity_logs');
    const [topPages] = await db.execute('SELECT page, COUNT(*) as visits FROM activity_logs GROUP BY page ORDER BY visits DESC LIMIT 10');
    const [topUsers] = await db.execute('SELECT username, COUNT(*) as actions FROM activity_logs GROUP BY username ORDER BY actions DESC LIMIT 10');
    const [recentIPs] = await db.execute('SELECT DISTINCT ip_address, city, country, username, MAX(created_at) as last_seen FROM activity_logs GROUP BY ip_address, city, country, username ORDER BY last_seen DESC LIMIT 20');
    const [hourlyActivity] = await db.execute("SELECT HOUR(created_at) as hour, COUNT(*) as count FROM activity_logs WHERE DATE(created_at) = CURDATE() GROUP BY HOUR(created_at) ORDER BY hour");

    res.json({
      total_logs: totalLogs[0].total,
      today_logs: todayLogs[0].total,
      unique_users: uniqueUsers[0].total,
      top_pages: topPages,
      top_users: topUsers,
      recent_ips: recentIPs,
      hourly_activity: hourlyActivity
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
