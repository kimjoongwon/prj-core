import { syncReferenceData } from "../sync-reference-data";
import type { ReferenceDataMigration } from "./types";

export const initialReferenceDataMigration: ReferenceDataMigration = {
	id: "20260317190000_initial-reference-data",
	description:
		"Seed reference-owned access control, OIDC, translation, and system taxonomy data.",
	sourcePath: __filename,
	async up(db) {
		await syncReferenceData(db);
	},
};
