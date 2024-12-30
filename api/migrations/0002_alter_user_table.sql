-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL
);
INSERT INTO "new_User" ("name", "userId") SELECT "name", "userId" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
