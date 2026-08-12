# Buildify - Frontend

React client for **Buildify**, a marketplace for construction materials and
skilled workers. It talks to the FastAPI backend in `../backend`; there is no mock data
layer and no local fixtures - every product, worker, order and notification on
screen came from the API. The one thing shipped locally is material
photography, and only as a fallback for listings with no uploads - see below.

## Running it

The backend has to be up first, because this app has nothing to show without it.

```bash
# 1. Backend (from ../backend) - api on :8000, MySQL on :3307, Adminer on :8080
make bootstrap        # docker compose up + alembic upgrade + seed data

# 2. Frontend
npm install
npm run dev           # http://localhost:5173
```

`http://localhost:5173` is already in the backend's `CORS_ORIGINS`, so the dev
server calls the API directly - no proxy needed.

### Environment

```bash
cp .env.example .env
```

`VITE_API_URL` is the only variable, and it does two things: it is the base URL
for every request, and `vite.config.js` reads it to build the `connect-src` of
the Content-Security-Policy injected into `index.html`. Point it at a deployed
backend and the CSP follows automatically.

### Demo accounts

Seeded by `make seed`, all with the password `DemoPass!2026`:

| Email | Role | What you can reach |
| --- | --- | --- |
| `client@demo.com` | CLIENT | Cart, checkout, orders, hiring, reviews |
| `vendor@demo.com` | VENDOR | Product catalogue, order fulfilment queue |
| `worker@demo.com` | WORKER | Incoming job requests, availability, ratings |
| `admin@demo.com` | ADMIN | Everything, plus vendor verification |

## Layout

```
src/
  services/     One axios instance + a module per API area. adapters.js is the
                single place backend payloads become UI shapes.
  routes/       Route table and ProtectedRoute (sign-in + role gate).
  pages/        One component per route.
  components/   Shared UI; components/ui/ is the primitive set.
  context/      CartContext - the server cart, exposed as a local-looking API.
  store/        Redux, holding only "who is signed in".
  constants/    Filter/sort options, static page copy, and the material photo
                library map. No product data.
public/
  images/materials/   Freely licensed photographs of the materials, plus the
                      ATTRIBUTION.md they are licensed on.
```

### Material photography

Product images belong to the vendor, and the API serves them from R2 - but
until a bucket is configured it returns none, which left every card and cart
row showing a drawn placeholder. `constants/materialImages.js` matches a
listing to a photograph of that material by keyword (name + category), so
listings added later are covered without editing the map.

A vendor's own upload always wins; the library photo is only the fallback, is
labelled as such on the detail page, and carries its credit there. Sources and
licences are in `public/images/materials/ATTRIBUTION.md`.

### Where state lives

- **Server data** - react-query, keyed per resource. It is the cache of record.
- **Auth** - Redux, rehydrated from `localStorage` and then *revalidated against
  `/users/me` on boot* (`hooks/useAuthBootstrap.js`), because a stored token may
  have expired or been revoked elsewhere.
- **Filters, forms, open/closed** - component state.

The cart is not in Redux. It lives on the server, so a second copy here would
only be something to keep in sync.

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built output |
| `npm run lint` | Oxlint |

## Notes on security

- Route guards are a **usability** measure, not the boundary. Every endpoint
  re-checks role and ownership server-side; the guards exist so a signed-out
  visitor gets the login form instead of a wall of 401s.
- Tokens are held in `localStorage` (the API returns them in the response body
  rather than as httpOnly cookies). Everything that touches storage goes through
  `services/tokenStore.js`, so moving to cookies is a one-file change.
- A CSP is injected at build time with `script-src 'self'`, which is the control
  that matters given the above.
