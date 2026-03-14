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
app.get('/api/info', (req, res) => res.json({ service: "Sandy's API", version: '4.0.0', endpoints: 35, donate: 'https://ko-fi.com/miasfuture' }));
app.get('/api/reverse/:text', (req, res) => res.json({ original: req.params.text, reversed: req.params.text.split('').reverse().join('') }));
app.get('/api/uppercase/:text', (req, res) => res.json({ original: req.params.text, upper: req.params.text.toUpperCase() }));
app.get('/api/lowercase/:text', (req, res) => res.json({ original: req.params.text, lower: req.params.text.toLowerCase() }));

// ============== NEW DEVELOPER TOOLS ==============

// Base64 Encode
app.get('/api/base64/encode', (req, res) => {
  const text = req.query.text || req.query.q || '';
  res.json({ text, encoded: Buffer.from(text).toString('base64') });
});

// Base64 Decode
app.get('/api/base64/decode', (req, res) => {
  const encoded = req.query.text || req.query.q || '';
  try {
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    res.json({ encoded, decoded, valid: true });
  } catch (e) {
    res.json({ encoded, decoded: null, valid: false, error: 'Invalid base64' });
  }
});

// URL Encode
app.get('/api/url/encode', (req, res) => {
  const text = req.query.text || req.query.q || '';
  res.json({ text, encoded: encodeURIComponent(text) });
});

// URL Decode
app.get('/api/url/decode', (req, res) => {
  const encoded = req.query.text || req.query.q || '';
  try {
    const decoded = decodeURIComponent(encoded);
    res.json({ encoded, decoded });
  } catch (e) {
    res.json({ encoded, decoded: null, error: 'Invalid URL encoding' });
  }
});

// JSON Formatter/Validator
app.get('/api/json', (req, res) => {
  const text = req.query.text || req.query.q || '';
  try {
    const parsed = JSON.parse(text);
    res.json({ valid: true, formatted: JSON.stringify(parsed, null, 2), parsed });
  } catch (e) {
    res.json({ valid: false, error: e.message, hint: 'Check for missing quotes or commas' });
  }
});

// Random Number
app.get('/api/random', (req, res) => {
  const min = parseInt(req.query.min) || 0;
  const max = parseInt(req.query.max) || 100;
  const count = Math.min(parseInt(req.query.count) || 1, 100);
  const numbers = [];
  for (let i = 0; i < count; i++) numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
  res.json({ min, max, count, numbers: count === 1 ? numbers[0] : numbers });
});

// Slugify
app.get('/api/slug/:text', (req, res) => {
  const slug = req.params.text.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  res.json({ text: req.params.text, slug });
});

// JWT Decode (no verification)
app.get('/api/jwt/decode', (req, res) => {
  const token = req.query.token || req.query.q || '';
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT format');
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    res.json({ token, header: JSON.parse(Buffer.from(parts[0], 'base64').toString()), payload, valid: true });
  } catch (e) {
    res.json({ token, error: e.message, valid: false });
  }
});

// Hex <-> ASCII
app.get('/api/hex/:text', (req, res) => {
  const hex = req.params.text;
  if (/^[0-9a-fA-F]+$/.test(hex)) {
    const str = hex.match(/.{1,2}/g)?.map(b => String.fromCharCode(parseInt(b, 16))).join('') || '';
    res.json({ hex, ascii: str, mode: 'hex-to-ascii' });
  } else {
    const h = hex.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    res.json({ ascii: hex, hex: h, mode: 'ascii-to-hex' });
  }
});

// Unix Timestamp Converter
app.get('/api/time', (req, res) => {
  const unix = req.query.unix;
  const iso = req.query.iso;
  let result = {};
  
  if (unix) {
    const date = new Date(parseInt(unix));
    result = { unix: parseInt(unix), iso: date.toISOString(), date: date.toUTCString(), readable: date.toLocaleString() };
  } else if (iso) {
    const date = new Date(iso);
    result = { iso, unix: date.getTime(), date: date.toUTCString(), readable: date.toLocaleString() };
  } else {
    const now = new Date();
    result = { now: true, unix: now.getTime(), iso: now.toISOString(), date: now.toUTCString(), readable: now.toLocaleString() };
  }
  res.json(result);
});

// Random Choice from List
app.get('/api/choice', (req, res) => {
  const items = (req.query.items || req.query.q || '').split(',').map(s => s.trim()).filter(s => s);
  if (items.length === 0) return res.json({ error: 'No items provided', usage: '/api/choice?items=a,b,c' });
  const choice = items[Math.floor(Math.random() * items.length)];
  res.json({ items, choice, count: items.length });
});

