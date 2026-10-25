import { CONTEXT_KEYS } from "@cocrepo/constant";
import type { ClsService } from "nestjs-cls";
import { SpaceContext } from "./space-context";

describe("SpaceContext", () => {
	it("Given ULID scope When 필터를 조회하면 Then ULID 문자열 계약을 반환한다", () => {
		const cls = {
			get: jest.fn((key: string) => {
				if (key === CONTEXT_KEYS.TENANT_ID) return "01JTENANT00000000000000000";
				if (key === CONTEXT_KEYS.SPACE_ID) return "01JSPACE00000000000000000F";
				if (key === CONTEXT_KEYS.EFFECTIVE_SPACE_IDS)
					return ["01JSPACE00000000000000000F", "01JSPACE00000000000000SAAA"];
				return undefined;
			}),
		};
		const context = new SpaceContext(cls as unknown as ClsService);

		expect(context.tenantId).toBe("01JTENANT00000000000000000");
		expect(context.spaceId).toBe("01JSPACE00000000000000000F");
		expect(context.spaceIds).toEqual([
			"01JSPACE00000000000000000F",
			"01JSPACE00000000000000000S",
		]);
		expect(context.spaceFilter).toEqual({
			space: {
				id: {
					in: ["01JSPACE00000000000000000F", "01JSPACE00000000000000000S"],
				},
			},
		});
		expect(context.currentSpaceFilter).toEqual({
			space: { id: "01JSPACE00000000000000000F" },
		});
		expect(context.canAccessSpace("01JSPACE00000000000000000S")).toBe(true);
		expect(context.canAccessSpace("01JSPACE00000000000000000X")).toBe(false);
	});

	it("Given scope 미적용 When 접근을 확인하면 Then 전체 접근을 허용한다", () => {
		const cls = {
			get: jest.fn(() => undefined),
		};
		const context = new SpaceContext(cls as unknown as ClsService);

		expect(context.spaceFilter).toBeUndefined();
		expect(context.canAccessSpace("01JSPACE00000000000000000X")).toBe(true);
	});
});
