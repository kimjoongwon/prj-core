import type { Prisma } from "@cocrepo/prisma";

export const IDP_ACCOUNT_ACCESS_GRANT_INCLUDE = {
	space: {
		include: {
			company: {
				include: {
					ground: true,
				},
			},
		},
	},
	role: true,
} as const satisfies Prisma.TenantInclude;

export type IdpAccountAccessGrantRecord = Prisma.TenantGetPayload<{
	include: typeof IDP_ACCOUNT_ACCESS_GRANT_INCLUDE;
}>;
