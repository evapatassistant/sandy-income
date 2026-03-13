const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files (landing page)
app.use(express.static(path.join(__dirname, '../public')));

// Landing page route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// ============== TOOLS API ==============

// Password Generator
app.get('/api/password', (req, res) => {
  const length = parseInt(req.query.length) || 16;
  const useSymbols = req.query.symbols !== 'false';
  const useNumbers = req.query.numbers !== 'false';
  const useUppercase = req.query.uppercase !== 'false';
  
  let chars = 'abcdefghijklmnopqrstuvwxyz';
  if (useUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (useNumbers) chars += '0123456789';
  if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  let password = '';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length];
  }
  
  res.json({ password, length, options: { symbols: useSymbols, numbers: useNumbers, uppercase: useUppercase } });
});

// UUID Generator
app.get('/api/uuid', (req, res) => {
  const count = Math.min(parseInt(req.query.count) || 1, 100);
  const uuids = [];
  for (let i = 0; i < count; i++) {
    uuids.push(crypto.randomUUID());
  }
  res.json({ uuids: count === 1 ? uuids[0] : uuids, count });
});

// Base64 Encode/Decode
app.post('/api/base64', (req, res) => {
  const { text, action } = req.body;
  if (!text) return res.status(400).json({ error: 'Missing text parameter' });
  
  try {
    if (action === 'decode') {
      res.json({ original: text, decoded: Buffer.from(text, 'base64').toString('utf8') });
    } else {
      res.json({ original: text, encoded: Buffer.from(text).toString('base64') });
    }
  } catch (e) {
    res.status(400).json({ error: 'Invalid input' });
  }
});

// Hash Generator
app.get('/api/hash/:text', (req, res) => {
  const text = req.params.text;
  const algo = req.query.algo || 'sha256';
  
  const hash = crypto.createHash(algo).update(text).digest('hex');
  res.json({ text, algo, hash });
});

// JSON Validator
app.post('/api/json/validate', (req, res) => {
  const data = req.body;
  
  try {
    const stringified = JSON.stringify(data, null, 2);
    res.json({ valid: true, data, size: stringified.length });
  } catch (e) {
    res.json({ valid: false, error: e.message });
  }
});

// JSON Formatter
app.post('/api/json/format', (req, res) => {
  const data = req.body;
  const indent = parseInt(req.query.indent) || 2;
  
  try {
    res.json({ formatted: JSON.stringify(data, null, indent) });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Timestamp Converter
app.get('/api/timestamp', (req, res) => {
  const input = req.query.time;
  let date;
  
  if (input) {
    const parsed = parseInt(input);
    date = isNaN(parsed) ? new Date(input) : new Date(parsed);
  } else {
    date = new Date();
  }
  
  if (isNaN(date.getTime())) {
    return res.status(400).json({ error: 'Invalid timestamp or date' });
  }
  
  res.json({
    unix: date.getTime(),
    unixSeconds: Math.floor(date.getTime() / 1000),
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toString(),
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds()
  });
});

// Color Converter
app.get('/api/color/:color', (req, res) => {
  const input = req.params.color;
  let hex = input;
  
  // Handle # prefix
  if (!hex.startsWith('#')) hex = '#' + hex;
  
  // Expand short form
  if (hex.length === 4) {
    hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return res.status(400).json({ error: 'Invalid color format' });
  }
  
  // RGB to HSL
  const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm), min = Math.min(rNorm, gNorm, bNorm);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm: h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6; break;
      case gNorm: h = ((bNorm - rNorm) / d + 2) / 6; break;
      case bNorm: h = ((rNorm - gNorm) / d + 4) / 6; break;
    }
  }
  
  res.json({
    hex: hex.toUpperCase(),
    rgb: `rgb(${r}, ${g}, ${b})`,
    rgbObject: { r, g, b },
    hsl: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
    hslObject: { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
  });
});

// Lorem Ipsum Generator
app.get('/api/lorem', (req, res) => {
  const paragraphs = Math.min(parseInt(req.query.paragraphs) || 1, 20);
  const words = Math.min(parseInt(req.query.words) || 50, 500);
  
  const wordsList = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'];
  
  const result = [];
  for (let p = 0; p < paragraphs; p++) {
    const paragraph = [];
    for (let w = 0; w < words; w++) {
      paragraph.push(wordsList[Math.floor(Math.random() * wordsList.length)]);
    }
    // Capitalize first letter
    paragraph[0] = paragraph[0].charAt(0).toUpperCase() + paragraph[0].slice(1);
    result.push(paragraph.join(' ') + '.');
  }
  
  res.json({ paragraphs: result, count: { paragraphs, words } });
});

// User Agent Parser
app.get('/api/ua', (req, res) => {
  const ua = req.query.ua || req.headers['user-agent'] || 'Unknown';
  
  const browser = ua.match(/(Firefox|Chrome|Safari|Edge|Opera|MSIE|Trident)[\/]?(\d+)/);
  const os = ua.match(/(Windows|Mac|Linux|Android|iOS|CrOS|Ubuntu|Fedora|Windows\sPhone)[\/]?[\d\.]*/);
  const mobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile|WPDesktop/.test(ua);
  
  res.json({
    userAgent: ua,
    browser: browser ? { name: browser[1], version: browser[2] } : null,
    os: os ? os[0] : null,
    isMobile: mobile,
    isBot: /bot|crawler|spider|crawl/i.test(ua)
  });
});

// QR Code (using external API - free)
app.get('/api/qrcode', (req, res) => {
  const text = req.query.text || 'https://sandy-income.onrender.com';
  const size = Math.min(parseInt(req.query.size) || 300, 1000);
  
  res.json({
    text,
    size,
    qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`,
    api: 'qrserver.com'
  });
});

// Binary Converter
app.get('/api/binary/:text', (req, res) => {
  const text = req.params.text;
  const binary = text.split('').map(char => 
    char.charCodeAt(0).toString(2).padStart(8, '0')
  ).join(' ');
  
  res.json({ text, binary });
});

// Morse Code
app.get('/api/morse/:text', (req, res) => {
  const text = req.params.text.toUpperCase();
  const morseCode = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', ' ': '/'
  };
  
  const morse = text.split('').map(char => morseCode[char] || char).join(' ');
  res.json({ text, morse });
});

// ============== EXISTING ENDPOINTS ==============

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
    service: "Sandy's Income API",
    version: '2.0.0',
    description: 'Developer utility API - built by Sandy (AI)',
    goal: 'Autonomous income for Mia',
    endpoints: 15,
    categories: ['password', 'uuid', 'base64', 'hash', 'json', 'timestamp', 'color', 'lorem', 'ua', 'qrcode', 'binary', 'morse']
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
  console.log(`Sandy's API v2 running on port ${PORT}`);
});
