import { syncReferenceData } from "../sync-reference-data";
import type { ReferenceDataMigration } from "./types";

export const oidcClientIdRenameMigration: ReferenceDataMigration = {
	id: "20260414110000_oidc-client-id-rename",
	description:
		"Rename first-party OIDC clientIds to the canonical realm-surface format.",
	sourcePath: __filename,
	async up(db) {
		await syncReferenceData(db);
	},
};
