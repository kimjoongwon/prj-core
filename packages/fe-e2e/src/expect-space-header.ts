import { type IntegrationUlid, isIntegrationUlid } from "@cocrepo/type";
import type { E2ERouteLike } from "./e2e-route-like";

/**
 * route 요청의 tenant header가 canonical ULID이며 기대값과 일치하는지 검증합니다.
 *
 * @param route 검증할 Playwright route
 * @param tenantId bootstrap 결과에서 얻은 기대 tenant ID
 */
export function expectSpaceHeader(route: E2ERouteLike, tenantId?: IntegrationUlid) {
	const headers = route.request().headers();
	const actualTenantId = headers["x-tenant-id"];

	if (!isIntegrationUlid(actualTenantId)) {
		throw new Error("x-tenant-id header must be a canonical ULID.");
	}

	if (tenantId && actualTenantId !== tenantId) {
		throw new Error(
			`x-tenant-id header mismatch. Expected ${tenantId}, received ${actualTenantId}.`,
		);
	}
}
