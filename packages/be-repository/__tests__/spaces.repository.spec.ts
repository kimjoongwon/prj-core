import { Space } from "@cocrepo/entity";
import { CategoryTypes } from "@cocrepo/prisma";
import { SpaceResourceScope } from "@cocrepo/type";
import { Test, type TestingModule } from "@nestjs/testing";
import { TransactionHost } from "@nestjs-cls/transactional";
import { SpacesRepository } from "../src/spaces.repository";

describe("SpacesRepository", () => {
	let repository: SpacesRepository;
	let mockTxHost: {
		tx: {
			space: {
				findUnique: jest.Mock;
				findMany: jest.Mock;
				create: jest.Mock;
				update: jest.Mock;
				count: jest.Mock;
			};
			ground: {
				findFirst: jest.Mock;
				create: jest.Mock;
				update: jest.Mock;
				updateMany: jest.Mock;
			};
			policy: {
				findMany: jest.Mock;
				upsert: jest.Mock;
			};
			policyAbility: {
				upsert: jest.Mock;
			};
			rolePolicy: {
				upsert: jest.Mock;
			};
			spaceClassification: {
				findFirst: jest.Mock;
				findUnique: jest.Mock;
				findMany: jest.Mock;
			};
			category: {
				findMany: jest.Mock;
			};
		};
	};

	const mockSpaceData = {
		id: "space-test-id",
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
		removedAt: null,
	};

	const mockSpaceWithGround = {
		...mockSpaceData,
		company: {
			id: "company-test-id",
			name: "Test Company",
			label: "Test Label",
			address: "Seoul",
			phone: "02-0000-0000",
			email: "ground@example.com",
			businessNo: "123-45-67890",
			spaceId: mockSpaceData.id,
			logoImageFileId: null,
			grounds: [
				{
					id: "ground-test-id",
					name: "Test Ground",
					label: "Test Label",
					address: "Seoul",
					phone: "02-0000-0000",
					email: "ground@example.com",
					companyId: "company-test-id",
					imageFileId: null,
				},
			],
		},
	};

	beforeEach(async () => {
		mockTxHost = {
			tx: {
				space: {
					findUnique: jest.fn(),
					findMany: jest.fn(),
					create: jest.fn(),
					update: jest.fn(),
					count: jest.fn(),
				},
				ground: {
					findFirst: jest.fn(),
					create: jest.fn(),
					update: jest.fn(),
					updateMany: jest.fn(),
				},
				policy: {
					findMany: jest.fn().mockResolvedValue([]),
					upsert: jest.fn(),
				},
				policyAbility: {
					upsert: jest.fn(),
				},
				rolePolicy: {
					upsert: jest.fn(),
				},
				spaceClassification: {
					findFirst: jest.fn(),
					findUnique: jest.fn(),
					findMany: jest.fn(),
				},
				category: {
					findMany: jest.fn(),
				},
			},
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SpacesRepository,
				{
					provide: TransactionHost,
					useValue: mockTxHost,
				},
			],
		}).compile();

		repository = module.get<SpacesRepository>(SpacesRepository);
	});

	it("리포지토리가 정의되어야 한다", () => {
		expect(repository).toBeDefined();
	});

	describe("findById", () => {
		it("ID로 Space를 조회해야 한다", async () => {
			// Given
			const spaceId = "space-test-id";
			mockTxHost.tx.space.findUnique.mockResolvedValue(mockSpaceData);

			// When
			const result = await repository.findById(spaceId);

			// Then
			expect(mockTxHost.tx.space.findUnique).toHaveBeenCalledWith({
				where: { id: spaceId },
			});
			expect(result).toBeInstanceOf(Space);
			expect(result?.id).toBe(mockSpaceData.id);
		});

		it("Space가 없으면 null을 반환해야 한다", async () => {
			// Given
			const spaceId = "non-existent-space";
			mockTxHost.tx.space.findUnique.mockResolvedValue(null);

			// When
			const result = await repository.findById(spaceId);

			// Then
			expect(mockTxHost.tx.space.findUnique).toHaveBeenCalledWith({
				where: { id: spaceId },
			});
			expect(result).toBeNull();
		});
	});

	describe("findByIdWithGround", () => {
		it("Ground 정보를 포함해서 Space를 조회해야 한다", async () => {
			// Given
			const spaceId = "space-test-id";
			mockTxHost.tx.space.findUnique.mockResolvedValue(mockSpaceWithGround);

			// When
			const result = await repository.findByIdWithGround(spaceId);

			// Then
			expect(mockTxHost.tx.space.findUnique).toHaveBeenCalledWith({
				where: { id: spaceId },
				include: {
					company: {
						include: {
							grounds: {
								where: { removedAt: null },
								orderBy: { createdAt: "asc" },
							},
						},
					},
				},
			});
			expect(result).toBeInstanceOf(Space);
			expect(result?.ground).toBeDefined();
			expect(result?.grounds).toHaveLength(1);
			expect(result?.ground?.businessNo).toBe("123-45-67890");
		});

		it("Space가 없으면 null을 반환해야 한다", async () => {
			// Given
			const spaceId = "non-existent-space";
			mockTxHost.tx.space.findUnique.mockResolvedValue(null);

			// When
			const result = await repository.findByIdWithGround(spaceId);

			// Then
			expect(result).toBeNull();
		});
	});

	describe("findAll", () => {
		it("전체 Space 목록을 조회해야 한다", async () => {
			// Given
			const mockSpaces = [
				mockSpaceData,
				{ ...mockSpaceData, id: "space-2", name: "Space 2" },
			];
			mockTxHost.tx.space.findMany.mockResolvedValue(mockSpaces);

			// When
			const result = await repository.findAll();

			// Then
			expect(mockTxHost.tx.space.findMany).toHaveBeenCalledWith({
				where: { removedAt: null },
				orderBy: { createdAt: "desc" },
			});
			expect(result).toHaveLength(2);
			expect(result[0]).toBeInstanceOf(Space);
		});

		it("Space가 없으면 빈 배열을 반환해야 한다", async () => {
			// Given
			mockTxHost.tx.space.findMany.mockResolvedValue([]);

			// When
			const result = await repository.findAll();

			// Then
			expect(result).toEqual([]);
		});
	});

	describe("create", () => {
		it("새 Space를 생성해야 한다", async () => {
			// Given
			const createData = { id: "custom-space-id" };
			mockTxHost.tx.space.create.mockResolvedValue({
				...mockSpaceData,
				...createData,
			});

			// When
			const result = await repository.create(createData);

			// Then
			expect(mockTxHost.tx.space.create).toHaveBeenCalledWith({
				data: createData,
			});
			expect(result).toBeInstanceOf(Space);
		});

		it("데이터 없이 기본 Space를 생성해야 한다", async () => {
			// Given
			mockTxHost.tx.space.create.mockResolvedValue(mockSpaceData);

			// When
			const result = await repository.create();

			// Then
			expect(mockTxHost.tx.space.create).toHaveBeenCalledWith({
				data: {},
			});
			expect(result).toBeInstanceOf(Space);
		});
	});

	describe("updateById", () => {
		it("Space를 수정해야 한다", async () => {
			// Given
			const spaceId = "space-test-id";
			const updateData = { updatedAt: new Date("2024-06-01") };
			mockTxHost.tx.space.update.mockResolvedValue({
				...mockSpaceData,
				...updateData,
			});

			// When
			const result = await repository.updateById(spaceId, updateData);

			// Then
			expect(mockTxHost.tx.space.update).toHaveBeenCalledWith({
				where: { id: spaceId },
				data: updateData,
			});
			expect(result).toBeInstanceOf(Space);
			expect(result.updatedAt).toEqual(updateData.updatedAt);
		});
	});

	describe("removeById", () => {
		it("Space를 소프트 삭제해야 한다", async () => {
			// Given
			const spaceId = "space-test-id";
			const removedAt = new Date();
			mockTxHost.tx.space.update.mockResolvedValue({
				...mockSpaceData,
				removedAt,
			});

			// When
			const result = await repository.removeById(spaceId);

			// Then
			expect(mockTxHost.tx.space.update).toHaveBeenCalledWith({
				where: { id: spaceId },
				data: { removedAt: expect.any(Date) },
			});
			expect(result).toBeInstanceOf(Space);
			expect(result.removedAt).toBeDefined();
		});
	});

	describe("findSpaceIdsByCategoryHierarchy", () => {
		it("ROOT space는 자신과 모든 하위 category space를 반환해야 한다", async () => {
			// Given
			mockTxHost.tx.spaceClassification.findFirst.mockResolvedValue({
				categoryId: "category-root",
			});
			mockTxHost.tx.category.findMany.mockResolvedValue([
				{ id: "category-root", parentId: null },
				{ id: "category-branch", parentId: "category-root" },
				{ id: "category-leaf", parentId: "category-branch" },
			]);
			mockTxHost.tx.spaceClassification.findMany.mockResolvedValue([
				{ spaceId: "space-root" },
				{ spaceId: "space-branch" },
				{ spaceId: "space-leaf" },
				{ spaceId: "space-branch" },
			]);

			// When
			const result =
				await repository.findSpaceIdsByCategoryHierarchy("space-root");

			// Then
			expect(mockTxHost.tx.spaceClassification.findFirst).toHaveBeenCalledWith({
				where: {
					spaceId: "space-root",
					removedAt: null,
					space: { removedAt: null },
					category: {
						type: CategoryTypes.Space,
						removedAt: null,
					},
				},
				select: { categoryId: true },
			});
			expect(mockTxHost.tx.category.findMany).toHaveBeenCalledWith({
				where: {
					type: CategoryTypes.Space,
					removedAt: null,
				},
				select: {
					id: true,
					parentId: true,
				},
			});
			expect(mockTxHost.tx.spaceClassification.findMany).toHaveBeenCalledWith({
				where: {
					removedAt: null,
					categoryId: {
						in: ["category-root", "category-branch", "category-leaf"],
					},
					space: { removedAt: null },
				},
				select: { spaceId: true },
			});
			expect(result).toEqual(["space-root", "space-branch", "space-leaf"]);
		});

		it("BRANCH space의 기본 하위 scope는 자기 자신만 반환해야 한다", async () => {
			// Given
			mockTxHost.tx.spaceClassification.findFirst.mockResolvedValue({
				categoryId: "category-branch",
			});
			mockTxHost.tx.category.findMany.mockResolvedValue([
				{ id: "category-root", parentId: null },
				{ id: "category-branch", parentId: "category-root" },
			]);
			mockTxHost.tx.spaceClassification.findMany.mockResolvedValue([
				{ spaceId: "space-branch" },
			]);

			// When
			const result =
				await repository.findSpaceIdsByCategoryHierarchy("space-branch");

			// Then
			expect(mockTxHost.tx.spaceClassification.findMany).toHaveBeenCalledWith(
				expect.objectContaining({
					where: expect.objectContaining({
						categoryId: { in: ["category-branch"] },
					}),
				}),
			);
			expect(result).toEqual(["space-branch"]);
		});

		it("ancestor scope는 현재 space와 상위 category space를 반환해야 한다", async () => {
			// Given
			mockTxHost.tx.spaceClassification.findFirst.mockResolvedValue({
				categoryId: "category-branch",
			});
			mockTxHost.tx.category.findMany.mockResolvedValue([
				{ id: "category-root", parentId: null },
				{ id: "category-branch", parentId: "category-root" },
			]);
			mockTxHost.tx.spaceClassification.findMany.mockResolvedValue([
				{ spaceId: "space-root" },
				{ spaceId: "space-branch" },
			]);

			// When
			const result = await repository.findSpaceIdsByCategoryHierarchy(
				"space-branch",
				SpaceResourceScope.WITH_ANCESTORS,
			);

			// Then
			expect(mockTxHost.tx.spaceClassification.findMany).toHaveBeenCalledWith(
				expect.objectContaining({
					where: expect.objectContaining({
						categoryId: { in: ["category-branch", "category-root"] },
					}),
				}),
			);
			expect(result).toEqual(["space-branch", "space-root"]);
		});

		it("tree scope는 현재, 상위, 하위 category space를 중복 없이 반환해야 한다", async () => {
			// Given
			mockTxHost.tx.spaceClassification.findFirst.mockResolvedValue({
				categoryId: "category-branch",
			});
			mockTxHost.tx.category.findMany.mockResolvedValue([
				{ id: "category-root", parentId: null },
				{ id: "category-branch", parentId: "category-root" },
				{ id: "category-leaf", parentId: "category-branch" },
			]);
			mockTxHost.tx.spaceClassification.findMany.mockResolvedValue([
				{ spaceId: "space-root" },
				{ spaceId: "space-branch" },
				{ spaceId: "space-leaf" },
				{ spaceId: "space-root" },
			]);

			// When
			const result = await repository.findSpaceIdsByCategoryHierarchy(
				"space-branch",
				SpaceResourceScope.WITH_TREE,
			);

			// Then
			expect(mockTxHost.tx.spaceClassification.findMany).toHaveBeenCalledWith(
				expect.objectContaining({
					where: expect.objectContaining({
						categoryId: {
							in: ["category-branch", "category-root", "category-leaf"],
						},
					}),
				}),
			);
			expect(result).toEqual(["space-branch", "space-root", "space-leaf"]);
		});

		it("SpaceClassification이 없으면 현재 space만 반환해야 한다", async () => {
			// Given
			mockTxHost.tx.spaceClassification.findFirst.mockResolvedValue(null);

			// When
			const result =
				await repository.findSpaceIdsByCategoryHierarchy("space-branch");

			// Then
			expect(result).toEqual(["space-branch"]);
			expect(mockTxHost.tx.category.findMany).not.toHaveBeenCalled();
			expect(mockTxHost.tx.spaceClassification.findMany).not.toHaveBeenCalled();
		});
	});
});
