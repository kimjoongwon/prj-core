import { systemAdminSeedData } from "../../bootstrap/data/system-users";
import { SYSTEM_SPACE_ID } from "../constants";
import type { ReferenceDataMigration } from "./types";

const SYSTEM_ADMIN_EMAILS = systemAdminSeedData.map((user) => user.email);

export const systemAdminBranchManageTenantsMigration: ReferenceDataMigration = {
	id: "20260427030000_system-admin-branch-manage-tenants",
	description:
		"Normalize system admin tenants so only the platform space keeps FULL_ACCESS and branch spaces use MANAGE.",
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

		const users = await db.user.findMany({
			where: {
				email: {
					in: SYSTEM_ADMIN_EMAILS,
				},
				removedAt: null,
			},
			select: {
				id: true,
			},
		});

		if (users.length === 0) {
			return;
		}

		const branchSpaces = await db.space.findMany({
			where: {
				id: {
					not: SYSTEM_SPACE_ID,
				},
				removedAt: null,
			},
			select: {
				id: true,
			},
		});

		for (const user of users) {
			for (const space of branchSpaces) {
				const existingTenants = await db.tenant.findMany({
					where: {
						userId: user.id,
						spaceId: space.id,
						removedAt: null,
					},
					select: {
						id: true,
						roleId: true,
					},
				});

				if (existingTenants.length === 0) {
					await db.tenant.create({
						data: {
							userId: user.id,
							spaceId: space.id,
							roleId: manageRole.id,
						},
					});
					continue;
				}

				if (existingTenants.some((tenant) => tenant.roleId !== manageRole.id)) {
					await db.tenant.updateMany({
						where: {
							id: {
								in: existingTenants.map((tenant) => tenant.id),
							},
						},
						data: {
							roleId: manageRole.id,
						},
					});
				}
			}
		}
	},
};
