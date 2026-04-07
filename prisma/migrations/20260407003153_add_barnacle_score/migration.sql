-- AlterTable
ALTER TABLE "Politician" ADD COLUMN     "birthYear" INTEGER,
ADD COLUMN     "estimatedNetWorth" DOUBLE PRECISION,
ADD COLUMN     "firstElectedYear" INTEGER,
ADD COLUMN     "prePoliticsCareer" TEXT;

-- CreateTable
CREATE TABLE "BarnacleScore" (
    "id" TEXT NOT NULL,
    "politicianId" TEXT NOT NULL,
    "barnacleScore" DOUBLE PRECISION NOT NULL,
    "citizenStatesmanScore" DOUBLE PRECISION NOT NULL,
    "tenureYears" INTEGER NOT NULL,
    "privateCareerYears" INTEGER NOT NULL,
    "citizenRatio" DOUBLE PRECISION NOT NULL,
    "tenureScore" DOUBLE PRECISION NOT NULL,
    "citizenRatioScore" DOUBLE PRECISION NOT NULL,
    "wealthGapScore" DOUBLE PRECISION NOT NULL,
    "revolvingDoorScore" DOUBLE PRECISION NOT NULL,
    "entrenchmentScore" DOUBLE PRECISION NOT NULL,
    "aiNarrative" TEXT,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BarnacleScore_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BarnacleScore" ADD CONSTRAINT "BarnacleScore_politicianId_fkey" FOREIGN KEY ("politicianId") REFERENCES "Politician"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
