import { describe, expect, it } from "vitest";
import {
	INTEGRATION_ULID_PATTERN,
	isIntegrationUlid,
	parseIntegrationUlid,
} from "./integration-ulid";

describe("integration-ulid", () => {
	it("Given 유효한 ULID 문자열 When 검사하면 Then integration ULID로 인정한다", () => {
		const ulid = "01J00000000000000000000000";

		expect(isIntegrationUlid(ulid)).toBe(true);
		expect(parseIntegrationUlid(ulid)).toBe(ulid);
		expect(INTEGRATION_ULID_PATTERN.test(ulid)).toBe(true);
	});

	it("Given ULID가 아닌 문자열 When 검사하면 Then 거부한다", () => {
		expect(isIntegrationUlid("1")).toBe(false);
		expect(isIntegrationUlid("01j00000000000000000000000")).toBe(false);
		expect(isIntegrationUlid("123e4567-e89b-12d3-a456-426614174000")).toBe(
			false,
		);
		expect(parseIntegrationUlid("not-an-ulid")).toBeNull();
	});
});
