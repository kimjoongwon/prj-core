-- AlterTable: User 모델에 인증 보안 필드 추가
ALTER TABLE "users" ADD COLUMN "failed_login_attempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "users" ADD COLUMN "locked_until" TIMESTAMPTZ(6);
ALTER TABLE "users" ADD COLUMN "is_permanently_locked" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN "must_change_password" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN "password_changed_at" TIMESTAMPTZ(6);
ALTER TABLE "users" ADD COLUMN "last_login_at" TIMESTAMPTZ(6);
ALTER TABLE "users" ADD COLUMN "last_login_ip" TEXT;
ALTER TABLE "users" ADD COLUMN "is_active" BOOLEAN NOT NULL DEFAULT true;

-- CreateEnum: 인증 감사 결과
CREATE TYPE "AuthAuditResult" AS ENUM ('SUCCESS', 'FAILURE', 'LOCKED');

-- CreateTable: 인증 감사 로그
CREATE TABLE "auth_audit_logs" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "user_id" TEXT,
    "result" "AuthAuditResult" NOT NULL,
    "failure_reason" TEXT,
    "ip_address" TEXT NOT NULL,
    "user_agent" TEXT,
    "client_id" TEXT,

    CONSTRAINT "auth_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable: 비밀번호 히스토리
CREATE TABLE "password_histories" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,

    CONSTRAINT "password_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "auth_audit_logs_email_idx" ON "auth_audit_logs"("email");
CREATE INDEX "auth_audit_logs_user_id_idx" ON "auth_audit_logs"("user_id");
CREATE INDEX "auth_audit_logs_created_at_idx" ON "auth_audit_logs"("created_at");
CREATE INDEX "auth_audit_logs_result_idx" ON "auth_audit_logs"("result");
CREATE INDEX "password_histories_user_id_idx" ON "password_histories"("user_id");

-- AddForeignKey
ALTER TABLE "auth_audit_logs" ADD CONSTRAINT "auth_audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "password_histories" ADD CONSTRAINT "password_histories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
