import type { PrismaClient } from "../generated/client/client";
import { SYSTEM_SPACE_ID } from "../reference-data/constants";

export async function assertE2eSeedContract(
	prisma: PrismaClient,
): Promise<void> {
	const [systemSpace, adminUser, adminClient, roles] = await Promise.all([
		prisma.space.findUnique({
			where: { id: SYSTEM_SPACE_ID },
		}),
		prisma.user.findFirst({
			where: { email: "admin@plate.com" },
			include: {
				tenants: true,
			},
		}),
		prisma.oidcClient.findUnique({
			where: { clientId: "admin-web" },
		}),
		prisma.role.findMany({
			where: {
				name: {
					in: ["FULL_ACCESS", "MANAGE", "VIEW"],
				},
			},
			select: {
				name: true,
			},
		}),
	]);
	const roleNames = new Set(roles.map((role) => role.name));
	const missingContracts: string[] = [];

	if (!systemSpace) {
		missingContracts.push(`system space (${SYSTEM_SPACE_ID})`);
	}

	if (!adminUser) {
		missingContracts.push("admin user (admin@plate.com)");
	}

	if (adminUser && adminUser.tenants.length === 0) {
		missingContracts.push("admin tenant (admin@plate.com)");
	}

	if (!adminClient) {
		missingContracts.push("admin OIDC client (admin-web)");
	}

	for (const roleName of ["FULL_ACCESS", "MANAGE", "VIEW"]) {
		if (!roleNames.has(roleName)) {
			missingContracts.push(`role (${roleName})`);
		}
	}

	if (missingContracts.length > 0) {
		throw new Error(
			`E2E seed contract is incomplete: ${missingContracts.join(", ")}`,
		);
	}
}
