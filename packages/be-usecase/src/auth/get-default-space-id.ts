import { getOrderedTenantSpaceIds } from "./get-ordered-tenant-space-ids";
import type { UserWithTenantsLike } from "./user-with-tenants-like";

export function getDefaultSpaceId(
	user: UserWithTenantsLike | undefined,
	allowedSpaceIds: Set<string>,
): string | undefined {
	if (!user?.tenants?.length) {
		return undefined;
	}

	return getOrderedTenantSpaceIds(user).find((spaceId) =>
		allowedSpaceIds.has(spaceId),
	);
}
