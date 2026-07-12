import { getAdminRequestHeaders } from "./admin-request-headers";

const DEFAULT_SYSTEM_TENANT_ID =
	process.env.E2E_SYSTEM_TENANT_ID ?? "71ddca20-1752-466e-b4da-879ebdbe54e3";

export function getAdminSpaceRequestHeaders(
	tenantId = DEFAULT_SYSTEM_TENANT_ID,
	headers: Record<string, string> = {},
) {
	return getAdminRequestHeaders({
		...headers,
		"x-tenant-id": headers["x-tenant-id"] ?? tenantId,
	});
}
