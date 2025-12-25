import { RoleCategoryNames } from "@cocrepo/enum";
import { ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { RoleCategoryGuard } from "./role-category.guard";

describe("RoleCategoryGuard", () => {
	let guard: RoleCategoryGuard;
	let mockReflector: jest.Mocked<Reflector>;

	const createMockExecutionContext = (
		user: any = null,
	): ExecutionContext => {
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
					name: "USER",
					classification: {
						category: {
							name: "사용자",
							parent: {
								name: "공통",
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

	beforeEach(async () => {
		mockReflector = {
			get: jest.fn(),
			getAllAndOverride: jest.fn(),
			getAllAndMerge: jest.fn(),
		} as any;

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				RoleCategoryGuard,
				{ provide: Reflector, useValue: mockReflector },
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
			it("사용자가 없으면 ForbiddenException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([RoleCategoryNames.COMMON]);
				const context = createMockExecutionContext(null);

				// When & Then
				expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
				expect(() => guard.canActivate(context)).toThrow(
					"인증된 사용자가 필요합니다.",
				);
			});

			it("사용자에게 테넌트가 없으면 ForbiddenException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([RoleCategoryNames.COMMON]);
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
				mockReflector.get.mockReturnValue([RoleCategoryNames.COMMON]);
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
				mockReflector.get.mockReturnValue([RoleCategoryNames.COMMON]);
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
				mockReflector.get.mockReturnValue([RoleCategoryNames.COMMON]);
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

		describe("카테고리 권한 검증", () => {
			it("사용자의 카테고리가 요구된 카테고리와 일치하면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([RoleCategoryNames.USER]);
				const user = createMockUser();
				const context = createMockExecutionContext(user);

				// When
				const result = guard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});

			it("사용자의 상위 카테고리가 요구된 카테고리와 일치하면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([RoleCategoryNames.COMMON]);
				const user = createMockUser();
				const context = createMockExecutionContext(user);

				// When
				const result = guard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});

			it("사용자의 하위 카테고리가 요구된 카테고리와 일치하면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([RoleCategoryNames.GUEST]);
				const user = createMockUser({
					tenants: [
						{
							id: "tenant-1",
							main: true,
							role: {
								name: "ADMIN",
								classification: {
									category: {
										name: "관리자",
										parent: null,
										children: [
											{
												name: "게스트",
												children: [],
											},
										],
									},
								},
							},
						},
					],
				});
				const context = createMockExecutionContext(user);

				// When
				const result = guard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});

			it("사용자의 카테고리가 요구된 카테고리와 일치하지 않으면 ForbiddenException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([RoleCategoryNames.ADMIN]);
				const user = createMockUser();
				const context = createMockExecutionContext(user);

				// When & Then
				expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
				expect(() => guard.canActivate(context)).toThrow(
					"이 작업을 수행하려면 다음 역할 카테고리 중 하나에 속해야 합니다",
				);
			});

			it("역할에 classification이 없으면 ForbiddenException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([RoleCategoryNames.COMMON]);
				const user = createMockUser({
					tenants: [
						{
							id: "tenant-1",
							main: true,
							role: {
								name: "USER",
								classification: null,
							},
						},
					],
				});
				const context = createMockExecutionContext(user);

				// When & Then
				expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
			});

			it("여러 카테고리 중 하나라도 일치하면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([
					RoleCategoryNames.ADMIN,
					RoleCategoryNames.USER,
				]);
				const user = createMockUser();
				const context = createMockExecutionContext(user);

				// When
				const result = guard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});
		});
	});
});
