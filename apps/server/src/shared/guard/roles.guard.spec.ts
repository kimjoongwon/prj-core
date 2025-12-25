import { Roles as RolesDecorator } from "@cocrepo/decorator";
import { Roles } from "@cocrepo/prisma";
import { ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { RolesGuard } from "./roles.guard";

describe("RolesGuard", () => {
	let guard: RolesGuard;
	let mockReflector: jest.Mocked<Reflector>;

	const createMockExecutionContext = (user: any = null): ExecutionContext => {
		const request = { user };
		const handler = jest.fn();

		return {
			switchToHttp: () => ({
				getRequest: () => request,
			}),
			getHandler: () => handler,
		} as unknown as ExecutionContext;
	};

	const createMockUser = (overrides: any = {}) => ({
		id: "user-test-id",
		email: "test@example.com",
		tenants: [
			{
				id: "tenant-1",
				main: true,
				role: {
					name: Roles.USER,
				},
			},
		],
		...overrides,
	});

	beforeEach(async () => {
		mockReflector = {
			get: jest.fn(),
			getAllAndOverride: jest.fn(),
			getAllAndMerge: jest.fn(),
		} as any;

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				RolesGuard,
				{ provide: Reflector, useValue: mockReflector },
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
					RolesDecorator,
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
			it("사용자가 없으면 ForbiddenException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([Roles.USER]);
				const context = createMockExecutionContext(null);

				// When & Then
				expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
				expect(() => guard.canActivate(context)).toThrow(
					"인증된 사용자가 필요합니다.",
				);
			});

			it("사용자에게 테넌트가 없으면 ForbiddenException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([Roles.USER]);
				const user = createMockUser({ tenants: null });
				const context = createMockExecutionContext(user);

				// When & Then
				expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
				expect(() => guard.canActivate(context)).toThrow(
					"사용자에게 할당된 테넌트가 없습니다.",
				);
			});

			it("사용자에게 빈 테넌트 배열이면 ForbiddenException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([Roles.USER]);
				const user = createMockUser({ tenants: [] });
				const context = createMockExecutionContext(user);

				// When & Then
				expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
				expect(() => guard.canActivate(context)).toThrow(
					"사용자에게 할당된 테넌트가 없습니다.",
				);
			});

			it("메인 테넌트가 없으면 ForbiddenException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([Roles.USER]);
				const user = createMockUser({
					tenants: [{ id: "tenant-1", main: false, role: {} }],
				});
				const context = createMockExecutionContext(user);

				// When & Then
				expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
				expect(() => guard.canActivate(context)).toThrow(
					"메인 테넌트가 설정되지 않았습니다.",
				);
			});

			it("테넌트에 역할이 없으면 ForbiddenException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([Roles.USER]);
				const user = createMockUser({
					tenants: [{ id: "tenant-1", main: true, role: null }],
				});
				const context = createMockExecutionContext(user);

				// When & Then
				expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
				expect(() => guard.canActivate(context)).toThrow(
					"테넌트에 역할이 할당되지 않았습니다.",
				);
			});
		});

		describe("역할 권한 검증", () => {
			it("사용자의 역할이 요구된 역할과 일치하면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([Roles.USER]);
				const user = createMockUser();
				const context = createMockExecutionContext(user);

				// When
				const result = guard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});

			it("사용자의 역할이 요구된 역할과 일치하지 않으면 ForbiddenException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([Roles.ADMIN]);
				const user = createMockUser();
				const context = createMockExecutionContext(user);

				// When & Then
				expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
				expect(() => guard.canActivate(context)).toThrow(
					"이 작업을 수행하려면 다음 역할 중 하나가 필요합니다",
				);
			});

			it("여러 역할 중 하나라도 일치하면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([Roles.ADMIN, Roles.USER]);
				const user = createMockUser();
				const context = createMockExecutionContext(user);

				// When
				const result = guard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});

			it("ADMIN 역할을 가진 사용자가 ADMIN 역할이 필요한 엔드포인트에 접근하면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([Roles.ADMIN]);
				const user = createMockUser({
					tenants: [
						{
							id: "tenant-1",
							main: true,
							role: { name: Roles.ADMIN },
						},
					],
				});
				const context = createMockExecutionContext(user);

				// When
				const result = guard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});

			it("SUPER_ADMIN 역할을 가진 사용자가 SUPER_ADMIN 역할이 필요한 엔드포인트에 접근하면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([Roles.SUPER_ADMIN]);
				const user = createMockUser({
					tenants: [
						{
							id: "tenant-1",
							main: true,
							role: { name: Roles.SUPER_ADMIN },
						},
					],
				});
				const context = createMockExecutionContext(user);

				// When
				const result = guard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});

			it("USER 역할을 가진 사용자가 SUPER_ADMIN 역할이 필요한 엔드포인트에 접근하면 ForbiddenException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([Roles.SUPER_ADMIN]);
				const user = createMockUser();
				const context = createMockExecutionContext(user);

				// When & Then
				expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
			});
		});
	});
});