// Text Statistics
app.get('/api/stats/:text', (req, res) => {
  const text = req.params.text;
  res.json({
    text,
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    words: text.trim().split(/\s+/).filter(w => w).length,
    lines: text.split('\n').length,
    sentences: text.split(/[.!?]+/).filter(s => s.trim()).length,
    paragraphs: text.split(/\n\n+/).filter(p => p.trim()).length,
    uniqueChars: new Set(text).size
  });
});

// Mime Type Lookup
app.get('/api/mime/:ext', (req, res) => {
  const mimeTypes = {
    'html': 'text/html', 'htm': 'text/html', 'css': 'text/css', 'js': 'application/javascript',
    'json': 'application/json', 'xml': 'application/xml', 'txt': 'text/plain',
    'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'gif': 'image/gif', 'svg': 'image/svg+xml', 'webp': 'image/webp',
    'pdf': 'application/pdf', 'zip': 'application/zip', 'tar': 'application/x-tar', 'gz': 'application/gzip',
    'mp3': 'audio/mpeg', 'wav': 'audio/wav', 'mp4': 'video/mp4', 'webm': 'video/webm',
    'woff': 'font/woff', 'woff2': 'font/woff2', 'ttf': 'font/ttf', 'eot': 'application/vnd.ms-fontobject',
    'ico': 'image/x-icon', 'csv': 'text/csv', 'md': 'text/markdown'
  };
  const ext = req.params.ext.toLowerCase().replace('.', '');
  res.json({ ext: req.params.ext, mime: mimeTypes[ext] || 'application/octet-stream', known: !!mimeTypes[ext] });
});

// Random String (alphanumeric only)
app.get('/api/randomstring', (req, res) => {
  const length = Math.min(parseInt(req.query.length) || 16, 1000);
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) result += chars[array[i] % chars.length];
  res.json({ string: result, length });
});

// Number Base Converter
app.get('/api/convert', (req, res) => {
  const value = req.query.value || req.query.q || '0';
  const from = parseInt(req.query.from) || 10;
  const to = parseInt(req.query.to) || 2;
  try {
    const decimal = parseInt(value, from);
    if (isNaN(decimal)) throw new Error('Invalid number');
    res.json({ value, from, to, result: decimal.toString(to), decimal });
  } catch (e) {
    res.json({ value, from, to, error: e.message });
  }
});

// Roman Numerals
app.get('/api/roman/:num', (req, res) => {
  const num = parseInt(req.params.num);
  if (isNaN(num) || num < 1 || num > 3999) return res.json({ error: 'Number must be between 1 and 3999' });
  const roman = (n) => {
    const vals = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
    return vals.reduce((s, [v, r]) => s + r.repeat(Math.floor(n / v)), '');
  };
  res.json({ number: num, roman: roman(num) });
});

// MD5 Hash (simple)
app.get('/api/md5/:text', (req, res) => {
  res.json({ text: req.params.text, md5: crypto.createHash('md5').update(req.params.text).digest('hex') });
});

