import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

import { Prisma, PrismaClient } from "../generated/client/client";
import { createPrismaClient, disconnectPrismaClient } from "../prisma-client";
import { REFERENCE_DATA_HISTORY_TABLE } from "./constants";
import { referenceDataMigrations } from "./migrations";

interface AppliedMigrationRow {
	id: string;
	checksum: string;
	description: string;
	applied_at: Date;
}

/**
 * migration 소스 파일의 현재 내용을 checksum으로 계산합니다.
 *
 * 이미 적용된 migration의 파일 내용이 나중에 바뀌면 이 값이 달라지므로,
 * "과거 migration 수정"을 감지하는 핵심 안전장치로 사용됩니다.
 */
function buildChecksum(sourcePath: string): string {
	// Each migration file is immutable once applied; the checksum is how we
	// detect an edited historical file and fail fast instead of silently drifting.
	return createHash("sha256")
		.update(readFileSync(sourcePath, "utf8"))
		.digest("hex");
}

/**
 * reference-data migration 이력 테이블을 보장합니다.
 *
 * schema migration으로도 관리되지만, 오래된 개발 DB나 부분 복구된 환경에서도
 * runner가 바로 동작할 수 있게 방어적으로 생성합니다.
 */
async function ensureHistoryTable(prisma: PrismaClient): Promise<void> {
	// The table is also present in Prisma schema, but we defensively create it so
	// older/dev databases can bootstrap the runner without manual repair.
	await prisma.$executeRawUnsafe(`
		CREATE TABLE IF NOT EXISTS ${REFERENCE_DATA_HISTORY_TABLE} (
			id TEXT PRIMARY KEY,
			checksum TEXT NOT NULL,
			description TEXT NOT NULL,
			applied_at TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
		)
	`);
}

/**
 * 이미 적용된 reference-data migration 이력을 메모리 맵으로 읽어옵니다.
 *
 * 이후 실행 단계에서는 이 맵을 기준으로 skip/apply/checksum mismatch를 판정합니다.
 */
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

/**
 * 등록된 reference-data migration 목록을 가볍게 조회합니다.
 *
 * 실제 실행 없이 `--list` 같은 운영 점검 경로에서 사용됩니다.
 */
export function listReferenceDataMigrations(): {
	id: string;
	description: string;
}[] {
	return referenceDataMigrations.map((migration) => ({
		id: migration.id,
		description: migration.description,
	}));
}

/**
 * reference-data migration을 순서대로 적용합니다.
 *
 * 이 함수는 schema migration과 별개로 "운영 기준 데이터의 버전 이력"을 관리합니다.
 * 각 migration은 checksum 검증 후 실행되며, 적용과 history 기록을 같은 transaction으로 묶습니다.
 */
export async function runReferenceDataMigrations(): Promise<void> {
	const prismaHandle = createPrismaClient();
	const { prisma } = prismaHandle;

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
			// Apply and record history in the same transaction so the migration is
			// never half-applied from the runner's point of view.
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
		await disconnectPrismaClient(prismaHandle);
	}
}
