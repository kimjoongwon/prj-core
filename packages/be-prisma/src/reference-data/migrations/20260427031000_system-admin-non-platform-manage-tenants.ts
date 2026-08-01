import { systemAdminSeedData } from "../../bootstrap/data/system-users";
import { SYSTEM_SPACE_ID } from "../constants";
import type { ReferenceDataMigration } from "./types";

const SYSTEM_ADMIN_EMAILS = systemAdminSeedData.map((user) => user.email);

export const systemAdminNonPlatformManageTenantsMigration: ReferenceDataMigration =
	{
		id: "20260427031000_system-admin-non-platform-manage-tenants",
		description:
			"Force all non-platform system admin tenant rows to MANAGE, including stale or E2E-created spaces.",
		sourcePath: __filename,
		async up(db) {
			const manageRole = await db.role.findFirst({
				where: {
					name: "MANAGE",
					removedAt: null,
				},
			});

			if (!manageRole) {
				throw new Error("MANAGE role is required before normalizing tenants.");
			}

			await db.tenant.updateMany({
				where: {
					space: {
						id: {
							not: SYSTEM_SPACE_ID,
						},
					},
					removedAt: null,
					user: {
						email: {
							in: SYSTEM_ADMIN_EMAILS,
						},
					},
				},
				data: {
					roleSeq: manageRole.seq,
				},
			});
		},
	};
