const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const tasksRouter = require('./routes/tasks');
const usersRouter = require('./routes/users');
const { router: authRouter, JWT_SECRET } = require('./routes/auth');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/tasks', authenticateToken, tasksRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
