import type { E2ERouteLike } from "./e2e-route-like";

const DEFAULT_SYSTEM_TENANT_ID =
	process.env.E2E_SYSTEM_TENANT_ID ?? "71ddca20-1752-466e-b4da-879ebdbe54e3";

export function expectSpaceHeader(
	route: E2ERouteLike,
	tenantId = DEFAULT_SYSTEM_TENANT_ID,
) {
	const headers = route.request().headers();
	const actualTenantId = headers["x-tenant-id"];

	if (!actualTenantId) {
		throw new Error("x-tenant-id header is missing.");
	}

	if (actualTenantId.toLowerCase() !== tenantId.toLowerCase()) {
		throw new Error(
			`x-tenant-id header mismatch. Expected ${tenantId}, received ${actualTenantId}.`,
		);
	}
}
