import { CONTEXT_KEYS } from "@cocrepo/constant";
import type { ContextUserSnapshot } from "@cocrepo/type";
import type { ClsService } from "nestjs-cls";
import { AuthContext } from "./auth-context";

describe("AuthContext", () => {
	it("Given bigint CLS 식별자 When 조회하면 Then bigint 계약을 유지한다", () => {
		const user: ContextUserSnapshot = {
			id: 101n,
			spaceId: 301n,
			tenants: [
				{
					id: 201n,
					spaceId: 301n,
					roleId: 401n,
				},
			],
		};
		const cls = {
			get: jest.fn((key: string) => {
				if (key === CONTEXT_KEYS.AUTH_USER) return user;
				if (key === CONTEXT_KEYS.TENANT_ID) return 201n;
				if (key === CONTEXT_KEYS.SPACE_ID) return 301n;
				return undefined;
			}),
		};
		const context = new AuthContext(cls as unknown as ClsService);

		expect(context.tenantId).toBe(201n);
		expect(context.spaceId).toBe(301n);
		expect(context.accessibleSpaceIds).toEqual([301n]);
		expect(context.canAccessSpace(301n)).toBe(true);
		expect(context.canAccessSpace(999n)).toBe(false);
	});
});
