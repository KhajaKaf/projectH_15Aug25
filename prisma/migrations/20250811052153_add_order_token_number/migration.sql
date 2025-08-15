/*
  Warnings:

  - A unique constraint covering the columns `[tokenNumber]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "tokenNumber" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "orders_tokenNumber_key" ON "orders"("tokenNumber");
