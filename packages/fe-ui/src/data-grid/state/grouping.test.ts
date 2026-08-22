import { describe, expect, it } from "vitest";
import { getQueryGroupByValues } from "./grouping";

describe("그룹 상태", () => {
	it("중복과 잘못된 그룹 조회 값을 제거한다", () => {
		expect(getQueryGroupByValues({ groupBy: ["status", "status", 1] })).toEqual(["status"]);
	});
});
