import { CONTEXT_KEYS, SYSTEM_ROLES } from "@cocrepo/constant";
import { ROLES_KEY } from "@cocrepo/decorator";
import {
	ExecutionContext,
	ForbiddenException,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { ClsService } from "nestjs-cls";
import { RolesGuard } from "./roles.guard";

describe("RolesGuard", () => {
	let guard: RolesGuard;
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

	const createMockUser = (overrides: Record<string, unknown> = {}) => ({
		id: 101n,
		email: "test@example.com",
		tenants: [
			{
				id: 201n,
				spaceId: 301n,
				role: {
					name: SYSTEM_ROLES.MEMBER,
				},
			},
		],
		...overrides,
	});

	const createMockTenant = (overrides: Record<string, unknown> = {}) => ({
		id: 201n,
		spaceId: 301n,
		role: {
			name: SYSTEM_ROLES.MEMBER,
		},
		...overrides,
	});

	beforeEach(async () => {
		mockReflector = {
			get: jest.fn(),
			getAllAndOverride: jest.fn(),
			getAllAndMerge: jest.fn(),
		} as unknown as jest.Mocked<Reflector>;

		mockClsService = {
			get: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				RolesGuard,
				{ provide: Reflector, useValue: mockReflector },
				{ provide: ClsService, useValue: mockClsService },
			],
		}).compile();

		guard = module.get<RolesGuard>(RolesGuard);
	});

	it("가드가 정의되어야 한다", () => {
		expect(guard).toBeDefined();
	});

	describe("canActivate", () => {
		describe("roles 메타데이터가 없는 경우", () => {
			it("roles가 없으면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue(undefined);
				const context = createMockExecutionContext();

				// When
				const result = guard.canActivate(context);

				// Then
				expect(result).toBe(true);
				expect(mockReflector.get).toHaveBeenCalledWith(
					ROLES_KEY,
					context.getHandler(),
				);
			});

			it("roles가 빈 배열이면 true를 반환해야 한다", () => {
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
				mockReflector.get.mockReturnValue([SYSTEM_ROLES.MEMBER]);
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
				mockReflector.get.mockReturnValue([SYSTEM_ROLES.MEMBER]);
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
				mockReflector.get.mockReturnValue([SYSTEM_ROLES.MEMBER]);
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

			it("테넌트 역할의 name이 없으면 ForbiddenException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([SYSTEM_ROLES.MEMBER]);
				const user = createMockUser({
					tenants: [{ id: 201n, role: {} }],
				});
				const tenant = { id: 201n, role: {} };
				mockClsService.get.mockImplementation((key: string) => {
					if (key === CONTEXT_KEYS.AUTH_USER) return user;
					if (key === CONTEXT_KEYS.TENANT) return tenant;
					return undefined;
				});
				const context = createMockExecutionContext();

				// When & Then
				expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
				expect(() => guard.canActivate(context)).toThrow(
					"[RolesGuard] 접근 거부",
				);
			});

			it("테넌트에 역할이 없으면 ForbiddenException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([SYSTEM_ROLES.MEMBER]);
				const user = createMockUser({
					tenants: [{ id: 201n, role: null }],
				});
				const tenant = { id: 201n, role: null };
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
			it("CLS에서 tenant가 없으면 ForbiddenException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([SYSTEM_ROLES.MEMBER]);
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

			it("CLS에서 올바른 tenant로 역할을 확인해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([SYSTEM_ROLES.COMPANY_MANAGER]);
				const user = createMockUser({
					tenants: [
						{
							id: 201n,
							spaceId: 301n,
							role: { name: SYSTEM_ROLES.MEMBER },
						},
						{
							id: 202n,
							spaceId: 302n,
							role: { name: SYSTEM_ROLES.COMPANY_MANAGER },
						},
					],
				});
				const tenant = createMockTenant({
					id: 202n,
					spaceId: 302n,
					role: { name: SYSTEM_ROLES.COMPANY_MANAGER },
				});
				mockClsService.get.mockImplementation((key: string) => {
					if (key === CONTEXT_KEYS.AUTH_USER) return user;
					if (key === CONTEXT_KEYS.TENANT) return tenant;
					if (key === CONTEXT_KEYS.SPACE_ID) return 302n;
					return undefined;
				});
				const context = createMockExecutionContext();

				// When
				const result = guard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});
		});

		describe("역할 권한 검증", () => {
			it("사용자의 역할이 요구된 역할과 일치하면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([SYSTEM_ROLES.MEMBER]);
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

			it("사용자의 역할이 요구된 역할과 일치하지 않으면 ForbiddenException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([SYSTEM_ROLES.COMPANY_MANAGER]);
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
					"[RolesGuard] 접근 거부",
				);
			});

			it("여러 역할 중 하나라도 일치하면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([
					SYSTEM_ROLES.COMPANY_MANAGER,
					SYSTEM_ROLES.MEMBER,
				]);
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

			it("COMPANY_MANAGER 역할을 가진 사용자가 COMPANY_MANAGER 역할이 필요한 엔드포인트에 접근하면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([SYSTEM_ROLES.COMPANY_MANAGER]);
				const user = createMockUser({
					tenants: [
						{
							id: 201n,
							main: true,
							role: { name: SYSTEM_ROLES.COMPANY_MANAGER },
						},
					],
				});
				const tenant = createMockTenant({
					role: { name: SYSTEM_ROLES.COMPANY_MANAGER },
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

			it("PLATFORM_ADMIN 역할을 가진 사용자가 PLATFORM_ADMIN 역할이 필요한 엔드포인트에 접근하면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([SYSTEM_ROLES.PLATFORM_ADMIN]);
				const user = createMockUser({
					tenants: [
						{
							id: 201n,
							main: true,
							role: { name: SYSTEM_ROLES.PLATFORM_ADMIN },
						},
					],
				});
				const tenant = createMockTenant({
					role: { name: SYSTEM_ROLES.PLATFORM_ADMIN },
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

			it("MEMBER 역할을 가진 사용자가 PLATFORM_ADMIN 역할이 필요한 엔드포인트에 접근하면 ForbiddenException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([SYSTEM_ROLES.PLATFORM_ADMIN]);
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
			});
		});
	});
});
