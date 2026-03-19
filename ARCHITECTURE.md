# ShopSmart — Architecture & Design Documentation

## 1. System Architecture

ShopSmart is a full-stack web application with a clear separation between frontend and backend, deployed on separate platforms.

```
┌──────────────────────────────────────────────────────────────┐
│                        GitHub Repository                     │
│   ┌──────────┐    ┌──────────┐    ┌──────────────────────┐  │
│   │  client/ │    │ server/  │    │  .github/workflows/  │  │
│   │ (React)  │    │(Express) │    │  backend.yml         │  │
│   └────┬─────┘    └────┬─────┘    │  frontend.yml        │  │
│        │              │           │  deploy.yml          │  │
│        │   CI/CD      │           └──────────────────────┘  │
└────────┼──────────────┼───────────────────────────────────── ┘
         │              │
    ┌────▼────┐    ┌────▼────────┐
    │  Vercel │    │  EC2 / Render│
    │(Frontend│    │  (Backend)  │
    │   SPA)  │    │  Port 5001  │
    └─────────┘    └────────────┘
                        │
                   ┌────▼────┐
                   │ In-Memory│
                   │  Store   │
                   └─────────┘
```

---

## 2. Tech Stack

| Layer       | Technology             | Purpose                          |
|-------------|------------------------|----------------------------------|
| Frontend    | React 18 + Vite 5      | UI framework + dev server/bundler|
| Styling     | Vanilla CSS            | Custom responsive design system  |
| Backend     | Node.js + Express 4    | REST API server                  |
| Testing (FE)| Vitest + RTL           | Unit & component tests           |
| Testing (BE)| Jest + Supertest       | Unit & integration tests         |
| E2E Testing | Playwright             | Browser-level flow testing       |
| Linting     | ESLint + Prettier      | Code quality & formatting        |
| CI/CD       | GitHub Actions         | Automated pipeline               |
| Deployment  | EC2 (via SSH Actions)  | Production server                |
| Monitoring  | PM2                    | Process management               |
| Deps        | Dependabot             | Automated dependency updates     |

---

## 3. Project Structure

```
shopcart-newton/
├── .github/
│   ├── workflows/
│   │   ├── backend.yml      # Backend CI pipeline
│   │   ├── frontend.yml     # Frontend CI pipeline
│   │   └── deploy.yml       # EC2 deployment pipeline
│   └── dependabot.yml       # Automated dependency updates
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CartItem.jsx
│   │   │   └── __tests__/   # Component unit tests
│   │   ├── App.jsx          # Root component
│   │   ├── App.test.jsx     # App integration test
│   │   └── index.css        # Global styles
│   ├── .eslintrc.json
│   └── package.json
├── server/                  # Express backend
│   ├── src/
│   │   ├── app.js           # Express app + routes
│   │   └── index.js         # Entry point / server listen
│   ├── tests/
│   │   ├── unit/            # Unit tests
│   │   └── integration/     # Integration tests
│   ├── .eslintrc.json
│   └── package.json
├── e2e/
│   └── tests/
│       └── shopping-flow.spec.js   # Playwright E2E tests
├── scripts/
│   ├── setup.sh             # Idempotent setup
│   └── deploy.sh            # Idempotent deployment
├── playwright.config.js
├── .prettierrc
└── render.yaml
```

---

## 4. CI/CD Workflow

### GitHub Actions Pipelines

**backend.yml** — triggers on push/PR touching `server/**`:
1. Checkout code
2. Setup Node.js 18 with npm cache
3. `npm ci` — reproducible install
4. `npm run lint` — ESLint check (fails PR on violations)
5. `npm test` — Jest unit + integration tests

**frontend.yml** — triggers on push/PR touching `client/**`:
1. Checkout code
2. Setup Node.js 18 with npm cache
3. `npm ci`
4. `npm run lint` — ESLint check
5. `npm test -- --run` — Vitest tests
6. `npm run build` — production build (validates bundle)

**deploy.yml** — triggers on push to `main`:
1. SSH into EC2 using `appleboy/ssh-action`
2. Executes `scripts/deploy.sh` on the server

### PR Gate: Any PR with ESLint violations will fail the CI check and cannot be merged until fixed.

---

## 5. API Design

| Method | Endpoint              | Description                    |
|--------|-----------------------|--------------------------------|
| GET    | /api/health           | Health check                   |
| GET    | /api/products         | List all products               |
| GET    | /api/products/:id     | Get single product              |
| GET    | /api/cart             | Get current cart + total        |
| POST   | /api/cart             | Add product to cart             |
| DELETE | /api/cart/:productId  | Remove product from cart        |

---

## 6. Testing Strategy

### Unit Tests
- **Backend**: Each API endpoint tested in isolation (status codes, response shapes, error cases)
- **Frontend**: Each component tested for rendering, props, event handling

### Integration Tests
- **Backend**: Full request lifecycle (route → middleware → response validation)
- **Frontend**: App component with mocked API (state updates, DOM assertions)

### E2E Tests (Playwright)
- Simulates real browser interactions
- Tests the complete user journey: load → browse products → add to cart → view cart → remove → checkout

### Test Coverage Map

| What               | Where                            | Tool       |
|--------------------|----------------------------------|------------|
| Health endpoint    | server/tests/unit/               | Jest       |
| Products endpoint  | server/tests/unit/               | Jest       |
| Cart API           | server/tests/integration/        | Jest       |
| Header component   | client/src/components/__tests__/ | Vitest+RTL |
| ProductCard        | client/src/components/__tests__/ | Vitest+RTL |
| CartItem           | client/src/components/__tests__/ | Vitest+RTL |
| App integration    | client/src/App.test.jsx          | Vitest+RTL |
| Full user flow     | e2e/tests/                       | Playwright |

---

## 7. Idempotency Principles

All scripts are idempotent — running them multiple times produces the same result:

| Bad (non-idempotent) | Good (idempotent) |
|---|---|
| `mkdir project` | `mkdir -p project` |
| `npm install` | `npm ci` |
| `pm2 start app.js` | `pm2 startOrRestart app.js` |
| Overwriting .env blindly | `if [ ! -f .env ]; then ... fi` |
| `git pull` blindly | `git fetch --all && git reset --hard origin/main` |

---

## 8. Design Decisions

1. **In-memory cart store**: Chosen to keep the backend simple, demonstrating all REST patterns without introducing a database as a dependency that could complicate CI/CD.
2. **Separate CI workflows per layer**: `backend.yml` and `frontend.yml` are path-filtered — a backend change won't trigger a frontend CI run and vice versa, saving CI minutes.
3. **Playwright API mocking in E2E**: E2E tests mock the API using `page.route()` so they are deterministic and don't require a running backend, ensuring they work in CI without spinning up multiple services.
4. **ESLint max-warnings 0**: Any ESLint warning is treated as an error, ensuring code quality gates are strict.
5. **PM2 for process management**: `pm2 startOrRestart` ensures the deployment script works whether the app is already running or starting fresh.

---

## 9. Challenges & Solutions

| Challenge | Solution |
|---|---|
| E2E tests requiring a live backend | Used Playwright's `page.route()` to mock API at browser level |
| ESLint config conflict between CJS (server) and ESM (client) | Separate `.eslintrc.json` per directory with correct `env` and `parserOptions` |
| Cart state reset between integration tests | Jest clears module cache; cart is re-initialized on each test file run |
| Making CI pipelines path-specific | Used `paths:` filter in GitHub Actions triggers |
| Idempotent deployment | `pm2 startOrRestart` + `git reset --hard` instead of pull + start |
