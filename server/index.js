const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');
require('dotenv').config();

const app = express();

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} Headers:`, req.headers);
  next();
});

app.use(cors({ origin: process.env.FRONTEND_URL }));
console.log('CORS origin set to:', process.env.FRONTEND_URL);
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Catch-all for unmatched routes
app.use((req, res) => {
  console.log(`[${new Date().toISOString()}] 404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Not Found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
