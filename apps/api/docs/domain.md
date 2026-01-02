# Reflecta API — Modulo 1 (Dominio)

Questo documento descrive **cosa** è il dominio backend di Reflecta oggi (in base allo stato reale in `apps/api/prisma/schema.prisma`) e quali **vincoli** guidano le API.

## Obiettivo del dominio

Il sistema gestisce:

- **Entry**: testo scritto dall’utente (immutabile una volta salvato).
- **Analysis**: analisi associata a una Entry, creata **solo su richiesta esplicita**.

Scelta deliberata (accettata): il dominio include anche

- **User**: autore delle entry.
- **Metriche normalizzate**: i punteggi dell’analisi sono salvati come righe (`MetricScore`) invece che come un JSON “monolitico”.

## Principi non negoziabili

1. **Entry immutabili**
   - Una Entry, una volta creata, **non viene modificata**.
   - A livello API questo implica: niente `PUT`/`PATCH` sulle entry.

2. **Analisi solo su richiesta**
   - Nessuna analisi automatica.
   - Un’Analysis esiste solo quando un’azione esplicita dell’utente la crea/salva.

3. **Separazione chiara**
   - `Entry` ≠ `Analysis`.
   - Un’Entry può avere **0 o 1** `Analysis`.

## Identificativi e timestamp

- Tutti gli ID sono `String` con default `ulid()` (scelta: ULID).
- I timestamp (`createdAt`) sono `DateTime` con default `now()`.

## Entità

### User

Rappresenta l’utente autore delle entry.

Campi:

- `id: String` (ULID, PK)
- `name: String`
- `email: String` (unico)
- `password: String`
- `entries: Entry[]`

Nota:

- `password` **non deve mai essere salvata in chiaro**.
- L’autenticazione/registrazione **non è parte di questo modulo**: qui serve solo la presenza del concetto di “autore” (`User`) per legare le entry a un proprietario.

### Entry

Rappresenta un testo scritto dall’utente.

Campi:

- `id: String` (ULID, PK)
- `authorId: String` (FK verso `User`)
- `createdAt: DateTime`
- `content: String` (testo completo)
- `snippet: String` (preview persistita)
- `analysis: Analysis?` (relazione opzionale 1–1)

Vincoli:

- `authorId` è obbligatorio (Entry sempre attribuita a un User).
- La presenza di `analysis` è opzionale.

Implicazioni:

- `snippet` è un dato derivato da `content` (come viene calcolato e la sua lunghezza massima vanno definiti a livello di API/DTO).

### Analysis

Rappresenta l’analisi di una singola entry.

Campi:

- `id: String` (ULID, PK)
- `createdAt: DateTime`
- `entryId: String` (FK verso `Entry`, **unico**)
- `metrics: MetricScore[]`

Vincoli:

- `entryId` è `@unique` ⇒ **una sola Analysis per Entry**.

### MetricScore

Rappresenta un singolo punteggio per una metrica all’interno di una Analysis.

Campi:

- `id: String` (ULID, PK)
- `analysisId: String` (FK verso `Analysis`)
- `key: AnalysisMetric`
- `score: Float`

Vincoli:

- `@@unique([analysisId, key])` ⇒ ogni metrica può comparire **al massimo una volta** per analysis.

Motivazione (normalizzazione):

- permette di rappresentare un set di metriche variabile senza “campi sparsi” su `Analysis`;
- rende semplice imporre l’unicità per metrica (vincolo DB);
- consente query/filtri per metrica in modo naturale (es. “tutte le analysis con ENERGY > x”).

### AnalysisMetric (enum)

Insieme delle metriche supportate:

- `MOOD`
- `ENERGY`
- `STRESS`
- `FOCUS`
- `CLARITY`

## Relazioni (cardinalità)

- `User (1) → (N) Entry`
- `Entry (1) → (0..1) Analysis`
- `Analysis (1) → (N) MetricScore`

## Decisioni ancora da chiudere (prima di Modulo 3/4)

1. **Gestione User (senza anticipare auth)**
   - Per MVP: user “single local” (seed) o login/registrazione?
   - Quando introdurremo auth: strategia password hashing e session/token.

2. **Snippet**
   - Lunghezza e regola di calcolo (es. primi N caratteri, trim, rimozione newline).
   - È sempre obbligatoria o calcolabile al volo (oggi è persistita e `NOT NULL`).

3. **Score range**
   - Range consigliato: `0..1` o `0..100` (oggi è `Float` senza vincoli DB).
   - Serve validazione applicativa nel Modulo 5/6.

4. **Metriche richieste**
   - Le metriche sono tutte opzionali o ci si aspetta un set completo per ogni Analysis?
