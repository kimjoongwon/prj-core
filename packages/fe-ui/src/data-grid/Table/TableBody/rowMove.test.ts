import { describe, expect, it } from "vitest";
import {
	getDataGridRowMoveEvent,
	getDataGridRowMoveProjection,
} from "./rowMove";

describe("테이블 행 이동", () => {
	it("의미 있는 행 이동 결과와 이벤트만 생성한다", () => {
		const items = [
			{ id: "a", parentId: null, depth: 0, original: { id: "a" } },
			{ id: "b", parentId: null, depth: 0, original: { id: "b" } },
		];
		const projection = getDataGridRowMoveProjection(items, "a", "b", 0);
		expect(projection).toEqual({ depth: 0, parentId: null });
		expect(getDataGridRowMoveEvent(items, "a", "b", projection!)).toMatchObject({
			index: 1,
			row: { id: "a" },
		});
	});
});
