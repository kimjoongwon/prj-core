import { syncReferenceData } from "../sync-reference-data";
import type { ReferenceDataMigration } from "./types";

export const oidcClientLoginPageFieldsMigration: ReferenceDataMigration = {
	id: "20260325110000_oidc-client-login-page-fields",
	description:
		"Backfill login page redirect metadata for reference-owned OIDC clients.",
	sourcePath: __filename,
	async up(db) {
		await syncReferenceData(db);
	},
};
