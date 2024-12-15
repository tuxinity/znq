/*
  Warnings:

  - You are about to drop the column `addressWallet` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "addressWallet",
ADD COLUMN     "walletAddress" TEXT;
