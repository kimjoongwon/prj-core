import { describe, expect, it } from "vitest";
import {
	resolveStackGapFromPixels,
	stackGapClasses,
	stackGapTailwindUnits,
	type StackGap,
} from "./stack-gap";

describe("stackGapTailwindUnits", () => {
	it("Given stackGapClasses When 단위를 비교하면 gap-N의 N과 일치한다", () => {
		for (const [gap, className] of Object.entries(stackGapClasses) as Array<
			[StackGap, string]
		>) {
			expect(stackGapTailwindUnits[gap]).toBe(
				Number(className.replace("gap-", "")),
			);
		}
	});
});

describe("resolveStackGapFromPixels", () => {
	it("Given root 16px 기준 계산 px When 역산하면 시맨틱 리듬을 반환한다", () => {
		expect(resolveStackGapFromPixels(0, 16)).toBe("flush");
		expect(resolveStackGapFromPixels(4, 16)).toBe("dense");
		expect(resolveStackGapFromPixels(8, 16)).toBe("inline");
		expect(resolveStackGapFromPixels(12, 16)).toBe("block");
		expect(resolveStackGapFromPixels(16, 16)).toBe("section");
		expect(resolveStackGapFromPixels(24, 16)).toBe("page");
		expect(resolveStackGapFromPixels(32, 16)).toBe("roomy");
	});

	it("Given 다른 root font-size When 단위를 정규화하면 동일 시맨틱을 반환한다", () => {
		expect(resolveStackGapFromPixels(5, 20)).toBe("dense");
		expect(resolveStackGapFromPixels(20, 20)).toBe("section");
	});

	it("Given 반올림 오차 When 역산하면 가장 가까운 단위로 판정한다", () => {
		expect(resolveStackGapFromPixels(16.4, 16)).toBe("section");
	});

	it("Given 시맨틱 표에 없는 값 When 역산하면 null을 반환한다", () => {
		expect(resolveStackGapFromPixels(10, 16)).toBeNull();
		expect(resolveStackGapFromPixels(20, 16)).toBeNull();
		expect(resolveStackGapFromPixels(Number.NaN, 16)).toBeNull();
		expect(resolveStackGapFromPixels(16, 0)).toBeNull();
	});
});
