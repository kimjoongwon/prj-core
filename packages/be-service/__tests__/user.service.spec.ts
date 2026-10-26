import { SpaceContext } from "@cocrepo/context";
import { TenantsRepository, UsersRepository } from "@cocrepo/repository";
import { Test, type TestingModule } from "@nestjs/testing";
import { type DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { AuthCacheService } from "../src/auth/auth-cache.service";
import { UserService } from "../src/user/user.service";

type UserWithRelations = NonNullable<
	Awaited<ReturnType<UsersRepository["findByIdWithTenantsAndProfiles"]>>
>;
type UsersBySpaceResult = Awaited<
	ReturnType<UsersRepository["findManyBySpaceIds"]>
>;
type UserStatsResult = Awaited<
	ReturnType<UsersRepository["countStatsBySpaceIds"]>
>;
type TenantDetailResult = NonNullable<
	Awaited<ReturnType<UsersRepository["findTenantDetailForUserInSpace"]>>
>;

describe("UserService", () => {
	let service: UserService;
	let mockRepository: DeepMockProxy<UsersRepository>;
	let mockTenantsRepository: DeepMockProxy<TenantsRepository>;
	let mockSpaceContext: SpaceContext;
	let mockAuthCacheService: jest.Mocked<AuthCacheService>;

	const mockUser = {
		id: 101n,
		userId: "user-public-id",
		email: "test@example.com",
		name: "Test User",
		phone: "010-1234-5678",
		password: "$2b$10$hashedPassword",
		spaceId: 301n,
		tenants: [
			{
				id: 201n,
				spaceId: 301n,
				roleId: 401n,
				space: { id: 301n, name: "Test Space" },
				role: {
					id: 401n,
					name: "Admin",
					classification: {
						category: { parent: { parent: { parent: null } } },
					},
				},
			},
		],
		profiles: [{ name: "Test User", nickname: "testuser" }],
	};

	beforeEach(async () => {
		mockRepository = mockDeep<UsersRepository>();
		mockTenantsRepository = mockDeep<TenantsRepository>();
		mockSpaceContext = {
			spaceId: 301n,
			spaceIds: [301n],
			requireSpaceId: jest.fn(),
			hasSpace: jest.fn(),
			isSystemSpace: jest.fn(),
		} as unknown as SpaceContext;
		mockAuthCacheService = {
			get: jest.fn(),
			set: jest.fn(),
			invalidate: jest.fn(),
			invalidateByPattern: jest.fn(),
		} as unknown as jest.Mocked<AuthCacheService>;

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserService,
				{
					provide: UsersRepository,
					useValue: mockRepository,
				},
				{
					provide: TenantsRepository,
					useValue: mockTenantsRepository,
				},
				{
					provide: SpaceContext,
					useValue: mockSpaceContext,
				},
				{
					provide: AuthCacheService,
					useValue: mockAuthCacheService,
				},
			],
		}).compile();

		service = module.get<UserService>(UserService);
	});

	afterEach(() => {
		mockReset(mockRepository);
	});

	it("서비스가 정의되어야 한다", () => {
		expect(service).toBeDefined();
	});

	it("현재 Tenant를 저장한 뒤 인증 캐시를 무효화한다", async () => {
		mockRepository.findById.mockResolvedValue(
			mockUser as unknown as Awaited<ReturnType<UsersRepository["findById"]>>,
		);

		await service.setCurrentTenant(101n, 201n);

		expect(mockRepository.updateCurrentTenantId).toHaveBeenCalledWith(
			101n,
			201n,
		);
		expect(mockAuthCacheService.invalidate).toHaveBeenCalledWith(
			"user-public-id",
		);
	});

	describe("findByUserIdWithTenants", () => {
		it("공개 사용자 식별자로 사용자를 조회해야 한다", async () => {
			// Given
			const userId = "user-public-id";
			mockRepository.findByUserIdWithTenantsAndProfiles.mockResolvedValue(
				mockUser as unknown as UserWithRelations,
			);

			// When
			const result = await service.findByUserIdWithTenants(userId);

			// Then
			expect(
				mockRepository.findByUserIdWithTenantsAndProfiles,
			).toHaveBeenCalledWith(userId);
			expect(result).toEqual(mockUser);
		});

		it("사용자가 없으면 null을 반환해야 한다", async () => {
			// Given
			const userId = "non-existent-user";
			mockRepository.findByUserIdWithTenantsAndProfiles.mockResolvedValue(null);

			// When
			const result = await service.findByUserIdWithTenants(userId);

			// Then
			expect(
				mockRepository.findByUserIdWithTenantsAndProfiles,
			).toHaveBeenCalledWith(userId);
			expect(result).toBeNull();
		});
	});

	describe("getTenantDetailForUser", () => {
		it("사용자·Tenant·Space 범위로 Tenant 상세를 반환해야 한다", async () => {
			mockRepository.findById.mockResolvedValue(
				mockUser as unknown as Awaited<ReturnType<UsersRepository["findById"]>>,
			);
			const tenant = {
				id: 201n,
				tenantId: "tenant-public-id",
				userId: 101n,
				spaceId: 301n,
				roleId: 401n,
				main: true,
				space: {
					id: 301n,
					spaceId: "space-public-id",
				},
			};
			mockTenantsRepository.findById.mockResolvedValue(
				tenant as Awaited<ReturnType<TenantsRepository["findById"]>>,
			);
			mockRepository.findTenantDetailForUserInSpace.mockResolvedValue(
				tenant as unknown as TenantDetailResult,
			);

			const result = await service.getTenantDetailForUser(101n, 201n, 301n);

			expect(
				mockRepository.findTenantDetailForUserInSpace,
			).toHaveBeenCalledWith(
				"user-public-id",
				"tenant-public-id",
				"space-public-id",
			);
			expect(result).toEqual(tenant);
		});

		it("범위에 맞는 Tenant가 없으면 찾을 수 없음 오류를 반환해야 한다", async () => {
			mockRepository.findById.mockResolvedValue(
				mockUser as unknown as Awaited<ReturnType<UsersRepository["findById"]>>,
			);
			mockTenantsRepository.findById.mockResolvedValue(null);
			mockRepository.findTenantDetailForUserInSpace.mockResolvedValue(null);

			await expect(
				service.getTenantDetailForUser(999n, 201n, 301n),
			).rejects.toThrow("사용자의 테넌트를 찾을 수 없습니다");
		});
	});

	describe("findUserForAuth", () => {
		it("이메일로 인증용 사용자를 조회해야 한다", async () => {
			// Given
			const email = "test@example.com";
			const authUser = {
				id: 101n,
				userId: "user-public-id",
				email: "test@example.com",
				password: "$2b$10$hashedPassword",
			};
			mockRepository.findByEmailSelectCredentials.mockResolvedValue(authUser);

			// When
			const result = await service.findUserForAuth(email);

			// Then
			expect(mockRepository.findByEmailSelectCredentials).toHaveBeenCalledWith(
				email,
			);
			expect(result).toEqual(authUser);
		});

		it("이메일로 사용자를 찾지 못하면 null을 반환해야 한다", async () => {
			// Given
			const email = "nonexistent@example.com";
			mockRepository.findByEmailSelectCredentials.mockResolvedValue(null);

			// When
			const result = await service.findUserForAuth(email);

			// Then
			expect(mockRepository.findByEmailSelectCredentials).toHaveBeenCalledWith(
				email,
			);
			expect(result).toBeNull();
		});
	});

	describe("getUsersBySpace", () => {
		it("비 PLATFORM_ADMIN이면 현재 tenant의 spaceId 1개만 기준으로 사용자 목록과 통계를 조회해야 한다", async () => {
			const input = {
				where: { removedAt: null },
				orderBy: [{ createdAt: "desc" as const }],
				skip: 10,
				take: 20,
			};
			const repositoryResult = {
				users: [mockUser],
				totalCount: 1,
			};
			const statsResult = {
				total: 1,
				active: 1,
				inactive: 0,
				newThisMonth: 0,
			};

			mockSpaceContext = {
				spaceId: 301n,
				spaceIds: [301n],
				tenant: {
					id: 201n,
					spaceId: 301n,
					role: {
						id: 401n,
						name: "COMPANY_MANAGER",
					},
				},
				requireSpaceId: jest.fn(),
				hasSpace: jest.fn(),
				isSystemSpace: jest.fn(),
			} as unknown as SpaceContext;
			mockRepository.findManyBySpaceIds.mockResolvedValue(
				repositoryResult as unknown as UsersBySpaceResult,
			);
			mockRepository.countStatsBySpaceIds.mockResolvedValue(
				statsResult as UserStatsResult,
			);
			Object.defineProperty(service, "spaceCtx", {
				value: mockSpaceContext,
			});

			const result = await service.getUsersBySpace(input);

			expect(mockRepository.findManyBySpaceIds).toHaveBeenCalledWith({
				where: {
					removedAt: null,
					tenants: {
						some: {
							space: { id: { in: [301n] } },
							removedAt: null,
						},
					},
				},
				orderBy: [{ createdAt: "desc" }],
				skip: 10,
				take: 20,
				spaceIds: [301n],
				includedRoleNames: undefined,
			});
			expect(mockRepository.countStatsBySpaceIds).toHaveBeenCalledWith({
				spaceIds: [301n],
			});
			expect(result).toEqual({
				users: [mockUser],
				totalCount: 1,
				stats: statsResult,
			});
		});

		it("PLATFORM_ADMIN이면 전체 사용자 목록과 통계를 조회해야 한다", async () => {
			const input = {
				where: { removedAt: null },
				orderBy: [{ createdAt: "desc" as const }],
				skip: 0,
				take: 10,
			};
			const repositoryResult = {
				users: [mockUser],
				totalCount: 1,
			};
			const statsResult = {
				total: 1,
				active: 1,
				inactive: 0,
				newThisMonth: 0,
			};

			mockSpaceContext = {
				spaceId: 901n,
				spaceIds: undefined,
				tenant: {
					id: "tenant-full-access-id",
					spaceId: 901n,
					role: {
						id: "role-full-access-id",
						name: "PLATFORM_ADMIN",
					},
				},
				requireSpaceId: jest.fn(),
				hasSpace: jest.fn(),
				isSystemSpace: jest.fn(),
			} as unknown as SpaceContext;
			mockRepository.findManyBySpaceIds.mockResolvedValue(
				repositoryResult as unknown as UsersBySpaceResult,
			);
			mockRepository.countStatsBySpaceIds.mockResolvedValue(
				statsResult as UserStatsResult,
			);
			Object.defineProperty(service, "spaceCtx", {
				value: mockSpaceContext,
			});

			const result = await service.getUsersBySpace(input);

			expect(mockRepository.findManyBySpaceIds).toHaveBeenCalledWith({
				where: { removedAt: null },
				orderBy: [{ createdAt: "desc" }],
				skip: 0,
				take: 10,
				spaceIds: undefined,
				includedRoleNames: undefined,
			});
			expect(mockRepository.countStatsBySpaceIds).toHaveBeenCalledWith({
				spaceIds: undefined,
			});
			expect(result).toEqual({
				users: [mockUser],
				totalCount: 1,
				stats: statsResult,
			});
		});

		it("현재 tenant role이 PLATFORM_ADMIN인 branch space도 전체 사용자 목록과 통계를 조회해야 한다", async () => {
			const input = {
				where: { removedAt: null },
				orderBy: [{ createdAt: "desc" as const }],
				skip: 0,
				take: 20,
			};
			const repositoryResult = {
				users: [mockUser],
				totalCount: 1,
			};
			const statsResult = {
				total: 1,
				active: 1,
				inactive: 0,
				newThisMonth: 0,
			};

			mockSpaceContext = {
				spaceId: 902n,
				spaceIds: undefined,
				tenant: {
					id: "tenant-branch-full-access-id",
					spaceId: 902n,
					role: {
						id: "role-full-access-id",
						name: "PLATFORM_ADMIN",
					},
				},
				requireSpaceId: jest.fn(),
				hasSpace: jest.fn(),
				isSystemSpace: jest.fn(),
			} as unknown as SpaceContext;
			mockRepository.findManyBySpaceIds.mockResolvedValue(
				repositoryResult as unknown as UsersBySpaceResult,
			);
			mockRepository.countStatsBySpaceIds.mockResolvedValue(
				statsResult as UserStatsResult,
			);
			Object.defineProperty(service, "spaceCtx", {
				value: mockSpaceContext,
			});

			const result = await service.getUsersBySpace(input);

			expect(mockRepository.findManyBySpaceIds).toHaveBeenCalledWith({
				where: { removedAt: null },
				orderBy: [{ createdAt: "desc" }],
				skip: 0,
				take: 20,
				spaceIds: undefined,
				includedRoleNames: undefined,
			});
			expect(mockRepository.countStatsBySpaceIds).toHaveBeenCalledWith({
				spaceIds: undefined,
			});
			expect(result).toEqual({
				users: [mockUser],
				totalCount: 1,
				stats: statsResult,
			});
		});
	});

	describe("getUserDetailForSpace", () => {
		it("일반 관리자는 유효 Space 범위 안에서 사용자 상세를 조회해야 한다", async () => {
			mockRepository.findById.mockResolvedValue(
				mockUser as unknown as Awaited<ReturnType<UsersRepository["findById"]>>,
			);
			mockRepository.findByIdAndSpaceIdsWithRelations.mockResolvedValue(
				mockUser as unknown as UserWithRelations,
			);

			const result = await service.getUserDetailForSpace(101n, 301n);

			expect(
				mockRepository.findByIdAndSpaceIdsWithRelations,
			).toHaveBeenCalledWith("user-public-id", [301n]);
			expect(result).toEqual(mockUser);
		});

		it("PLATFORM_ADMIN은 Space 제한 없이 사용자 상세를 조회해야 한다", async () => {
			mockSpaceContext = {
				spaceId: 901n,
				spaceIds: undefined,
			} as unknown as SpaceContext;
			Object.defineProperty(service, "spaceCtx", {
				value: mockSpaceContext,
			});
			mockRepository.findById.mockResolvedValue(
				mockUser as unknown as Awaited<ReturnType<UsersRepository["findById"]>>,
			);
			mockRepository.findByIdAndSpaceIdsWithRelations.mockResolvedValue(
				mockUser as unknown as UserWithRelations,
			);

			const result = await service.getUserDetailForSpace(101n, 901n);

			expect(
				mockRepository.findByIdAndSpaceIdsWithRelations,
			).toHaveBeenCalledWith("user-public-id", undefined);
			expect(result).toEqual(mockUser);
		});

		it("유효 Space 범위에서 사용자를 찾지 못하면 오류를 반환해야 한다", async () => {
			mockRepository.findByIdAndSpaceIdsWithRelations.mockResolvedValue(null);

			await expect(service.getUserDetailForSpace(999n, 301n)).rejects.toThrow(
				"사용자를 찾을 수 없습니다",
			);
		});
	});
});
