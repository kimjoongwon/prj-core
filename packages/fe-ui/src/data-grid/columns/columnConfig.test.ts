import { describe, expect, it } from "vitest";
import { DataGridColumnsState } from "../state/DataGridState";
import {
	getGroupingColumnIds,
	getVisibleColumnConfigs,
	toColumnDefs,
} from "./columnConfig";

const columns = [
	{ field: "name", label: "Name", isRequired: true, isSortable: true },
	{ field: "status", label: "Status", enableRowGroup: true },
] as never[];

describe("열 설정", () => {
	it("상태로부터 표시 순서와 그룹 열 정의를 계산한다", () => {
		const state = new DataGridColumnsState({
			order: ["status", "name"],
			visibility: { status: false },
		});
		expect(getVisibleColumnConfigs(columns, state).map((column) => column.field)).toEqual(["name"]);
		expect(getGroupingColumnIds(columns, state, { groupBy: ["status"] })).toEqual(["status"]);
		expect(toColumnDefs(columns, state)[0].meta?.isSortable).toBe(true);
	});
});
