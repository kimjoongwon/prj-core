import { CONTEXT_KEYS, SYSTEM_ROLES } from "@cocrepo/constant";
import { RoleCategoryName, RoleGroupName } from "@cocrepo/enum";
import { ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { ClsService } from "nestjs-cls";
import { RoleCategoryGuard } from "./role-category.guard";
import { RoleGroupGuard } from "./role-group.guard";
import { RolesGuard } from "./roles.guard";

/**
 * Role 시스템 통합 테스트
 * - 상수/Enum 값 정합성 검증
 * - Guard 간 교차 검증 (새 역할 이름 기반)
 */
describe("Role 시스템 통합 테스트", () => {
	// ==================== A. 상수/Enum 값 정합성 검증 ====================

	describe("상수/Enum 값 정합성 검증", () => {
		describe("SYSTEM_ROLES 상수", () => {
			it("FULL_ACCESS, MANAGE, VIEW 3개만 포함해야 한다", () => {
				// Given
				const roleNames = Object.keys(SYSTEM_ROLES);

				// Then
				expect(roleNames).toHaveLength(3);
				expect(SYSTEM_ROLES.FULL_ACCESS).toBe("FULL_ACCESS");
				expect(SYSTEM_ROLES.MANAGE).toBe("MANAGE");
				expect(SYSTEM_ROLES.VIEW).toBe("VIEW");
			});

			it("이전 이름(SUPER_ADMIN, ADMIN, USER)이 없어야 한다", () => {
				// Given
				const roleValues = Object.values(SYSTEM_ROLES);

				// Then
				expect(roleValues).not.toContain("SUPER_ADMIN");
				expect(roleValues).not.toContain("ADMIN");
				expect(roleValues).not.toContain("USER");

				// 키에도 존재하면 안 됨
				expect(SYSTEM_ROLES).not.toHaveProperty("SUPER_ADMIN");
				expect(SYSTEM_ROLES).not.toHaveProperty("ADMIN");
				expect(SYSTEM_ROLES).not.toHaveProperty("USER");
			});
		});

		describe("RoleCategoryName enum", () => {
			it("7개 멤버를 가져야 한다: PLATFORM, SHARED, WORKSPACE, PUBLIC, PROJECT, TECHNICAL, RESTRICTED", () => {
				// Then
				expect(RoleCategoryName.PLATFORM).toBeDefined();
				expect(RoleCategoryName.SHARED).toBeDefined();
				expect(RoleCategoryName.WORKSPACE).toBeDefined();
				expect(RoleCategoryName.PUBLIC).toBeDefined();
				expect(RoleCategoryName.PROJECT).toBeDefined();
				expect(RoleCategoryName.TECHNICAL).toBeDefined();
				expect(RoleCategoryName.RESTRICTED).toBeDefined();
			});

			it("한글 name이 올바르게 설정되어야 한다", () => {
				// Then
				expect(RoleCategoryName.PLATFORM.name).toBe("플랫폼");
				expect(RoleCategoryName.SHARED.name).toBe("공유");
				expect(RoleCategoryName.WORKSPACE.name).toBe("워크스페이스");
				expect(RoleCategoryName.PUBLIC.name).toBe("공개");
				expect(RoleCategoryName.PROJECT.name).toBe("프로젝트");
				expect(RoleCategoryName.TECHNICAL.name).toBe("기술");
				expect(RoleCategoryName.RESTRICTED.name).toBe("제한");
			});

			it("이전 이름(ROOT, COMMON, ADMIN, USER, MANAGER, DEVELOPER, GUEST)이 없어야 한다", () => {
				// Then
				expect(RoleCategoryName).not.toHaveProperty("ROOT");
				expect(RoleCategoryName).not.toHaveProperty("COMMON");
				expect(RoleCategoryName).not.toHaveProperty("ADMIN");
				expect(RoleCategoryName).not.toHaveProperty("USER");
				expect(RoleCategoryName).not.toHaveProperty("MANAGER");
				expect(RoleCategoryName).not.toHaveProperty("DEVELOPER");
				expect(RoleCategoryName).not.toHaveProperty("GUEST");
			});
		});

		describe("RoleGroupName enum", () => {
			it("3개 멤버를 가져야 한다: TRUSTED, STANDARD, PREMIUM", () => {
				// Then
				expect(RoleGroupName.TRUSTED).toBeDefined();
				expect(RoleGroupName.STANDARD).toBeDefined();
				expect(RoleGroupName.PREMIUM).toBeDefined();
			});

			it("한글 name이 올바르게 설정되어야 한다", () => {
				// Then
				expect(RoleGroupName.TRUSTED.name).toBe("신뢰");
				expect(RoleGroupName.STANDARD.name).toBe("일반");
				expect(RoleGroupName.PREMIUM.name).toBe("프리미엄");
			});

			it("이전 이름(ROOT, NORMAL, VIP)이 없어야 한다", () => {
				// Then
				expect(RoleGroupName).not.toHaveProperty("ROOT");
				expect(RoleGroupName).not.toHaveProperty("NORMAL");
				expect(RoleGroupName).not.toHaveProperty("VIP");
			});
		});
	});

	// ==================== B. Guard 간 교차 검증 ====================

	describe("Guard 간 교차 검증", () => {
		let rolesGuard: RolesGuard;
		let roleCategoryGuard: RoleCategoryGuard;
		let roleGroupGuard: RoleGroupGuard;
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

		const createMockUser = (
			roleName: string,
			category?: any,
			associations?: any[],
		) => ({
			id: "user-test-id",
			email: "test@example.com",
			tenants: [
				{
					id: "tenant-1",
					spaceId: "space-001",
					role: {
						name: roleName,
						classification: category ? { category } : undefined,
						associations: associations ?? [],
					},
				},
			],
		});

		const createMockTenant = (
			roleName: string,
			category?: any,
			associations?: any[],
		) => ({
			id: "tenant-1",
			spaceId: "space-001",
			role: {
				name: roleName,
				classification: category ? { category } : undefined,
				associations: associations ?? [],
			},
		});

		const setupCls = (user: any, tenant: any, spaceId = "space-001") => {
			mockClsService.get.mockImplementation((key: string) => {
				if (key === CONTEXT_KEYS.AUTH_USER) return user;
				if (key === CONTEXT_KEYS.TENANT) return tenant;
				if (key === CONTEXT_KEYS.SPACE_ID) return spaceId;
				return undefined;
			});
		};

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
					RolesGuard,
					RoleCategoryGuard,
					RoleGroupGuard,
					{ provide: Reflector, useValue: mockReflector },
					{ provide: ClsService, useValue: mockClsService },
				],
			}).compile();

			rolesGuard = module.get<RolesGuard>(RolesGuard);
			roleCategoryGuard = module.get<RoleCategoryGuard>(RoleCategoryGuard);
			roleGroupGuard = module.get<RoleGroupGuard>(RoleGroupGuard);
		});

		describe("RolesGuard 교차 검증", () => {
			it("FULL_ACCESS 사용자 -> RolesGuard([FULL_ACCESS]) 통과", () => {
				// Given
				mockReflector.get.mockReturnValue([SYSTEM_ROLES.FULL_ACCESS]);
				const user = createMockUser(SYSTEM_ROLES.FULL_ACCESS);
				const tenant = createMockTenant(SYSTEM_ROLES.FULL_ACCESS);
				setupCls(user, tenant);
				const context = createMockExecutionContext();

				// When
				const result = rolesGuard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});

			it("MANAGE 사용자 -> RolesGuard([FULL_ACCESS]) 거부", () => {
				// Given
				mockReflector.get.mockReturnValue([SYSTEM_ROLES.FULL_ACCESS]);
				const user = createMockUser(SYSTEM_ROLES.MANAGE);
				const tenant = createMockTenant(SYSTEM_ROLES.MANAGE);
				setupCls(user, tenant);
				const context = createMockExecutionContext();

				// When & Then
				expect(() => rolesGuard.canActivate(context)).toThrow(
					ForbiddenException,
				);
			});

			it("MANAGE 사용자 -> RolesGuard([MANAGE]) 통과", () => {
				// Given
				mockReflector.get.mockReturnValue([SYSTEM_ROLES.MANAGE]);
				const user = createMockUser(SYSTEM_ROLES.MANAGE);
				const tenant = createMockTenant(SYSTEM_ROLES.MANAGE);
				setupCls(user, tenant);
				const context = createMockExecutionContext();

				// When
				const result = rolesGuard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});

			it("VIEW 사용자 -> RolesGuard([MANAGE, VIEW]) 통과 (여러 역할 중 하나 일치)", () => {
				// Given
				mockReflector.get.mockReturnValue([
					SYSTEM_ROLES.MANAGE,
					SYSTEM_ROLES.VIEW,
				]);
				const user = createMockUser(SYSTEM_ROLES.VIEW);
				const tenant = createMockTenant(SYSTEM_ROLES.VIEW);
				setupCls(user, tenant);
				const context = createMockExecutionContext();

				// When
				const result = rolesGuard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});
		});

		describe("RoleCategoryGuard 교차 검증", () => {
			it("공개(PUBLIC) 카테고리 사용자 -> RoleCategoryGuard([SHARED]) 통과 (상위 카테고리 포함)", () => {
				// Given - 공개(PUBLIC)의 상위가 공유(SHARED)
				mockReflector.get.mockReturnValue([RoleCategoryName.SHARED]);
				const category = {
					name: "공개",
					parent: { name: "공유" },
					children: [],
				};
				const user = createMockUser(SYSTEM_ROLES.VIEW, category);
				const tenant = createMockTenant(SYSTEM_ROLES.VIEW, category);
				setupCls(user, tenant);
				const context = createMockExecutionContext();

				// When
				const result = roleCategoryGuard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});

			it("워크스페이스(WORKSPACE) 카테고리 사용자 -> RoleCategoryGuard([PUBLIC]) 거부", () => {
				// Given - 워크스페이스의 계층에 공개가 없음
				mockReflector.get.mockReturnValue([RoleCategoryName.PUBLIC]);
				const category = { name: "워크스페이스", parent: null, children: [] };
				const user = createMockUser(SYSTEM_ROLES.MANAGE, category);
				const tenant = createMockTenant(SYSTEM_ROLES.MANAGE, category);
				setupCls(user, tenant);
				const context = createMockExecutionContext();

				// When & Then
				expect(() => roleCategoryGuard.canActivate(context)).toThrow(
					ForbiddenException,
				);
			});
		});

		describe("RoleGroupGuard 교차 검증", () => {
			it("일반(STANDARD) 그룹 사용자 -> RoleGroupGuard(['일반']) 통과", () => {
				// Given
				mockReflector.get.mockReturnValue(["일반"]);
				const associations = [{ group: { name: "일반" } }];
				const user = createMockUser(SYSTEM_ROLES.VIEW, undefined, associations);
				const tenant = createMockTenant(
					SYSTEM_ROLES.VIEW,
					undefined,
					associations,
				);
				setupCls(user, tenant);
				const context = createMockExecutionContext();

				// When
				const result = roleGroupGuard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});

			it("일반(STANDARD) 그룹 사용자 -> RoleGroupGuard(['프리미엄']) 거부", () => {
				// Given
				mockReflector.get.mockReturnValue(["프리미엄"]);
				const associations = [{ group: { name: "일반" } }];
				const user = createMockUser(SYSTEM_ROLES.VIEW, undefined, associations);
				const tenant = createMockTenant(
					SYSTEM_ROLES.VIEW,
					undefined,
					associations,
				);
				setupCls(user, tenant);
				const context = createMockExecutionContext();

				// When & Then
				expect(() => roleGroupGuard.canActivate(context)).toThrow(
					ForbiddenException,
				);
			});
		});

		describe("에러 메시지 검증", () => {
			it("RolesGuard 거부 시 에러 메시지에 새 역할 이름이 포함되어야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([SYSTEM_ROLES.FULL_ACCESS]);
				const user = createMockUser(SYSTEM_ROLES.VIEW);
				const tenant = createMockTenant(SYSTEM_ROLES.VIEW);
				setupCls(user, tenant);
				const context = createMockExecutionContext();

				// When & Then
				try {
					rolesGuard.canActivate(context);
					fail("ForbiddenException이 발생해야 합니다");
				} catch (error) {
					expect(error).toBeInstanceOf(ForbiddenException);
					const message = (error as ForbiddenException).message;
					expect(message).toContain("[RolesGuard] 접근 거부");
					expect(message).toContain("VIEW");
					expect(message).toContain("FULL_ACCESS");
					// 이전 이름이 포함되면 안 됨
					expect(message).not.toContain("SUPER_ADMIN");
					expect(message).not.toContain("USER");
				}
			});

			it("RoleCategoryGuard 거부 시 에러 메시지에 새 카테고리 이름이 포함되어야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue([RoleCategoryName.WORKSPACE]);
				const category = {
					name: "공개",
					parent: { name: "공유" },
					children: [],
				};
				const user = createMockUser(SYSTEM_ROLES.VIEW, category);
				const tenant = createMockTenant(SYSTEM_ROLES.VIEW, category);
				setupCls(user, tenant);
				const context = createMockExecutionContext();

				// When & Then
				try {
					roleCategoryGuard.canActivate(context);
					fail("ForbiddenException이 발생해야 합니다");
				} catch (error) {
					expect(error).toBeInstanceOf(ForbiddenException);
					const message = (error as ForbiddenException).message;
					expect(message).toContain("[RoleCategoryGuard] 접근 거부");
					expect(message).toContain("워크스페이스");
				}
			});

			it("RoleGroupGuard 거부 시 에러 메시지에 새 그룹 이름이 포함되어야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue(["프리미엄"]);
				const associations = [{ group: { name: "일반" } }];
				const user = createMockUser(SYSTEM_ROLES.VIEW, undefined, associations);
				const tenant = createMockTenant(
					SYSTEM_ROLES.VIEW,
					undefined,
					associations,
				);
				setupCls(user, tenant);
				const context = createMockExecutionContext();

				// When & Then
				try {
					roleGroupGuard.canActivate(context);
					fail("ForbiddenException이 발생해야 합니다");
				} catch (error) {
					expect(error).toBeInstanceOf(ForbiddenException);
					const message = (error as ForbiddenException).message;
					expect(message).toContain("[RoleGroupGuard] 접근 거부");
					expect(message).toContain("일반");
					expect(message).toContain("프리미엄");
				}
			});
		});
	});
});
