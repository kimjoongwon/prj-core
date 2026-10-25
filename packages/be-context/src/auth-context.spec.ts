import { CONTEXT_KEYS } from "@cocrepo/constant";
import type { ContextUserSnapshot } from "@cocrepo/type";
import type { ClsService } from "nestjs-cls";
import { AuthContext } from "./auth-context";

describe("AuthContext", () => {
	it("Given ULID CLS 식별자 When 조회하면 Then ULID 계약을 유지한다", () => {
		const tenantId = "01JTENANT0000000000000000A";
		const spaceId = "01JSPACE00000000000000000F";
		const user: ContextUserSnapshot = {
			id: "01JSER0000000000000000000A",
			tenants: [
				{
					id: tenantId,
					space: { id: spaceId },
					role: { id: "01JTASK000000000000000000A" },
				},
			],
		};
		const cls = {
			get: jest.fn((key: string) => {
				if (key === CONTEXT_KEYS.AUTH_USER) return user;
				if (key === CONTEXT_KEYS.TENANT_ID) return tenantId;
				if (key === CONTEXT_KEYS.SPACE_ID) return spaceId;
				return undefined;
			}),
		};
		const context = new AuthContext(cls as unknown as ClsService);

		expect(context.tenantId).toBe(tenantId);
		expect(context.accessibleSpaceIds).toEqual([spaceId]);
		expect(context.canAccessSpace(spaceId)).toBe(true);
		expect(context.canAccessSpace("01JSPACE00000000000000000X")).toBe(false);
	});
});
