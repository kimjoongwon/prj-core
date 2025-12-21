import {
	TenantDto,
	UserDto,
} from "@cocrepo/dto";
import { type ClsService } from "nestjs-cls";
import { ContextService } from "./context.service";

describe("ContextService", () => {
	it("setTenant로 테넌트를 저장하고 조회한다", async () => {
		const store = new Map<string, unknown>();
		const clsService = {
			set: jest.fn((key: string, value: unknown) => {
				store.set(key, value);
			}),
			get: jest.fn((key: string) => store.get(key)),
		} as unknown as ClsService;
		const service = new ContextService(clsService);
		const tenant = { id: "tenant-1", spaceId: "space-1" } as TenantDto;

		service.setTenant(tenant);

		expect(service.getTenant()).toBe(tenant);
		expect(service.getTenantId()).toBe("tenant-1");
		expect(service.getSpaceId()).toBe("space-1");
	});

	it("setAuthUser로 사용자를 저장하고 조회한다", async () => {
		const store = new Map<string, unknown>();
		const clsService = {
			set: jest.fn((key: string, value: unknown) => {
				store.set(key, value);
			}),
			get: jest.fn((key: string) => store.get(key)),
		} as unknown as ClsService;
		const service = new ContextService(clsService);
		const user = { id: "user-1" } as UserDto;

		service.setAuthUser(user);
		service.setAuthUserId(user.id);

		expect(service.getAuthUser()).toBe(user);
		expect(service.getAuthUserId()).toBe("user-1");
	});

	it("tenant가 없으면 getTenantId와 getSpaceId는 undefined를 반환한다", async () => {
		const clsService = {
			set: jest.fn(),
			get: jest.fn(() => undefined),
		} as unknown as ClsService;
		const service = new ContextService(clsService);

		expect(service.getTenant()).toBeUndefined();
		expect(service.getTenantId()).toBeUndefined();
		expect(service.getSpaceId()).toBeUndefined();
	});
});
