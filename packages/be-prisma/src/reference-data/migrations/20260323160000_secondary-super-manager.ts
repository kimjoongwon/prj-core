import { ensureSystemAdminUsers } from "../../bootstrap/system-admins";
import type { ReferenceDataMigration } from "./types";

const TARGET_EMAIL = "wallydevplan@gmail.com";

export const secondarySuperManagerMigration: ReferenceDataMigration = {
	id: "20260323160000_secondary-super-manager",
	description:
		"Ensure the secondary system super manager account exists and is attached to the system space.",
	sourcePath: __filename,
	async up(db) {
		const fullAccessRole = await db.role.findFirst({
			where: {
				name: "FULL_ACCESS",
				removedAt: null,
			},
		});

		if (!fullAccessRole) {
			throw new Error(
				"FULL_ACCESS role is required before seeding system admins.",
			);
		}

		await ensureSystemAdminUsers(db, fullAccessRole.id, {
			emails: [TARGET_EMAIL],
		});
	},
};
