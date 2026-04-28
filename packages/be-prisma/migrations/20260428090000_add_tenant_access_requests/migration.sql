CREATE TYPE "TenantAccessRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELED');

CREATE TABLE "tenant_access_requests" (
  "id" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6),
  "removed_at" TIMESTAMPTZ(6),
  "requester_id" TEXT NOT NULL,
  "space_id" TEXT NOT NULL,
  "requested_role_id" TEXT NOT NULL,
  "previous_role_id" TEXT,
  "reason" TEXT,
  "status" "TenantAccessRequestStatus" NOT NULL DEFAULT 'PENDING',
  "reviewer_id" TEXT,
  "review_comment" TEXT,
  "reviewed_at" TIMESTAMPTZ(6),
  "applied_tenant_id" TEXT,

  CONSTRAINT "tenant_access_requests_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "tenants_user_id_space_id_key"
ON "tenants"("user_id", "space_id");

CREATE INDEX "tenant_access_requests_requester_id_idx"
ON "tenant_access_requests"("requester_id");

CREATE INDEX "tenant_access_requests_space_id_idx"
ON "tenant_access_requests"("space_id");

CREATE INDEX "tenant_access_requests_status_idx"
ON "tenant_access_requests"("status");

CREATE INDEX "tenant_access_requests_requester_id_space_id_status_idx"
ON "tenant_access_requests"("requester_id", "space_id", "status");

CREATE UNIQUE INDEX "tenant_access_requests_pending_requester_space_key"
ON "tenant_access_requests"("requester_id", "space_id")
WHERE "status" = 'PENDING' AND "removed_at" IS NULL;

ALTER TABLE "tenant_access_requests"
ADD CONSTRAINT "tenant_access_requests_requester_id_fkey"
FOREIGN KEY ("requester_id") REFERENCES "users"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "tenant_access_requests"
ADD CONSTRAINT "tenant_access_requests_reviewer_id_fkey"
FOREIGN KEY ("reviewer_id") REFERENCES "users"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE "tenant_access_requests"
ADD CONSTRAINT "tenant_access_requests_space_id_fkey"
FOREIGN KEY ("space_id") REFERENCES "spaces"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "tenant_access_requests"
ADD CONSTRAINT "tenant_access_requests_requested_role_id_fkey"
FOREIGN KEY ("requested_role_id") REFERENCES "roles"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "tenant_access_requests"
ADD CONSTRAINT "tenant_access_requests_previous_role_id_fkey"
FOREIGN KEY ("previous_role_id") REFERENCES "roles"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE "tenant_access_requests"
ADD CONSTRAINT "tenant_access_requests_applied_tenant_id_fkey"
FOREIGN KEY ("applied_tenant_id") REFERENCES "tenants"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
