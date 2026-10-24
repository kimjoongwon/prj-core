import { CONTEXT_KEYS } from "@cocrepo/constant";
import type { ContextUserSnapshot } from "@cocrepo/type";
import type { ClsService } from "nestjs-cls";
import { AuthContext } from "./auth-context";

describe("AuthContext", () => {
	it("Given ULID CLS 식별자 When 조회하면 Then ULID 계약을 유지한다", () => {
		const user: ContextUserSnapshot = {
			id: "01JSER0000000000000000000A",
			spaceSeq: 301n,
			tenants: [
				{
					id: "01JTENANT00000000000000000",
					spaceSeq: 301n,
					roleSeq: 401n,
				},
			],
		};
		const cls = {
			get: jest.fn((key: string) => {
				if (key === CONTEXT_KEYS.AUTH_USER) return user;
				if (key === CONTEXT_KEYS.TENANT_ID)
				return "01JTENANT00000000000000000";
				if (key === CONTEXT_KEYS.SPACE_ID) return 301n;
				return undefined;
			}),
		};
		const context = new AuthContext(cls as unknown as ClsService);

		expect(context.tenantId).toBe("01JTENANT00000000000000000");
		expect(context.accessibleSpaceIds).toEqual(["01JSPACE00000000000000000F"]);
		expect(context.canAccessSpace("01JSPACE00000000000000000F")).toBe(true);
		expect(context.canAccessSpace("01JSPACE00000000000000000X")).toBe(false);
	});
});
