import type { E2ERouteLike } from "./e2e-route-like";

const DEFAULT_SYSTEM_SPACE_ID =
	process.env.E2E_SYSTEM_SPACE_ID ?? "61ddca20-1752-466e-b4da-879ebdbe54e3";

export function expectSpaceHeader(
	route: E2ERouteLike,
	spaceId = DEFAULT_SYSTEM_SPACE_ID,
) {
	const headers = route.request().headers();
	const actualSpaceId = headers["x-space-id"];

	if (!actualSpaceId) {
		throw new Error("x-space-id header is missing.");
	}

	if (actualSpaceId.toLowerCase() !== spaceId.toLowerCase()) {
		throw new Error(
			`x-space-id header mismatch. Expected ${spaceId}, received ${actualSpaceId}.`,
		);
	}
}
