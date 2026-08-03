import { type DecimalId, isDecimalId } from "@cocrepo/type";
import { describe, expect, it } from "vitest";
import { getAdminSpaceRequestHeaders } from "./admin-space-request-headers";
import { expectSpaceHeader } from "./expect-space-header";

function decimalIdFixture(value: string): DecimalId {
	if (!isDecimalId(value)) {
		throw new Error(`Invalid decimal ID fixture: ${value}`);
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
	it("Given bootstrap에서 얻은 tenant ID가 있을 때 When header를 만들면 Then decimal 문자열을 변경하지 않는다", () => {
		const tenantId = decimalIdFixture("601");

		expect(
			getAdminSpaceRequestHeaders(tenantId, {
				Authorization: "Bearer access-token",
			}),
		).toEqual({
			Authorization: "Bearer access-token",
			"x-tenant-id": tenantId,
		});
		expect(() =>
			expectSpaceHeader(routeWithTenantHeader(tenantId), tenantId),
		).not.toThrow();
	});

	it("Given 비정상 decimal tenant fixture가 있을 때 When header를 만들거나 검증하면 Then 공용 validator 기준으로 거부한다", () => {
		const invalidDecimalIdFixture = "0";
		expect(isDecimalId(invalidDecimalIdFixture)).toBe(false);

		expect(() =>
			getAdminSpaceRequestHeaders(decimalIdFixture("602"), {
				Authorization: "Bearer access-token",
				"x-tenant-id": invalidDecimalIdFixture,
			}),
		).toThrow("x-tenant-id must be a canonical decimal ID.");
		expect(() =>
			expectSpaceHeader(routeWithTenantHeader(invalidDecimalIdFixture)),
		).toThrow("x-tenant-id header must be a canonical decimal ID.");
	});
});
