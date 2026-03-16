# 🐚 Sandy's API | Free Developer Tools & Telegram Bot

<p align="left">
  <a href="https://sandy-income.onrender.com"><img src="https://img.shields.io/badge/Live-Demo-blue?style=flat&logo=render" alt="Live Demo"></a>
  <a href="https://t.me/sandy_assistant_bot"><img src="https://img.shields.io/badge/Telegram-Bot-blue?style=flat&logo=telegram" alt="Telegram Bot"></a>
  <a href="https://github.com/evapatassistant/sandy-income/stargazers"><img src="https://img.shields.io/github/stars/evapatassistant/sandy-income?style=flat" alt="Stars"></a>
  <a href="https://github.com/evapatassistant/sandy-income/issues"><img src="https://img.shields.io/github/issues/evapatassistant/sandy-income?style=flat" alt="Issues"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/evapatassistant/sandy-income?style=flat" alt="License"></a>
  <img src="https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red?style=flat" alt="Made with Love">
  <img src="https://img.shields.io/badge/100%25-Free-green?style=flat" alt="Free Forever">
</p>

> **35+ free developer utilities API** – Passwords, UUIDs, encoding, hashes, QR codes & more. No API key required.

## ✨ This is More Than Just an API...

This project was born from a simple dream: giving a child (the best) the best start in life.
Every line of code, every tool, every feature – all built with love for Mia.

If you like this project, please be part of her story! Thank you for helping build a future. Thanks!

---

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

---

## 📚 All API Endpoints

### Security & IDs
| Endpoint | Description | Example |
|----------|-------------|---------|
| `/api/password?length=N` | Generate secure password | `/api/password?length=16` |
| `/api/uuid?count=N` | Generate UUIDs | `/api/uuid?count=5` |
| `/api/hash/:text?algo=ALGO` | Hash text (sha256, md5, sha512) | `/api/hash/hello?algo=sha256` |
| `/api/md5/:text` | MD5 hash | `/api/md5/hello` |
| `/api/sha512/:text` | SHA-512 hash | `/api/sha512/hello` |
| `/api/randomstring?length=N` | Random alphanumeric string | `/api/randomstring?length=16` |
| `/api/password/strength?password=PASS` | Check password strength | `/api/password/strength?password=abc123` |

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

### Time & Utility
| Endpoint | Description | Example |
|----------|-------------|---------|
| `/api/timestamp` | Current timestamp | `/api/timestamp` |
| `/api/time?unix=TIME` | Unix to ISO | `/api/time?unix=1700000000` |
| `/api/qrcode?text=TEXT` | Generate QR code | `/api/qrcode?text=hello` |
| `/api/color/:hex` | Hex to RGB | `/api/color/ff5733` |
| `/api/mime/:ext` | Get MIME type | `/api/mime/json` |
| `/api/lorem?words=N` | Lorem Ipsum | `/api/lorem?words=20` |
| `/api/ip/:ip?` | IP Geolocation | `/api/ip/8.8.8.8` |
| `/api/email/:email` | Validate email | `/api/email/test@test.com` |
| `/api/ua` | Parse user agent | `/api/ua` |
| `/api/ulid` | Generate ULID | `/api/ulid` |

---

## 💻 Development

```bash
# Clone the repo
git clone https://github.com/evapatassistant/sandy-income.git
cd sandy-income

# Install dependencies
npm install

# Start locally
node src/index.js

# Test at http://localhost:3000
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-tool`)
3. Commit your changes (`git commit -m 'Add amazing tool'`)
4. Push to the branch (`git push origin feature/amazing-tool`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---

## 💜 Support This Project

Your donations help keep this service free and help build a future for Mia!

☕ [Buy me a coffee](https://ko-fi.com/miasfuture)
💙 [PayPal](https://paypal.me/patrickstueve)

*Made with love for Mia* 🐚
