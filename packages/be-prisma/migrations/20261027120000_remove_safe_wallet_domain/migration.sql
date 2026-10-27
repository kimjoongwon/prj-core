-- SafeWallet 도메인은 더 이상 애플리케이션에서 사용하지 않으므로
-- 종속 관계의 자식 테이블부터 제거한다. 이 migration은 기존 데이터를 영구 삭제한다.

BEGIN;

-- DropTable
DROP TABLE "safe_confirmations";

-- DropTable
DROP TABLE "safe_transactions";

-- DropTable
DROP TABLE "safe_wallets";

COMMIT;
