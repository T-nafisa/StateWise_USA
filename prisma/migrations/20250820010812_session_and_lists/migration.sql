-- CreateTable
CREATE TABLE "public"."DailySnapshot" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "state" TEXT NOT NULL,
    "weather" JSONB NOT NULL,
    "activities" JSONB NOT NULL,
    "userNote" TEXT,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "DailySnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Note" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "snapshotId" INTEGER NOT NULL,
    "sessionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WishlistItem" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT NOT NULL,
    "parkId" TEXT,
    "parkName" TEXT NOT NULL,
    "parkUrl" TEXT,
    "state" TEXT,
    "dailySnapshotId" INTEGER,

    CONSTRAINT "WishlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailySnapshot_createdAt_idx" ON "public"."DailySnapshot"("createdAt");

-- CreateIndex
CREATE INDEX "DailySnapshot_state_idx" ON "public"."DailySnapshot"("state");

-- CreateIndex
CREATE INDEX "DailySnapshot_sessionId_idx" ON "public"."DailySnapshot"("sessionId");

-- CreateIndex
CREATE INDEX "Note_sessionId_idx" ON "public"."Note"("sessionId");

-- CreateIndex
CREATE INDEX "Note_snapshotId_idx" ON "public"."Note"("snapshotId");

-- CreateIndex
CREATE INDEX "WishlistItem_sessionId_idx" ON "public"."WishlistItem"("sessionId");

-- CreateIndex
CREATE INDEX "WishlistItem_parkId_idx" ON "public"."WishlistItem"("parkId");

-- AddForeignKey
ALTER TABLE "public"."Note" ADD CONSTRAINT "Note_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "public"."DailySnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WishlistItem" ADD CONSTRAINT "WishlistItem_dailySnapshotId_fkey" FOREIGN KEY ("dailySnapshotId") REFERENCES "public"."DailySnapshot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
