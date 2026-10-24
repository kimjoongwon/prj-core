-- 공간의 표시 이름(이름/라벨)의 원천을 Space로 옮깁니다.
-- 1단계: spaces에 name/label 컬럼 추가 후 fitness_centers.name에서 backfill하고 NOT NULL로 전환.
-- 2단계: fitness_centers의 name/label 컬럼 삭제.

-- 1단계: 컬럼 추가
ALTER TABLE "spaces" ADD COLUMN "name" TEXT;
ALTER TABLE "spaces" ADD COLUMN "label" TEXT;

-- backfill: 살아있는 FitnessCenter 이름 우선, 없으면 Company 이름, 그래도 없으면 기본값.
-- FitnessCenter가 없는 Space(시스템 예외 공간 등)는 안전한 기본값으로 채웁니다.
UPDATE "spaces" AS s
SET
    "name" = COALESCE(
        live_center."name",
        any_center."name",
        live_company."name",
        '이름 없는 공간'
    ),
    "label" = COALESCE(live_center."label", any_center."label")
FROM "spaces" AS s_join
LEFT JOIN LATERAL (
    SELECT fc."name", fc."label"
    FROM "fitness_centers" fc
    WHERE fc."space_id" = s_join."id" AND fc."removed_at" IS NULL
    LIMIT 1
) AS live_center ON TRUE
LEFT JOIN LATERAL (
    SELECT fc."name", fc."label"
    FROM "fitness_centers" fc
    WHERE fc."space_id" = s_join."id"
    LIMIT 1
) AS any_center ON TRUE
LEFT JOIN LATERAL (
    SELECT c."name"
    FROM "fitness_centers" fc
    JOIN "companies" c ON c."id" = fc."company_id" AND c."removed_at" IS NULL
    WHERE fc."space_id" = s_join."id"
    LIMIT 1
) AS live_company ON TRUE
WHERE s."id" = s_join."id";

ALTER TABLE "spaces" ALTER COLUMN "name" SET NOT NULL;

-- 2단계: FitnessCenter에서 이름 컬럼 제거 (이름의 소유자는 Space)
ALTER TABLE "fitness_centers" DROP COLUMN "name";
ALTER TABLE "fitness_centers" DROP COLUMN "label";
