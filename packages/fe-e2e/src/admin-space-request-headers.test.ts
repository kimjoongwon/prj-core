import { type IntegrationUlid, isIntegrationUlid } from "@cocrepo/type";
import { afterEach, describe, expect, it, vi } from "vitest";
import { expectSpaceHeader } from "./expect-space-header";

function ulidFixture(value: string): IntegrationUlid {
	if (!isIntegrationUlid(value)) {
		throw new Error(`Invalid ULID fixture: ${value}`);
	}

	return value;
}

function routeWithTenantHeader(tenantId: string) {
	return {
		request: () => ({
			url: () => "http://localhost/api/v1/tasks",
			method: () => "GET",
			headers: () => ({ "x-tenant-id": tenantId }),
		}),
		fulfill: async () => {},
	};
}

describe("Admin Space request header contract", () => {
	afterEach(() => vi.unstubAllEnvs());

	it("Given bootstrap에서 얻은 tenant ID가 있을 때 When header를 만들면 Then ULID 문자열을 변경하지 않는다", async () => {
		vi.stubEnv("E2E_ADMIN_BASE_URL", "http://localhost:3400");
		vi.resetModules();
		const { getAdminSpaceRequestHeaders } = await import(
			"./admin-space-request-headers"
		);
		const tenantId = ulidFixture("01J00000000000000000000005");

		expect(
			getAdminSpaceRequestHeaders(tenantId, {
				Authorization: "Bearer access-token",
			}),
		).toEqual({
			Authorization: "Bearer access-token",
			// 상태 변경 API의 쿠키 인증은 신뢰된 Origin을 함께 보낸다.
			Origin: "http://localhost:3400",
			"x-tenant-id": tenantId,
		});
		expect(() =>
			expectSpaceHeader(routeWithTenantHeader(tenantId), tenantId),
		).not.toThrow();
	});

	it("Given 비정상 ULID tenant fixture가 있을 때 When header를 만들거나 검증하면 Then 공용 validator 기준으로 거부한다", async () => {
		vi.stubEnv("E2E_ADMIN_BASE_URL", "http://localhost:3400");
		vi.resetModules();
		const { getAdminSpaceRequestHeaders } = await import(
			"./admin-space-request-headers"
		);
		const invalidUlidFixture = "0";
		expect(isIntegrationUlid(invalidUlidFixture)).toBe(false);

		expect(() =>
			getAdminSpaceRequestHeaders(ulidFixture("01J00000000000000000000006"), {
				Authorization: "Bearer access-token",
				"x-tenant-id": invalidUlidFixture,
			}),
		).toThrow("x-tenant-id must be a canonical ULID.");
		expect(() =>
			expectSpaceHeader(routeWithTenantHeader(invalidUlidFixture)),
		).toThrow("x-tenant-id header must be a canonical ULID.");
	});
});
