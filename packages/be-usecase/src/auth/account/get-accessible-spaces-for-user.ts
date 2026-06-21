import { SpaceAggregate } from "@cocrepo/aggregate";
import { getOrderedTenantSpaceIds } from "./get-ordered-tenant-space-ids";
import type { AuthSpaceResult } from "./space.result";
import type { UserWithTenantsLike } from "./user-with-tenants-like";

export async function getAccessibleSpacesForUser(
	spacesService: SpaceAggregate,
	user?: UserWithTenantsLike,
): Promise<AuthSpaceResult[]> {
	if (!user?.tenants?.length) {
		return [];
	}

	const tenantSpaceIds = getOrderedTenantSpaceIds(user);
	const spaces = await spacesService.findByIdsWithGround(tenantSpaceIds);
	const spaceById = new Map(spaces.map((space) => [space.id, space]));
	const tenantBySpaceId = new Map(
		(user.tenants ?? []).map((tenant) => [tenant.spaceId, tenant]),
	);

	const results: AuthSpaceResult[] = [];
	for (const spaceId of tenantSpaceIds) {
		const space = spaceById.get(spaceId);
		const tenant = tenantBySpaceId.get(spaceId);
		if (space && tenant) {
			results.push({
				...space,
				tenantId: tenant.id,
			});
		}
	}

	return results;
}
