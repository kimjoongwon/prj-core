-- Space에 isSystem 필드 추가
ALTER TABLE "spaces" ADD COLUMN "is_system" BOOLEAN NOT NULL DEFAULT false;

-- 기존 System Space 마이그레이션: seq=1인 Space를 isSystem=true로 설정
UPDATE "spaces" SET "is_system" = true WHERE "seq" = 1;

-- 모든 테이블에서 seq 컬럼 제거
ALTER TABLE "categories" DROP COLUMN "seq";
ALTER TABLE "groups" DROP COLUMN "seq";
ALTER TABLE "tenants" DROP COLUMN "seq";
ALTER TABLE "assignments" DROP COLUMN "seq";
ALTER TABLE "posts" DROP COLUMN "seq";
ALTER TABLE "contents" DROP COLUMN "seq";
ALTER TABLE "users" DROP COLUMN "seq";
ALTER TABLE "user_classifications" DROP COLUMN "seq";
ALTER TABLE "user_associations" DROP COLUMN "seq";
ALTER TABLE "profiles" DROP COLUMN "seq";
ALTER TABLE "spaces" DROP COLUMN "seq";
ALTER TABLE "space_classifications" DROP COLUMN "seq";
ALTER TABLE "space_associations" DROP COLUMN "seq";
ALTER TABLE "grounds" DROP COLUMN "seq";
ALTER TABLE "roles" DROP COLUMN "seq";
ALTER TABLE "role_associations" DROP COLUMN "seq";
ALTER TABLE "role_classifications" DROP COLUMN "seq";
ALTER TABLE "files" DROP COLUMN "seq";
ALTER TABLE "file_classifications" DROP COLUMN "seq";
ALTER TABLE "file_associations" DROP COLUMN "seq";
ALTER TABLE "subjects" DROP COLUMN "seq";
ALTER TABLE "actions" DROP COLUMN "seq";
ALTER TABLE "abilities" DROP COLUMN "seq";
ALTER TABLE "grants" DROP COLUMN "seq";
ALTER TABLE "timelines" DROP COLUMN "seq";
ALTER TABLE "sessions" DROP COLUMN "seq";
ALTER TABLE "programs" DROP COLUMN "seq";
ALTER TABLE "routines" DROP COLUMN "seq";
ALTER TABLE "activities" DROP COLUMN "seq";
ALTER TABLE "tasks" DROP COLUMN "seq";
ALTER TABLE "exercises" DROP COLUMN "seq";
ALTER TABLE "oidc_clients" DROP COLUMN "seq";
ALTER TABLE "oidc_models" DROP COLUMN "seq";
ALTER TABLE "safe_wallets" DROP COLUMN "seq";
ALTER TABLE "safe_transactions" DROP COLUMN "seq";
ALTER TABLE "safe_confirmations" DROP COLUMN "seq";
