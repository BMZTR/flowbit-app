const express = require('express');
const fs = require('fs').promises;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const USERS_FILE = './data/users.json';
const JWT_SECRET = 'flowbit-secret-2025';

router.post(
  '/register',
  [
    body('name').notEmpty().trim(),
    body('email').isEmail().normalizeEmail(),
    body('username').notEmpty().trim().isLength({ min: 3 }),
    body('password').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, username, password } = req.body;
      const data = await fs.readFile(USERS_FILE, 'utf8');
      const users = JSON.parse(data);

      if (users.find(u => u.username === username || u.email === email)) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        id: users.length + 1,
        name,
        email,
        username,
        password: hashedPassword
      };
      users.push(newUser);
      await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));

      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, username });
    } catch (error) {
      res.status(500).json({ error: 'Failed to register user' });
    }
  }
);

router.post(
  '/login',
  [
    body('username').notEmpty().trim(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, password } = req.body;
      const data = await fs.readFile(USERS_FILE, 'utf8');
      const users = JSON.parse(data);

      const user = users.find(u => u.username === username || u.email === username);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, username: user.username });
    } catch (error) {
      res.status(500).json({ error: 'Failed to login' });
    }
  }
);

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const data = await fs.readFile(USERS_FILE, 'utf8');
    const users = JSON.parse(data);

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ error: 'Email not found' });
    }

    // Pas de SMTP gratuit, donc retourner un code temporaire (simulé)
    const tempCode = Math.random().toString(36).substring(2, 8);
    res.json({ message: 'Temporary code sent (check logs for demo)', tempCode });
    console.log(`Recovery code for ${email}: ${tempCode}`);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process request' });
  }
});

module.exports = { router, JWT_SECRET };
