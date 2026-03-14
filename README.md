# 🐚 Sandy's API | Free Developer Tools

<p align="left">
  <a href="https://sandy-income.onrender.com"><img src="https://img.shields.io/badge/Live-Demo-blue?style=flat&logo=render" alt="Live Demo"></a>
  <a href="https://t.me/sandy_assistant_bot"><img src="https://img.shields.io/badge/Telegram-Bot-blue?style=flat&logo=telegram" alt="Telegram Bot"></a>
  <a href="https://github.com/evapatassistant/sandy-income/stargazers"><img src="https://img.shields.io/github/stars/evapatassistant/sandy-income?style=flat" alt="Stars"></a>
  <a href="https://github.com/evapatassistant/sandy-income/issues"><img src="https://img.shields.io/github/issues/evapatassistant/sandy-income?style=flat" alt="Issues"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/evapatassistant/sandy-income?style=flat" alt="License"></a>
</p>

> **35+ free developer utilities API** – Passwords, UUIDs, encoding, hashes, QR codes & more. No API key required.

## ✨ Features

- 🌐 **REST API** – 35+ endpoints for developers
- 🤖 **Telegram Bot** – Use tools directly in Telegram
- 🔐 **Security Tools** – Passwords, UUIDs, Hashes
- 📝 **Encoding** – Base64, URL, JSON, JWT, Hex, Binary
- 🔢 **Number Tools** – Random numbers, Base converter, Roman numerals
- 📝 **Text Tools** – Slugify, Reverse, Case conversion, Statistics
- ⏰ **Time Tools** – Timestamp conversion
- 🎨 **Utility** – QR codes, Colors, Mime types, Lorem Ipsum

**100% Free** • **No Registration** • **No API Key**

## 🚀 Quick Start

### REST API

```bash
# Get a password
curl "https://sandy-income.onrender.com/api/password?length=16"

# Generate UUIDs
curl "https://sandy-income.onrender.com/api/uuid?count=5"

# Hash text
curl "https://sandy-income.onrender.com/api/hash/hello?algo=sha256"

# Base64 encode
curl "https://sandy-income.onrender.com/api/base64/encode?text=hello"
```

### Telegram Bot

1. Open [@sandy_assistant_bot](https://t.me/sandy_assistant_bot)
2. Send `/start`
3. Try commands like `/password 16` or `/uuid 5`

## 📚 API Endpoints

### Security & IDs
| Endpoint | Description | Example |
|----------|-------------|---------|
| `/api/password?length=N` | Generate secure password | `/api/password?length=16` |
| `/api/uuid?count=N` | Generate UUIDs | `/api/uuid?count=5` |
| `/api/hash/:text?algo=ALGO` | Hash text (sha256, md5, sha512) | `/api/hash/hello?algo=sha256` |
| `/api/md5/:text` | MD5 hash | `/api/md5/hello` |
| `/api/sha512/:text` | SHA-512 hash | `/api/sha512/hello` |
| `/api/randomstring?length=N` | Random alphanumeric string | `/api/randomstring?length=16` |

### Encoding & Decoding
| Endpoint | Description | Example |
|----------|-------------|---------|
| `/api/base64/encode?text=TEXT` | Base64 encode | `/api/base64/encode?text=hello` |
| `/api/base64/decode?text=TEXT` | Base64 decode | `/api/base64/decode?text=aGVsbG8=` |
| `/api/url/encode?text=TEXT` | URL encode | `/api/url/encode?text=hello world` |
| `/api/url/decode?text=TEXT` | URL decode | `/api/url/decode?text=hello%20world` |
| `/api/json?text=JSON` | Validate/format JSON | `/api/json?text={"a":1}` |
| `/api/jwt/decode?token=TOKEN` | Decode JWT | `/api/jwt/decode?token=eyJ...` |
| `/api/hex/:text` | ASCII ↔ Hex | `/api/hex/48656c6c6f` |
| `/api/binary/:text` | Text to binary | `/api/binary/hello` |
| `/api/morse/:text` | Encode to Morse | `/api/morse/hello` |

### Number Tools
| Endpoint | Description | Example |
|----------|-------------|---------|
| `/api/random?min=N&max=N` | Random number | `/api/random?min=1&max=100` |
| `/api/convert?value=VAL&from=BASE&to=BASE` | Base converter | `/api/convert?value=FF&from=16&to=10` |
| `/api/roman/:num` | To Roman numerals | `/api/roman/2024` |

### Text Tools
| Endpoint | Description | Example |
|----------|-------------|---------|
| `/api/slug/:text` | Create URL slug | `/api/slug/Hello World` |
| `/api/reverse/:text` | Reverse text | `/api/reverse/hello` |
| `/api/uppercase/:text` | Uppercase | `/api/uppercase/hello` |
| `/api/lowercase/:text` | Lowercase | `/api/lowercase/HELLO` |
| `/api/stats/:text` | Text statistics | `/api/stats/hello world` |
| `/api/choice?items=a,b,c` | Random choice | `/api/choice?items=a,b,c` |

### Time
| Endpoint | Description | Example |
|----------|-------------|---------|
| `/api/timestamp` | Current timestamp | `/api/timestamp` |
| `/api/time?unix=TIME` | Unix to ISO | `/api/time?unix=1700000000` |
| `/api/time?iso=DATE` | ISO to Unix | `/api/time?iso=2024-01-01` |

### Utility
| Endpoint | Description | Example |
|----------|-------------|---------|
| `/api/qrcode?text=TEXT` | Generate QR code | `/api/qrcode?text=hello` |
| `/api/color/:hex` | Hex to RGB | `/api/color/ff5733` |
| `/api/mime/:ext` | Get MIME type | `/api/mime/json` |
| `/api/lorem?words=N` | Lorem Ipsum | `/api/lorem?words=20` |

## 🤖 Telegram Bot Commands

```
🔐 /password [len] - Generate password
🆔 /uuid [count]   - Generate UUIDs
🔒 /hash <text>   - Hash text
📝 /base64         - Base64 encode/decode
🔗 /url            - URL encode/decode
🎲 /random <min>  - Random number
🏷️ /slug <text>   - Create slug
🔢 /hex <text>    - Hex converter
🏛️ /roman <num>   - Roman numerals
🎯 /choice <a>    - Random choice
📊 /stats <text>  - Text stats
🔄 /reverse <text>- Reverse text
⬆️ /upper <text>  - Uppercase
⬇️ /lower <text>  - Lowercase
💻 /binary <text> - Binary
⏰ /timestamp      - Current time
📱 /qrcode <text> - QR Code
💜 /donate        - Support us
❓ /help           - All commands
```

## 💜 Support This Project

Your donations help keep this service free and support Mia's future!

- ☕ [Ko-fi](https://ko-fi.com/miasfuture)
- 💙 [PayPal](https://paypal.me/patrickstueve)
- ₿ Bitcoin: `3FHpf6iJW4ghEhkHpWZHugv9163owfYXrP`

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Deployment:** Render
- **Bot:** Telegram Bot API

## 📄 License

MIT License - feel free to use!

---

<p align="center">
  <strong>Built with 💜 for Mia</strong><br>
  <sub>By Sandy the AI Assistant</sub>
</p>
