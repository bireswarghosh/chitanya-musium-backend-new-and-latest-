const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Ensure rate_settings table exists
const initSettingsTable = async () => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS rate_settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        museum_gallery_rate DECIMAL(10,2) DEFAULT 50.00,
        museum_movie_rate DECIMAL(10,2) DEFAULT 30.00,
        hall_charge DECIMAL(10,2) DEFAULT 6600.00,
        extra_hour_charge DECIMAL(10,2) DEFAULT 2200.00,
        base_hours INT DEFAULT 3,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    const [rows] = await db.execute('SELECT * FROM rate_settings WHERE id = 1');
    if (rows.length === 0) {
      await db.execute(`
        INSERT INTO rate_settings (id, museum_gallery_rate, museum_movie_rate, hall_charge, extra_hour_charge, base_hours)
        VALUES (1, 50, 30, 6600, 2200, 3)
      `);
    }
  } catch (err) {
    console.error('Failed to init rate_settings table:', err.message);
  }
};

initSettingsTable();

// GET current default rate settings
router.get('/rates', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM rate_settings WHERE id = 1');
    if (rows.length === 0) {
      return res.json({
        museum_gallery_rate: 50,
        museum_movie_rate: 30,
        hall_charge: 6600,
        extra_hour_charge: 2200,
        base_hours: 3
      });
    }
    const r = rows[0];
    res.json({
      id: r.id,
      museum_gallery_rate: Number(r.museum_gallery_rate) || 50,
      museum_movie_rate: Number(r.museum_movie_rate) || 30,
      hall_charge: Number(r.hall_charge) || 6600,
      extra_hour_charge: Number(r.extra_hour_charge) || 2200,
      base_hours: Number(r.base_hours) || 3,
      updated_at: r.updated_at
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE default rate settings
router.post('/rates', async (req, res) => {
  try {
    const {
      museum_gallery_rate,
      museum_movie_rate,
      hall_charge,
      extra_hour_charge,
      base_hours
    } = req.body;

    const gRate = Number(museum_gallery_rate) >= 0 ? Number(museum_gallery_rate) : 50;
    const mRate = Number(museum_movie_rate) >= 0 ? Number(museum_movie_rate) : 30;
    const hCharge = Number(hall_charge) >= 0 ? Number(hall_charge) : 6600;
    const eCharge = Number(extra_hour_charge) >= 0 ? Number(extra_hour_charge) : 2200;
    const bHours = Number(base_hours) >= 1 ? Math.floor(Number(base_hours)) : 3;

    await db.execute(`
      INSERT INTO rate_settings (id, museum_gallery_rate, museum_movie_rate, hall_charge, extra_hour_charge, base_hours)
      VALUES (1, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        museum_gallery_rate = VALUES(museum_gallery_rate),
        museum_movie_rate = VALUES(museum_movie_rate),
        hall_charge = VALUES(hall_charge),
        extra_hour_charge = VALUES(extra_hour_charge),
        base_hours = VALUES(base_hours),
        updated_at = CURRENT_TIMESTAMP
    `, [gRate, mRate, hCharge, eCharge, bHours]);

    res.json({
      success: true,
      message: 'Rate settings updated successfully',
      rates: {
        museum_gallery_rate: gRate,
        museum_movie_rate: mRate,
        hall_charge: hCharge,
        extra_hour_charge: eCharge,
        base_hours: bHours
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
