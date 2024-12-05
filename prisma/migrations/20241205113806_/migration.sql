/*
  Warnings:

  - You are about to drop the column `createdAt` on the `PasswordResetToken` table. All the data in the column will be lost.
  - Added the required column `txHash` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PasswordResetToken" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "txHash" TEXT NOT NULL;
