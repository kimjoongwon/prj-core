CREATE TABLE "role_grants" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "role_id" TEXT NOT NULL,
    "ability_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "role_grants_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_grants" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "user_id" TEXT NOT NULL,
    "ability_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "user_grants_pkey" PRIMARY KEY ("id")
);

INSERT INTO "role_grants" (
    "id",
    "created_at",
    "updated_at",
    "removed_at",
    "role_id",
    "ability_id",
    "is_active",
    "priority"
)
SELECT
    "id",
    "created_at",
    "updated_at",
    "removed_at",
    "grantee_id",
    "ability_id",
    "is_active",
    "priority"
FROM "grants"
WHERE "grantee_type" = 'Role';

INSERT INTO "user_grants" (
    "id",
    "created_at",
    "updated_at",
    "removed_at",
    "user_id",
    "ability_id",
    "is_active",
    "priority"
)
SELECT
    "id",
    "created_at",
    "updated_at",
    "removed_at",
    "grantee_id",
    "ability_id",
    "is_active",
    "priority"
FROM "grants"
WHERE "grantee_type" = 'User';

CREATE UNIQUE INDEX "role_grants_role_id_ability_id_key" ON "role_grants"("role_id", "ability_id");
CREATE INDEX "role_grants_role_id_idx" ON "role_grants"("role_id");
CREATE INDEX "role_grants_ability_id_idx" ON "role_grants"("ability_id");
CREATE INDEX "role_grants_is_active_idx" ON "role_grants"("is_active");

CREATE UNIQUE INDEX "user_grants_user_id_ability_id_key" ON "user_grants"("user_id", "ability_id");
CREATE INDEX "user_grants_user_id_idx" ON "user_grants"("user_id");
CREATE INDEX "user_grants_ability_id_idx" ON "user_grants"("ability_id");
CREATE INDEX "user_grants_is_active_idx" ON "user_grants"("is_active");

ALTER TABLE "role_grants"
ADD CONSTRAINT "role_grants_role_id_fkey"
FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "role_grants"
ADD CONSTRAINT "role_grants_ability_id_fkey"
FOREIGN KEY ("ability_id") REFERENCES "abilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "user_grants"
ADD CONSTRAINT "user_grants_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "user_grants"
ADD CONSTRAINT "user_grants_ability_id_fkey"
FOREIGN KEY ("ability_id") REFERENCES "abilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

DROP TABLE "grants";
