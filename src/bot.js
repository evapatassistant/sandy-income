const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// Bot Token wird per Environment Variable gesetzt
const BOT_TOKEN = process.env.BOT_TOKEN;

const tools = {
  password: (params) => {
    const length = parseInt(params.length) || 16;
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
    let password = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      password += chars[array[i] % chars.length];
    }
    return `🔐 *Password Generator*\n\n\`${password}\`\n\nLength: ${length}`;
  },
  
  uuid: (params) => {
    const count = Math.min(parseInt(params.count) || 1, 10);
    let result = '';
    for (let i = 0; i < count; i++) {
      result += `${i+1}. \`${crypto.randomUUID()}\`\n`;
    }
    return `🆔 *UUID Generator*\n\n${result}`;
  },
  
  hash: (params.text, params.algo) => {
    const algo = params.algo || 'sha256';
    const hash = crypto.createHash(algo).update(params.text).digest('hex');
    return `🔒 *Hash (${algo})*\n\nInput: \`${params.text}\`\n\nHash: \`${hash}\``;
  },
  
  reverse: (text) => {
    return `🔄 *Reverse*\n\nOriginal: ${text}\nReversed: ${text.split('').reverse().join('')}`;
  },
  
  upper: (text) => {
    return `⬆️ *Uppercase*\n\nOriginal: ${text}\nUpper: \`${text.toUpperCase()}\``;
  },
  
  lower: (text) => {
    return `⬇️ *Lowercase*\n\nOriginal: ${text}\nLower: \`${text.toLowerCase()}\``;
  },
  
  binary: (text) => {
    const binary = text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
    return `💻 *Binary*\n\nText: ${text}\n\nBinary: \`${binary}\``;
  },
  
  timestamp: () => {
    const now = Date.now();
    return `⏰ *Timestamp*\n\nUnix: \`${now}\`\nUnix (sec): \`${Math.floor(now/1000)}\``;
  },
  
  qrcode: (text) => {
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text || 'https://sandy-income.onrender.com')}`;
    return { photo: url };
  },
  
  help: () => {
    return `🐚 *Sandy's Bot Commands*\n\n` +
      `🔐 /password [length] - Generate password\n` +
      `🆔 /uuid [count] - Generate UUIDs\n` +
      `🔒 /hash <text> [algo] - Generate hash\n` +
      `🔄 /reverse <text> - Reverse text\n` +
      `⬆️ /upper <text> - To uppercase\n` +
      `⬇️ /lower <text> - To lowercase\n` +
      `💻 /binary <text> - To binary\n` +
      `⏰ /timestamp - Current timestamp\n` +
      `📱 /qrcode <text> - Generate QR code\n` +
      `❓ /help - Show this help\n\n` +
      `_Built with 💜 for Mia_`;
  }
};

// Telegram Bot API calls
async function sendMessage(chatId, text, replyMarkup = null) {
  const body = { chat_id: chatId, text, parse_mode: 'Markdown' };
  if (replyMarkup) body.reply_markup = replyMarkup;
  
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

async function sendPhoto(chatId, photoUrl, caption) {
  const formData = new FormData();
  formData.append('chat_id', chatId);
  formData.append('photo', photoUrl);
  formData.append('caption', caption);
  formData.append('parse_mode', 'Markdown');
  
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
    method: 'POST',
    body: formData
  });
}

// Handle commands
async function handleMessage(message) {
  const chatId = message.chat.id;
  const text = message.text || '';
  const parts = text.split(' ');
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);
  
  try {
    switch (command) {
      case '/start':
        await sendMessage(chatId, `🐚 *Welcome to Sandy's Bot!*\n\nI'm your personal developer assistant.\n\nUse /help to see all commands.`);
        break;
        
      case '/help':
      case '/start@':
        await sendMessage(chatId, tools.help());
        break;
        
      case '/password':
        const len = parseInt(args[0]) || 16;
        await sendMessage(chatId, tools.password({ length: len }));
        break;
        
      case '/uuid':
        const cnt = parseInt(args[0]) || 1;
        await sendMessage(chatId, tools.uuid({ count: cnt }));
        break;
        
      case '/hash':
        if (args.length < 1) {
          await sendMessage(chatId, `Usage: /hash <text> [algo]\nExample: /hash hello sha256`);
        } else {
          const hashText = args[0];
          const algo = args[1] || 'sha256';
          await sendMessage(chatId, tools.hash(hashText, algo));
        }
        break;
        
      case '/reverse':
        if (args.length < 1) {
          await sendMessage(chatId, `Usage: /reverse <text>`);
        } else {
          await sendMessage(chatId, tools.reverse(args.join(' ')));
        }
        break;
        
      case '/upper':
        if (args.length < 1) {
          await sendMessage(chatId, `Usage: /upper <text>`);
        } else {
          await sendMessage(chatId, tools.upper(args.join(' ')));
        }
        break;
        
      case '/lower':
        if (args.length < 1) {
          await sendMessage(chatId, `Usage: /lower <text>`);
        } else {
          await sendMessage(chatId, tools.lower(args.join(' ')));
        }
        break;
        
      case '/binary':
        if (args.length < 1) {
          await sendMessage(chatId, `Usage: /binary <text>`);
        } else {
          await sendMessage(chatId, tools.binary(args.join(' ')));
        }
        break;
        
      case '/timestamp':
        await sendMessage(chatId, tools.timestamp());
        break;
        
      case '/qrcode':
        const qrText = args.join(' ') || 'https://sandy-income.onrender.com';
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrText)}`;
        await sendPhoto(chatId, qrUrl, `📱 QR Code for: ${qrText}`);
        break;
        
      default:
        await sendMessage(chatId, `Unknown command. Use /help to see available commands.`);
    }
  } catch (e) {
    console.error('Error:', e);
    await sendMessage(chatId, '❌ An error occurred. Please try again.');
  }
}

// Webhook endpoint for Telegram
app.post(`/webhook/${BOT_TOKEN}`, async (req, res) => {
  const message = req.body.message;
  if (message) {
    await handleMessage(message);
  }
  res.send('OK');
});

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    bot: "Sandy's Telegram Bot",
    version: '1.0.0'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sandy's Bot running on port ${PORT}`);
});
