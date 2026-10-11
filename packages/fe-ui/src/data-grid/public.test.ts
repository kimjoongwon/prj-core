import type {
	DataGridGroupPanelConfig,
	DataGridToolbarConfig,
} from "@cocrepo/type";
import { describe, expect, it } from "vitest";
import * as cells from "./cell";
import * as columns from "./columns";
import * as dataGrid from "./index";
import * as inputs from "./input";
import * as table from "./Table";

describe("DataGrid 공용 API", () => {
	it("DataGrid와 상태 모델, 셀, 입력, 열 API를 제공한다", () => {
		const toolbarConfig: DataGridToolbarConfig = {};
		const groupPanelConfig: DataGridGroupPanelConfig = { show: "always" };

		expect(dataGrid.DataGrid).toBeDefined();
		expect(dataGrid.DataGrid).not.toHaveProperty("Container");
		expect(dataGrid.DataGrid).not.toHaveProperty("Loading");
		expect(table.Table.Header).toBe(table.TableHeader);
		expect(dataGrid.Table.Header).toBe(table.TableHeader);
		expect(dataGrid.DataGridState).toBeDefined();
		expect(cells.SelectionCell).toBeDefined();
		expect(inputs.ColumnSortInput).toBeDefined();
		expect(columns).toBeDefined();
		expect(toolbarConfig).toEqual({});
		expect(groupPanelConfig.show).toBe("always");
	});
});
