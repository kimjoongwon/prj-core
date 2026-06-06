import { existsSync } from "node:fs";
import path from "node:path";

function getStorageStateCandidates() {
	const env = process.env.E2E_ENV ?? "local";
	const explicitPath = process.env.E2E_ADMIN_STORAGE_STATE;
	const cwd = process.cwd();

	return [
		explicitPath,
		path.resolve(cwd, "tests/admin/helpers/.auth", env, "admin.json"),
		path.resolve(cwd, "apps/test/e2e/tests/admin/helpers/.auth", env, "admin.json"),
		path.resolve(cwd, "tests/admin/helpers/.auth/admin.json"),
		path.resolve(cwd, "apps/test/e2e/tests/admin/helpers/.auth/admin.json"),
	].filter((candidate): candidate is string => Boolean(candidate));
}

export function getAdminStorageStatePath() {
	const storageStatePath = getStorageStateCandidates().find((candidate) =>
		existsSync(candidate),
	);

	if (!storageStatePath) {
		throw new Error(
			"Admin E2E storage state was not found. Run the admin setup project first.",
		);
	}

	return storageStatePath;
}
