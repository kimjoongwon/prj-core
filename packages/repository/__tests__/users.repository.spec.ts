import { User } from "@cocrepo/entity";
import { PrismaClient } from "@cocrepo/prisma";
import { Test, TestingModule } from "@nestjs/testing";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { UsersRepository } from "../src/users.repository";

describe("UsersRepository", () => {
	let repository: UsersRepository;
	let mockTxHost: {
		tx: {
			user: {
				findUnique: jest.Mock;
			};
		};
	};

	const mockUserData = {
		id: "user-test-id",
		seq: 1,
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
				main: true,
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
								space: true,
							}),
						}),
					}),
				}),
			);
		});
	});
});
