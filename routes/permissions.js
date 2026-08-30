const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET permissions for a role
router.get('/:roleId', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM role_permissions WHERE role_id = ?', [req.params.roleId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all permissions (all roles)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM role_permissions ORDER BY role_id, page_key');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SAVE/UPDATE permissions for a role (bulk upsert)
router.post('/', async (req, res) => {
  try {
    const { role_id, permissions } = req.body;
    // permissions = [{ page_key, can_view, can_add, can_edit, can_delete, can_download, can_print, is_public }]

    // Delete existing for this role
    await db.execute('DELETE FROM role_permissions WHERE role_id = ?', [role_id]);

    // Insert new
    for (const p of permissions) {
      await db.execute(
        `INSERT INTO role_permissions (role_id, page_key, can_view, can_add, can_edit, can_delete, can_download, can_print, is_public) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [role_id, p.page_key, p.can_view || 0, p.can_add || 0, p.can_edit || 0, p.can_delete || 0, p.can_download || 0, p.can_print || 0, p.is_public || 0]
      );
    }

    res.json({ message: 'Permissions saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
