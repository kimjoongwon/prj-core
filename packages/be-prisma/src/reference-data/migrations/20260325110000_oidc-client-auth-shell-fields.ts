import { syncReferenceData } from "../sync-reference-data";
import type { ReferenceDataMigration } from "./types";

export const oidcClientAuthShellFieldsMigration: ReferenceDataMigration = {
	id: "20260325110000_oidc-client-auth-shell-fields",
	description:
		"Backfill auth shell redirect metadata for reference-owned OIDC clients.",
	sourcePath: __filename,
	async up(db) {
		await syncReferenceData(db);
	},
};
