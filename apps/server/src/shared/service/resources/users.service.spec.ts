import { Test, TestingModule } from "@nestjs/testing";
import { Prisma, QueryUserDto } from "@shared/schema";
import { UsersRepository } from "../../repository/users.repository";
import { createTestUserEntity } from "../../test/test-utils";
import { UsersService } from "./users.service";

describe("UsersService", () => {
	let service: UsersService;
	let repository: jest.Mocked<UsersRepository>;

	beforeEach(async () => {
		const mockRepository = {
			findUnique: jest.fn(),
			findFirst: jest.fn(),
			findMany: jest.fn(),
			count: jest.fn(),
			create: jest.fn(),
			update: jest.fn(),
			updateMany: jest.fn(),
			delete: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: UsersRepository,
					useValue: mockRepository,
				},
			],
		}).compile();

		service = module.get<UsersService>(UsersService);
		repository = module.get(UsersRepository);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("getById", () => {
		it("should call repository.findUnique with correct args", async () => {
			const userId = "user-test-id";
			const expectedUser = createTestUserEntity();

			repository.findUnique.mockResolvedValue(expectedUser);

			const result = await service.getById(userId);

			expect(repository.findUnique).toHaveBeenCalledWith({
				where: { id: userId },
			});
			expect(result).toEqual(expectedUser);
		});

		it("should return null when user is not found", async () => {
			const userId = "non-existent-id";

			repository.findUnique.mockResolvedValue(null as any);

			const result = await service.getById(userId);

			expect(repository.findUnique).toHaveBeenCalledWith({
				where: { id: userId },
			});
			expect(result).toBeNull();
		});
	});

	describe("getByEmail", () => {
		it("should call repository.findFirst with correct args", async () => {
			const email = "test@example.com";
			const expectedUser = createTestUserEntity();

			repository.findFirst.mockResolvedValue(expectedUser);

			const result = await service.getByEmail(email);

			expect(repository.findFirst).toHaveBeenCalledWith({
				where: { email },
			});
			expect(result).toEqual(expectedUser);
		});
	});

	describe("removeMany", () => {
		it("should soft delete multiple users by updating removedAt", async () => {
			const ids = ["user-1", "user-2", "user-3"];
			const updateResult = { count: 3 };

			repository.updateMany.mockResolvedValue(updateResult);

			const result = await service.removeMany(ids);

			expect(repository.updateMany).toHaveBeenCalledWith({
				where: { id: { in: ids } },
				data: { removedAt: expect.any(Date) },
			});
			expect(result).toEqual(updateResult);
		});

		it("should handle empty array of ids", async () => {
			const ids: string[] = [];
			const updateResult = { count: 0 };

			repository.updateMany.mockResolvedValue(updateResult);

			const result = await service.removeMany(ids);

			expect(repository.updateMany).toHaveBeenCalledWith({
				where: { id: { in: ids } },
				data: { removedAt: expect.any(Date) },
			});
			expect(result).toEqual(updateResult);
		});
	});

	describe("deleteById", () => {
		it("should call repository.delete with correct args", async () => {
			const userId = "user-test-id";
			const deletedUser = createTestUserEntity();

			repository.delete.mockResolvedValue(deletedUser);

			const result = await service.deleteById(userId);

			expect(repository.delete).toHaveBeenCalledWith({
				where: { id: userId },
			});
			expect(result).toEqual(deletedUser);
		});
	});

	describe("create", () => {
		it("should call repository.create with correct args", async () => {
			const args: Prisma.UserCreateArgs = {
				data: {
					name: "Test User",
					email: "test@example.com",
					phone: "010-1234-5678",
					password: "hashed-password",
				},
			};
			const createdUser = createTestUserEntity();

			repository.create.mockResolvedValue(createdUser);

			const result = await service.create(args);

			expect(repository.create).toHaveBeenCalledWith(args);
			expect(result).toEqual(createdUser);
		});
	});

	describe("getManyByQuery", () => {
		it("should return users and count from query", async () => {
			const mockQuery = {
				toArgs: jest.fn().mockReturnValue({
					skip: 0,
					take: 10,
					where: {},
				}),
				toCountArgs: jest.fn().mockReturnValue({
					where: {},
				}),
			} as unknown as QueryUserDto;

			const expectedUsers = [createTestUserEntity()];
			const expectedCount = 1;

			repository.findMany.mockResolvedValue(expectedUsers);
			repository.count.mockResolvedValue(expectedCount);

			const result = await service.getManyByQuery(mockQuery);

			expect(mockQuery.toArgs).toHaveBeenCalled();
			expect(mockQuery.toCountArgs).toHaveBeenCalled();
			expect(repository.findMany).toHaveBeenCalledWith({
				skip: 0,
				take: 10,
				where: {},
				include: {
					tenants: {
						include: {
							role: true,
						},
					},
					profiles: true,
				},
			});
			expect(repository.count).toHaveBeenCalledWith({
				where: {},
			});
			expect(result).toEqual({
				users: expectedUsers,
				count: expectedCount,
			});
		});

		it("should handle empty results", async () => {
			const mockQuery = {
				toArgs: jest.fn().mockReturnValue({
					skip: 0,
					take: 10,
					where: { name: "non-existent" },
				}),
				toCountArgs: jest.fn().mockReturnValue({
					where: { name: "non-existent" },
				}),
			} as unknown as QueryUserDto;

			repository.findMany.mockResolvedValue([]);
			repository.count.mockResolvedValue(0);

			const result = await service.getManyByQuery(mockQuery);

			expect(result).toEqual({
				users: [],
				count: 0,
			});
		});
	});

	describe("updateById", () => {
		it("should call repository.update with correct args", async () => {
			const userId = "user-test-id";
			const updateData = { name: "Updated Name" };
			const updatedUser = createTestUserEntity({ name: "Updated Name" });

			repository.update.mockResolvedValue(updatedUser);

			const result = await service.updateById(userId, updateData);

			expect(repository.update).toHaveBeenCalledWith({
				where: { id: userId },
				data: updateData,
			});
			expect(result).toEqual(updatedUser);
		});
	});

	describe("removeById", () => {
		it("should soft delete user by updating removedAt", async () => {
			const userId = "user-test-id";
			const removedUser = createTestUserEntity({
				removedAt: expect.any(Date),
			});

			repository.update.mockResolvedValue(removedUser);

			const result = await service.removeById(userId);

			expect(repository.update).toHaveBeenCalledWith({
				where: { id: userId },
				data: { removedAt: expect.any(Date) },
			});
			expect(result).toEqual(removedUser);
		});
	});
});
