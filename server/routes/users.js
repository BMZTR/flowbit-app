const express = require('express');
const fs = require('fs').promises;
const router = express.Router();

const USERS_FILE = './data/users.json';

router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read users' });
  }
});

module.exports = router;