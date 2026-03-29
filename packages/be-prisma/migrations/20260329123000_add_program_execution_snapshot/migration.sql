ALTER TABLE "programs"
ADD COLUMN "routine_name_snapshot" TEXT,
ADD COLUMN "routine_label_snapshot" TEXT;

UPDATE "programs" AS "program"
SET
  "routine_name_snapshot" = "routine"."name",
  "routine_label_snapshot" = "routine"."label"
FROM "routines" AS "routine"
WHERE "routine"."id" = "program"."routine_id";

CREATE TABLE "program_activities" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6),
  "removed_at" TIMESTAMPTZ(6),
  "program_id" TEXT NOT NULL,
  "task_id" TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  "repetitions" INTEGER NOT NULL,
  "rest_time" INTEGER NOT NULL,
  "notes" TEXT,
  "exercise_name" TEXT NOT NULL,
  "exercise_description" TEXT,
  "exercise_duration" INTEGER NOT NULL,
  "exercise_count" INTEGER NOT NULL,
  "image_file_id" TEXT,
  "video_file_id" TEXT,

  CONSTRAINT "program_activities_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "program_activities_program_id_order_idx"
ON "program_activities"("program_id", "order");

CREATE UNIQUE INDEX "program_activities_program_id_task_id_key"
ON "program_activities"("program_id", "task_id");

CREATE INDEX "program_activities_task_id_idx"
ON "program_activities"("task_id");

ALTER TABLE "program_activities"
ADD CONSTRAINT "program_activities_program_id_fkey"
FOREIGN KEY ("program_id") REFERENCES "programs"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

INSERT INTO "program_activities" (
  "program_id",
  "task_id",
  "order",
  "repetitions",
  "rest_time",
  "notes",
  "exercise_name",
  "exercise_description",
  "exercise_duration",
  "exercise_count",
  "image_file_id",
  "video_file_id",
  "created_at",
  "updated_at",
  "removed_at"
)
SELECT DISTINCT ON ("program"."id", "activity"."task_id")
  "program"."id",
  "activity"."task_id",
  "activity"."order",
  "activity"."repetitions",
  "activity"."rest_time",
  "activity"."notes",
  COALESCE("exercise"."name", "activity"."task_id"),
  "exercise"."description",
  COALESCE("exercise"."duration", 0),
  COALESCE("exercise"."count", 0),
  "exercise"."image_file_id",
  "exercise"."video_file_id",
  COALESCE("activity"."created_at", "program"."created_at"),
  COALESCE("activity"."updated_at", "program"."updated_at"),
  COALESCE("program"."removed_at", "activity"."removed_at")
FROM "programs" AS "program"
JOIN "activities" AS "activity"
  ON "activity"."routine_id" = "program"."routine_id"
LEFT JOIN "exercises" AS "exercise"
  ON "exercise"."task_id" = "activity"."task_id"
WHERE "activity"."removed_at" IS NULL
ORDER BY
  "program"."id",
  "activity"."task_id",
  "activity"."order" ASC;
