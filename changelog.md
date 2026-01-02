# Changelog

## Main (unversioned)

### Backend
- Bootstrap Express + dotenv with a `/health` endpoint.
- Prisma + SQLite: full schema (User, Entry, Analysis, MetricScore) and migrations.
- Repository + DTO layer for Entry/Analysis, input validation, centralized error handling.
- API endpoints: `GET /entries`, `GET /entries/:id`, `POST /entries`, `POST /analysis`, `DELETE /entries/:id`.
- Local seed script to generate a User and Author ID.

### Frontend
- Page restructure (Write, Archive, Detail) and UI components (entry-card, badge, snackbar).
- API integration: create entry, list/detail, request analysis, delete.
- Settings page for Author ID management (localStorage) with removal confirmation.
- Material 3 theme + layout: sidenav/toolbar, cards, buttons, dialog/snackbar, responsive layout.
- UI refinements: click-to-toggle analysis badge, time shown in cards and detail view.

### Tooling & Quality
- `scripts/dev.mjs` to start API + Web together.
- VS Code tasks/debug configs.
- `.gitignore` cleanup and generated output handling.
- Pre-commit hook to block ULID leakage in tracked files.

---

Note: this project does not use tagged releases yet; this changelog summarizes the current main branch.
