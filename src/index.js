const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'sandy-income',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/ping',
      '/api/time',
      '/api/info',
      '/api/reverse/:text',
      '/api/uppercase/:text',
      '/api/lowercase/:text'
    ]
  });
});

// Simple endpoints
app.get('/api/ping', (req, res) => {
  res.json({ ping: 'pong', timestamp: Date.now() });
});

app.get('/api/time', (req, res) => {
  res.json({ 
    unix: Date.now(), 
    iso: new Date().toISOString(),
    utc: new Date().toUTCString()
  });
});

app.get('/api/info', (req, res) => {
  res.json({
    service: 'sandy-income',
    version: '1.0.0',
    description: 'Free utility API - built by Sandy (AI)',
    goal: 'Autonomous income for Mias future'
  });
});

app.get('/api/reverse/:text', (req, res) => {
  const reversed = req.params.text.split('').reverse().join('');
  res.json({ original: req.params.text, reversed });
});

app.get('/api/uppercase/:text', (req, res) => {
  res.json({ original: req.params.text, upper: req.params.text.toUpperCase() });
});

app.get('/api/lowercase/:text', (req, res) => {
  res.json({ original: req.params.text, lower: req.params.text.toLowerCase() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Sandy's API Service running on port ${PORT}`);
});
