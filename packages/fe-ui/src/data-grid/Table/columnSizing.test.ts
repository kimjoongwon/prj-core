import { describe, expect, it } from "vitest";
import { getColumnWidthStyle } from "./columnSizing";

describe("테이블 열 너비", () => {
	it("유효한 열 너비를 테이블 스타일로 변환한다", () => {
		expect(getColumnWidthStyle({ size: 120 } as never)).toEqual({
			width: 120,
			minWidth: 120,
		});
	});
});
