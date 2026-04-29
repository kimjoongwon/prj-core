-- CreateEnum: 이메일 인증 상태
CREATE TYPE "EmailVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'EXPIRED');

-- CreateTable: 이메일 인증
CREATE TABLE "email_verifications" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "status" "EmailVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "verified_at" TIMESTAMPTZ(6),
    "last_sent_at" TIMESTAMPTZ(6),
    "send_count" INTEGER NOT NULL DEFAULT 0,
    "last_send_status" TEXT,
    "last_send_error" TEXT,
    "verified_user_id" TEXT,

    CONSTRAINT "email_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_verifications_token_hash_key" ON "email_verifications"("token_hash");
CREATE INDEX "email_verifications_email_idx" ON "email_verifications"("email");
CREATE INDEX "email_verifications_status_idx" ON "email_verifications"("status");
CREATE INDEX "email_verifications_expires_at_idx" ON "email_verifications"("expires_at");
CREATE INDEX "email_verifications_created_at_idx" ON "email_verifications"("created_at");
CREATE INDEX "email_verifications_verified_user_id_idx" ON "email_verifications"("verified_user_id");

-- AddForeignKey
ALTER TABLE "email_verifications" ADD CONSTRAINT "email_verifications_verified_user_id_fkey" FOREIGN KEY ("verified_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
