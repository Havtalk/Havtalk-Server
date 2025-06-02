/*
  Warnings:

  - You are about to drop the column `isPublic` on the `Character` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `UserPersona` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Character" DROP COLUMN "isPublic",
ADD COLUMN     "backstory" TEXT,
ADD COLUMN     "exampleDialogues" JSONB,
ADD COLUMN     "goals" TEXT,
ADD COLUMN     "quirks" TEXT,
ADD COLUMN     "role" TEXT,
ADD COLUMN     "speechStyle" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "tone" TEXT;

-- AlterTable
ALTER TABLE "UserPersona" ADD COLUMN     "backstory" TEXT,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Favorites" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterShowcase" (
    "id" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CharacterShowcase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonaShowcase" (
    "id" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonaShowcase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Favorites_userId_characterId_key" ON "Favorites"("userId", "characterId");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterShowcase_addedBy_characterId_key" ON "CharacterShowcase"("addedBy", "characterId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonaShowcase_addedBy_personaId_key" ON "PersonaShowcase"("addedBy", "personaId");

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterShowcase" ADD CONSTRAINT "CharacterShowcase_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterShowcase" ADD CONSTRAINT "CharacterShowcase_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonaShowcase" ADD CONSTRAINT "PersonaShowcase_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonaShowcase" ADD CONSTRAINT "PersonaShowcase_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "UserPersona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
