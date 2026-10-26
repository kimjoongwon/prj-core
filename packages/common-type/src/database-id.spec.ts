import { describe, expect, it } from "vitest";
import {
	DATABASE_ID_MAX,
	DECIMAL_ID_PATTERN,
	formatDatabaseId,
	isDecimalId,
	parseDecimalId,
	requireDecimalId,
} from "./database-id";

describe("database-id", () => {
	it("Given 허용 범위의 decimal 문자열 When 검사하면 Then decimal ID로 인정한다", () => {
		expect(isDecimalId("1")).toBe(true);
		expect(isDecimalId("9223372036854775807")).toBe(true);
		expect(parseDecimalId("9223372036854775807")).toBe(DATABASE_ID_MAX);
	});

	it("Given canonical 규칙을 벗어난 문자열 When 검사하면 Then 거부한다", () => {
		expect(isDecimalId("0")).toBe(false);
		expect(isDecimalId("-1")).toBe(false);
		expect(isDecimalId("01")).toBe(false);
		expect(isDecimalId("1.0")).toBe(false);
		expect(isDecimalId("1e3")).toBe(false);
		expect(isDecimalId(" 1")).toBe(false);
		expect(isDecimalId("9223372036854775808")).toBe(false);
		expect(parseDecimalId("9223372036854775808")).toBeNull();
	});

	it("Given bigint ID When 직렬화하면 Then canonical decimal 문자열을 반환한다", () => {
		expect(formatDatabaseId(1n)).toBe("1");
		expect(formatDatabaseId(9223372036854775807n)).toBe("9223372036854775807");
	});

	it("Given 외부 문자열 When 필수 decimal ID로 좁히면 Then 유효값만 반환한다", () => {
		expect(requireDecimalId("1", "userId")).toBe("1");
		expect(() => requireDecimalId("01", "userId")).toThrow(
			"userId must be a canonical positive signed-BIGINT decimal string",
		);
	});

	it("Given 범위를 벗어난 bigint ID When 직렬화하면 Then RangeError를 던진다", () => {
		expect(() => formatDatabaseId(0n)).toThrow(RangeError);
		expect(() => formatDatabaseId(-1n)).toThrow(RangeError);
		expect(() => formatDatabaseId(9223372036854775808n)).toThrow(RangeError);
	});

	it("Given 경계 문자열 When 정규식으로 검사하면 Then 상한 포함 여부가 정확하다", () => {
		expect(DECIMAL_ID_PATTERN.test("9223372036854775807")).toBe(true);
		expect(DECIMAL_ID_PATTERN.test("9223372036854775808")).toBe(false);
	});
});
