# Reflecta

Reflecta is a local‑first journaling app. You can save entries, request an analysis on demand, and keep everything on your own machine.

## Features

- Write and save entries (immutable, deletable)
- Analysis on explicit request (never automatic)
- Local SQLite storage (no cloud by default)
- Author ID stored locally in the browser
- Angular Material 3 UI (calm‑tech, journal style)

## Tech Stack

- Frontend: Angular 21 + Angular Material (M3)
- Backend: Node.js + Express
- Database: Prisma + SQLite

## Requirements

- Node.js 20+
- npm

## Quick Start (Local)

1) Install dependencies

```bash
npm -C apps/api install
npm -C apps/web install
```

2) Configure the API environment

Create `apps/api/.env`:

```bash
DATABASE_URL="file:./db.sqlite3"
```

3) Start API + Web together

```bash
node scripts/dev.mjs
```

- API: http://localhost:3000
- Web: http://localhost:4200

### Run separately

```bash
npm -C apps/api run dev
npm -C apps/web start
```

## Author ID

Reflecta uses a local Author ID to associate entries.

Generate one with the seed command:

```bash
npm -C apps/api run db:seed
```

Copy the printed ID and save it in **Settings**.

## Database

- File: `apps/api/db.sqlite3`
- Stored locally and ignored by git
- To move to another PC: copy the DB file **and** reuse the same Author ID

## API Endpoints (local)

- `GET /health`
- `GET /entries`
- `GET /entries/:id`
- `POST /entries`
- `POST /analysis`
- `DELETE /entries/:id`

## Security Notes

- Author ID is **not** authentication.
- If the backend is exposed publicly, anyone with an Author ID could read data.
- For safety, keep the app local unless you add real authentication.

## Project Structure

- `apps/api` — Express + Prisma API
- `apps/web` — Angular UI
- `scripts/dev.mjs` — start API + Web together

