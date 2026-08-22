import { describe, expect, it } from "vitest";
import { getDataGridRowKey } from "./rowKeys";

describe("테이블 행 키", () => {
	it("중복 행 식별자도 안전한 행 키로 만든다", () => {
		const rows = [{ id: "same" }, { id: "same" }];
		expect(getDataGridRowKey(rows[0], 0, new Map([["same", 2]]))).toBe("row:same:0");
	});
});
