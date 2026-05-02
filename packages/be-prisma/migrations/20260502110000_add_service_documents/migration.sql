-- CreateEnum
CREATE TYPE "ServiceDocumentKind" AS ENUM ('TERMS_OF_SERVICE', 'PRIVACY_POLICY', 'MARKETING_CONSENT', 'LOCATION_CONSENT', 'THIRD_PARTY_SHARING');

-- CreateEnum
CREATE TYPE "ServiceDocumentPlatform" AS ENUM ('ALL', 'WEB', 'MOBILE');

-- CreateEnum
CREATE TYPE "ServiceDocumentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ServiceDocumentFormat" AS ENUM ('MARKDOWN', 'HTML', 'PLAIN_TEXT');

-- CreateTable
CREATE TABLE "service_documents" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "kind" "ServiceDocumentKind" NOT NULL,
    "platform" "ServiceDocumentPlatform" NOT NULL DEFAULT 'ALL',
    "locale" TEXT NOT NULL DEFAULT 'ko-KR',
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT NOT NULL,
    "format" "ServiceDocumentFormat" NOT NULL DEFAULT 'MARKDOWN',
    "version" TEXT NOT NULL,
    "status" "ServiceDocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "effective_at" TIMESTAMPTZ(6),
    "published_at" TIMESTAMPTZ(6),

    CONSTRAINT "service_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "service_documents_kind_platform_locale_version_key" ON "service_documents"("kind", "platform", "locale", "version");

-- CreateIndex
CREATE INDEX "service_documents_kind_platform_locale_status_idx" ON "service_documents"("kind", "platform", "locale", "status");

-- CreateIndex
CREATE INDEX "service_documents_status_idx" ON "service_documents"("status");

-- CreateIndex
CREATE INDEX "service_documents_published_at_idx" ON "service_documents"("published_at");

-- CreateIndex
CREATE UNIQUE INDEX "service_documents_current_published_unique_idx"
ON "service_documents"("kind", "platform", "locale")
WHERE "status" = 'PUBLISHED' AND "removed_at" IS NULL;
