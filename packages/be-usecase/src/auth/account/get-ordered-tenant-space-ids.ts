import type { UserWithTenantsLike } from "./user-with-tenants-like";

export function getOrderedTenantSpaceIds(user: UserWithTenantsLike): bigint[] {
	const seen = new Set<bigint>();
	const orderedSpaceIds: bigint[] = [];

	for (const tenant of user.tenants ?? []) {
		if (tenant.removedAt != null) {
			continue;
		}
		if (!seen.has(tenant.spaceId)) {
			seen.add(tenant.spaceId);
			orderedSpaceIds.push(tenant.spaceId);
		}
	}

	return orderedSpaceIds;
}
