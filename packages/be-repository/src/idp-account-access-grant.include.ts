import type { Prisma } from "@cocrepo/prisma";

export const IDP_ACCOUNT_ACCESS_GRANT_INCLUDE = {
	space: {
		include: {
			fitnessCenter: {
				include: {
					company: true,
				},
			},
		},
	},
	role: true,
} as unknown as Prisma.TenantInclude;

export type IdpAccountAccessGrantRecord = Prisma.TenantGetPayload<{
	include: typeof IDP_ACCOUNT_ACCESS_GRANT_INCLUDE;
}>;
