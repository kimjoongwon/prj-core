import { CONTEXT_KEYS } from "@cocrepo/constant";
import type { ClsService } from "nestjs-cls";
import { SpaceContext } from "./space-context";

describe("SpaceContext", () => {
	it("Given bigint scope When 필터를 조회하면 Then bigint 및 bigint[]를 반환한다", () => {
		const cls = {
			get: jest.fn((key: string) => {
				if (key === CONTEXT_KEYS.TENANT_ID) return 201n;
				if (key === CONTEXT_KEYS.SPACE_ID) return 301n;
				if (key === CONTEXT_KEYS.EFFECTIVE_SPACE_IDS) return [301n, 302n];
				return undefined;
			}),
		};
		const context = new SpaceContext(cls as unknown as ClsService);

		expect(context.tenantId).toBe(201n);
		expect(context.spaceId).toBe(301n);
		expect(context.spaceIds).toEqual([301n, 302n]);
		expect(context.spaceFilter).toEqual({ spaceId: { in: [301n, 302n] } });
		expect(context.currentSpaceFilter).toEqual({ spaceId: 301n });
		expect(context.canAccessSpace(302n)).toBe(true);
		expect(context.canAccessSpace(999n)).toBe(false);
	});

	it("Given scope 미적용 When 접근을 확인하면 Then 전체 접근을 허용한다", () => {
		const cls = {
			get: jest.fn(() => undefined),
		};
		const context = new SpaceContext(cls as unknown as ClsService);

		expect(context.spaceFilter).toBeUndefined();
		expect(context.canAccessSpace(999n)).toBe(true);
	});
});
