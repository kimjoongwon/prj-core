import { SpaceAggregate } from "@cocrepo/aggregate";
import { getAccessibleSpacesForUser } from "./get-accessible-spaces-for-user";
import type { AuthSpaceResult } from "./space.result";
import type { UserWithTenantsLike } from "./user-with-tenants-like";

export async function resolveCurrentSpace(
	spacesService: SpaceAggregate,
	user: UserWithTenantsLike | undefined,
	requestedTenantId: string | undefined,
): Promise<AuthSpaceResult | null> {
	const spaces = await getAccessibleSpacesForUser(spacesService, user);
	if (spaces.length === 0) {
		return null;
	}

	const requestedSpace = requestedTenantId
		? spaces.find((space) => space.tenantId === requestedTenantId)
		: undefined;

	return requestedSpace ?? spaces[0] ?? null;
}
