import { TenantDto, UserDto } from "@shared/schema";
import { type ClsService } from "nestjs-cls";
import { ContextService } from "./context.service";

describe("ContextService", () => {
	it("setAuthContext로 사용자와 테넌트를 저장하고 조회한다", async () => {
		const store = new Map<string, unknown>();
		const clsService = {
			set: jest.fn((key: string, value: unknown) => {
				store.set(key, value);
			}),
			get: jest.fn((key: string) => store.get(key)),
		} as unknown as ClsService;
		const service = new ContextService(clsService);
		const user = { id: "user-1" } as UserDto;
		const tenant = { id: "tenant-1", spaceId: "space-1" } as TenantDto;

		service.setAuthContext({
			user,
			tenant,
			tenantId: tenant.id,
			spaceId: tenant.spaceId,
		});

		expect(service.getAuthUser()).toBe(user);
		expect(service.getAuthUserId()).toBe("user-1");
		expect(service.getTenant()).toBe(tenant);
		expect(service.getTenantId()).toBe("tenant-1");
		expect(service.getSpaceId()).toBe("space-1");
	});

	it("setAuthContext 없이 getAuthContext를 호출하면 null을 반환한다", async () => {
		const clsService = {
			set: jest.fn(),
			get: jest.fn(() => undefined),
		} as unknown as ClsService;
		const service = new ContextService(clsService);

		expect(service.getAuthContext()).toBeNull();
	});
});
