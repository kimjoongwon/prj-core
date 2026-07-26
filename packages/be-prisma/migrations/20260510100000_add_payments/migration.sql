DO $$
BEGIN
  CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELED', 'REFUNDED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'VIRTUAL_ACCOUNT', 'BANK_TRANSFER', 'CASH', 'FREE', 'EXTERNAL');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "PaymentSubjectType" AS ENUM ('COURSE', 'COURSE_OFFERING', 'ENROLLMENT', 'COURSE_PASS', 'PRODUCT', 'CUSTOM');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "PaymentReferenceType" AS ENUM ('ENROLLMENT', 'COURSE_PASS', 'PRODUCT_ENTITLEMENT', 'SERVICE_USAGE', 'REFUND', 'CUSTOM');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE "payments" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6),
  "removed_at" TIMESTAMPTZ(6),
  "space_id" TEXT NOT NULL,
  "payer_user_id" TEXT,
  "title" TEXT NOT NULL,
  "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "method" "PaymentMethod",
  "provider" TEXT,
  "provider_payment_id" TEXT,
  "provider_order_id" TEXT,
  "total_amount" INTEGER NOT NULL DEFAULT 0,
  "currency" TEXT NOT NULL DEFAULT 'KRW',
  "requested_at" TIMESTAMPTZ(6),
  "approved_at" TIMESTAMPTZ(6),
  "canceled_at" TIMESTAMPTZ(6),
  "receipt_url" TEXT,
  "memo" TEXT,
  "metadata" JSONB,

  CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "payment_subjects" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6),
  "removed_at" TIMESTAMPTZ(6),
  "payment_id" TEXT NOT NULL,
  "space_id" TEXT NOT NULL,
  "service_code" TEXT NOT NULL DEFAULT 'core',
  "subject_type" "PaymentSubjectType" NOT NULL,
  "subject_id" TEXT NOT NULL,
  "subject_label" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "unit_amount" INTEGER NOT NULL DEFAULT 0,
  "total_amount" INTEGER NOT NULL DEFAULT 0,
  "currency" TEXT NOT NULL DEFAULT 'KRW',
  "metadata" JSONB,

  CONSTRAINT "payment_subjects_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "payment_references" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6),
  "removed_at" TIMESTAMPTZ(6),
  "payment_id" TEXT NOT NULL,
  "space_id" TEXT NOT NULL,
  "service_code" TEXT NOT NULL DEFAULT 'core',
  "reference_type" "PaymentReferenceType" NOT NULL,
  "reference_id" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'primary',
  "label" TEXT,
  "metadata" JSONB,

  CONSTRAINT "payment_references_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "enrollments"
ADD COLUMN "payment_id" TEXT;

CREATE UNIQUE INDEX "payments_provider_provider_payment_id_key"
ON "payments"("provider", "provider_payment_id");

CREATE INDEX "payments_space_id_idx"
ON "payments"("space_id");

CREATE INDEX "payments_payer_user_id_idx"
ON "payments"("payer_user_id");

CREATE INDEX "payments_status_idx"
ON "payments"("status");

CREATE INDEX "payments_provider_order_id_idx"
ON "payments"("provider_order_id");

CREATE INDEX "payments_approved_at_idx"
ON "payments"("approved_at");

CREATE INDEX "payment_subjects_payment_id_idx"
ON "payment_subjects"("payment_id");

CREATE INDEX "payment_subjects_space_id_idx"
ON "payment_subjects"("space_id");

CREATE INDEX "payment_subjects_service_code_idx"
ON "payment_subjects"("service_code");

CREATE INDEX "payment_subjects_subject_type_subject_id_idx"
ON "payment_subjects"("subject_type", "subject_id");

CREATE INDEX "payment_references_payment_id_idx"
ON "payment_references"("payment_id");

CREATE INDEX "payment_references_space_id_idx"
ON "payment_references"("space_id");

CREATE INDEX "payment_references_service_code_idx"
ON "payment_references"("service_code");

CREATE INDEX "payment_references_reference_type_reference_id_idx"
ON "payment_references"("reference_type", "reference_id");

CREATE INDEX "enrollments_payment_id_idx"
ON "enrollments"("payment_id");

ALTER TABLE "payments"
ADD CONSTRAINT "payments_space_id_fkey"
FOREIGN KEY ("space_id") REFERENCES "spaces"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "payments"
ADD CONSTRAINT "payments_payer_user_id_fkey"
FOREIGN KEY ("payer_user_id") REFERENCES "users"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE "payment_subjects"
ADD CONSTRAINT "payment_subjects_payment_id_fkey"
FOREIGN KEY ("payment_id") REFERENCES "payments"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "payment_subjects"
ADD CONSTRAINT "payment_subjects_space_id_fkey"
FOREIGN KEY ("space_id") REFERENCES "spaces"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "payment_references"
ADD CONSTRAINT "payment_references_payment_id_fkey"
FOREIGN KEY ("payment_id") REFERENCES "payments"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "payment_references"
ADD CONSTRAINT "payment_references_space_id_fkey"
FOREIGN KEY ("space_id") REFERENCES "spaces"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "enrollments"
ADD CONSTRAINT "enrollments_payment_id_fkey"
FOREIGN KEY ("payment_id") REFERENCES "payments"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

