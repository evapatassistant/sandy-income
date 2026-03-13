const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN || '8084527991:AAEJk7DxYnQW2GNzUCBg8868OyYuzGanw9I';

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
  const length = Math.min(parseInt(req.query.length) || 16, 1000);
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
  let password = '';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length];
  }
  res.json({ password, length, premium: length > 100 ? 'Consider donating for bulk usage!' : false });
});

// UUID Generator
app.get('/api/uuid', (req, res) => {
  const count = Math.min(parseInt(req.query.count) || 1, 1000);
  const uuids = [];
  for (let i = 0; i < count; i++) uuids.push(crypto.randomUUID());
  res.json({ uuids: count === 1 ? uuids[0] : uuids, count, premium: count > 100 ? 'Consider donating for bulk usage!' : false });
});

// Hash Generator
app.get('/api/hash/:text', (req, res) => {
  const algo = req.query.algo || 'sha256';
  const hash = crypto.createHash(algo).update(req.params.text).digest('hex');
  res.json({ text: req.params.text, algo, hash });
});

// Timestamp
app.get('/api/timestamp', (req, res) => {
  res.json({ unix: Date.now(), iso: new Date().toISOString() });
});

// QR Code
app.get('/api/qrcode', (req, res) => {
  const text = req.query.text || 'https://sandy-income.onrender.com';
  const size = Math.min(parseInt(req.query.size) || 300, 1000);
  res.json({ text, qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}` });
});

// Binary
app.get('/api/binary/:text', (req, res) => {
  const binary = req.params.text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
  res.json({ text: req.params.text, binary });
});

// Morse
app.get('/api/morse/:text', (req, res) => {
  const morseCode = { 'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', ' ': '/' };
  const morse = req.params.text.toUpperCase().split('').map(c => morseCode[c] || c).join(' ');
  res.json({ text: req.params.text, morse });
});

// Color
app.get('/api/color/:color', (req, res) => {
  let hex = req.params.color.startsWith('#') ? req.params.color : '#' + req.params.color;
  if (hex.length === 4) hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  if (isNaN(r)) return res.status(400).json({ error: 'Invalid color' });
  res.json({ hex: hex.toUpperCase(), rgb: `rgb(${r},${g},${b})`, rgbObject: { r, g, b } });
});

// Lorem Ipsum
app.get('/api/lorem', (req, res) => {
  const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit'];
  const count = Math.min(parseInt(req.query.words) || 20, 1000);
  const text = Array(count).fill(0).map(() => words[Math.floor(Math.random() * words.length)]).join(' ');
  res.json({ text: text.charAt(0).toUpperCase() + text.slice(1) + '.', words: count });
});

// Basic endpoints
app.get('/api/ping', (req, res) => res.json({ ping: 'pong', timestamp: Date.now() }));
app.get('/api/info', (req, res) => res.json({ service: "Sandy's API", version: '3.0.0', endpoints: 12, donate: 'https://ko-fi.com/YOUR_LINK' }));
app.get('/api/reverse/:text', (req, res) => res.json({ original: req.params.text, reversed: req.params.text.split('').reverse().join('') }));
app.get('/api/uppercase/:text', (req, res) => res.json({ original: req.params.text, upper: req.params.text.toUpperCase() }));
app.get('/api/lowercase/:text', (req, res) => res.json({ original: req.params.text, lower: req.params.text.toLowerCase() }));

// ============== TELEGRAM BOT ==============

const PREMIUM_USERS = new Set(['6118337937']); // Add user IDs here for premium

const botCommands = {
  password: (args, isPremium) => {
    const len = Math.min(parseInt(args[0]) || 16, isPremium ? 1000 : 100);
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
    let password = '';
    const array = new Uint32Array(len);
    crypto.getRandomValues(array);
    for (let i = 0; i < len; i++) password += chars[array[i] % chars.length];
    return `🔐 *Password Generator*\n\n\`${password}\`\n\nLength: ${len}${!isPremium && len >= 100 ? '\n\n⭐ Upgrade to Premium for up to 1000 chars!' : ''}`;
  },
  
  uuid: (args, isPremium) => {
    const count = Math.min(parseInt(args[0]) || 1, isPremium ? 1000 : 20);
    let result = '';
    for (let i = 0; i < count; i++) result += `${i+1}. \`${crypto.randomUUID()}\`\n`;
    return `🆔 *UUID Generator*${count > 100 ? ' ⭐' : ''}\n\n${result}${!isPremium && count >= 20 ? '\n⭐ Upgrade to Premium for 1000+ UUIDs!' : ''}`;
  },
  
  hash: (args) => args[0] ? `🔒 *Hash*\n\n\`${crypto.createHash(args[1] || 'sha256').update(args[0]).digest('hex')}\`` : 'Usage: /hash <text> [algo]',
  
  reverse: (args) => args.join(' ') ? `🔄 *Reverse*\n\n${args.join(' ')} → ${args.join('').split('').reverse().join('')}` : 'Usage: /reverse <text>',
  
  upper: (args) => args.join(' ') ? `⬆️ *Uppercase*\n\n\`${args.join(' ').toUpperCase()}\`` : 'Usage: /upper <text>',
  
  lower: (args) => args.join(' ') ? `⬇️ *Lowercase*\n\n\`${args.join(' ').toLowerCase()}\`` : 'Usage: /lower <text>',
  
  binary: (args) => args.join(' ') ? `💻 *Binary*\n\n${args.join(' ').split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ')}` : 'Usage: /binary <text>',
  
  timestamp: () => `⏰ *Timestamp*\n\nUnix: \`${Date.now()}\``,
  
  qrcode: (args) => `📱 *QR Code*\n\nhttps://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(args.join(' ') || 'hello')}`,
  
  donate: () => `💜 *Support This Project*\n\nYour donations help keep this service free!\n\n☕ https://ko-fi.com/YOUR_LINK\n💙 PayPal: https://paypal.me/YOUR_LINK`,
  
  premium: () => `⭐ *Premium Features*\n\n• Passwords up to 1000 chars\n• UUIDs up to 1000 at once\n• Priority support\n\n💜 Donate to unlock!`,
  
  help: () => `🐚 *Sandy's Bot Commands*\n\n` +
    `🔐 /password [len] - Password (max 100)\n` +
    `🆔 /uuid [count] - UUIDs (max 20)\n` +
    `🔒 /hash <text> [algo] - Hash\n` +
    `🔄 /reverse <text> - Reverse\n` +
    `⬆️ /upper <text> - Uppercase\n` +
    `⬇️ /lower <text> - Lowercase\n` +
    `💻 /binary <text> - Binary\n` +
    `⏰ /timestamp - Time\n` +
    `📱 /qrcode <text> - QR Code\n` +
    `💜 /donate - Support us\n` +
    `⭐ /premium - Premium info\n` +
    `❓ /help - This help\n\n` +
    `_Built with 💜 for Mia_`
};

async function sendMessage(chatId, text, parseMode = 'Markdown') {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: parseMode })
    });
  } catch (e) {
    console.error('Send error:', e);
  }
}

app.post(`/webhook/${BOT_TOKEN}`, async (req, res) => {
  const msg = req.body.message;
  if (!msg || !msg.text) return res.send('OK');
  
  const chatId = msg.chat.id;
  const userId = msg.from?.id?.toString();
  const parts = msg.text.split(' ');
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);
  
  const isPremium = PREMIUM_USERS.has(userId);
  
  try {
    if (cmd === '/start') {
      await sendMessage(chatId, '🐚 *Welcome to Sandy\'s Bot!*\n\nYour free developer assistant.\n\n❓ Use /help for commands\n💜 Donate with /donate');
    } else if (cmd === '/help' || cmd === '/start@') {
      await sendMessage(chatId, botCommands.help());
    } else if (botCommands[cmd.slice(1)]) {
      await sendMessage(chatId, botCommands[cmd.slice(1)](args, isPremium));
    } else {
      await sendMessage(chatId, 'Unknown command. Use /help');
    }
  } catch (e) {
    console.error(e);
  }
  res.send('OK');
});

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Start
app.listen(PORT, () => {
  console.log(`Sandy's All-in-One running on port ${PORT}`);
});
