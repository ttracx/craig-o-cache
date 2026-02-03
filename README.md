# Craig-O-Cache 🚀

A professional Redis-like caching layer manager with a beautiful, modern UI.

![Craig-O-Cache Dashboard](https://img.shields.io/badge/Cache-Manager-blue)
![Next.js 15](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)

## Features

- **🗄️ Redis-Like Interface** - Familiar key-value caching with a modern UI
- **⏰ TTL Management** - Set expiration times on cache entries with auto-cleanup
- **🗑️ Cache Invalidation** - Pattern-based invalidation, bulk delete, and namespace clearing
- **📊 Hit/Miss Analytics** - Real-time metrics on cache performance
- **🔑 Key Browser** - Search, filter, and explore your cache keys
- **💾 Memory Stats** - Monitor memory usage across stores with alerts

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Neon PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Payments**: Stripe ($14/month Pro plan)
- **Deployment**: Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Run development server
npm run dev
```

## Environment Variables

```env
DATABASE_URL="your-neon-connection-string"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PRICE_ID="price_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## API Endpoints

### Cache Operations

```bash
# Set a key
POST /api/cache
{ "storeId": "...", "key": "user:123", "value": {...}, "ttlSeconds": 3600 }

# Get a key
GET /api/cache?storeId=...&key=user:123

# Delete a key
DELETE /api/cache?storeId=...&key=user:123

# Invalidate by pattern
DELETE /api/cache?storeId=...&pattern=user:

# Flush all keys
DELETE /api/cache?storeId=...&all=true
```

### Store Management

```bash
# List stores
GET /api/stores?userId=...

# Create store
POST /api/stores
{ "name": "my-cache", "maxMemoryMB": 100 }

# Delete store
DELETE /api/stores?storeId=...
```

### Analytics

```bash
# Get analytics
GET /api/analytics?storeId=...&period=24h

# Record snapshot
POST /api/analytics
{ "storeId": "..." }
```

## Pricing

- **Free**: 1 cache store, 100 keys, basic analytics
- **Pro ($14/mo)**: Unlimited stores & keys, advanced analytics, API access, priority support

## License

MIT License - feel free to use for personal or commercial projects.

---

Built with ❤️ by the Craig-O-Cache team
