import { describe, expect, it } from "vitest";
import { getColumnSettingItems, getGroupableColumnItems } from "./columnConfig";
import { buildColumns, defineColumn } from "./data-grid/dataGridFactory";

type ProductRow = {
	name: string;
	stock: number;
	status: "ACTIVE" | "INACTIVE";
};

const productNameColumn = defineColumn<ProductRow, string>({
	accessorKey: "name",
	header: "Name",
	enableHiding: false,
	enableSorting: true,
	cell: ({ getValue }) => {
		const productName: string = getValue();
		return productName;
	},
});

const productStockColumn = defineColumn<ProductRow, number>({
	accessorKey: "stock",
	header: "Stock",
	cell: ({ getValue }) => {
		const productStock: number = getValue();
		return productStock;
	},
});

const productStatusColumn = defineColumn<ProductRow, ProductRow["status"]>({
	accessorKey: "status",
	header: "Status",
	enableGrouping: true,
});

const columns = buildColumns(
	productNameColumn,
	productStockColumn,
	productStatusColumn,
);

describe("열 설정", () => {
	it("TanStack 컬럼 정의에 컬럼 정책을 반영한다", () => {
		const columnDefs = columns;
		expect(columnDefs[0]?.enableSorting).toBe(true);
		expect(getColumnSettingItems(columnDefs)[0]?.isRequired).toBe(true);
		expect(getGroupableColumnItems(columnDefs)).toEqual([
			{ id: "name", label: "Name" },
			{ id: "stock", label: "Stock" },
			{ id: "status", label: "Status" },
		]);
	});
});
