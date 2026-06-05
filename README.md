# Reflecta

Reflecta is a local‑first journaling app. Keep a private diary of titled, dated entries, search them by title or date, and store everything on your own machine.

## Features

- Write diary entries with a **title** and a **date** (the date defaults to today but is editable)
- Browse your archive and re‑read any entry
- **Search** by title and filter by a date range
- Delete entries you no longer want
- Local SQLite storage (fully offline — nothing leaves your machine)
- Author ID stored locally in the browser
- Warm, editorial Angular Material (M3) UI with light/dark themes

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

Copy the example env file (or create `apps/api/.env`):

```bash
cp apps/api/.env.example apps/api/.env
# apps/api/.env
# DATABASE_URL="file:./db.sqlite3"
```

3) Apply database migrations

```bash
npm -C apps/api run db:migrate
```

4) Start API + Web together

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
- `GET /entries` — supports `?q=` (title search), `?from=` / `?to=` (date range, `YYYY-MM-DD`), `?authorId=`, `?page=`, `?limit=`
- `GET /entries/:id`
- `POST /entries` — body: `{ authorId, title, date, content }`
- `DELETE /entries/:id`

## Security & Privacy Notes

- Reflecta is offline by default: entries live only in your local SQLite database and are never sent anywhere.
- Author ID is **not** authentication.
- If the backend is exposed publicly, anyone with an Author ID could read data.
- For safety, keep the app local unless you add real authentication.

## Project Structure

- `apps/api` — Express + Prisma API
- `apps/web` — Angular UI
- `scripts/dev.mjs` — start API + Web together
