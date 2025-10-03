-- CreateTable
CREATE TABLE "trip_forms" (
    "id" TEXT NOT NULL,
    "continent" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "durationWeeks" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "totalSavings" DECIMAL(10,2) NOT NULL,
    "preferredBenefit" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sessionId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trip_forms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "trip_forms_country_idx" ON "trip_forms"("country");

-- CreateIndex
CREATE INDEX "trip_forms_continent_idx" ON "trip_forms"("continent");

-- CreateIndex
CREATE INDEX "trip_forms_createdAt_idx" ON "trip_forms"("createdAt");

-- CreateIndex
CREATE INDEX "trip_forms_email_idx" ON "trip_forms"("email");
