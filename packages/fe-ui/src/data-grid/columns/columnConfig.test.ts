import type { ColumnDef } from "@tanstack/react-table";
import { describe, expect, it } from "vitest";
import { DataGridColumnsState } from "../state/DataGridState";
import {
	getGroupingColumnIds,
	getVisibleColumnConfigs,
	toColumnDefs,
} from "./columnConfig";
import { buildColumns, defineColumn } from "./data-grid/dataGridFactory";

type ProductRow = {
	name: string;
	stock: number;
	status: "ACTIVE" | "INACTIVE";
};

const productNameColumn = defineColumn<ProductRow, string>({
	field: "name",
	label: "Name",
	isRequired: true,
	isSortable: true,
	cell: ({ getValue }) => {
		const productName: string = getValue();
		return productName;
	},
});

const productStockColumn = defineColumn<ProductRow, number>({
	field: "stock",
	label: "Stock",
	cell: ({ getValue }) => {
		const productStock: number = getValue();
		return productStock;
	},
});

const productStatusColumn = defineColumn<ProductRow, ProductRow["status"]>({
	field: "status",
	label: "Status",
	enableRowGroup: true,
});

const columns = buildColumns(
	productNameColumn,
	productStockColumn,
	productStatusColumn,
);

describe("열 설정", () => {
	it("상태로부터 표시 순서와 그룹 열 정의를 계산한다", () => {
		const state = new DataGridColumnsState({
			order: ["status", "name"],
			visibility: { status: false, stock: false },
		});
		const visibleColumns = getVisibleColumnConfigs(columns, state);
		const visibleColumn: (typeof columns)[number] | undefined =
			visibleColumns[0];
		expect(visibleColumns.map((column) => column.field)).toEqual(["name"]);
		expect(
			getGroupingColumnIds(columns, state, { groupBy: ["status"] }),
		).toEqual(["status"]);

		const columnDefs: ColumnDef<ProductRow, unknown>[] = toColumnDefs(
			columns,
			state,
		);
		expect(columnDefs[0]?.meta?.isSortable).toBe(true);
		expect(visibleColumn).toBe(productNameColumn);
	});
});
