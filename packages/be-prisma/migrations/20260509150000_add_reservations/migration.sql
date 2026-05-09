CREATE TYPE "ReservationStatus" AS ENUM ('CONFIRMED', 'WAITLISTED', 'CANCELED');

CREATE TABLE "reservations" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6),
  "removed_at" TIMESTAMPTZ(6),
  "space_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "timeline_id" TEXT NOT NULL,
  "session_id" TEXT NOT NULL,
  "program_id" TEXT NOT NULL,
  "occurrence_start_at" TIMESTAMPTZ(6) NOT NULL,
  "status" "ReservationStatus" NOT NULL DEFAULT 'CONFIRMED',
  "memo" TEXT,
  "idempotency_key" TEXT NOT NULL,
  "waitlist_position" INTEGER,
  "confirmed_at" TIMESTAMPTZ(6),
  "canceled_at" TIMESTAMPTZ(6),
  "cancel_reason" TEXT,

  CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "reservations_user_id_idempotency_key_key"
ON "reservations"("user_id", "idempotency_key");

CREATE INDEX "reservations_space_id_occurrence_start_at_idx"
ON "reservations"("space_id", "occurrence_start_at");

CREATE INDEX "reservations_user_id_occurrence_start_at_idx"
ON "reservations"("user_id", "occurrence_start_at");

CREATE INDEX "reservations_program_id_occurrence_start_at_status_idx"
ON "reservations"("program_id", "occurrence_start_at", "status");

ALTER TABLE "reservations"
ADD CONSTRAINT "reservations_space_id_fkey"
FOREIGN KEY ("space_id") REFERENCES "spaces"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "reservations"
ADD CONSTRAINT "reservations_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "reservations"
ADD CONSTRAINT "reservations_timeline_id_fkey"
FOREIGN KEY ("timeline_id") REFERENCES "timelines"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "reservations"
ADD CONSTRAINT "reservations_session_id_fkey"
FOREIGN KEY ("session_id") REFERENCES "sessions"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "reservations"
ADD CONSTRAINT "reservations_program_id_fkey"
FOREIGN KEY ("program_id") REFERENCES "programs"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;
