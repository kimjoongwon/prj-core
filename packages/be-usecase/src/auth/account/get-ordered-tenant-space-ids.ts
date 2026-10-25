import type { UserWithTenantsLike } from "./user-with-tenants-like";

/** 활성 Tenant 순서대로 접근 가능한 Space 공개 ID(ULID) 목록을 반환합니다. */
export function getOrderedTenantSpaceIds(user: UserWithTenantsLike): string[] {
	const seen = new Set<string>();
	const orderedSpaceIds: string[] = [];

	for (const tenant of user.tenants ?? []) {
		if (tenant.removedAt != null) {
			continue;
		}
		const spaceId = tenant.space?.id;
		if (spaceId && !seen.has(spaceId)) {
			seen.add(spaceId);
			orderedSpaceIds.push(spaceId);
		}
	}

	return orderedSpaceIds;
}
