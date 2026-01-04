/*
  Warnings:

  - You are about to drop the column `content` on the `Reflection` table. All the data in the column will be lost.
  - You are about to drop the column `submitted` on the `Reflection` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Reflection` table. All the data in the column will be lost.
  - Added the required column `challenges` to the `Reflection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nextWeekFocus` to the `Reflection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wins` to the `Reflection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reflection" DROP COLUMN "content",
DROP COLUMN "submitted",
DROP COLUMN "updatedAt",
ADD COLUMN     "challenges" TEXT NOT NULL,
ADD COLUMN     "nextWeekFocus" TEXT NOT NULL,
ADD COLUMN     "submittedAt" TIMESTAMP(3),
ADD COLUMN     "wins" TEXT NOT NULL;
