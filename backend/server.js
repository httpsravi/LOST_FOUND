const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./db');
const authRoutes = require('./authRoutes');
const itemRoutes = require('./itemRoutes');
const chatRoutes = require('./chatRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' })); // 10mb limit for base64 image uploads

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/chat', chatRoutes);

// Helpful root route so opening backend URL doesn't show "Cannot GET /"
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Lost & Found backend is running',
    frontend: 'http://localhost:3000',
    health: '/api/health',
  });
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', db: 'MongoDB connected' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
