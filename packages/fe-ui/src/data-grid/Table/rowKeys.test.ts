import { describe, expect, it } from "vitest";
import {
	createDataGridRowKeyAdapter,
	getDataGridRowKey,
} from "./rowKeys";

describe("테이블 행 키", () => {
	it("중복 행 식별자도 안전한 행 키로 만든다", () => {
		const rows = [{ id: BigInt(100) }, { id: BigInt(100) }];
		expect(
			getDataGridRowKey(rows[0], 0, new Map([["100", 2]])),
		).toBe("row:100:0");
	});

	it("bigint DTO id를 React/TanStack 문자열 key로 변환한다", () => {
		const rows = [{ id: BigInt(100) }, { id: BigInt(200) }];
		const getRowKey = createDataGridRowKeyAdapter(rows);

		expect(getRowKey(rows[0], 0)).toBe("100");
		expect(getRowKey(rows[1], 1)).toBe("200");
	});
});
