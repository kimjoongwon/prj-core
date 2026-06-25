import type { Prisma } from "@cocrepo/prisma";

export const IDP_ACCOUNT_ACCESS_GRANT_INCLUDE = {
	space: {
		include: {
			company: {
				include: {
					grounds: {
						where: { removedAt: null },
						orderBy: { createdAt: "asc" },
					},
				},
			},
		},
	},
	role: true,
} as const satisfies Prisma.TenantInclude;

export type IdpAccountAccessGrantRecord = Prisma.TenantGetPayload<{
	include: typeof IDP_ACCOUNT_ACCESS_GRANT_INCLUDE;
}>;
