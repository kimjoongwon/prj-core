import { describe, expect, it } from "vitest";
import { DataGridChangesState } from "./DataGridChangesState";

interface TestRow {
	id: string;
	name: string;
	parentId: string | null;
	sortOrder: number;
}

const originalRow: TestRow = {
	id: "category-1",
	name: "의류",
	parentId: null,
	sortOrder: 0,
};

describe("DataGridChangesState", () => {
	it("Given 기존 행 When 값을 바꾸고 원래 값으로 되돌리면 Then 수정 내역을 추가했다 제거한다", () => {
		const state = new DataGridChangesState();

		state.setValue(originalRow, "name", "패션");
		expect(state.toJSON<TestRow>().updated).toEqual([
			{
				id: "category-1",
				changes: { name: "패션" },
			},
		]);

		state.setValue(state.getRow(originalRow), "name", "의류");
		expect(state.toJSON<TestRow>().updated).toEqual([]);
		expect(originalRow.name).toBe("의류");
	});

	it("Given 새 행 When 값을 수정하면 Then created만 갱신한다", () => {
		const state = new DataGridChangesState();
		const createdRow: TestRow = {
			id: "temporary-1",
			name: "새 카테고리",
			parentId: null,
			sortOrder: 1,
		};

		state.addRow(createdRow);
		state.setValue(createdRow, "name", "액세서리");

		expect(state.toJSON<TestRow>()).toEqual({
			created: [{ ...createdRow, name: "액세서리" }],
			updated: [],
			deleted: [],
		});
	});

	it("Given 생성 행과 기존 행 When 삭제하면 Then 생성 행은 제거하고 기존 id만 deleted에 기록한다", () => {
		const state = new DataGridChangesState();
		state.addRow({ ...originalRow, id: "temporary-1" });
		state.deleteRow("temporary-1");
		state.setValue(originalRow, "name", "패션");
		state.deleteRow(originalRow.id);

		expect(state.toJSON<TestRow>()).toEqual({
			created: [],
			updated: [],
			deleted: ["category-1"],
		});

		state.restoreRow(originalRow.id);
		expect(state.toJSON<TestRow>().deleted).toEqual([]);
	});

	it("Given 여러 변경 When clear하면 Then 저장 snapshot을 모두 비운다", () => {
		const state = new DataGridChangesState();
		state.addRow({ ...originalRow, id: "temporary-1" });
		state.setValue(originalRow, "name", "패션");
		state.deleteRow("category-2");

		state.clear();

		expect(state.toJSON<TestRow>()).toEqual({
			created: [],
			updated: [],
			deleted: [],
		});
	});
});
