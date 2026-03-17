import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

import { PrismaPg } from "@prisma/adapter-pg";
import * as pg from "pg";

import { Prisma, PrismaClient } from "../generated/client/client";
import { REFERENCE_DATA_HISTORY_TABLE } from "./constants";
import { referenceDataMigrations } from "./migrations";

interface AppliedMigrationRow {
	id: string;
	checksum: string;
	description: string;
	applied_at: Date;
}

function buildChecksum(sourcePath: string): string {
	return createHash("sha256").update(readFileSync(sourcePath, "utf8")).digest("hex");
}

async function ensureHistoryTable(prisma: PrismaClient): Promise<void> {
	await prisma.$executeRawUnsafe(`
		CREATE TABLE IF NOT EXISTS ${REFERENCE_DATA_HISTORY_TABLE} (
			id TEXT PRIMARY KEY,
			checksum TEXT NOT NULL,
			description TEXT NOT NULL,
			applied_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
		)
	`);
}

async function readAppliedMigrations(
	prisma: PrismaClient,
): Promise<Map<string, AppliedMigrationRow>> {
	const rows = await prisma.$queryRaw<AppliedMigrationRow[]>(
		Prisma.raw(`
			SELECT id, checksum, description, applied_at
			FROM ${REFERENCE_DATA_HISTORY_TABLE}
			ORDER BY id ASC
		`),
	);

	return new Map(rows.map((row) => [row.id, row]));
}

export function listReferenceDataMigrations(): { id: string; description: string }[] {
	return referenceDataMigrations.map((migration) => ({
		id: migration.id,
		description: migration.description,
	}));
}

export async function runReferenceDataMigrations(): Promise<void> {
	const pool = new pg.Pool({
		connectionString: process.env.DATABASE_URL,
	});
	const adapter = new PrismaPg(pool);
	const prisma = new PrismaClient({ adapter });

	try {
		await ensureHistoryTable(prisma);
		const appliedMigrations = await readAppliedMigrations(prisma);

		for (const migration of referenceDataMigrations) {
			const checksum = buildChecksum(migration.sourcePath);
			const applied = appliedMigrations.get(migration.id);

			if (applied) {
				if (applied.checksum !== checksum) {
					throw new Error(
						`Reference data migration checksum mismatch: ${migration.id}. Existing migrations must not be edited in place.`,
					);
				}

				console.log(`- skip ${migration.id}`);
				continue;
			}

			console.log(`- apply ${migration.id}`);
			await prisma.$transaction(
				async (tx) => {
					await migration.up(tx);
					await tx.$executeRawUnsafe(
						`
							INSERT INTO ${REFERENCE_DATA_HISTORY_TABLE} (id, checksum, description, applied_at)
							VALUES ($1, $2, $3, NOW())
						`,
						migration.id,
						checksum,
						migration.description,
					);
				},
				{
					maxWait: 10_000,
					timeout: 120_000,
				},
			);
		}
	} finally {
		await prisma.$disconnect();
		await pool.end();
	}
}
