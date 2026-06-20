import type { UserWithTenantsLike } from "./user-with-tenants-like";

export function getOrderedTenantSpaceIds(user: UserWithTenantsLike): string[] {
	const seen = new Set<string>();
	const orderedSpaceIds: string[] = [];

	for (const tenant of user.tenants ?? []) {
		if (!seen.has(tenant.spaceId)) {
			seen.add(tenant.spaceId);
			orderedSpaceIds.push(tenant.spaceId);
		}
	}

	return orderedSpaceIds;
}
