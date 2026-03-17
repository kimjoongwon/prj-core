CREATE TABLE "reference_data_migration_history" (
    "id" TEXT NOT NULL,
    "checksum" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "applied_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reference_data_migration_history_pkey" PRIMARY KEY ("id")
);
