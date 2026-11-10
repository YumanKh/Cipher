# Cipher — Zero-Knowledge Password Manager API

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)

REST API for **Cipher**, a zero-knowledge password manager. The server stores only encrypted data: it never sees a master password, an encryption key, or any plaintext note or password. All encryption and decryption happen on the client.

> **Status:** the backend is feature-complete and covered by integration tests. The client (React) and its cryptography layer are the next phase.

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Zero-knowledge design](#zero-knowledge-design)
- [Authentication and sessions](#authentication-and-sessions)
- [Security measures](#security-measures)
- [Data model](#data-model)
- [API reference](#api-reference)
- [Getting started](#getting-started)
- [Testing](#testing)
- [Known limitations and roadmap](#known-limitations-and-roadmap)

## Features

- Account registration, login, logout and token refresh
- `prelogin` endpoint so the client can fetch its key-derivation salt before logging in
- Encrypted notes and passwords (CRUD, favorites)
- Account management: update profile, change password, delete account
- Strict per-user data isolation
- Integration test suite running against a dedicated test database

## Tech stack

| Area | Choice |
|---|---|
| Runtime / language | Node.js, TypeScript (ESM) |
| Framework | Express 5 |
| Database / ORM | PostgreSQL, Prisma 6 |
| Validation | Zod 4 |
| Auth | JWT access tokens, rotating refresh tokens in httpOnly cookies, bcrypt |
| Hardening | helmet, CORS, express-rate-limit |
| Tests | Vitest, supertest |

## Architecture

The code follows a layered architecture. Each layer has one job and only talks to the layer below it.

```
route  →  controller  →  service  →  repository  →  Prisma / PostgreSQL
```

| Layer | Responsibility |
|---|---|
| Route | Maps an HTTP method and path to a controller, applies middlewares |
| Controller | HTTP only: validates input with Zod, chooses status codes, sets cookies |
| Service | Business rules: ownership checks, password verification, hashing |
| Repository | Database access only (Prisma) |

```
backend/
├── prisma/            # schema and migrations
└── src/
    ├── api/
    │   ├── controllers/
    │   ├── middlewares/   # requireAuth, rate limiters
    │   ├── repositories/
    │   ├── routes/
    │   └── services/
    ├── lib/               # token and password helpers
    ├── schemas/           # Zod schemas
    └── tests/             # integration tests
```

## Zero-knowledge design

The server cannot decrypt user data. The client derives a key from the master password, and that key protects a random data key (`cryptingKey`). Notes and passwords are encrypted with the data key, each row with its own `iv`.

```
register:
  kdfSalt = random bytes                                  // stored on the server, not secret
  cryptingKey = random key                                // never leaves the client in clear
  key = KDF(password, kdfSalt)                            // never stored
  sent to the server = encrypt(key, iv2, cryptingKey)     // stored in the cryptingKey column

notes / passwords:
  ciphertext = encrypt(cryptingKey, iv, data)             // stored with its iv

login:
  kdfSalt = from POST /auth/prelogin
  key = KDF(password, kdfSalt)
  cryptingKey = decrypt(key, iv2, encrypted cryptingKey)

change password:
  decrypt cryptingKey with the old key, re-encrypt it with the new key
  notes and passwords are untouched                       // that is why cryptingKey exists
```

Authentication uses an `authValue` derived on the client. The server hashes it with bcrypt and never receives the master password.

## Authentication and sessions

- **Access token:** short-lived JWT (15 minutes), sent as `Authorization: Bearer <token>`. The client keeps it in memory.
- **Refresh token:** random value stored **hashed** in the database and sent in an `httpOnly` cookie (`sameSite=strict`, `path=/auth`, `secure` in production, 30 days).
- **Rotation:** each refresh issues a new refresh token and invalidates the old one. Reusing an old token fails.
- **Logout:** deletes the refresh token from the database.

## Security measures

- **Ownership enforced in the query** (`where: { id, userId }`): a user can never read or modify another user's data. Missing and foreign resources both return `404` to prevent id enumeration.
- **The user id comes from the verified token**, never from the body or the URL.
- **Input validation** with Zod on every route. Validation errors are never leaked to the client.
- **Passwords:** `authValue` hashed with bcrypt. Refresh tokens hashed with SHA-256.
- **Cookies:** `httpOnly`, `sameSite=strict`, restricted path.
- **helmet**, **CORS** limited to the configured front-end origin with credentials, and **rate limiting** on authentication routes.
- **Cascade deletes:** deleting an account removes its notes, passwords and refresh tokens.
- **Account deletion and password change** require the current `authValue`.

## Data model

| Model | Main fields |
|---|---|
| `User` | `id`, `name`, `email` (unique), `hashedPassword`, `cryptingKey`, `kdfSalt` |
| `RefreshToken` | `id`, `hashedToken` (unique), `expiresAt`, `userId` |
| `Note` | `id`, `title`, `content`, `iv`, `isFavorite`, `userId` |
| `Passwords` | `id`, `title`, `link?`, `content`, `iv`, `isFavorite`, `userId` |

`title`, `content` and `link` hold ciphertext produced by the client. The server treats them as opaque strings.

## API reference

All errors have the form `{ "error": "message" }`. "Bearer" means an `Authorization: Bearer <accessToken>` header is required.

### Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/prelogin` | Public | Returns the `kdfSalt` for an email (`404` if unknown) |
| POST | `/auth/register` | Public | Creates an account. Body: `name`, `email`, `authValue`, `cryptingKey`, `kdfSalt` |
| POST | `/auth/login` | Public | Body: `email`, `authValue`. Returns `{ user, accessToken }` and sets the refresh cookie |
| POST | `/auth/refresh` | Cookie | Rotates the refresh token, returns a new `accessToken` |
| POST | `/auth/logout` | Cookie | Deletes the refresh token |

### Notes

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/notes` | Bearer | Lists the user's notes |
| POST | `/notes` | Bearer | Body: `title`, `content`, `iv` |
| PATCH | `/notes/:id` | Bearer | Body: `isFavorite`, or `title` + `content` + `iv` together |
| DELETE | `/notes/:id` | Bearer | Deletes a note |

### Passwords

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/passwords` | Bearer | Lists the user's passwords |
| POST | `/passwords` | Bearer | Body: `title`, `content`, `iv`, optional `link` |
| PATCH | `/passwords/:id` | Bearer | Body: `isFavorite`, or `title` + `content` + `iv` (+ optional `link`) |
| DELETE | `/passwords/:id` | Bearer | Deletes a password |

When any encrypted field changes, `title`, `content` and `iv` must be sent together: the client re-encrypts with a fresh `iv`.

### Users

| Method | Path | Auth | Description |
|---|---|---|---|
| PATCH | `/users/me/datas` | Bearer | Body: `name` and/or `email`. `409` if the email is taken |
| PATCH | `/users/me/password` | Bearer | Body: `currentAuthValue`, `newAuthValue`, `cryptingKey` (re-encrypted) |
| DELETE | `/users/me` | Bearer | Body: `authValue`. Deletes the account and its data |

## Getting started

**Prerequisites:** Node.js (LTS) and PostgreSQL.

```bash
git clone https://github.com/YumanKh/Cipher.git
cd Cipher/backend
npm install
```

Create a `.env` file from `.env.example` and fill in the values (see below), then apply the migrations and start the server:

```bash
npx prisma migrate dev
npm run dev
```

### Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign access tokens |
| `FRONTEND_URL` | Front-end origin allowed by CORS |
| `NODE_ENV` | `development`, `test` or `production` |

### Scripts

| Script | Description |
|---|---|
| `npm run dev` | Starts the server with hot reload |
| `npm run build` | Compiles TypeScript to `dist/` |
| `npm start` | Runs the compiled server |
| `npm test` | Runs the test suite (Vitest, watch mode) |
| `npm run migrate:test` | Applies migrations to the test database |

## Testing

Integration tests (Vitest and supertest) hit the real Express app and a **dedicated test database**. They cover:

- authentication flows, including cookies and refresh token rotation
- CRUD for notes and passwords
- ownership: a second account cannot read, edit or delete another user's data
- validation errors and status codes
- database state after writes and deletes

Setup: create a separate database, put its URL in `.env.test`, then:

```bash
npm run migrate:test
npm test
```

The suite refuses to run if the database URL is not the test database.

## Known limitations and roadmap

These are deliberate trade-offs for the current stage:

- **Account enumeration:** `register` (`409`) and `prelogin` (`404`) reveal whether an email has an account. A real fix needs email verification.
- **Sessions on password change:** other devices' refresh tokens are not revoked yet. An opt-in "log out other devices" option is planned.
- **No account recovery:** by design of zero-knowledge, a forgotten password means unrecoverable data.
- **Client-side cryptography is not implemented yet.** The API stores opaque strings today. The KDF and encryption layer come with the React client.

Roadmap: React client with the crypto layer, email verification, optional session revocation, CI pipeline.

## Author

**Yuman Khoufache** — [GitHub](https://github.com/YumanKh) · [LinkedIn](https://linkedin.com/in/yuman-khoufache)

## License

Copyright © 2026 Yuman Khoufache. All rights reserved.