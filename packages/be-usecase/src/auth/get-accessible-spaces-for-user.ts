import { SpaceAggregate } from "@cocrepo/aggregate";
import { SpaceDto } from "@cocrepo/dto";
import { plainToInstance } from "class-transformer";
import { getOrderedTenantSpaceIds } from "./get-ordered-tenant-space-ids";
import type { UserWithTenantsLike } from "./user-with-tenants-like";

export async function getAccessibleSpacesForUser(
	spacesService: SpaceAggregate,
	user?: UserWithTenantsLike,
): Promise<SpaceDto[]> {
	if (!user?.tenants?.length) {
		return [];
	}

	const tenantSpaceIds = getOrderedTenantSpaceIds(user);
	const spaces = await spacesService.findByIdsWithGround(tenantSpaceIds);
	const spaceById = new Map(
		spaces.map((space) => [space.id, plainToInstance(SpaceDto, space)]),
	);

	return tenantSpaceIds
		.map((spaceId) => spaceById.get(spaceId))
		.filter((space): space is SpaceDto => Boolean(space));
}
