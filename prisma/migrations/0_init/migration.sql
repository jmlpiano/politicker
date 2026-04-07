-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."Donor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Donor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DonorContribution" (
    "id" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "politicianId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "year" INTEGER NOT NULL,
    "cycle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DonorContribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IntegrityScore" (
    "id" TEXT NOT NULL,
    "politicianId" TEXT NOT NULL,
    "integrityScore" DOUBLE PRECISION NOT NULL,
    "sleazeScore" DOUBLE PRECISION NOT NULL,
    "alignmentRate" DOUBLE PRECISION NOT NULL,
    "donorInfluence" DOUBLE PRECISION NOT NULL,
    "flipFrequency" DOUBLE PRECISION NOT NULL,
    "partySpectrum" DOUBLE PRECISION NOT NULL,
    "integrityAxis" DOUBLE PRECISION NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntegrityScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Politician" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "initials" TEXT NOT NULL,
    "party" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "since" INTEGER NOT NULL,
    "bio" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Politician_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Statement" (
    "id" TEXT NOT NULL,
    "politicianId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "issue" TEXT NOT NULL,
    "source" TEXT,
    "date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Statement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Vote" (
    "id" TEXT NOT NULL,
    "politicianId" TEXT NOT NULL,
    "bill" TEXT NOT NULL,
    "billId" TEXT,
    "issue" TEXT NOT NULL,
    "vote" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VoteStatementAlignment" (
    "id" TEXT NOT NULL,
    "voteId" TEXT NOT NULL,
    "statementId" TEXT NOT NULL,
    "aligned" BOOLEAN NOT NULL,
    "explanation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VoteStatementAlignment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."DonorContribution" ADD CONSTRAINT "DonorContribution_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "public"."Donor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DonorContribution" ADD CONSTRAINT "DonorContribution_politicianId_fkey" FOREIGN KEY ("politicianId") REFERENCES "public"."Politician"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IntegrityScore" ADD CONSTRAINT "IntegrityScore_politicianId_fkey" FOREIGN KEY ("politicianId") REFERENCES "public"."Politician"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Statement" ADD CONSTRAINT "Statement_politicianId_fkey" FOREIGN KEY ("politicianId") REFERENCES "public"."Politician"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vote" ADD CONSTRAINT "Vote_politicianId_fkey" FOREIGN KEY ("politicianId") REFERENCES "public"."Politician"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VoteStatementAlignment" ADD CONSTRAINT "VoteStatementAlignment_statementId_fkey" FOREIGN KEY ("statementId") REFERENCES "public"."Statement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VoteStatementAlignment" ADD CONSTRAINT "VoteStatementAlignment_voteId_fkey" FOREIGN KEY ("voteId") REFERENCES "public"."Vote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

