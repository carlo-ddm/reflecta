-- Remove the analysis feature and turn entries into a pure diary:
-- add an editable `date` and a `title`, drop the Analysis/MetricScore tables.
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- DropTable (analysis feature removed)
DROP TABLE "MetricScore";
DROP TABLE "Analysis";

-- RedefineTable: Entry gains `date` + `title`, loses the analysis relation.
-- SQLite cannot ADD COLUMN with a CURRENT_TIMESTAMP default, so we rebuild the
-- table and backfill `date` from the original `createdAt` for existing entries.
CREATE TABLE "new_Entry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL,
    "snippet" TEXT NOT NULL,
    CONSTRAINT "Entry_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Entry" ("id", "authorId", "createdAt", "date", "title", "content", "snippet")
SELECT "id", "authorId", "createdAt", "createdAt", '', "content", "snippet" FROM "Entry";
DROP TABLE "Entry";
ALTER TABLE "new_Entry" RENAME TO "Entry";
CREATE INDEX "Entry_authorId_date_idx" ON "Entry"("authorId", "date");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
