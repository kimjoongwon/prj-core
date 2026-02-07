import { CONTEXT_KEYS } from "@cocrepo/constant";
import { ROLE_CATEGORIES_KEY } from "@cocrepo/decorator";
import { RoleCategoryNames } from "@cocrepo/enum";
import { ExecutionContext, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { ClsService } from "nestjs-cls";
import { RoleCategoryGuard } from "./role-category.guard";

describe("RoleCategoryGuard", () => {
	let guard: RoleCategoryGuard;
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
					classification: {
						category: {
							name: "공개",
							parent: {
								name: "공유",
							},
							children: [],
						},
					},
					associations: [],
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
			classification: {
				category: {
					name: "공개",
					parent: {
						name: "공유",
					},
					children: [],
				},
			},
			associations: [],
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
				RoleCategoryGuard,
				{ provide: Reflector, useValue: mockReflector },
				{ provide: ClsService, useValue: mockClsService },
			],
		}).compile();

		guard = module.get<RoleCategoryGuard>(RoleCategoryGuard);
	});

	it("가드가 정의되어야 한다", () => {
		expect(guard).toBeDefined();
	});

	describe("canActivate", () => {
		describe("roleCategories 메타데이터가 없는 경우", () => {
			it("roleCategories가 없으면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue(undefined);
				const context = createMockExecutionContext();

				// When
				const result = guard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});

			it("roleCategories가 빈 배열이면 true를 반환해야 한다", () => {
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
				mockReflector.get.mockReturnValue([RoleCategoryNames.SHARED]);
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
				mockReflector.get.mockReturnValue([RoleCategoryNames.SHARED]);
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
				mockReflector.get.mockReturnValue([RoleCategoryNames.SHARED]);
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
				mockReflector.get.mockReturnValue([RoleCategoryNames.SHARED]);
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
				mockReflector.get.mockReturnValue([RoleCategoryNames.SHARED]);
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
			it("CLS에서 올바른 tenant로 카테고리를 확인해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([RoleCategoryNames.WORKSPACE]);
				const user = createMockUser({
					tenants: [
						{
							id: "tenant-1",
							spaceId: "space-001",
							role: {
								name: "VIEW",
								classification: {
									category: { name: "공개", parent: { name: "공유" }, children: [] },
								},
								associations: [],
							},
						},
						{
							id: "tenant-2",
							spaceId: "space-002",
							role: {
								name: "MANAGE",
								classification: {
									category: { name: "워크스페이스", parent: null, children: [] },
								},
								associations: [],
							},
						},
					],
				});
				const tenant = createMockTenant({
					id: "tenant-2",
					spaceId: "space-002",
					role: {
						name: "MANAGE",
						classification: {
							category: { name: "워크스페이스", parent: null, children: [] },
						},
						associations: [],
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

		describe("카테고리 권한 검증", () => {
			it("사용자의 카테고리가 요구된 카테고리와 일치하면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([RoleCategoryNames.PUBLIC]);
				const user = createMockUser();
				const tenant = createMockTenant();
				mockClsService.get.mockImplementation((key: string) => {
					if (key === CONTEXT_KEYS.AUTH_USER) return user;
					if (key === CONTEXT_KEYS.TENANT) return tenant;
					if (key === CONTEXT_KEYS.SPACE_ID) return "space-001";
					return undefined;
				});
				const context = createMockExecutionContext();

				// When
				const result = guard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});

			it("사용자의 상위 카테고리가 요구된 카테고리와 일치하면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([RoleCategoryNames.SHARED]);
				const user = createMockUser();
				const tenant = createMockTenant();
				mockClsService.get.mockImplementation((key: string) => {
					if (key === CONTEXT_KEYS.AUTH_USER) return user;
					if (key === CONTEXT_KEYS.TENANT) return tenant;
					if (key === CONTEXT_KEYS.SPACE_ID) return "space-001";
					return undefined;
				});
				const context = createMockExecutionContext();

				// When
				const result = guard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});

			it("사용자의 하위 카테고리가 요구된 카테고리와 일치하면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([RoleCategoryNames.RESTRICTED]);
				const tenant = createMockTenant({
					role: {
						name: "MANAGE",
						classification: {
							category: {
								name: "워크스페이스",
								parent: null,
								children: [
									{
										name: "제한",
										children: [],
									},
								],
							},
						},
					},
				});
				const user = createMockUser({
					tenants: [tenant],
				});
				mockClsService.get.mockImplementation((key: string) => {
					if (key === CONTEXT_KEYS.AUTH_USER) return user;
					if (key === CONTEXT_KEYS.TENANT) return tenant;
					if (key === CONTEXT_KEYS.SPACE_ID) return "space-001";
					return undefined;
				});
				const context = createMockExecutionContext();

				// When
				const result = guard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});

			it("사용자의 카테고리가 요구된 카테고리와 일치하지 않으면 ForbiddenException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([RoleCategoryNames.WORKSPACE]);
				const user = createMockUser();
				const tenant = createMockTenant();
				mockClsService.get.mockImplementation((key: string) => {
					if (key === CONTEXT_KEYS.AUTH_USER) return user;
					if (key === CONTEXT_KEYS.TENANT) return tenant;
					if (key === CONTEXT_KEYS.SPACE_ID) return "space-001";
					return undefined;
				});
				const context = createMockExecutionContext();

				// When & Then
				expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
				expect(() => guard.canActivate(context)).toThrow(
					"[RoleCategoryGuard] 접근 거부",
				);
			});

			it("역할에 classification이 없으면 ForbiddenException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([RoleCategoryNames.SHARED]);
				const tenant = createMockTenant({
					role: {
						name: "VIEW",
						classification: null,
					},
				});
				const user = createMockUser({
					tenants: [tenant],
				});
				mockClsService.get.mockImplementation((key: string) => {
					if (key === CONTEXT_KEYS.AUTH_USER) return user;
					if (key === CONTEXT_KEYS.TENANT) return tenant;
					if (key === CONTEXT_KEYS.SPACE_ID) return "space-001";
					return undefined;
				});
				const context = createMockExecutionContext();

				// When & Then
				expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
			});

			it("여러 카테고리 중 하나라도 일치하면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([
					RoleCategoryNames.WORKSPACE,
					RoleCategoryNames.PUBLIC,
				]);
				const user = createMockUser();
				const tenant = createMockTenant();
				mockClsService.get.mockImplementation((key: string) => {
					if (key === CONTEXT_KEYS.AUTH_USER) return user;
					if (key === CONTEXT_KEYS.TENANT) return tenant;
					if (key === CONTEXT_KEYS.SPACE_ID) return "space-001";
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
