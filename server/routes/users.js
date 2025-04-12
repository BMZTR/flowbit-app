const express = require('express');
const fs = require('fs').promises;
const router = express.Router();

const USERS_FILE = './data/users.json';

router.get('/', async (req, res) => {
  try {
    try {
      await fs.access(USERS_FILE);
    } catch {
      // Create empty file if missing
      await fs.writeFile(USERS_FILE, JSON.stringify([]));
    }
    const data = await fs.readFile(USERS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    console.error('Error reading users:', err);
    res.status(500).json({ error: 'Failed to read users' });
  }
});

module.exports = router;
