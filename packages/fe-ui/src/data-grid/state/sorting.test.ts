import { describe, expect, it } from "vitest";
import { getQuerySortValue, getTableSortingState } from "./sorting";

describe("정렬 상태", () => {
	it("nuqs 정렬 값을 TanStack Table 상태로 변환하고 다시 직렬화한다", () => {
		const sorting = getTableSortingState({ sort: ["name", "-createdAt"] });

		expect(sorting).toEqual([
			{ id: "name", desc: false },
			{ id: "createdAt", desc: true },
		]);
		expect(getQuerySortValue(sorting)).toEqual(["name", "-createdAt"]);
		expect(getQuerySortValue([])).toBeNull();
	});
});
