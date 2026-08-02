import { describe, expect, it } from "vitest";
import {
	type DataGridMoveItem,
	getDataGridRowMoveEvent,
	getDataGridRowMoveProjection,
} from "./rowMove";

interface TestRow {
	id: string;
	name: string;
}

const rootA: TestRow = { id: "a", name: "A" };
const childA: TestRow = { id: "a-1", name: "A-1" };
const rootB: TestRow = { id: "b", name: "B" };

const items: DataGridMoveItem<TestRow>[] = [
	{ id: "a", parentId: null, depth: 0, original: rootA },
	{ id: "a/a-1", parentId: "a", depth: 1, original: childA },
	{ id: "b", parentId: null, depth: 0, original: rootB },
];

describe("DataGrid row move", () => {
	it("Given 최상위 행 When 위로 이동하면 Then 최상위 형제 순서를 반환한다", () => {
		const projection = getDataGridRowMoveProjection(items, "b", "a", 0);

		expect(projection).toEqual({ depth: 0, parentId: null });
		expect(
			projection ? getDataGridRowMoveEvent(items, "b", "a", projection) : null,
		).toEqual({
			row: rootB,
			parent: null,
			index: 0,
			siblings: [rootB, rootA],
		});
	});

	it("Given 최상위 행 When 오른쪽으로 이동하면 Then 앞 행의 자식으로 투영한다", () => {
		const projection = getDataGridRowMoveProjection(items, "b", "b", 24);

		expect(projection).toEqual({ depth: 1, parentId: "a" });
		expect(
			projection ? getDataGridRowMoveEvent(items, "b", "b", projection) : null,
		).toEqual({
			row: rootB,
			parent: rootA,
			index: 1,
			siblings: [childA, rootB],
		});
	});

	it("Given 자식 행 When 왼쪽으로 이동하면 Then 최상위 형제로 투영한다", () => {
		const projection = getDataGridRowMoveProjection(
			items,
			"a/a-1",
			"a/a-1",
			-24,
		);

		expect(projection).toEqual({ depth: 0, parentId: null });
		expect(
			projection
				? getDataGridRowMoveEvent(items, "a/a-1", "a/a-1", projection)
				: null,
		).toEqual({
			row: childA,
			parent: null,
			index: 1,
			siblings: [rootA, childA, rootB],
		});
	});
});
