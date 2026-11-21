# Cipher — Zero-Knowledge Password Manager (Web Client)

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=reactrouter&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?logo=react&logoColor=white)

Web client for **Cipher**, a zero-knowledge password manager. All cryptography runs in the browser: the master password, the derived key and every plaintext note or password stay on the client. The server only ever receives ciphertext and an opaque `authValue`.

> **Status:** feature-complete. Implements the full cryptography layer, authenticated sessions, the encrypted vault, account management and the public pages.

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Client-side cryptography](#client-side-cryptography)
- [State and data fetching](#state-and-data-fetching)
- [Authentication and sessions](#authentication-and-sessions)
- [Routing](#routing)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Build and deployment](#build-and-deployment)
- [Known limitations and roadmap](#known-limitations-and-roadmap)

## Features

- Registration and login with a full client-side key-derivation flow
- Encrypted vault for notes and passwords: create, edit, delete, favorite
- Search and filter across the vault, with dedicated views (All, Passwords, Notes, Favorites, Trash)
- Soft delete: items move to Trash, then can be restored or permanently deleted
- Website favicons for password entries, with type-icon fallbacks
- Account management: edit profile, change master password, delete account
- Encrypted-vault export to a local JSON file, with an explicit plaintext warning
- Public pages (no login required): Features, Security, Terms, Privacy
- Custom 404 page and a React error boundary for runtime failures
- Responsive layout with a mobile navigation drawer

## Tech stack

| Area | Choice |
|---|---|
| Build tool / language | Vite, TypeScript |
| UI library | React |
| Routing | React Router |
| Server state | TanStack Query |
| Client state | Zustand |
| Styling | CSS Modules |
| Cryptography | native Web Crypto API (`crypto.subtle`) |
| Icons | lucide-react |

## Architecture

The client is organized by responsibility. UI components never talk to the network or the crypto layer directly; they go through hooks, the API layer and the crypto helpers.

```
component  →  hook (TanStack Query)  →  api layer  →  backend
component  →  crypto layer (Web Crypto)  →  Zustand store (in-memory key)
```

| Layer | Responsibility |
|---|---|
| Pages / components | Rendering and user interaction only |
| Hooks | Query and mutation logic, cache invalidation |
| API layer | HTTP calls, Bearer token, cookie credentials |
| Crypto layer | Key derivation, envelope wrap/unwrap, encrypt/decrypt |
| Store (Zustand) | Session state and the in-memory `cryptingKey` |

## Client-side cryptography

The server is zero-knowledge: it cannot decrypt anything. All key material is derived and used in the browser with the Web Crypto API.

```
register:
  kdfSalt      = random bytes                          // sent to server, not secret
  masterKey    = PBKDF2(password, kdfSalt, 600k, SHA-256)   // never leaves the client
  authValue    = SHA-256(masterKey)                    // sent to server, bcrypt-hashed there
  cryptingKey  = random 256-bit key                    // the data key, never sent in clear
  wrappedKey   = AES-256-GCM(masterKey, cryptingKey)   // sent and stored encrypted

vault items:
  ciphertext   = AES-256-GCM(cryptingKey, iv, data)    // one fresh iv per write

login:
  kdfSalt      = from POST /auth/prelogin
  masterKey    = PBKDF2(password, kdfSalt, 600k, SHA-256)
  cryptingKey  = AES-256-GCM.decrypt(masterKey, wrappedKey)

change master password:
  cryptingKey  = unwrap with the old masterKey          // also validates the old password locally
  newMasterKey = PBKDF2(newPassword, same kdfSalt, 600k, SHA-256)
  newWrappedKey = AES-256-GCM(newMasterKey, cryptingKey) // items are never re-encrypted
```

The `cryptingKey` is the reason a password change is cheap: only the wrapped key changes, the encrypted notes and passwords stay untouched.

## State and data fetching

- **Server state** (notes, passwords) is owned by **TanStack Query**: queries cache the encrypted rows, mutations invalidate the relevant keys after writes, restores and deletes.
- **Session state** lives in a **Zustand** store: the current user, the access token and the `cryptingKey`.
- The decrypted `cryptingKey` is held **in memory only**. It is never persisted to `localStorage` or cookies, so a full page reload or a same-tab navigation away from the app drops it and requires a fresh login.

## Authentication and sessions

- **Access token:** short-lived JWT kept in memory and sent as `Authorization: Bearer <token>`.
- **Refresh token:** handled by the backend in an `httpOnly` cookie; the client never reads it. API calls are sent with credentials so the cookie flows automatically.
- **In-memory key model:** because the `cryptingKey` only exists in memory, outbound links to public pages from inside the authenticated app open in a new tab to avoid tearing down the session.

## Routing

| Path | Access | Page |
|---|---|---|
| `/` | Public | Landing |
| `/login`, `/register` | Public | Authentication |
| `/features`, `/security` | Public | Product information |
| `/terms`, `/privacy` | Public | Legal documents |
| `/vault` | Protected | Encrypted vault |
| `/settings` | Protected | Account management |
| `*` | Public | 404 Not Found |

A session gate guards the protected routes; a top-level error boundary renders a fallback page on any uncaught runtime error.

## Project structure

```
frontend/
├── public/
└── src/
    ├── assets/            # images, icons, favicon
    ├── components/        # modals, dialogs, shared UI
    ├── hooks/             # TanStack Query hooks
    ├── lib/               # api layer, crypto helpers, export
    ├── pages/             # routed pages + CSS Modules
    └── stores/            # Zustand session store
```

## Getting started

**Prerequisites:** Node.js (LTS) and a running instance of the [Cipher backend](../backend).

```bash
git clone https://github.com/YumanKh/Cipher.git
cd Cipher/frontend
npm install
```

Create a `.env` file and point it at your backend:

```bash
VITE_API_URL=http://localhost:3000
```

Then start the dev server:

```bash
npm run dev
```

### Environment variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the Cipher backend. Inlined at **build time** by Vite |

### Scripts

| Script | Description |
|---|---|
| `npm run dev` | Starts the Vite dev server with hot reload |
| `npm run build` | Type-checks and builds the production bundle to `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint |

## Build and deployment

The client is a static single-page app and can be served from any static host. `VITE_API_URL` is read at **build time**, so the production URL of the backend must be set as a build environment variable, not at runtime.

Because it is an SPA, the host must serve `index.html` for unknown routes (SPA fallback) so client-side routing works on refresh and deep links.

## Known limitations and roadmap

- **In-memory session only:** a page reload requires logging back in. This is a deliberate security trade-off, not a persisted session.
- **No offline mode:** the client always talks to the backend; there is no local cache of decrypted data.
- **Client cryptography depends on the Web Crypto API**, available in all modern browsers.

Roadmap: optional "log out other devices", email verification flow, CI pipeline.

## Author

**Yuman Khoufache** — [GitHub](https://github.com/YumanKh) · [LinkedIn](https://linkedin.com/in/yuman-khoufache)

## License

Copyright © 2026 Yuman Khoufache. All rights reserved.