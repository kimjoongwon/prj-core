import type { DomainData } from "@cocrepo/entity";
import type { Prisma } from "@cocrepo/prisma";

export const IDP_ACCOUNT_ACCESS_GRANT_INCLUDE = {
	user: { select: { id: true } },
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

type IdpAccountAccessGrantPersistenceRecord = Prisma.TenantGetPayload<{
	include: typeof IDP_ACCOUNT_ACCESS_GRANT_INCLUDE;
}>;

export type IdpAccountAccessGrantRecord =
	DomainData<IdpAccountAccessGrantPersistenceRecord> & {
		userId: bigint;
		spaceId: bigint;
		roleId: bigint;
	};
