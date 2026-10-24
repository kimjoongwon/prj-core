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

	const activeTenants = user.tenants.filter(
		(tenant) => tenant.removedAt == null,
	);
	if (activeTenants.length === 0) {
		return [];
	}

	const tenantSpaceIds = getOrderedTenantSpaceIds(user);
	const spaces = await spacesService.findByIdsWithFitnessCenter(tenantSpaceIds);
	const spaceById = new Map(spaces.map((space) => [space.id, space]));
	const tenantBySpaceId = new Map(
		activeTenants.map((tenant) => [tenant.spaceSeq, tenant]),
	);

	const results: AuthSpaceResult[] = [];
	for (const spaceSeq of tenantSpaceIds) {
		const space = spaceById.get(spaceSeq);
		const tenant = tenantBySpaceId.get(spaceSeq);
		if (space && tenant) {
			results.push({
				...space,
				tenantId: tenant.id,
			});
		}
	}

	return results;
}
