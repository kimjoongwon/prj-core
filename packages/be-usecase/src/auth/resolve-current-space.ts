import { SpaceAggregate } from "@cocrepo/aggregate";
import { SpaceDto } from "@cocrepo/dto";
import { getAccessibleSpacesForUser } from "./get-accessible-spaces-for-user";
import { getDefaultSpaceId } from "./get-default-space-id";
import type { UserWithTenantsLike } from "./user-with-tenants-like";

export async function resolveCurrentSpace(
	spacesService: SpaceAggregate,
	user: UserWithTenantsLike | undefined,
	requestedSpaceId: string | undefined,
): Promise<SpaceDto | null> {
	const spaces = await getAccessibleSpacesForUser(spacesService, user);
	if (spaces.length === 0) {
		return null;
	}

	const allowedSpaceIds = new Set(spaces.map((space) => space.id));
	const defaultSpaceId = getDefaultSpaceId(user, allowedSpaceIds);
	const nextSpaceId =
		requestedSpaceId && allowedSpaceIds.has(requestedSpaceId)
			? requestedSpaceId
			: defaultSpaceId;
	return spaces.find((space) => space.id === nextSpaceId) ?? null;
}
