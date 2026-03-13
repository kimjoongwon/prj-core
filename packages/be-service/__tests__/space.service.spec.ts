import { SpacesRepository } from "@cocrepo/repository";
import { Test, type TestingModule } from "@nestjs/testing";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { SpaceService } from "../src/space.service";

describe("SpaceService", () => {
	let service: SpaceService;
	let mockRepository: DeepMockProxy<SpacesRepository>;

	const mockSpace = {
		id: "space-test-id",
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
		removedAt: null,
	};

	beforeEach(async () => {
		mockRepository = mockDeep<SpacesRepository>();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SpaceService,
				{ provide: SpacesRepository, useValue: mockRepository },
			],
		}).compile();

		service = module.get<SpaceService>(SpaceService);
	});

	afterEach(() => {
		mockReset(mockRepository);
	});

	it("서비스가 정의되어야 한다", () => {
		expect(service).toBeDefined();
	});

	describe("getById", () => {
		it("ID로 Space를 조회해야 한다", async () => {
			// Given
			const spaceId = "space-test-id";
			mockRepository.findById.mockResolvedValue(mockSpace as any);

			// When
			const result = await service.getById(spaceId);

			// Then
			expect(mockRepository.findById).toHaveBeenCalledWith(spaceId);
			expect(result).toEqual(mockSpace);
		});

		it("Space가 없으면 null을 반환해야 한다", async () => {
			// Given
			const spaceId = "non-existent";
			mockRepository.findById.mockResolvedValue(null);

			// When
			const result = await service.getById(spaceId);

			// Then
			expect(result).toBeNull();
		});
	});

	describe("createPersonalSpace", () => {
		it("개인 Space를 생성해야 한다", async () => {
			// Given
			mockRepository.create.mockResolvedValue(mockSpace as any);

			// When
			const result = await service.createPersonalSpace();

			// Then
			expect(mockRepository.create).toHaveBeenCalledWith();
			expect(result).toEqual(mockSpace);
		});
	});

	describe("create", () => {
		it("옵션 없이 Space를 생성해야 한다", async () => {
			// Given
			mockRepository.create.mockResolvedValue(mockSpace as any);

			// When
			const result = await service.create();

			// Then
			expect(mockRepository.create).toHaveBeenCalledWith(undefined);
			expect(result).toEqual(mockSpace);
		});

		it("옵션과 함께 Space를 생성해야 한다", async () => {
			// Given
			const createData = { id: "custom-space-id" };
			const createdSpace = { ...mockSpace, id: createData.id };
			mockRepository.create.mockResolvedValue(createdSpace as any);

			// When
			const result = await service.create(createData);

			// Then
			expect(mockRepository.create).toHaveBeenCalledWith(createData);
			expect(result.id).toBe(createData.id);
		});
	});

	describe("removeById", () => {
		it("Space를 소프트 삭제해야 한다", async () => {
			// Given
			const spaceId = "space-test-id";
			const removedSpace = { ...mockSpace, removedAt: new Date() };
			mockRepository.removeById.mockResolvedValue(removedSpace as any);

			// When
			const result = await service.removeById(spaceId);

			// Then
			expect(mockRepository.removeById).toHaveBeenCalledWith(spaceId);
			expect(result.removedAt).toBeDefined();
		});
	});
});
