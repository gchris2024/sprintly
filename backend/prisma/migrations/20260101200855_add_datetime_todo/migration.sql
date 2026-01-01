-- DropIndex
DROP INDEX "Todo_userId_idx";

-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "minutes" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Todo_userId_date_idx" ON "Todo"("userId", "date");
