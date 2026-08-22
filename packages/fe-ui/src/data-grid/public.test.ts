import { describe, expect, it } from "vitest";
import * as dataGrid from "./index";
import * as table from "./Table";
import * as cells from "./cell";
import * as inputs from "./input";
import * as columns from "./columns";

describe("DataGrid 공용 API", () => {
	it("합성 네임스페이스, 상태 모델, 셀, 입력, 열 API를 제공한다", () => {
		expect(dataGrid.DataGrid.Container).toBeDefined();
		expect(dataGrid.Table.Header).toBe(table.TableHeader);
		expect(dataGrid.DataGridState).toBeDefined();
		expect(cells.SelectionCell).toBeDefined();
		expect(inputs.ColumnSortInput).toBeDefined();
		expect(columns).toBeDefined();
	});
});
