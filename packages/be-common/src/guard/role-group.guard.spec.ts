import { CONTEXT_KEYS } from "@cocrepo/constant";
import { ROLE_GROUPS_KEY } from "@cocrepo/decorator";
import { ExecutionContext, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { ClsService } from "nestjs-cls";
import { RoleGroupGuard } from "./role-group.guard";

describe("RoleGroupGuard", () => {
	let guard: RoleGroupGuard;
	let mockReflector: jest.Mocked<Reflector>;
	let mockClsService: { get: jest.Mock };

	const createMockExecutionContext = (): ExecutionContext => {
		const handler = jest.fn();
		Object.defineProperty(handler, "name", { value: "testHandler" });

		const controller = { name: "TestController" };

		return {
			switchToHttp: () => ({
				getRequest: () => ({}),
			}),
			getHandler: () => handler,
			getClass: () => controller,
		} as unknown as ExecutionContext;
	};

	const createMockUser = (overrides: any = {}) => ({
		id: "user-test-id",
		email: "test@example.com",
		tenants: [
			{
				id: "tenant-1",
				spaceId: "space-001",
				role: {
					name: "VIEW",
					associations: [
						{
							group: {
								name: "일반",
							},
						},
					],
				},
			},
		],
		...overrides,
	});

	const createMockTenant = (overrides: any = {}) => ({
		id: "tenant-1",
		spaceId: "space-001",
		role: {
			name: "VIEW",
			associations: [
				{
					group: {
						name: "일반",
					},
				},
			],
		},
		...overrides,
	});

	beforeEach(async () => {
		mockReflector = {
			get: jest.fn(),
			getAllAndOverride: jest.fn(),
			getAllAndMerge: jest.fn(),
		} as any;

		mockClsService = {
			get: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				RoleGroupGuard,
				{ provide: Reflector, useValue: mockReflector },
				{ provide: ClsService, useValue: mockClsService },
			],
		}).compile();

		guard = module.get<RoleGroupGuard>(RoleGroupGuard);
	});

	it("가드가 정의되어야 한다", () => {
		expect(guard).toBeDefined();
	});

	describe("canActivate", () => {
		describe("roleGroups 메타데이터가 없는 경우", () => {
			it("roleGroups가 없으면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue(undefined);
				const context = createMockExecutionContext();

				// When
				const result = guard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});

			it("roleGroups가 빈 배열이면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([]);
				const context = createMockExecutionContext();

				// When
				const result = guard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});
		});

		describe("사용자 인증 검증", () => {
			it("사용자가 없으면 UnauthorizedException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue(["일반"]);
				mockClsService.get.mockReturnValue(undefined);
				const context = createMockExecutionContext();

				// When & Then
				expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
				expect(() => guard.canActivate(context)).toThrow(
					"인증된 사용자가 필요합니다.",
				);
			});

			it("사용자에게 테넌트가 없으면 ForbiddenException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue(["일반"]);
				const user = createMockUser({ tenants: null });
				mockClsService.get.mockImplementation((key: string) => {
					if (key === CONTEXT_KEYS.AUTH_USER) return user;
					return undefined;
				});
				const context = createMockExecutionContext();

				// When & Then
				expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
				expect(() => guard.canActivate(context)).toThrow(
					"사용자에게 할당된 테넌트가 없습니다.",
				);
			});

			it("사용자에게 빈 테넌트 배열이면 ForbiddenException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue(["일반"]);
				const user = createMockUser({ tenants: [] });
				mockClsService.get.mockImplementation((key: string) => {
					if (key === CONTEXT_KEYS.AUTH_USER) return user;
					return undefined;
				});
				const context = createMockExecutionContext();

				// When & Then
				expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
				expect(() => guard.canActivate(context)).toThrow(
					"사용자에게 할당된 테넌트가 없습니다.",
				);
			});

			it("CLS에서 tenant가 없으면 ForbiddenException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue(["일반"]);
				const user = createMockUser();
				mockClsService.get.mockImplementation((key: string) => {
					if (key === CONTEXT_KEYS.AUTH_USER) return user;
					if (key === CONTEXT_KEYS.TENANT) return undefined;
					return undefined;
				});
				const context = createMockExecutionContext();

				// When & Then
				expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
				expect(() => guard.canActivate(context)).toThrow(
					"해당 Space에 대한 테넌트가 없습니다.",
				);
			});

			it("테넌트에 역할이 없으면 ForbiddenException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue(["일반"]);
				const user = createMockUser({
					tenants: [{ id: "tenant-1", spaceId: "space-001", role: null }],
				});
				const tenant = createMockTenant({ role: null });
				mockClsService.get.mockImplementation((key: string) => {
					if (key === CONTEXT_KEYS.AUTH_USER) return user;
					if (key === CONTEXT_KEYS.TENANT) return tenant;
					return undefined;
				});
				const context = createMockExecutionContext();

				// When & Then
				expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
				expect(() => guard.canActivate(context)).toThrow(
					"테넌트에 역할이 할당되지 않았습니다.",
				);
			});
		});

		describe("CLS 기반 테넌트 사용", () => {
			it("CLS에서 올바른 tenant로 그룹을 확인해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue(["관리자"]);
				const user = createMockUser({
					tenants: [
						{
							id: "tenant-1",
							spaceId: "space-001",
							role: {
								name: "VIEW",
								associations: [{ group: { name: "일반" } }],
							},
						},
						{
							id: "tenant-2",
							spaceId: "space-002",
							role: {
								name: "MANAGE",
								associations: [{ group: { name: "관리자" } }],
							},
						},
					],
				});
				const tenant = createMockTenant({
					id: "tenant-2",
					spaceId: "space-002",
					role: {
						name: "MANAGE",
						associations: [{ group: { name: "관리자" } }],
					},
				});
				mockClsService.get.mockImplementation((key: string) => {
					if (key === CONTEXT_KEYS.AUTH_USER) return user;
					if (key === CONTEXT_KEYS.TENANT) return tenant;
					if (key === CONTEXT_KEYS.SPACE_ID) return "space-002";
					return undefined;
				});
				const context = createMockExecutionContext();

				// When
				const result = guard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});
		});

		describe("역할 그룹 권한 검증", () => {
			it("사용자의 역할 그룹이 요구된 그룹과 일치하면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue(["일반"]);
				const user = createMockUser();
				const tenant = createMockTenant();
				mockClsService.get.mockImplementation((key: string) => {
					if (key === CONTEXT_KEYS.AUTH_USER) return user;
					if (key === CONTEXT_KEYS.TENANT) return tenant;
					return undefined;
				});
				const context = createMockExecutionContext();

				// When
				const result = guard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});

			it("사용자의 역할 그룹이 요구된 그룹과 일치하지 않으면 ForbiddenException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue(["프리미엄"]);
				const user = createMockUser();
				const tenant = createMockTenant();
				mockClsService.get.mockImplementation((key: string) => {
					if (key === CONTEXT_KEYS.AUTH_USER) return user;
					if (key === CONTEXT_KEYS.TENANT) return tenant;
					return undefined;
				});
				const context = createMockExecutionContext();

				// When & Then
				expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
				expect(() => guard.canActivate(context)).toThrow(
					"[RoleGroupGuard] 접근 거부",
				);
			});

			it("여러 그룹 중 하나라도 일치하면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue(["프리미엄", "일반"]);
				const user = createMockUser();
				const tenant = createMockTenant();
				mockClsService.get.mockImplementation((key: string) => {
					if (key === CONTEXT_KEYS.AUTH_USER) return user;
					if (key === CONTEXT_KEYS.TENANT) return tenant;
					return undefined;
				});
				const context = createMockExecutionContext();

				// When
				const result = guard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});

			it("사용자가 여러 그룹에 속해 있을 때 하나라도 일치하면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue(["관리자"]);
				const tenant = createMockTenant({
					role: {
						name: "VIEW",
						associations: [
							{ group: { name: "일반" } },
							{ group: { name: "관리자" } },
						],
					},
				});
				const user = createMockUser({
					tenants: [tenant],
				});
				mockClsService.get.mockImplementation((key: string) => {
					if (key === CONTEXT_KEYS.AUTH_USER) return user;
					if (key === CONTEXT_KEYS.TENANT) return tenant;
					return undefined;
				});
				const context = createMockExecutionContext();

				// When
				const result = guard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});

			it("associations가 없으면 ForbiddenException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue(["일반"]);
				const tenant = createMockTenant({
					role: {
						name: "VIEW",
						associations: null,
					},
				});
				const user = createMockUser({
					tenants: [tenant],
				});
				mockClsService.get.mockImplementation((key: string) => {
					if (key === CONTEXT_KEYS.AUTH_USER) return user;
					if (key === CONTEXT_KEYS.TENANT) return tenant;
					return undefined;
				});
				const context = createMockExecutionContext();

				// When & Then
				expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
			});

			it("associations가 빈 배열이면 ForbiddenException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue(["일반"]);
				const tenant = createMockTenant({
					role: {
						name: "VIEW",
						associations: [],
					},
				});
				const user = createMockUser({
					tenants: [tenant],
				});
				mockClsService.get.mockImplementation((key: string) => {
					if (key === CONTEXT_KEYS.AUTH_USER) return user;
					if (key === CONTEXT_KEYS.TENANT) return tenant;
					return undefined;
				});
				const context = createMockExecutionContext();

				// When & Then
				expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
			});

			it("group이 null인 association이 있어도 처리해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue(["일반"]);
				const tenant = createMockTenant({
					role: {
						name: "VIEW",
						associations: [{ group: null }, { group: { name: "일반" } }],
					},
				});
				const user = createMockUser({
					tenants: [tenant],
				});
				mockClsService.get.mockImplementation((key: string) => {
					if (key === CONTEXT_KEYS.AUTH_USER) return user;
					if (key === CONTEXT_KEYS.TENANT) return tenant;
					return undefined;
				});
				const context = createMockExecutionContext();

				// When
				const result = guard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});
		});
	});
});
