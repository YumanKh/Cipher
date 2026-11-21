# Cipher

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)

**Cipher** is a zero-knowledge password manager. Passwords and notes are encrypted and decrypted entirely in the browser; the server stores only ciphertext and never sees a master password, an encryption key, or any plaintext.

The repository is a monorepo with two independent applications: a REST API and a web client.

## Table of contents

- [How zero-knowledge works](#how-zero-knowledge-works)
- [Repository structure](#repository-structure)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Documentation](#documentation)
- [Security model at a glance](#security-model-at-a-glance)
- [Author](#author)
- [License](#license)

## How zero-knowledge works

The master password never leaves the client. The browser derives a key from it, and that key encrypts a random **data key**. Every note and password is encrypted with the data key before it is sent.

```
             ┌─────────────── browser (client) ───────────────┐
password  →  │  PBKDF2  →  masterKey  →  wraps the cryptingKey │
             │  cryptingKey  →  encrypts notes & passwords      │
             └─────────────────────┬──────────────────────────┘
                                   │  only ciphertext + authValue
                                   ▼
             ┌─────────────── server (API) ────────────────────┐
             │  stores opaque ciphertext, bcrypt(authValue)     │
             │  cannot decrypt anything                         │
             └─────────────────────────────────────────────────┘
```

Authentication uses an `authValue` derived on the client and hashed with bcrypt on the server. A forgotten master password means unrecoverable data — that is the point of the design.

## Repository structure

```
Cipher/
├── backend/     # REST API — Node.js, Express, Prisma, PostgreSQL
├── frontend/    # Web client — React, Vite, TypeScript
└── README.md
```

Each application has its own `package.json`, its own environment variables and its own README.

## Tech stack

| Side | Stack |
|---|---|
| Backend | Node.js, TypeScript, Express 5, Prisma, PostgreSQL, Zod, JWT, bcrypt |
| Frontend | React, Vite, TypeScript, React Router, TanStack Query, Zustand, Web Crypto API |
| Tests | Vitest, supertest (backend integration suite) |

## Getting started

Run the two applications in separate terminals. The backend must be running before the frontend can authenticate.

**1. Backend**

```bash
cd backend
npm install
# configure .env (DATABASE_URL, JWT_SECRET, FRONTEND_URL, NODE_ENV)
npx prisma migrate dev
npm run dev
```

**2. Frontend**

```bash
cd frontend
npm install
# configure .env (VITE_API_URL pointing at the backend)
npm run dev
```

Full setup instructions, environment variables and scripts are in each application's README.

## Documentation

- **[Backend README](./backend/README.md)** — API reference, architecture, data model, authentication and sessions, testing.
- **[Frontend README](./frontend/README.md)** — client-side cryptography, state management, routing, build and deployment.

## Security model at a glance

- The server is **zero-knowledge**: it stores ciphertext and an `authValue`, never plaintext or keys.
- **PBKDF2** key derivation and **AES-256-GCM** encryption, run with the Web Crypto API in the browser.
- **Envelope encryption:** a master-key-derived key wraps a random data key, so a password change never re-encrypts the vault.
- **Per-user isolation** enforced in every database query.
- **Session security:** short-lived access tokens in memory, rotating refresh tokens in `httpOnly` cookies.

## Author

**Yuman Khoufache** — [GitHub](https://github.com/YumanKh) · [LinkedIn](https://linkedin.com/in/yuman-khoufache)

## License

Copyright © 2026 Yuman Khoufache. All rights reserved.