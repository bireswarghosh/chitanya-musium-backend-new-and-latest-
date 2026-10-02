const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all bookings
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM bookings ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE booking
router.post('/', async (req, res) => {
  try {
    const {
      fullname, phone, email, address, aadhar,
      booking_date, booking_time, hours, extra_hours,
      service_charge, booking_charge, hall_charge,
      extra_charge, total_amt, paid_amt, payment, txn_id
    } = req.body;
    const created_at = new Date().toISOString().split('T')[0];

    const [result] = await db.execute(
      `INSERT INTO bookings (fullname, phone, email, address, aadhar, booking_date, booking_time, hours, extra_hours, service_charge, booking_charge, hall_charge, extra_charge, total_amt, paid_amt, payment, txn_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fullname, phone, email || '', address || '', aadhar || '',
        booking_date, booking_time || '', hours || 3, extra_hours || 0,
        service_charge || 0, booking_charge || 0, hall_charge || 6600,
        extra_charge || 0, total_amt, paid_amt || total_amt, payment || '0', txn_id || '', created_at
      ]
    );

    res.status(201).json({
      id: result.insertId,
      fullname, phone, email, address, aadhar, booking_date, booking_time,
      hours, extra_hours, service_charge, booking_charge, hall_charge, extra_charge,
      total_amt, paid_amt, payment, txn_id, created_at
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE booking
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM bookings WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
