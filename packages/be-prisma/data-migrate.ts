import "./src/load-env";

import {
	listReferenceDataMigrations,
	runReferenceDataMigrations,
} from "./src/reference-data/run-reference-data-migrations";

/**
 * reference-data migration CLI 진입점입니다.
 *
 * `--list`면 등록된 migration 메타데이터만 출력하고, 기본 경로에서는
 * 아직 적용되지 않은 reference-data migration을 실제로 실행합니다.
 */
async function main(): Promise<void> {
	// `--list` is the lightweight inspection path used by operators to confirm
	// what will run before actually mutating reference data.
	if (process.argv.includes("--list")) {
		for (const migration of listReferenceDataMigrations()) {
			console.log(`${migration.id}  ${migration.description}`);
		}
		return;
	}

	// Default behaviour is "apply pending reference-data migrations".
	await runReferenceDataMigrations();
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
