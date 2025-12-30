/*
  Warnings:

  - You are about to drop the column `weekStart` on the `Todo` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Todo_userId_weekStart_idx";

-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "weekStart";

-- CreateIndex
CREATE INDEX "Todo_userId_idx" ON "Todo"("userId");
