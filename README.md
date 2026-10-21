# Pillar — User Registration and Dashboard

Sign up, sign in, view and edit your saved profile, log out.
React + Vite + Tailwind on the front, Express + Prisma + PostgreSQL on the back, session in an HTTP-only cookie.

```
pillar/
├── backend/    Express API, Prisma schema + migration, integration tests
└── frontend/   React app (sign-up, sign-in, dashboard)
```

## Run it locally

**Prerequisites:** Node.js 20+, PostgreSQL 14+.

1. **Create the database**
   ```bash
   createdb pillar          # or: psql -c "CREATE DATABASE pillar;"
   ```
2. **Backend**
   ```bash
   cd backend
   cp .env.example .env     # on Windows: copy .env.example .env
   # edit .env: set DATABASE_URL and a JWT_SECRET of 32+ random characters
   npm install
   npx prisma migrate deploy   # applies prisma/migrations
   npx prisma generate
   npm run dev                 # http://localhost:4000
   ```
3. **Frontend** (new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev                 # http://localhost:5173
   ```
   Vite proxies `/api` to the backend, so the session cookie is same-origin in development.

Open http://localhost:5173 and create an account.

## API

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | – | Create account, start session (201) |
| POST | `/api/auth/login` | – | Sign in with email or username |
| POST | `/api/auth/logout` | – | Clear the session cookie |
| GET | `/api/users/me` | cookie | Current user's profile |
| PATCH | `/api/users/me` | cookie | Update `fullName`, `phone`, `dateOfBirth`, `gender` |

Errors look like `{ "message": "...", "errors": { "email": "..." } }`; the frontend maps `errors` onto the matching form fields.

## Tests

Automated API tests (`backend/tests/auth.test.js`) cover registration, missing fields, invalid email, password mismatch, duplicates, wrong and correct login, unauthenticated access, persistence across requests, profile updates, and logout. They use the real database from `DATABASE_URL` and only delete rows whose email ends in `@example.test`, so point them at a development database.

```bash
cd backend && npm test
```

Check these by hand in the browser:
- Dashboard URL while signed out redirects to sign-in.
- Refresh on the dashboard keeps you signed in with the same data.
- Edit profile, save, refresh: changes persist.
- Log out, then press Back: you land on sign-in.
- Resize from phone width to desktop on all three pages.

## Security notes

- Passwords: bcrypt (12 rounds), never returned by the API. Server-side validation mirrors the client's Zod rules.
- Session: signed JWT in an `HttpOnly`, `SameSite=Lax` cookie (`Secure` in production). The user is always taken from the token, never from client input.
- Unique constraints on `email` and `username` are enforced by PostgreSQL; the API also pre-checks to report friendly errors.
- Login and register are rate-limited (20 requests / 15 minutes / IP). Helmet and a CORS allow-list for `CLIENT_ORIGIN` are on.
- Logout clears the cookie. Because the JWT is stateless, a copied token stays valid until it expires (`SESSION_DAYS`). If you need instant server-side revocation, add a `tokenVersion` column and check it in `requireAuth`.
- Account status is shown as "Active" for every account because the schema has no status column.

## Deploying

Serve the frontend and API under the same site if you can (e.g. `app.example.com` and `api.example.com`) and keep `COOKIE_SAME_SITE=lax`. For fully separate sites use `COOKIE_SAME_SITE=none` over HTTPS. Set `NODE_ENV=production`, `CLIENT_ORIGIN` to the real frontend origin, `VITE_API_URL` at build time, and run `npx prisma migrate deploy` on release.
