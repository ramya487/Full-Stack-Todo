/*
  Warnings:

  - You are about to drop the column `ownerId` on the `tasks` table. All the data in the column will be lost.
  - Added the required column `signupid` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `tasks_ownerId_fkey`;

-- AlterTable
ALTER TABLE `tasks` DROP COLUMN `ownerId`,
    ADD COLUMN `signupid` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_signupid_fkey` FOREIGN KEY (`signupid`) REFERENCES `signup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
