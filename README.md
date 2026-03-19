# ShopSmart

A full-stack shopping cart application with a React frontend and Express backend.

## Tech Stack

- **Frontend**: React 18 + Vite 5
- **Backend**: Node.js + Express 4
- **Testing**: Vitest (FE), Jest + Supertest (BE), Playwright (E2E)
- **Linting**: ESLint + Prettier
- **CI/CD**: GitHub Actions
- **Deployment**: EC2 (backend), Vercel/Render (frontend)

## Project Structure

```
shopcart-newton/
├── .github/
│   ├── workflows/          # CI/CD pipelines
│   └── dependabot.yml      # Auto dependency updates
├── client/                 # React frontend
├── server/                 # Express backend
├── e2e/                    # Playwright E2E tests
├── scripts/                # Idempotent setup/deploy scripts
├── playwright.config.js
└── ARCHITECTURE.md         # Full architecture docs
```

## Quick Start

```bash
# Setup (idempotent)
bash scripts/setup.sh

# Run backend
cd server && npm run dev

# Run frontend
cd client && npm run dev
```

## Running Tests

```bash
# Backend unit + integration tests
cd server && npm test

# Frontend component tests
cd client && npm test -- --run

# E2E tests (requires frontend running)
npx playwright test
```

## Linting

```bash
cd server && npm run lint
cd client && npm run lint
```

## CI/CD Pipelines

| Workflow | Trigger | Steps |
|---|---|---|
| `backend.yml` | push/PR to `server/**` | install → lint → test |
| `frontend.yml` | push/PR to `client/**` | install → lint → test → build |
| `deploy.yml` | push to `main` | SSH → EC2 → deploy |

## EC2 Deployment

1. Add GitHub secrets: `EC2_HOST`, `EC2_USERNAME`, `EC2_SSH_KEY`
2. Push to `main` — `deploy.yml` SSHes into EC2 and runs `scripts/deploy.sh`

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | Health check |
| GET | /api/products | List products |
| GET | /api/products/:id | Get product |
| GET | /api/cart | View cart |
| POST | /api/cart | Add to cart |
| DELETE | /api/cart/:id | Remove from cart |

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full documentation.
