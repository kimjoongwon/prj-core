import "./src/load-local-env";

import { listReferenceDataMigrations, runReferenceDataMigrations } from "./src/reference-data/run-reference-data-migrations";

async function main(): Promise<void> {
	if (process.argv.includes("--list")) {
		for (const migration of listReferenceDataMigrations()) {
			console.log(`${migration.id}  ${migration.description}`);
		}
		return;
	}

	await runReferenceDataMigrations();
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
