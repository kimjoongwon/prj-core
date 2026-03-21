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
	// 1) CLI 실행마다 독립적인 Prisma handle을 연다.
	// app runtime 싱글턴을 재사용하지 않고, 스크립트 수명주기 안에서 열고 닫는다.
	const prismaHandle = createPrismaClient();
	const { prisma } = prismaHandle;

	try {
		// 2) runner가 의존하는 최소 메타데이터부터 보장한다.
		// schema migration이 이미 끝난 정상 환경이라면 no-op이고,
		// 오래된 dev DB처럼 일부만 복구된 환경에서도 여기서 바로 복구된다.
		await ensureHistoryTable(prisma);

		// 3) 현재 DB가 "어디까지 적용됐는지"를 메모리에 읽어 둔다.
		// 이후 loop에서는 이 맵만 보고 skip/apply/checksum mismatch를 판정한다.
		const appliedMigrations = await readAppliedMigrations(prisma);

		// 4) 코드에 등록된 reference-data migration을 선언 순서대로 순회한다.
		// 배열 순서가 곧 실행 순서이므로, 선행 migration이 만든 기준 데이터를
		// 후속 migration이 참조하는 구조를 안전하게 표현할 수 있다.
		for (const migration of referenceDataMigrations) {
			// 현재 파일 내용을 그대로 checksum으로 계산한다.
			// 이미 적용된 migration 파일이 나중에 수정되면 이 값이 달라진다.
			const checksum = buildChecksum(migration.sourcePath);

			// DB history에 같은 id가 있는지 확인한다.
			// 있으면 "과거에 실행한 적 있는 migration", 없으면 "이번에 처음 실행할 migration"이다.
			const applied = appliedMigrations.get(migration.id);

			if (applied) {
				// 이미 실행된 migration인데 checksum이 다르면 과거 파일이 수정된 것이다.
				// 이런 경우 조용히 진행하면 환경별 drift를 만들기 때문에 즉시 실패시킨다.
				if (applied.checksum !== checksum) {
					throw new Error(
						`Reference data migration checksum mismatch: ${migration.id}. Existing migrations must not be edited in place.`,
					);
				}

				// id도 같고 checksum도 같다면 완전히 동일한 migration이므로 skip한다.
				// 이 branch 덕분에 PreSync Job이 여러 번 떠도 재실행에 안전하다.
				console.log(`- skip ${migration.id}`);
				continue;
			}

			// DB 이력에 없는 migration만 실제 적용 대상으로 본다.
			console.log(`- apply ${migration.id}`);
			// 5) "실제 데이터 변경"과 "history 기록"을 하나의 transaction으로 묶는다.
			// 중간에 실패하면 둘 다 롤백되어, runner 입장에서는
			// "반쯤 적용됐는데 기록은 없는 상태"를 만들지 않는다.
			await prisma.$transaction(
				async (tx) => {
					// migration 본문이 여기서 실제 row create/update를 수행한다.
					await migration.up(tx);

					// 본문이 성공한 직후에만 history를 남긴다.
					// 이후 실행에서는 이 row를 보고 skip 여부를 판단한다.
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
						// 대기 시간과 총 실행 시간을 분리해서 둔다.
						// maxWait: transaction slot을 얻기까지 기다리는 최대 시간
						// timeout: transaction 시작 후 전체 작업이 완료돼야 하는 시간
						maxWait: 10_000,
						timeout: 120_000,
					},
				);
			}
	} finally {
		// 6) 성공/실패와 무관하게 연결 자원을 반드시 정리한다.
		await disconnectPrismaClient(prismaHandle);
	}
}
