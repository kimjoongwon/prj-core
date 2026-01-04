import { Space } from "@cocrepo/entity";
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
			};
		};
	};

	const mockSpaceData = {
		id: "space-test-id",
		seq: 1,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
		removedAt: null,
	};

	const mockSpaceWithGround = {
		...mockSpaceData,
		ground: {
			id: "ground-test-id",
			seq: 1,
			name: "Test Ground",
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
				include: { ground: true },
			});
			expect(result).toBeInstanceOf(Space);
			expect(result?.ground).toBeDefined();
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
});
