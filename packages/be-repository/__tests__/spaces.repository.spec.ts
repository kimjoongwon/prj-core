import { Space } from "@cocrepo/entity";
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
			company: {
				create: jest.Mock;
				update: jest.Mock;
			};
			fitnessCenter: {
				findFirst: jest.Mock;
				create: jest.Mock;
				update: jest.Mock;
			};
			spaceClassification: {
				findFirst: jest.Mock;
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
		name: "Test Fitness Center",
		label: "Test Label",
	};

	const mockCompanyData = {
		id: 10n,
		name: "Test Company",
		label: "Test Label",
		address: "Seoul",
		phone: "02-0000-0000",
		email: "center@example.com",
		businessNo: "123-45-67890",
		logoImageFileId: null,
		removedAt: null,
	};

	const mockSpaceWithFitnessCenter = {
		...mockSpaceData,
		fitnessCenter: {
			id: "fitness-center-test-id",
			address: "Seoul",
			phone: "02-0000-0000",
			email: "center@example.com",
			companyId: mockCompanyData.id,
			spaceId: mockSpaceData.id,
			imageFileId: null,
			removedAt: null,
			company: mockCompanyData,
			space: mockSpaceData,
		},
	};

	const mockSecondSpaceWithFitnessCenter = {
		...mockSpaceData,
		id: "space-second-id",
		name: "Second Fitness Center",
		label: "Second Label",
		fitnessCenter: {
			id: "fitness-center-second-id",
			address: "Busan",
			phone: "051-0000-0000",
			email: "second@example.com",
			companyId: mockCompanyData.id,
			spaceId: "space-second-id",
			imageFileId: "image-2",
			removedAt: null,
			company: mockCompanyData,
			space: { ...mockSpaceData, id: "space-second-id" },
		},
	};

	const mockSpaceDbId = 1n;
	const mockSecondSpaceDbId = 2n;

	const getFitnessCenter = (
		space: Space | null | undefined,
	):
		| {
				id?: string | bigint;
				address?: string;
				company?: {
					id?: string | bigint;
					businessNo?: string;
					fitnessCenters?: Array<{ id?: string | bigint }>;
				};
				space?: { id?: string };
		  }
		| undefined => {
		return (
			space as
				| (Space & {
						fitnessCenter?: {
							id?: string | bigint;
							address?: string;
							company?: {
								id?: string | bigint;
								businessNo?: string;
								fitnessCenters?: Array<{ id?: string | bigint }>;
							};
							space?: { id?: string };
						};
				  })
				| null
				| undefined
		)?.fitnessCenter;
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
				company: {
					create: jest.fn(),
					update: jest.fn(),
				},
				fitnessCenter: {
					findFirst: jest.fn(),
					create: jest.fn(),
					update: jest.fn(),
				},
				spaceClassification: {
					findFirst: jest.fn(),
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
			const spaceId = mockSpaceDbId;
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
			mockTxHost.tx.space.findUnique.mockResolvedValue(null);

			// When
			const result = await repository.findById(999n);

			// Then
			expect(result).toBeNull();
		});
	});

	describe("findByIdWithFitnessCenter", () => {
		it("FitnessCenter와 Company를 포함해서 Space를 조회해야 한다", async () => {
			// Given
			mockTxHost.tx.space.findUnique.mockResolvedValue(
				mockSpaceWithFitnessCenter,
			);

			// When
			const result = await repository.findByIdWithFitnessCenter(
				mockSpaceData.id,
			);

			// Then
			expect(mockTxHost.tx.space.findUnique).toHaveBeenCalledWith({
				where: { spaceId: mockSpaceData.id },
				include: {
					fitnessCenter: {
						include: {
							company: true,
						},
					},
				},
			});
			expect(result).toBeInstanceOf(Space);

			const fitnessCenter = getFitnessCenter(result);
			expect(fitnessCenter?.id).toBe("fitness-center-test-id");
			expect(fitnessCenter?.company?.businessNo).toBe("123-45-67890");
			expect(fitnessCenter?.space?.id).toBe(mockSpaceData.id);
		});

		it("같은 Company가 여러 FitnessCenter를 가져도 현재 Space의 센터만 연결해야 한다", async () => {
			// Given
			mockTxHost.tx.space.findUnique.mockResolvedValue(
				mockSpaceWithFitnessCenter,
			);

			// When
			const result = await repository.findByIdWithFitnessCenter(
				mockSpaceData.id,
			);

			// Then
			const fitnessCenter = getFitnessCenter(result);
			expect(fitnessCenter?.company?.fitnessCenters).toHaveLength(1);
			expect(fitnessCenter?.company?.fitnessCenters?.[0]?.id).toBe(
				"fitness-center-test-id",
			);
		});

		it("Space가 없으면 null을 반환해야 한다", async () => {
			// Given
			mockTxHost.tx.space.findUnique.mockResolvedValue(null);

			// When
			const result =
				await repository.findByIdWithFitnessCenter("missing-space-id");

			// Then
			expect(result).toBeNull();
		});
	});

	describe("findManyWithFitnessCenter", () => {
		it("Company 검색 조건으로 서로 다른 Space의 FitnessCenter를 함께 조회해야 한다", async () => {
			// Given
			mockTxHost.tx.space.findMany.mockResolvedValue([
				mockSpaceWithFitnessCenter,
				mockSecondSpaceWithFitnessCenter,
			]);
			mockTxHost.tx.space.count.mockResolvedValue(2);

			// When
			const [spaces, total] = await repository.findManyWithFitnessCenter({
				search: "123-45",
				spaceIds: [mockSpaceDbId, mockSecondSpaceDbId],
			});

			// Then
			// 이름의 원천이 Space이므로 기본 where는 FitnessCenter 존재를 요구하지 않고,
			// 검색만 Space 이름/회사명/사업자번호를 선택적으로 참조합니다.
			expect(mockTxHost.tx.space.findMany).toHaveBeenCalledWith(
				expect.objectContaining({
					where: expect.objectContaining({
						OR: expect.arrayContaining([
							expect.objectContaining({
								name: expect.objectContaining({
									contains: "123-45",
								}),
							}),
							expect.objectContaining({
								fitnessCenter: expect.objectContaining({
									is: expect.objectContaining({
										company: expect.objectContaining({
											is: expect.objectContaining({
												businessNo: expect.objectContaining({
													contains: "123-45",
												}),
											}),
										}),
									}),
								}),
							}),
						]),
					}),
				}),
			);
			const whereArg = mockTxHost.tx.space.findMany.mock.calls[0][0].where;
			expect(whereArg).not.toHaveProperty("fitnessCenter");
			expect(total).toBe(2);
			expect(getFitnessCenter(spaces[0])?.space?.id).toBe(mockSpaceData.id);
			expect(getFitnessCenter(spaces[1])?.space?.id).toBe("space-second-id");
		});
	});

	describe("findFitnessCenterBySpaceId", () => {
		it("공개 Space ID 관계로 FitnessCenter를 조회해야 한다", async () => {
			// Given
			mockTxHost.tx.fitnessCenter.findFirst.mockResolvedValue(
				mockSpaceWithFitnessCenter.fitnessCenter,
			);

			// When
			const result = await repository.findFitnessCenterBySpaceId(mockSpaceDbId);

			// Then
			expect(mockTxHost.tx.fitnessCenter.findFirst).toHaveBeenCalledWith({
				where: { spaceId: mockSpaceDbId },
				include: {
					company: true,
					space: true,
				},
			});
			expect(result?.spaceId).toBe(mockSpaceData.id);
			expect(
				(result as { company?: { id?: string | bigint } } | null)?.company?.id,
			).toBe(mockCompanyData.id);
		});
	});

	describe("findByIdsWithFitnessCenter", () => {
		it("여러 ID로 FitnessCenter를 포함한 Space를 조회해야 한다", async () => {
			// Given
			mockTxHost.tx.space.findMany.mockResolvedValue([
				mockSpaceWithFitnessCenter,
				mockSecondSpaceWithFitnessCenter,
			]);

			// When
			const result = await repository.findByIdsWithFitnessCenter([
				mockSpaceDbId,
				mockSecondSpaceDbId,
			]);

			// Then
			expect(mockTxHost.tx.space.findMany).toHaveBeenCalledWith({
				where: {
					id: { in: [mockSpaceDbId, mockSecondSpaceDbId] },
					removedAt: null,
				},
				include: {
					fitnessCenter: {
						include: {
							company: true,
						},
					},
				},
				orderBy: { createdAt: "desc" },
			});
			expect(result).toHaveLength(2);
			expect(getFitnessCenter(result[1])?.id).toBe("fitness-center-second-id");
		});
	});

	describe("findSpaceIdsByCategoryHierarchy", () => {
		it("ROOT space는 자신과 모든 하위 category space를 반환해야 한다", async () => {
			// Given
			mockTxHost.tx.spaceClassification.findFirst.mockResolvedValue({
				category: { id: "category-root" },
			});
			mockTxHost.tx.category.findMany.mockResolvedValue([
				{ id: "category-root", parent: null },
				{ id: "category-branch", parent: { id: "category-root" } },
				{ id: "category-leaf", parent: { id: "category-branch" } },
			]);
			mockTxHost.tx.spaceClassification.findMany.mockResolvedValue([
				{ spaceId: 100n },
				{ spaceId: 101n },
				{ spaceId: 102n },
				{ spaceId: 101n },
			]);

			// When
			const result = await repository.findSpaceIdsByCategoryHierarchy(100n);

			// Then
			expect(mockTxHost.tx.spaceClassification.findFirst).toHaveBeenCalledWith({
				where: {
					space: { id: 100n, removedAt: null },
					removedAt: null,
					category: {
						removedAt: null,
					},
				},
				select: { category: { select: { id: true } } },
			});
				expect(mockTxHost.tx.category.findMany).toHaveBeenCalledWith({
				where: {
					removedAt: null,
					spaceClassifications: { some: { removedAt: null } },
				},
				select: {
					id: true,
					parent: { select: { id: true } },
				},
			});
			expect(mockTxHost.tx.spaceClassification.findMany).toHaveBeenCalledWith({
				where: {
					removedAt: null,
					category: {
						id: {
							in: ["category-root", "category-branch", "category-leaf"],
						},
					},
					space: { removedAt: null },
				},
				select: { spaceId: true },
			});
			expect(result).toEqual([100n, 101n, 102n]);
		});

		it("BRANCH space의 기본 하위 scope는 자기 자신만 반환해야 한다", async () => {
			// Given
			mockTxHost.tx.spaceClassification.findFirst.mockResolvedValue({
				category: { id: "category-branch" },
			});
			mockTxHost.tx.category.findMany.mockResolvedValue([
				{ id: "category-root", parent: null },
				{ id: "category-branch", parent: { id: "category-root" } },
			]);
			mockTxHost.tx.spaceClassification.findMany.mockResolvedValue([
				{ spaceId: 101n },
			]);

			// When
			const result = await repository.findSpaceIdsByCategoryHierarchy(101n);

			// Then
			expect(mockTxHost.tx.spaceClassification.findMany).toHaveBeenCalledWith(
				expect.objectContaining({
					where: expect.objectContaining({
						category: { id: { in: ["category-branch"] } },
					}),
				}),
			);
			expect(result).toEqual([101n]);
		});

		it("ancestor scope는 현재 space와 상위 category space를 반환해야 한다", async () => {
			// Given
			mockTxHost.tx.spaceClassification.findFirst.mockResolvedValue({
				category: { id: "category-branch" },
			});
			mockTxHost.tx.category.findMany.mockResolvedValue([
				{ id: "category-root", parent: null },
				{ id: "category-branch", parent: { id: "category-root" } },
			]);
			mockTxHost.tx.spaceClassification.findMany.mockResolvedValue([
				{ spaceId: 100n },
				{ spaceId: 101n },
			]);

			// When
			const result = await repository.findSpaceIdsByCategoryHierarchy(
				101n,
				SpaceResourceScope.WITH_ANCESTORS,
			);

			// Then
			expect(mockTxHost.tx.spaceClassification.findMany).toHaveBeenCalledWith(
				expect.objectContaining({
					where: expect.objectContaining({
						category: {
							id: { in: ["category-branch", "category-root"] },
						},
					}),
				}),
			);
			expect(result).toEqual([101n, 100n]);
		});

		it("tree scope는 현재, 상위, 하위 category space를 중복 없이 반환해야 한다", async () => {
			// Given
			mockTxHost.tx.spaceClassification.findFirst.mockResolvedValue({
				category: { id: "category-branch" },
			});
			mockTxHost.tx.category.findMany.mockResolvedValue([
				{ id: "category-root", parent: null },
				{ id: "category-branch", parent: { id: "category-root" } },
				{ id: "category-leaf", parent: { id: "category-branch" } },
			]);
			mockTxHost.tx.spaceClassification.findMany.mockResolvedValue([
				{ spaceId: 100n },
				{ spaceId: 101n },
				{ spaceId: 102n },
				{ spaceId: 100n },
			]);

			// When
			const result = await repository.findSpaceIdsByCategoryHierarchy(
				101n,
				SpaceResourceScope.WITH_TREE,
			);

			// Then
			expect(mockTxHost.tx.spaceClassification.findMany).toHaveBeenCalledWith(
				expect.objectContaining({
					where: expect.objectContaining({
						category: {
							id: {
								in: ["category-branch", "category-root", "category-leaf"],
							},
						},
					}),
				}),
			);
			expect(result).toEqual([101n, 100n, 102n]);
		});

		it("SpaceClassification이 없으면 현재 space만 반환해야 한다", async () => {
			// Given
			mockTxHost.tx.spaceClassification.findFirst.mockResolvedValue(null);

			// When
			const result = await repository.findSpaceIdsByCategoryHierarchy(101n);

			// Then
			expect(result).toEqual([101n]);
			expect(mockTxHost.tx.category.findMany).not.toHaveBeenCalled();
			expect(mockTxHost.tx.spaceClassification.findMany).not.toHaveBeenCalled();
		});
	});
});
