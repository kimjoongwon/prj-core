CREATE TABLE "policies" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6),
  "removed_at" TIMESTAMPTZ(6),
  "space_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "display_name" TEXT,
  "description" TEXT,
  "is_system" BOOLEAN NOT NULL DEFAULT false,

  CONSTRAINT "policies_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "policy_abilities" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6),
  "removed_at" TIMESTAMPTZ(6),
  "policy_id" TEXT NOT NULL,
  "ability_id" TEXT NOT NULL,

  CONSTRAINT "policy_abilities_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "role_policies" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6),
  "removed_at" TIMESTAMPTZ(6),
  "role_id" TEXT NOT NULL,
  "policy_id" TEXT NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "priority" INTEGER NOT NULL DEFAULT 0,

  CONSTRAINT "role_policies_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_policies" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6),
  "removed_at" TIMESTAMPTZ(6),
  "user_id" TEXT NOT NULL,
  "policy_id" TEXT NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "priority" INTEGER NOT NULL DEFAULT 10,

  CONSTRAINT "user_policies_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "policies_space_id_name_key" ON "policies"("space_id", "name");
CREATE INDEX "policies_space_id_idx" ON "policies"("space_id");
CREATE INDEX "policies_is_system_idx" ON "policies"("is_system");

CREATE UNIQUE INDEX "policy_abilities_policy_id_ability_id_key" ON "policy_abilities"("policy_id", "ability_id");
CREATE INDEX "policy_abilities_policy_id_idx" ON "policy_abilities"("policy_id");
CREATE INDEX "policy_abilities_ability_id_idx" ON "policy_abilities"("ability_id");

CREATE UNIQUE INDEX "role_policies_role_id_policy_id_key" ON "role_policies"("role_id", "policy_id");
CREATE INDEX "role_policies_role_id_idx" ON "role_policies"("role_id");
CREATE INDEX "role_policies_policy_id_idx" ON "role_policies"("policy_id");
CREATE INDEX "role_policies_is_active_idx" ON "role_policies"("is_active");

CREATE UNIQUE INDEX "user_policies_user_id_policy_id_key" ON "user_policies"("user_id", "policy_id");
CREATE INDEX "user_policies_user_id_idx" ON "user_policies"("user_id");
CREATE INDEX "user_policies_policy_id_idx" ON "user_policies"("policy_id");
CREATE INDEX "user_policies_is_active_idx" ON "user_policies"("is_active");

ALTER TABLE "policies"
ADD CONSTRAINT "policies_space_id_fkey"
FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "policy_abilities"
ADD CONSTRAINT "policy_abilities_policy_id_fkey"
FOREIGN KEY ("policy_id") REFERENCES "policies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "policy_abilities"
ADD CONSTRAINT "policy_abilities_ability_id_fkey"
FOREIGN KEY ("ability_id") REFERENCES "abilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "role_policies"
ADD CONSTRAINT "role_policies_role_id_fkey"
FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "role_policies"
ADD CONSTRAINT "role_policies_policy_id_fkey"
FOREIGN KEY ("policy_id") REFERENCES "policies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "user_policies"
ADD CONSTRAINT "user_policies_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "user_policies"
ADD CONSTRAINT "user_policies_policy_id_fkey"
FOREIGN KEY ("policy_id") REFERENCES "policies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO "policies" (
  "space_id",
  "name",
  "display_name",
  "description",
  "is_system"
)
SELECT
  s."id",
  LOWER(REPLACE(r."name", '_', '-')) || '-migrated-role-policy',
  COALESCE(r."display_name", r."name") || ' 이관 정책',
  'RoleGrant에서 Policy 구조로 자동 이관된 역할 정책입니다.',
  r."is_system"
FROM "roles" r
CROSS JOIN "spaces" s
WHERE s."removed_at" IS NULL
  AND EXISTS (
    SELECT 1
    FROM "role_grants" rg
    WHERE rg."role_id" = r."id"
      AND rg."is_active" = true
      AND rg."removed_at" IS NULL
  );

INSERT INTO "policy_abilities" (
  "policy_id",
  "ability_id"
)
SELECT DISTINCT
  p."id",
  rg."ability_id"
FROM "role_grants" rg
JOIN "roles" r ON r."id" = rg."role_id"
JOIN "policies" p
  ON p."name" = LOWER(REPLACE(r."name", '_', '-')) || '-migrated-role-policy'
WHERE rg."is_active" = true
  AND rg."removed_at" IS NULL;

INSERT INTO "role_policies" (
  "role_id",
  "policy_id",
  "is_active",
  "priority"
)
SELECT
  r."id",
  p."id",
  true,
  COALESCE(MAX(rg."priority"), 0)
FROM "role_grants" rg
JOIN "roles" r ON r."id" = rg."role_id"
JOIN "policies" p
  ON p."name" = LOWER(REPLACE(r."name", '_', '-')) || '-migrated-role-policy'
WHERE rg."is_active" = true
  AND rg."removed_at" IS NULL
GROUP BY r."id", p."id";

INSERT INTO "policies" (
  "space_id",
  "name",
  "display_name",
  "description",
  "is_system"
)
SELECT DISTINCT
  t."space_id",
  'user-' || ug."user_id" || '-migrated-policy',
  '사용자 예외 이관 정책',
  'UserGrant에서 Policy 구조로 자동 이관된 사용자 예외 정책입니다.',
  false
FROM "user_grants" ug
JOIN "tenants" t ON t."user_id" = ug."user_id"
JOIN "spaces" s ON s."id" = t."space_id"
WHERE ug."is_active" = true
  AND ug."removed_at" IS NULL
  AND t."removed_at" IS NULL
  AND s."removed_at" IS NULL;

INSERT INTO "policy_abilities" (
  "policy_id",
  "ability_id"
)
SELECT DISTINCT
  p."id",
  ug."ability_id"
FROM "user_grants" ug
JOIN "tenants" t ON t."user_id" = ug."user_id"
JOIN "policies" p
  ON p."space_id" = t."space_id"
  AND p."name" = 'user-' || ug."user_id" || '-migrated-policy'
WHERE ug."is_active" = true
  AND ug."removed_at" IS NULL
  AND t."removed_at" IS NULL;

INSERT INTO "user_policies" (
  "user_id",
  "policy_id",
  "is_active",
  "priority"
)
SELECT
  ug."user_id",
  p."id",
  true,
  COALESCE(MAX(ug."priority"), 10)
FROM "user_grants" ug
JOIN "tenants" t ON t."user_id" = ug."user_id"
JOIN "policies" p
  ON p."space_id" = t."space_id"
  AND p."name" = 'user-' || ug."user_id" || '-migrated-policy'
WHERE ug."is_active" = true
  AND ug."removed_at" IS NULL
  AND t."removed_at" IS NULL
GROUP BY ug."user_id", p."id";

DROP TABLE "role_grants";
DROP TABLE "user_grants";
