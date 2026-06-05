# Changelog

## Main (unversioned)

### Diary redesign (latest)
- Refocused the app as a pure, offline diary — removed the analysis feature entirely (route, metrics, `Analysis`/`MetricScore` tables, UI).
- Entries now have a **title** and an **editable date** (defaults to today, backfilled from `createdAt` for existing data).
- **Search**: `GET /entries` filters by title (`q`) and date range (`from`/`to`); new search bar in the archive.
- Full visual overhaul: warm "paper" editorial theme (cream palette, Fraunces serif headings), redesigned Write / Archive / Detail pages, refreshed states and loaders, light/dark.
- Italian date formatting throughout.

### Backend
- Express + dotenv with a `/health` endpoint.
- Prisma + SQLite: `User` and `Entry` (with `title`, `date`) and migrations.
- Repository + DTO layer for entries, input validation, centralized error handling.
- API endpoints: `GET /entries` (search + pagination), `GET /entries/:id`, `POST /entries`, `DELETE /entries/:id`.
- Local seed script to generate a User and Author ID.

### Frontend
- Pages: Write, Archive, Detail, Settings; reusable entry-card and snackbar components.
- API integration: create entry, list/detail with search, delete.
- Settings page for Author ID management (localStorage) with removal confirmation, plus theme switch.
- Material 3 theme + layout: sidenav/toolbar, cards, buttons, dialog/snackbar, responsive layout.

### Tooling & Quality
- `scripts/dev.mjs` to start API + Web together.
- VS Code tasks/debug configs.
- `.gitignore` cleanup and generated output handling; `.env.example` for the API.
- Pre-commit hook to block ULID leakage in tracked files.

---

Note: this project does not use tagged releases yet; this changelog summarizes the current main branch.
