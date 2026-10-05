import { syncReferenceData } from "../sync-reference-data";
import type { ReferenceDataMigration } from "./types";

/**
 * identity-prisma-v2 스키마에 맞춘 현재 reference data 전체 baseline입니다.
 */
export const identityPrismaV2ReferenceBaseline: ReferenceDataMigration = {
	id: "20260802001000_identity-prisma-v2-reference-baseline",
	description:
		"Seed the complete identity-prisma-v2 reference data catalog baseline.",
	sourcePath: __filename,
	async up(db) {
		await syncReferenceData(db);
	},
};