// SHA-512 Hash
app.get('/api/sha512/:text', (req, res) => {
  res.json({ text: req.params.text, sha512: crypto.createHash('sha512').update(req.params.text).digest('hex') });
});

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
  
  base64: (args) => {
    if (!args[0]) return 'Usage: /base64 <encode|decode> <text>';
    const mode = args[0].toLowerCase();
    const text = args.slice(1).join(' ');
    if (mode === 'encode') return `📝 *Base64 Encode*\n\n\`${Buffer.from(text).toString('base64')}\``;
    if (mode === 'decode') {
      try { return `📝 *Base64 Decode*\n\n\`${Buffer.from(text, 'base64').toString('utf8')}\``; }
      catch { return '❌ Invalid Base64'; }
    }
    return 'Usage: /base64 <encode|decode> <text>';
  },
  
  url: (args) => {
    if (!args[0]) return 'Usage: /url <encode|decode> <text>';
    const mode = args[0].toLowerCase();
    const text = args.slice(1).join(' ');
    if (mode === 'encode') return `🔗 *URL Encode*\n\n\`${encodeURIComponent(text)}\``;
    if (mode === 'decode') {
      try { return `🔗 *URL Decode*\n\n\`${decodeURIComponent(text)}\``; }
      catch { return '❌ Invalid URL encoding'; }
    }
    return 'Usage: /url <encode|decode> <text>';
  },
  
  random: (args) => {
    const min = parseInt(args[0]) || 0;
    const max = parseInt(args[1]) || 100;
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return `🎲 *Random Number*\n\nMin: ${min}\nMax: ${max}\nResult: \`${num}\``;
  },
  
  slug: (args) => {
    const text = args.join(' ');
    if (!text) return 'Usage: /slug <text>';
    const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `🏷️ *Slugify*\n\n${text} → \`${slug}\``;
  },
  
  hex: (args) => {
    const text = args.join(' ');
    if (!text) return 'Usage: /hex <text>';
    if (/^[0-9a-fA-F]+$/.test(text)) {
      const str = text.match(/.{1,2}/g)?.map(b => String.fromCharCode(parseInt(b, 16)).join('') || '';
      return `🔢 *Hex → ASCII*\n\n\`${str}\``;
    }
    const h = text.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    return `🔢 *ASCII → Hex*\n\n\`${h}\``;
  },
  
  roman: (args) => {
    const num = parseInt(args[0]);
    if (isNaN(num) || num < 1 || num > 3999) return '❌ Number must be between 1 and 3999';
    const vals = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
    const roman = vals.reduce((s, [v, r]) => s + r.repeat(Math.floor(num / v)), '');
    return `🏛️ *Roman Numerals*\n\n${num} → \`${roman}\``;
  },
  
  choice: (args) => {
    if (args.length < 2) return 'Usage: /choice <a> <b> <c> ...';
    const choice = args[Math.floor(Math.random() * args.length)];
    return `🎯 *Random Choice*\n\nOptions: ${args.join(', ')}\nResult: \`${choice}\``;
  },
  
  stats: (args) => {
    const text = args.join(' ');
    if (!text) return 'Usage: /stats <text>';
    return `📊 *Text Statistics*\n\n` +
      `Characters: ${text.length}\n` +
      `Words: ${text.trim().split(/\s+/).filter(w => w).length}\n` +
      `Lines: ${text.split('\n').length}\n` +
      `Unique Chars: ${new Set(text).size}`;
  },
  
  reverse: (args) => args.join(' ') ? `🔄 *Reverse*\n\n${args.join(' ')} → ${args.join('').split('').reverse().join('')}` : 'Usage: /reverse <text>',
  
  upper: (args) => args.join(' ') ? `⬆️ *Uppercase*\n\n\`${args.join(' ').toUpperCase()}\`` : 'Usage: /upper <text>',
  
  lower: (args) => args.join(' ') ? `⬇️ *Lowercase*\n\n\`${args.join(' ').toLowerCase()}\`` : 'Usage: /lower <text>',
  
  binary: (args) => args.join(' ') ? `💻 *Binary*\n\n${args.join(' ').split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ')}` : 'Usage: /binary <text>',
  
  timestamp: () => `⏰ *Timestamp*\n\nUnix: \`${Date.now()}\``,
  
  qrcode: (args) => `📱 *QR Code*\n\nhttps://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(args.join(' ') || 'hello')}`,
  
  donate: () => `💜 *Support This Project*\n\nYour donations help keep this service free!\n\n☕ https://ko-fi.com/miasfuture\n💙 PayPal: https://paypal.me/patrickstueve`,
  
  premium: () => `⭐ *Premium Features*\n\n• Passwords up to 1000 chars\n• UUIDs up to 1000 at once\n• Priority support\n\n💜 Donate to unlock!`,
  
  help: () => `🐚 *Sandy's Bot (35+ Tools)*\n\n` +
    `🔐 /password [len] - Password\n` +
    `🆔 /uuid [count] - UUIDs\n` +
    `🔒 /hash <text> [algo] - Hash\n` +
    `📝 /base64 <encode|decode> - Base64\n` +
    `🔗 /url <encode|decode> - URL encode\n` +
    `🎲 /random <min> <max> - Random #\n` +
    `🏷️ /slug <text> - URL slug\n` +
    `🔢 /hex <text> - Hex converter\n` +
    `🏛️ /roman <number> - Roman numerals\n` +
    `🎯 /choice <a> <b> <c> - Random pick\n` +
    `📊 /stats <text> - Text stats\n` +
    `🔄 /reverse <text> - Reverse\n` +
    `⬆️ /upper <text> - Uppercase\n` +
    `⬇️ /lower <text> - Lowercase\n` +
    `💻 /binary <text> - Binary\n` +
    `⏰ /timestamp - Current time\n` +
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
