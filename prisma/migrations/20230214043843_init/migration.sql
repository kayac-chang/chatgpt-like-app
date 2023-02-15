/*
  Warnings:

  - Added the required column `messageId` to the `Case` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Case" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "snippet" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    CONSTRAINT "Case_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Case" ("id", "snippet", "title", "url") SELECT "id", "snippet", "title", "url" FROM "Case";
DROP TABLE "Case";
ALTER TABLE "new_Case" RENAME TO "Case";
CREATE UNIQUE INDEX "Case_title_url_key" ON "Case"("title", "url");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
