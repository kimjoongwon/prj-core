import { describe, expect, it } from "vitest";
import { DataGridChangesState } from "./DataGridChangesState";

describe("DataGrid 변경 상태", () => {
	it("생성, 수정, 복원, 삭제 행을 순수 스냅샷으로 관리한다", () => {
		const changes = new DataGridChangesState();
		const existingRow = { id: "row-1", name: "Alpha", status: "active" };
		const createdRow = { id: "row-new", name: "New", status: "inactive" };

		changes.addRow(createdRow);
		changes.setValue(existingRow, "name", "Beta");
		changes.setValue(createdRow, "name", "Created Beta");
		changes.deleteRow("row-1");

		expect(changes.toJSON()).toEqual({
			created: [{ id: "row-new", name: "Created Beta", status: "inactive" }],
			updated: [],
			deleted: ["row-1"],
		});

		changes.restoreRow("row-1");
		changes.setValue(existingRow, "name", "Alpha");
		expect(changes.toJSON()).toEqual({
			created: [{ id: "row-new", name: "Created Beta", status: "inactive" }],
			updated: [],
			deleted: [],
		});
	});

	it("생성 행을 제거하고 모든 변경 상태를 초기화한다", () => {
		const changes = new DataGridChangesState();
		changes.addRow({ id: "row-new", name: "New" });
		changes.deleteRow("row-new");
		changes.setValue({ id: "row-1", name: "Alpha" }, "name", "Beta");
		changes.clear();

		expect(changes.toJSON()).toEqual({ created: [], updated: [], deleted: [] });
	});
});
