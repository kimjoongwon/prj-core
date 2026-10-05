-- 2단계: UserStatus 분리 1단계(create_user_statuses_backfill)의 prod 배포·검증 완료 후
-- users에서 UserStatus로 이전된 구 상태 컬럼과 mustChangePassword(폐기)를 제거한다.
-- 이 시점의 앱 코드는 해당 컬럼을 더 이상 참조하지 않는다.

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_current_tenant_id_fkey";

-- DropIndex
DROP INDEX "users_current_tenant_id_idx";

-- AlterTable
ALTER TABLE "users"
    DROP COLUMN "failed_login_attempts",
    DROP COLUMN "locked_until",
    DROP COLUMN "is_permanently_locked",
    DROP COLUMN "must_change_password",
    DROP COLUMN "last_login_at",
    DROP COLUMN "last_login_ip",
    DROP COLUMN "is_active",
    DROP COLUMN "current_tenant_id";
