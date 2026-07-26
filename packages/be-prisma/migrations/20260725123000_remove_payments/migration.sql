-- The payment checkout feature was removed from the application.
-- Delete its database-only residue after the historical add_payments migration
-- has been restored to the migration tree for history consistency.

ALTER TABLE "enrollments"
DROP CONSTRAINT "enrollments_payment_id_fkey";

ALTER TABLE "enrollments"
DROP COLUMN "payment_id";

ALTER TABLE "enrollments"
DROP COLUMN "payment_status";

DROP TABLE "payment_references";
DROP TABLE "payment_subjects";
DROP TABLE "payments";

DROP TYPE "PaymentReferenceType";
DROP TYPE "PaymentSubjectType";
DROP TYPE "PaymentMethod";
DROP TYPE "PaymentStatus";
