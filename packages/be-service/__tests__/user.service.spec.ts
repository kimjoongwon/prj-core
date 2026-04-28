import { SpaceContext } from "@cocrepo/context";
import { UsersRepository } from "@cocrepo/repository";
import { Test, type TestingModule } from "@nestjs/testing";
import { type DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { AuthCacheService } from "../src/auth-cache.service";
import { UserService } from "../src/user.service";

describe("UserService", () => {
	let service: UserService;
	let mockRepository: DeepMockProxy<UsersRepository>;
	let mockSpaceContext: SpaceContext;
	let mockAuthCacheService: jest.Mocked<AuthCacheService>;

	const mockUser = {
		id: "user-test-id",
		email: "test@example.com",
		name: "Test User",
		phone: "010-1234-5678",
		password: "$2b$10$hashedPassword",
		spaceId: "space-test-id",
		tenants: [
			{
				id: "tenant-test-id",
				spaceId: "space-test-id",
				roleId: "role-test-id",
				space: { id: "space-test-id", name: "Test Space" },
				role: {
					id: "role-test-id",
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
		mockSpaceContext = {
			spaceId: "space-test-id",
			spaceIds: ["space-test-id"],
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

	describe("getByIdWithTenants", () => {
		it("ID로 사용자를 조회해야 한다", async () => {
			// Given
			const userId = "user-test-id";
			mockRepository.findByIdWithTenantsAndProfiles.mockResolvedValue(
				mockUser as any,
			);

			// When
			const result = await service.getByIdWithTenants(userId);

			// Then
			expect(
				mockRepository.findByIdWithTenantsAndProfiles,
			).toHaveBeenCalledWith(userId);
			expect(result).toEqual(mockUser);
		});

		it("사용자가 없으면 null을 반환해야 한다", async () => {
			// Given
			const userId = "non-existent-user";
			mockRepository.findByIdWithTenantsAndProfiles.mockResolvedValue(null);

			// When
			const result = await service.getByIdWithTenants(userId);

			// Then
			expect(
				mockRepository.findByIdWithTenantsAndProfiles,
			).toHaveBeenCalledWith(userId);
			expect(result).toBeNull();
		});
	});

	describe("findUserForAuth", () => {
		it("이메일로 인증용 사용자를 조회해야 한다", async () => {
			// Given
			const email = "test@example.com";
			const authUser = {
				id: "user-test-id",
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
		it("비 FULL_ACCESS면 현재 tenant의 spaceId 1개만 기준으로 사용자 목록과 통계를 조회해야 한다", async () => {
			const query = {
				skip: 10,
				take: 20,
				toPrismaWhere: jest.fn().mockReturnValue({ removedAt: null }),
				toPrismaOrderBy: jest.fn().mockReturnValue([{ createdAt: "desc" }]),
			} as any;
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
				spaceId: "space-header-id",
				spaceIds: ["space-header-id"],
				tenant: {
					id: "tenant-current-id",
					spaceId: "space-header-id",
					role: {
						id: "role-manage-id",
						name: "MANAGE",
					},
				},
				requireSpaceId: jest.fn(),
				hasSpace: jest.fn(),
				isSystemSpace: jest.fn(),
			} as unknown as SpaceContext;
			mockRepository.findManyBySpaceIds.mockResolvedValue(
				repositoryResult as any,
			);
			mockRepository.countStatsBySpaceIds.mockResolvedValue(statsResult as any);
			(service as any).spaceCtx = mockSpaceContext;

			const result = await service.getUsersBySpace(query);

			expect(query.toPrismaWhere).toHaveBeenCalledWith({
				tenants: {
					some: {
						spaceId: { in: ["space-header-id"] },
						removedAt: null,
					},
				},
			});
			expect(mockRepository.findManyBySpaceIds).toHaveBeenCalledWith({
				where: { removedAt: null },
				orderBy: [{ createdAt: "desc" }],
				skip: 10,
				take: 20,
				spaceIds: ["space-header-id"],
				includedRoleNames: undefined,
			});
			expect(mockRepository.countStatsBySpaceIds).toHaveBeenCalledWith({
				spaceIds: ["space-header-id"],
			});
			expect(result).toEqual({
				users: [mockUser],
				totalCount: 1,
				stats: statsResult,
			});
		});

		it("FULL_ACCESS면 전체 사용자 목록과 통계를 조회해야 한다", async () => {
			const query = {
				skip: 0,
				take: 10,
				toPrismaWhere: jest.fn().mockReturnValue({ removedAt: null }),
				toPrismaOrderBy: jest.fn().mockReturnValue([{ createdAt: "desc" }]),
			} as any;
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
				spaceId: "space-root-id",
				spaceIds: undefined,
				tenant: {
					id: "tenant-full-access-id",
					spaceId: "space-root-id",
					role: {
						id: "role-full-access-id",
						name: "FULL_ACCESS",
					},
				},
				requireSpaceId: jest.fn(),
				hasSpace: jest.fn(),
				isSystemSpace: jest.fn(),
			} as unknown as SpaceContext;
			mockRepository.findManyBySpaceIds.mockResolvedValue(
				repositoryResult as any,
			);
			mockRepository.countStatsBySpaceIds.mockResolvedValue(statsResult as any);
			(service as any).spaceCtx = mockSpaceContext;

			const result = await service.getUsersBySpace(query);

			expect(query.toPrismaWhere).toHaveBeenCalledWith({});
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

		it("현재 tenant role이 FULL_ACCESS인 branch space도 전체 사용자 목록과 통계를 조회해야 한다", async () => {
			const query = {
				skip: 0,
				take: 20,
				toPrismaWhere: jest.fn().mockReturnValue({ removedAt: null }),
				toPrismaOrderBy: jest.fn().mockReturnValue([{ createdAt: "desc" }]),
			} as any;
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
				spaceId: "space-branch-id",
				spaceIds: undefined,
				tenant: {
					id: "tenant-branch-full-access-id",
					spaceId: "space-branch-id",
					role: {
						id: "role-full-access-id",
						name: "FULL_ACCESS",
					},
				},
				requireSpaceId: jest.fn(),
				hasSpace: jest.fn(),
				isSystemSpace: jest.fn(),
			} as unknown as SpaceContext;
			mockRepository.findManyBySpaceIds.mockResolvedValue(
				repositoryResult as any,
			);
			mockRepository.countStatsBySpaceIds.mockResolvedValue(statsResult as any);
			(service as any).spaceCtx = mockSpaceContext;

			const result = await service.getUsersBySpace(query);

			expect(query.toPrismaWhere).toHaveBeenCalledWith({});
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
});
