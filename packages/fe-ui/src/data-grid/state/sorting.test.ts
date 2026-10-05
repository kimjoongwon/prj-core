import { describe, expect, it } from "vitest";
import { getNextSortValues, getSortDirection } from "./sorting";

describe("정렬 상태", () => {
	it("현재 정렬 방향에 따라 다음 조회 값을 만든다", () => {
		expect(getSortDirection("name", ["-name"])).toBe("desc");
		expect(getNextSortValues("name", "desc")).toBeNull();
	});
});
