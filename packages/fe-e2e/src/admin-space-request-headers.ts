import { getAdminRequestHeaders } from "./admin-request-headers";

const SYSTEM_SPACE_ID =
	process.env.E2E_SYSTEM_SPACE_ID ?? "61ddca20-1752-466e-b4da-879ebdbe54e3";

export function getAdminSpaceRequestHeaders(
	spaceId = SYSTEM_SPACE_ID,
	headers: Record<string, string> = {},
) {
	return getAdminRequestHeaders({
		...headers,
		"x-space-id": headers["x-space-id"] ?? spaceId,
	});
}
