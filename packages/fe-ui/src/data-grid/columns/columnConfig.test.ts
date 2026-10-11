import type { ColumnDef } from "@tanstack/react-table";
import { describe, expect, it } from "vitest";
import { toColumnDefs } from "./columnConfig";
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
	it("TanStack 컬럼 정의에 컬럼 정책을 반영한다", () => {
		const columnDefs: ColumnDef<ProductRow, unknown>[] = toColumnDefs(columns);
		expect(columnDefs[0]?.meta?.isSortable).toBe(true);
		expect(columnDefs[0]?.enableHiding).toBe(false);
	});
});
