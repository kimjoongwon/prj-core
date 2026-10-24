import { SpaceAggregate } from "@cocrepo/aggregate";
import { getAccessibleSpacesForUser } from "./get-accessible-spaces-for-user";
import type { AuthSpaceResult } from "./space.result";
import type { UserWithTenantsLike } from "./user-with-tenants-like";

export async function resolveCurrentSpace(
	spacesService: SpaceAggregate,
	user: UserWithTenantsLike | undefined,
): Promise<AuthSpaceResult | null> {
	if (!user?.currentTenantId) {
		return null;
	}

	const spaces = await getAccessibleSpacesForUser(spacesService, user);
	return (
		spaces.find((space) => space.tenantId === user.currentTenantId) ?? null
	);
}
