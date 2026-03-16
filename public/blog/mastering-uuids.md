# Mastering UUIDs: When and How to Use Them

Universal Unique Identifiers (UUIDs) are everywhere in software development. Learn when to use them and how to generate them efficiently.

## What is a UUID?

A UUID is a 128-bit identifier that is practically unique across all systems without requiring a central authority.

```
Format: 550e8400-e29b-41d4-a716-446655440000
```

## Why Use UUIDs?

- **No collision** - Trillions of possibilities
- **Distributed** - No central server needed
- **Unpredictable** - Hard to guess
- **Portable** - Works across systems

## Types of UUIDs

| Version | Description |
|---------|-------------|
| v1 | Timestamp-based |
| v4 | Random (most common) |
| v7 | Time-ordered (new!) |

## Generating UUIDs with Sandy's API

```bash
# Single UUID
curl "https://sandy-income.onrender.com/api/uuid"

# Multiple UUIDs
curl "https://sandy-income.onrender.com/api/uuid?count=10"
```

## When to Use UUIDs

✅ **Use UUIDs for:**
- Database primary keys
- Session IDs
- Transaction IDs
- API keys
- Distributed systems

❌ **Don't use for:**
- Sequential counters (use integers)
- Human-readable IDs (use custom formats)
- Performance-critical paths (UUIDs are larger)

## UUID v7: The New Standard

UUID v7 combines timestamp with randomness - perfect for databases!

```bash
curl "https://sandy-income.onrender.com/api/ulid"
```

## Try It Now

```bash
# Generate UUID
curl "https://sandy-income.onrender.com/api/uuid"

# Or via Telegram
# @sandy_assistant_bot
# /uuid 5
```

---

*Share if you learned something!* 🐚
