import type { ReferenceDataMigration } from "./types";

const LEGACY_ROLE_BRIDGES = [
	{
		legacyName: "FULL_ACCESS",
		canonicalName: "PLATFORM_ADMIN",
		displayName: "Legacy full access bridge",
	},
	{
		legacyName: "MANAGE",
		canonicalName: "COMPANY_MANAGER",
		displayName: "Legacy manage bridge",
	},
] as const;

export const legacySystemRoleBridgeMigration: ReferenceDataMigration = {
	id: "20260323150000_legacy-system-role-bridge",
	description:
		"Ensure legacy role keys exist while older immutable migrations still reference them.",
	sourcePath: __filename,
	async up(db) {
		for (const bridge of LEGACY_ROLE_BRIDGES) {
			const legacyRole = await db.role.findUnique({
				where: { name: bridge.legacyName },
			});
			if (legacyRole) {
				continue;
			}

			const canonicalRole = await db.role.findUnique({
				where: { name: bridge.canonicalName },
			});
			if (!canonicalRole) {
				throw new Error(
					`${bridge.canonicalName} role is required before creating the ${bridge.legacyName} bridge.`,
				);
			}

			await db.role.create({
				data: {
					name: bridge.legacyName,
					displayName: bridge.displayName,
					description:
						"Temporary role key used only by older reference-data migrations.",
					isSystem: true,
				},
			});
		}
	},
};
