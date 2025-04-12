const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const tasksRouter = require('./routes/tasks');
const usersRouter = require('./routes/users');
const { router: authRouter, JWT_SECRET } = require('./routes/auth');

const app = express();
app.use(cors({ origin: 'https://flowbit-app.vercel.app' }));
app.use(express.json());

// Endpoint temporaire pour créer un utilisateur de test
app.post('/api/auth/register-test', async (req, res) => {
  const users = require('./routes/users').users || [];
  const { email, password, name } = req.body;
  users.push({ id: users.length + 1, email, password, name });
  res.status(201).json({ message: 'Utilisateur test créé', email });
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Accès refusé' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalide' });
    req.user = user;
    next();
  });
};

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/tasks', authenticateToken, tasksRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur sur le port ${PORT}`));
