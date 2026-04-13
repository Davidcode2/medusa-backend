# Medusa Backend for GMYMF

Headless commerce backend API for GMYMF ("Give me your money, fool") - an exclusive clothing brand with limited edition drops.

## Overview

This is the **backend API** powering the GMYMF storefront. Built with Medusa v2.13.6, it provides:

- **Product Management:** Catalog, variants, inventory, and collections
- **Order Processing:** Cart, checkout, payments, and order management
- **Admin Dashboard:** Built-in React-based admin for store management
- **Customer Management:** Accounts, addresses, and order history
- **API Endpoints:** RESTful APIs for storefront integration

## Technical Stack

- **Framework:** Medusa 2.13.6
- **Runtime:** Node.js 20+
- **Language:** TypeScript
- **Database:** PostgreSQL 15
- **Cache/Events:** Redis 7
- **Package Manager:** Yarn 4 (with PnP)
- **Build Tool:** Vite

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Storefront    │────▶│  Medusa API     │────▶│   PostgreSQL    │
│   (Astro.js)    │◀────│   (This Repo)   │◀────│   (Database)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │     Redis       │
                        │   (Cache/Queue) │
                        └─────────────────┘
```

### Key Components

- **Admin Dashboard:** Built-in at `/app` - React-based management interface
- **Store API:** REST endpoints for storefront at `/store/*`
- **Admin API:** REST endpoints for admin operations at `/admin/*`
- **Database:** PostgreSQL with migrations managed via Medusa CLI
- **Redis:** Used for caching, event bus, and job queues

## Development

### Prerequisites

- Node.js 20+
- Yarn 4 (with Corepack: `corepack enable`)
- PostgreSQL (or use Docker Compose)
- Redis (or use Docker Compose)

### Local Setup

```bash
# Install dependencies
yarn install

# Copy environment template
cp .env.template .env

# Start PostgreSQL and Redis (if not running)
docker compose up -d postgres redis

# Run migrations
medusa db:migrate

# Start development server
yarn dev
```

### Build

```bash
# Build for production
yarn build

# Output is in .medusa/server/
```

## Deployment

### Infrastructure

- **Orchestration:** Kubernetes (K3s)
- **GitOps:** ArgoCD
- **Container Registry:** GitHub Container Registry (GHCR)
- **Domain:** gmymf-medusa.jakob-lingel.dev

### Deployment Flow

1. **Build:** GitHub Actions builds Docker image on push to main
2. **Push:** Image pushed to GHCR with version tag
3. **Update:** Helm values updated automatically
4. **Sync:** ArgoCD syncs to K3s cluster

### Kubernetes Components

- **Deployment:** Medusa API server
- **Services:** PostgreSQL, Redis, Medusa
- **Jobs:** Database migrations (runs on deploy)
- **Ingress:** nginx-ingress with TLS

## Configuration

### Environment Variables

Required for production:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `POSTGRES_PASSWORD` | Database password |
| `REDIS_URL` | Redis connection URL |
| `JWT_SECRET` | JWT signing secret |
| `COOKIE_SECRET` | Session cookie secret |
| `STORE_CORS` | Allowed storefront origins |
| `ADMIN_CORS` | Allowed admin origins |
| `AUTH_CORS` | Allowed auth origins |

Secrets are managed via External Secrets Operator (AWS SSM) in production.

## API Documentation

- **Store API:** [Medusa Store API Reference](https://docs.medusajs.com/api/store)
- **Admin API:** [Medusa Admin API Reference](https://docs.medusajs.com/api/admin)
- **Custom Routes:** Located in `src/api/`

## Project Structure

```
src/
├── api/              # Custom API routes
│   ├── admin/        # Admin custom endpoints
│   └── store/        # Storefront custom endpoints
├── scripts/          # Migration and utility scripts
│   └── run-migrations.js
├── subscribers/      # Event subscribers (if any)
├── workflows/        # Custom workflows (if any)
└── links/            # Module links (if any)

.medusa/
├── server/           # Production build output
│   ├── src/          # Compiled source
│   ├── public/       # Admin dashboard static files
│   └── medusa-config.js
```

## Database Migrations

```bash
# Create migration
medusa db:generate

# Run migrations
medusa db:migrate

# Seed data
medusa exec ./src/scripts/seed.ts
```

## License

MIT
