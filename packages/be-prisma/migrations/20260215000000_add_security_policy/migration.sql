-- 보안 정책 테이블 생성
CREATE TABLE "security_policies" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "key" TEXT NOT NULL,
    "password_min_length" INTEGER NOT NULL DEFAULT 8,
    "password_require_uppercase" BOOLEAN NOT NULL DEFAULT true,
    "password_require_lowercase" BOOLEAN NOT NULL DEFAULT true,
    "password_require_number" BOOLEAN NOT NULL DEFAULT true,
    "password_require_special" BOOLEAN NOT NULL DEFAULT true,
    "password_expiration_days" INTEGER NOT NULL DEFAULT 0,
    "password_reuse_limit" INTEGER NOT NULL DEFAULT 3,
    "temporary_lock_threshold" INTEGER NOT NULL DEFAULT 5,
    "temporary_lock_duration_min" INTEGER NOT NULL DEFAULT 15,
    "permanent_lock_threshold" INTEGER NOT NULL DEFAULT 10,
    "access_token_ttl_sec" INTEGER NOT NULL DEFAULT 3600,
    "refresh_token_ttl_sec" INTEGER NOT NULL DEFAULT 2592000,
    "session_ttl_sec" INTEGER NOT NULL DEFAULT 86400,

    CONSTRAINT "security_policies_pkey" PRIMARY KEY ("id")
);

-- 유니크 인덱스
CREATE UNIQUE INDEX "security_policies_key_key" ON "security_policies"("key");

-- 기본 보안 정책 시드 데이터
INSERT INTO "security_policies" ("key") VALUES ('default') ON CONFLICT DO NOTHING;
