-- 1. 새 필드 추가
ALTER TABLE "roles" ADD COLUMN "description" TEXT;
ALTER TABLE "roles" ADD COLUMN "display_name" TEXT;
ALTER TABLE "roles" ADD COLUMN "is_system" BOOLEAN NOT NULL DEFAULT false;

-- 2. name 컬럼의 기본값 제거 (enum 의존성 해제)
ALTER TABLE "roles" ALTER COLUMN "name" DROP DEFAULT;

-- 3. name 컬럼을 enum에서 TEXT로 변환 (기존 데이터 유지)
ALTER TABLE "roles" ALTER COLUMN "name" TYPE TEXT USING "name"::TEXT;

-- 4. Roles enum 삭제
DROP TYPE "Roles";

-- 5. 기본 시스템 역할의 displayName, description, isSystem 업데이트
UPDATE "roles" SET
  "display_name" = '슈퍼 관리자',
  "description" = '시스템의 모든 권한을 가진 최고 관리자',
  "is_system" = true
WHERE "name" = 'SUPER_ADMIN';

UPDATE "roles" SET
  "display_name" = '관리자',
  "description" = '일반 관리 업무를 수행하는 관리자',
  "is_system" = true
WHERE "name" = 'ADMIN';

UPDATE "roles" SET
  "display_name" = '일반 사용자',
  "description" = '기본 사용자 역할',
  "is_system" = true
WHERE "name" = 'USER';
