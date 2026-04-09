-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Analysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entryId" TEXT NOT NULL,
    CONSTRAINT "Analysis_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Analysis" ("createdAt", "entryId", "id") SELECT "createdAt", "entryId", "id" FROM "Analysis";
DROP TABLE "Analysis";
ALTER TABLE "new_Analysis" RENAME TO "Analysis";
CREATE UNIQUE INDEX "Analysis_entryId_key" ON "Analysis"("entryId");
CREATE TABLE "new_MetricScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "analysisId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "score" REAL NOT NULL,
    CONSTRAINT "MetricScore_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MetricScore" ("analysisId", "id", "key", "score") SELECT "analysisId", "id", "key", "score" FROM "MetricScore";
DROP TABLE "MetricScore";
ALTER TABLE "new_MetricScore" RENAME TO "MetricScore";
CREATE UNIQUE INDEX "MetricScore_analysisId_key_key" ON "MetricScore"("analysisId", "key");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
