-- CreateEnum
CREATE TYPE "TextTypes" AS ENUM ('HTML', 'MARKDOWN', 'STRING');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ServiceNames" ADD VALUE 'TIMELINE';
ALTER TYPE "ServiceNames" ADD VALUE 'ROUTINE';

-- DropEnum
DROP TYPE "PostTypes";

-- CreateTable
CREATE TABLE "Timeline" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "tenancyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Timeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "type" "SessionTypes" NOT NULL DEFAULT 'ONE_TIME',
    "startDateTime" TIMESTAMPTZ(6) NOT NULL,
    "endDateTime" TIMESTAMPTZ(6) NOT NULL,
    "startTime" TIME NOT NULL,
    "endTime" TIME NOT NULL,
    "timelineId" TEXT NOT NULL,
    "recurringDayOfTheWeek" "RecurringDayOfTheWeek"[] DEFAULT ARRAY[]::"RecurringDayOfTheWeek"[],
    "repeatCycle" INTEGER NOT NULL DEFAULT 1,
    "repeatCycleType" "RepeatCycleTypes" NOT NULL DEFAULT 'WEEK',

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sequence" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tenancyId" TEXT NOT NULL,
    "routineId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),

    CONSTRAINT "Sequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Routine" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "sessionId" TEXT,
    "contentId" TEXT NOT NULL,
    "tenancyId" TEXT NOT NULL,

    CONSTRAINT "Routine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "contentId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "tenancyId" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),
    "removedAt" TIMESTAMPTZ(6),
    "title" TEXT,
    "description" TEXT,
    "dopotId" TEXT NOT NULL,
    "type" "TextTypes" NOT NULL DEFAULT 'HTML',
    "text" VARCHAR(1000),

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Timeline_seq_key" ON "Timeline"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Timeline_name_key" ON "Timeline"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Session_seq_key" ON "Session"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Sequence_seq_key" ON "Sequence"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Sequence_name_key" ON "Sequence"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Routine_seq_key" ON "Routine"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Routine_name_key" ON "Routine"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Post_seq_key" ON "Post"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "Content_seq_key" ON "Content"("seq");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_timelineId_fkey" FOREIGN KEY ("timelineId") REFERENCES "Timeline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
