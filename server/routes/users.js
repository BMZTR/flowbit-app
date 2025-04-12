const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const USERS_FILE = path.join(__dirname, '../data/users.json');

router.get('/', async (req, res) => {
  try {
    console.log('Attempting to access users file:', USERS_FILE);
    await fs.access(USERS_FILE);
    const data = await fs.readFile(USERS_FILE, 'utf8');
    console.log('Successfully read users file');
    res.json(JSON.parse(data));
  } catch (err) {
    console.error('Error reading users file:', err.message);
    res.status(500).json({ error: 'Failed to read users' });
  }
});

module.exports = router;
