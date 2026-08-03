import { Tenant, User } from "@cocrepo/entity";
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
			tenant: {
				findFirst: jest.Mock;
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
				tenant: {
					findFirst: jest.fn(),
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

	describe("findTenantDetailForUserInSpace", () => {
		it("사용자·Tenant·현재 Space를 모두 조건으로 권한 그래프를 조회해야 한다", async () => {
			const tenantData = {
				id: "tenant-test-id",
				userId: "user-test-id",
				spaceId: "space-test-id",
				roleId: "role-test-id",
				main: true,
				createdAt: new Date("2026-01-01"),
				updatedAt: new Date("2026-01-01"),
				removedAt: null,
				space: {
					id: "space-test-id",
					fitnessCenter: {
						id: "fitness-center-test-id",
						company: { id: "company-test-id" },
					},
				},
				role: {
					id: "role-test-id",
					assignments: [],
				},
			};
			mockTxHost.tx.tenant.findFirst.mockResolvedValue(tenantData);

			const result = await repository.findTenantDetailForUserInSpace(
				"user-test-id",
				"tenant-test-id",
				"space-test-id",
			);

			expect(mockTxHost.tx.tenant.findFirst).toHaveBeenCalledWith({
				where: {
					tenantId: "tenant-test-id",
					user: { userId: "user-test-id" },
					space: { spaceId: "space-test-id" },
					removedAt: null,
				},
				include: {
					user: { select: { id: true } },
					space: {
						include: {
							fitnessCenter: {
								include: { company: true },
							},
						},
					},
					role: {
						include: {
							assignments: {
								where: {
									removedAt: null,
									policy: {
										space: { spaceId: "space-test-id" },
										removedAt: null,
									},
								},
								orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
								include: {
									policy: {
										include: {
											entries: {
												where: {
													removedAt: null,
													ability: { removedAt: null },
												},
												orderBy: { createdAt: "asc" },
												include: {
													policy: { select: { id: true } },
													ability: {
														include: {
															action: true,
															subject: true,
														},
													},
												},
											},
										},
									},
								},
							},
						},
					},
				},
			});
			expect(result).toBeInstanceOf(Tenant);
		});

		it("다른 사용자 또는 Space에 속한 Tenant면 null을 반환해야 한다", async () => {
			mockTxHost.tx.tenant.findFirst.mockResolvedValue(null);

			const result = await repository.findTenantDetailForUserInSpace(
				"other-user-id",
				"tenant-test-id",
				"space-test-id",
			);

			expect(result).toBeNull();
		});
	});

	it("리포지토리가 정의되어야 한다", () => {
		expect(repository).toBeDefined();
	});

	describe("findByIdAndSpaceIdsWithRelations", () => {
		it("Space 범위가 있으면 해당 Space의 활성 Tenant를 가진 사용자만 조회해야 한다", async () => {
			mockTxHost.tx.user.findFirst.mockResolvedValue(mockUserData);

			const result = await repository.findByIdAndSpaceIdsWithRelations(
				"user-test-id",
				[101n, 102n],
			);

			expect(mockTxHost.tx.user.findFirst).toHaveBeenCalledWith(
				expect.objectContaining({
					where: {
						userId: "user-test-id",
						tenants: {
							some: {
								space: {
									id: { in: [101n, 102n] },
								},
								removedAt: null,
							},
						},
					},
				}),
			);
			expect(result).toBeInstanceOf(User);
		});

		it("Space 범위가 undefined면 사용자 ID만으로 조회해야 한다", async () => {
			mockTxHost.tx.user.findFirst.mockResolvedValue(mockUserData);

			const result = await repository.findByIdAndSpaceIdsWithRelations(
				"user-test-id",
				undefined,
			);

			expect(mockTxHost.tx.user.findFirst).toHaveBeenCalledWith(
				expect.objectContaining({
					where: { userId: "user-test-id" },
				}),
			);
			expect(result).toBeInstanceOf(User);
		});
	});

	describe("findByIdWithTenantsAndProfiles", () => {
		it("ID로 사용자를 조회해야 한다", async () => {
			// Given
			const userId = 101n;
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
			const userId = 999n;
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
			const userId = 101n;
			mockTxHost.tx.user.findUnique.mockResolvedValue(mockUserData);

			// When
			const result = await repository.findByIdWithTenantsAndProfiles(userId);

			// Then
			expect(result?.tenants).toBeDefined();
			expect(result?.profiles).toBeDefined();
		});

		it("Tenant의 Space에 FitnessCenter와 Company include를 사용해야 한다", async () => {
			const userId = 101n;
			mockTxHost.tx.user.findUnique.mockResolvedValue(mockUserData);

			await repository.findByIdWithTenantsAndProfiles(userId);

			expect(mockTxHost.tx.user.findUnique).toHaveBeenCalledWith(
				expect.objectContaining({
					include: expect.objectContaining({
						tenants: expect.objectContaining({
							include: expect.objectContaining({
								space: {
									include: expect.objectContaining({
										fitnessCenter: {
											include: {
												company: true,
											},
										},
									}),
								},
							}),
						}),
					}),
				}),
			);
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
				spaceIds: [1n],
			});

			const expectedWhere = {
				removedAt: null,
				tenants: {
					some: {
						space: { id: { in: [1n] } },
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
							space: { id: { in: [1n] } },
						},
						include: {
							role: true,
							space: true,
							user: { select: { id: true } },
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
				spaceIds: [1n],
				includedRoleNames: ["MANAGER"],
			});

			const expectedWhere = {
				removedAt: null,
				tenants: {
					some: {
						role: {
							name: { in: ["MANAGER"] },
						},
						space: { id: { in: [1n] } },
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
				spaceIds: [1n],
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
								space: { id: { in: [1n] } },
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
			mockTxHost.tx.user.update.mockResolvedValue({
				...account,
				isActive: false,
			});

			const result = await repository.updateIdpAccountById({
				userId: 101n,
				data: { isActive: false },
				spaceIds: [1n],
			});

			expect(mockTxHost.tx.user.findFirst).toHaveBeenCalledWith(
				expect.objectContaining({
					where: {
						id: 101n,
						removedAt: null,
						tenants: {
							some: {
								space: { id: { in: [1n] } },
								removedAt: null,
							},
						},
					},
				}),
			);
			expect(mockTxHost.tx.user.update).toHaveBeenCalledWith(
				expect.objectContaining({
					where: { id: 101n },
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
