/*
  Warnings:

  - Added the required column `image` to the `GroupPurchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroupPurchase" ADD COLUMN     "image" TEXT NOT NULL;
