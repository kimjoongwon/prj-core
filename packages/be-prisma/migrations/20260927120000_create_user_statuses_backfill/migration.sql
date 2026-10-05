-- CreateTable
-- 1단계: user_statuses 테이블 생성 + 기존 users 데이터 backfill.
-- users의 구 컬럼(is_active, failed_login_attempts, ...)은 롤아웃 중 구버전 파드 안전을 위해 유지하며,
-- prod 배포 검증 후 2단계 마이그레이션에서 DROP한다.
CREATE TABLE "user_statuses" (
    "user_status_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "user_id" BIGINT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMPTZ(6),
    "is_permanently_locked" BOOLEAN NOT NULL DEFAULT false,
    "last_login_at" TIMESTAMPTZ(6),
    "last_login_ip" TEXT,
    "current_tenant_id" BIGINT,

    CONSTRAINT "user_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_statuses_user_status_id_key" ON "user_statuses"("user_status_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_statuses_user_id_key" ON "user_statuses"("user_id");

-- CreateIndex
CREATE INDEX "user_statuses_user_id_idx" ON "user_statuses"("user_id");

-- CreateIndex
CREATE INDEX "user_statuses_current_tenant_id_idx" ON "user_statuses"("current_tenant_id");

-- AddForeignKey
ALTER TABLE "user_statuses" ADD CONSTRAINT "user_statuses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_statuses" ADD CONSTRAINT "user_statuses_current_tenant_id_fkey" FOREIGN KEY ("current_tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill: 기존 users의 상태 컬럼 값을 user_statuses로 복사 (멱등: NOT EXISTS 가드)
-- user_status_id는 ULID 문자集합(0-9,a-f ⊂ Crockford base32) 내에서 결정적으로 생성
INSERT INTO "user_statuses" (
    "user_status_id",
    "user_id",
    "is_active",
    "failed_login_attempts",
    "locked_until",
    "is_permanently_locked",
    "last_login_at",
    "last_login_ip",
    "current_tenant_id",
    "created_at"
)
SELECT
    substr(md5(u."id"::text || ':user-status'), 1, 26),
    u."id",
    u."is_active",
    u."failed_login_attempts",
    u."locked_until",
    u."is_permanently_locked",
    u."last_login_at",
    u."last_login_ip",
    u."current_tenant_id",
    u."created_at"
FROM "users" u
WHERE NOT EXISTS (
    SELECT 1 FROM "user_statuses" s WHERE s."user_id" = u."id"
);
