-- TenantAccessRequest 소비 계약 제거가 완료된 뒤 전용 업무 테이블과 enum을 제거한다.
-- 이 migration은 기존 신청 데이터를 영구 삭제하므로 승인된 배포 단계에서만 적용한다.

BEGIN;

-- DropTable
DROP TABLE "tenant_access_requests";

-- DropEnum
DROP TYPE "TenantAccessRequestStatus";

COMMIT;
