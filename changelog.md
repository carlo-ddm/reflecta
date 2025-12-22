# Changelog (English)

## Global / Config

- `package.json`, `package-lock.json`: added `ulid` dependency.
- `src/app/app.config.ts`: register Italian locale and set `LOCALE_ID`.
- `src/main.ts`: minor formatting clean‑up.

## Routing

- `src/app/app.routes.ts`: routes updated to point to new `pages/page-components/*` paths.

## Pages (moved + rewritten)

- **Removed** legacy pages under `src/app/pages/entities/*` (write/entries/detail + specs).
- **Added** new pages under `src/app/pages/page-components/*`:
  - `write.*`: editor UI, analysis modal markup, snackbar host, form wiring.
  - `entries.*`: list layout, empty state, render via `@for`.
  - `entry-detail.*`: placeholder layout.

## UI Components

- `src/app/UI/ui-components/entry-card/*`: reusable entry card (markup + styles), `<time>` bound to ISO `createdAt`.
- `src/app/UI/ui-components/snackbar/*`: snackbar component with slots for title/message/action/dismiss, refined layout and button styling.

## Models / Data / Service

- `src/app/pages/models/models.ts`: `EntryPreview` adjusted (`id` can be `null`).
- `src/app/pages/mock/page.ts`: mock entries updated to ULID‑like IDs.
- `src/app/pages/services/page.service.ts`: added `getEntryList()` and `insertEntry()` (in‑memory list update + ULID generation).

## Notes

- Snackbar styling iterated several times (size, button look, action row positioning).
- Entry card styles moved into UI component to keep entries page lean.

---

# Changelog (Italiano)

## Globale / Config

- `package.json`, `package-lock.json`: aggiunta dipendenza `ulid`.
- `src/app/app.config.ts`: registrazione locale italiano e `LOCALE_ID`.
- `src/main.ts`: piccolo riordino formattazione.

## Routing

- `src/app/app.routes.ts`: routes aggiornate verso i nuovi path `pages/page-components/*`.

## Pagine (spostate + riscritte)

- **Rimosse** le pagine legacy in `src/app/pages/entities/*` (write/entries/detail + spec).
- **Aggiunte** le nuove pagine in `src/app/pages/page-components/*`:
  - `write.*`: editor UI, modal analisi, host snackbar, wiring form.
  - `entries.*`: layout lista, empty state, render con `@for`.
  - `entry-detail.*`: layout placeholder.

## UI Components

- `src/app/UI/ui-components/entry-card/*`: card riusabile (markup + stili), `<time>` legato a `createdAt` ISO.
- `src/app/UI/ui-components/snackbar/*`: snackbar con slot title/message/action/dismiss, layout e bottoni rifiniti.

## Modelli / Dati / Service

- `src/app/pages/models/models.ts`: `EntryPreview` aggiornato (`id` può essere `null`).
- `src/app/pages/mock/page.ts`: mock entries con ID tipo ULID.
- `src/app/pages/services/page.service.ts`: introdotti `getEntryList()` e `insertEntry()` (update in‑memory + ULID).

## Note

- Snackbar ricalibrato più volte (dimensioni, bottoni, posizionamento azioni).
- Stili entry card spostati nel componente UI per mantenere la pagina Entries più pulita.
