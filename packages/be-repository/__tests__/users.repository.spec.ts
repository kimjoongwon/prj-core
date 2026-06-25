import { User } from "@cocrepo/entity";
import { Test, type TestingModule } from "@nestjs/testing";
import { TransactionHost } from "@nestjs-cls/transactional";
import { UsersRepository } from "../src/users.repository";

describe("UsersRepository", () => {
	let repository: UsersRepository;
	let mockTxHost: {
		tx: {
			user: {
				findUnique: jest.Mock;
				findFirst: jest.Mock;
				findMany: jest.Mock;
				count: jest.Mock;
				update: jest.Mock;
			};
		};
	};

	const mockUserData = {
		id: "user-test-id",
		email: "test@example.com",
		name: "Test User",
		phone: "010-1234-5678",
		password: "$2b$10$hashedPassword",
		spaceId: "space-test-id",
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
		removedAt: null,
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
						category: {
							parent: {
								parent: {
									parent: null,
								},
							},
						},
					},
				},
			},
		],
		profiles: [{ name: "Test User", nickname: "testuser" }],
	};

	beforeEach(async () => {
		mockTxHost = {
			tx: {
				user: {
					findUnique: jest.fn(),
					findFirst: jest.fn(),
					findMany: jest.fn(),
					count: jest.fn(),
					update: jest.fn(),
				},
			},
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersRepository,
				{
					provide: TransactionHost,
					useValue: mockTxHost,
				},
			],
		}).compile();

		repository = module.get<UsersRepository>(UsersRepository);
	});

	it("리포지토리가 정의되어야 한다", () => {
		expect(repository).toBeDefined();
	});

	describe("findByIdWithTenantsAndProfiles", () => {
		it("ID로 사용자를 조회해야 한다", async () => {
			// Given
			const userId = "user-test-id";
			mockTxHost.tx.user.findUnique.mockResolvedValue(mockUserData);

			// When
			const result = await repository.findByIdWithTenantsAndProfiles(userId);

			// Then
			expect(mockTxHost.tx.user.findUnique).toHaveBeenCalledWith({
				where: { id: userId },
				include: expect.objectContaining({
					tenants: expect.any(Object),
					profiles: true,
				}),
			});
			expect(result).toBeInstanceOf(User);
			expect(result?.id).toBe(mockUserData.id);
			expect(result?.email).toBe(mockUserData.email);
		});

		it("사용자가 없으면 null을 반환해야 한다", async () => {
			// Given
			const userId = "non-existent-user";
			mockTxHost.tx.user.findUnique.mockResolvedValue(null);

			// When
			const result = await repository.findByIdWithTenantsAndProfiles(userId);

			// Then
			expect(mockTxHost.tx.user.findUnique).toHaveBeenCalledWith({
				where: { id: userId },
				include: expect.any(Object),
			});
			expect(result).toBeNull();
		});

		it("Tenant와 Profile 정보를 포함해야 한다", async () => {
			// Given
			const userId = "user-test-id";
			mockTxHost.tx.user.findUnique.mockResolvedValue(mockUserData);

			// When
			const result = await repository.findByIdWithTenantsAndProfiles(userId);

			// Then
			expect(result?.tenants).toBeDefined();
			expect(result?.profiles).toBeDefined();
		});
	});

	describe("findByEmailWithTenantsAndProfiles", () => {
		it("이메일로 사용자를 조회해야 한다", async () => {
			// Given
			const email = "test@example.com";
			mockTxHost.tx.user.findUnique.mockResolvedValue(mockUserData);

			// When
			const result = await repository.findByEmailWithTenantsAndProfiles(email);

			// Then
			expect(mockTxHost.tx.user.findUnique).toHaveBeenCalledWith({
				where: { email },
				include: expect.objectContaining({
					tenants: expect.any(Object),
					profiles: true,
				}),
			});
			expect(result).toBeInstanceOf(User);
			expect(result?.email).toBe(email);
		});

		it("이메일로 사용자를 찾지 못하면 null을 반환해야 한다", async () => {
			// Given
			const email = "nonexistent@example.com";
			mockTxHost.tx.user.findUnique.mockResolvedValue(null);

			// When
			const result = await repository.findByEmailWithTenantsAndProfiles(email);

			// Then
			expect(mockTxHost.tx.user.findUnique).toHaveBeenCalledWith({
				where: { email },
				include: expect.any(Object),
			});
			expect(result).toBeNull();
		});

		it("중첩된 role과 classification 정보를 조회해야 한다", async () => {
			// Given
			const email = "test@example.com";
			mockTxHost.tx.user.findUnique.mockResolvedValue(mockUserData);

			// When
			await repository.findByEmailWithTenantsAndProfiles(email);

			// Then
			expect(mockTxHost.tx.user.findUnique).toHaveBeenCalledWith(
				expect.objectContaining({
					include: expect.objectContaining({
						tenants: expect.objectContaining({
							include: expect.objectContaining({
								role: expect.any(Object),
								space: expect.any(Object),
							}),
						}),
					}),
				}),
			);
		});
	});

	describe("findManyBySpaceIds", () => {
		it("scoped 목록 조회에서 spaceIds가 있으면 user 목록과 tenants include를 그 space로 제한한다", async () => {
			mockTxHost.tx.user.findMany.mockResolvedValue([]);
			mockTxHost.tx.user.count.mockResolvedValue(0);

			await repository.findManyBySpaceIds({
				where: { removedAt: null },
				orderBy: [{ createdAt: "desc" }],
				skip: 0,
				take: 20,
				spaceIds: ["space-001"],
			});

			const expectedWhere = {
				removedAt: null,
				tenants: {
					some: {
						spaceId: { in: ["space-001"] },
						removedAt: null,
					},
				},
			};

			expect(mockTxHost.tx.user.findMany).toHaveBeenCalledWith({
				where: expectedWhere,
				include: expect.objectContaining({
					tenants: expect.objectContaining({
						where: {
							removedAt: null,
							spaceId: { in: ["space-001"] },
						},
						include: {
							role: true,
							space: true,
						},
					}),
				}),
				orderBy: [{ createdAt: "desc" }],
				skip: 0,
				take: 20,
			});
			expect(mockTxHost.tx.user.count).toHaveBeenCalledWith({
				where: expectedWhere,
			});
		});

		it("scoped 목록 조회에서 기존 tenants.some 조건과 spaceIds를 병합한다", async () => {
			mockTxHost.tx.user.findMany.mockResolvedValue([]);
			mockTxHost.tx.user.count.mockResolvedValue(0);

			await repository.findManyBySpaceIds({
				where: {
					removedAt: null,
					tenants: {
						some: {
							role: {
								name: { in: ["MANAGER"] },
							},
						},
					},
				},
				orderBy: [{ createdAt: "desc" }],
				skip: 0,
				take: 20,
				spaceIds: ["space-001"],
				includedRoleNames: ["MANAGER"],
			});

			const expectedWhere = {
				removedAt: null,
				tenants: {
					some: {
						role: {
							name: { in: ["MANAGER"] },
						},
						spaceId: { in: ["space-001"] },
						removedAt: null,
					},
				},
			};

			expect(mockTxHost.tx.user.findMany).toHaveBeenCalledWith(
				expect.objectContaining({
					where: expectedWhere,
				}),
			);
			expect(mockTxHost.tx.user.count).toHaveBeenCalledWith({
				where: expectedWhere,
			});
		});
	});

	describe("findManyIdpAccounts", () => {
		it("IDP 계정 목록 조회에서 query mapper, scope, projection select를 적용한다", async () => {
			mockTxHost.tx.user.findMany.mockResolvedValue([]);
			mockTxHost.tx.user.count.mockResolvedValue(0);

			await repository.findManyIdpAccounts({
				input: {
					search: "kim",
					isActive: true,
					sort: ["-email"],
					skip: 10,
					take: 5,
				},
				spaceIds: ["space-001"],
			});

			expect(mockTxHost.tx.user.findMany).toHaveBeenCalledWith(
				expect.objectContaining({
					where: {
						removedAt: null,
						isActive: true,
						AND: [
							{
								OR: [
									{ name: { contains: "kim", mode: "insensitive" } },
									{ email: { contains: "kim", mode: "insensitive" } },
								],
							},
						],
						tenants: {
							some: {
								spaceId: { in: ["space-001"] },
								removedAt: null,
							},
						},
					},
					orderBy: [{ email: "desc" }],
					skip: 10,
					take: 5,
					select: expect.objectContaining({
						id: true,
						email: true,
						isActive: true,
					}),
				}),
			);
		});
	});

	describe("updateIdpAccountById", () => {
		it("scope 안의 IDP 계정만 projection으로 수정한다", async () => {
			const account = {
				id: "user-test-id",
				name: "Test User",
				email: "test@example.com",
				isActive: true,
				failedLoginAttempts: 0,
				isPermanentlyLocked: false,
				lockedUntil: null,
				mustChangePassword: false,
				lastLoginAt: null,
				lastLoginIp: null,
				createdAt: new Date("2024-01-01"),
			};
			mockTxHost.tx.user.findFirst.mockResolvedValue(account);
			mockTxHost.tx.user.update.mockResolvedValue({ ...account, isActive: false });

			const result = await repository.updateIdpAccountById({
				userId: "user-test-id",
				data: { isActive: false },
				spaceIds: ["space-001"],
			});

			expect(mockTxHost.tx.user.findFirst).toHaveBeenCalledWith(
				expect.objectContaining({
					where: {
						id: "user-test-id",
						removedAt: null,
						tenants: {
							some: {
								spaceId: { in: ["space-001"] },
								removedAt: null,
							},
						},
					},
				}),
			);
			expect(mockTxHost.tx.user.update).toHaveBeenCalledWith(
				expect.objectContaining({
					where: { id: "user-test-id" },
					data: { isActive: false },
					select: expect.objectContaining({
						id: true,
						isActive: true,
					}),
				}),
			);
			expect(result?.isActive).toBe(false);
		});
	});
});
