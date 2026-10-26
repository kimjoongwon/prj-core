import type { Space } from "@cocrepo/entity";
import { SpacesRepository } from "@cocrepo/repository";
import { NotFoundException } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";

jest.mock("@nestjs-cls/transactional", () => ({
	Transactional:
		() =>
		(
			_target: object,
			_propertyKey: string | symbol,
			descriptor: PropertyDescriptor,
		) =>
			descriptor,
}));

import { SpaceAggregate } from "../src/space/space.aggregate";

describe("SpaceAggregate", () => {
	let service: SpaceAggregate;
	let mockRepository: DeepMockProxy<SpacesRepository>;

	const mockSpace = {
		id: "01JSPACE0000000000000000101",
		seq: 101n,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
		removedAt: null,
	};
	const mockFitnessCenter = {
		id: 201n,
		name: "테스트 센터",
		label: "테스트 라벨",
		address: "서울시 강남구",
		phone: "02-1234-5678",
		email: "fitness@example.com",
		companySeq: 301n,
		spaceSeq: 101n,
		imageFileId: "image-test-id",
	};

	beforeEach(async () => {
		mockRepository = mockDeep<SpacesRepository>();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SpaceAggregate,
				{ provide: SpacesRepository, useValue: mockRepository },
			],
		}).compile();

		service = module.get<SpaceAggregate>(SpaceAggregate);
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
			const spaceSeq = 1n;
			mockRepository.findById.mockResolvedValue(mockSpace as unknown as Space);

			// When
			const result = await service.getById(spaceSeq);

			// Then
			expect(mockRepository.findById).toHaveBeenCalledWith(spaceSeq);
			expect(result).toEqual(mockSpace);
		});

		it("Space가 없으면 null을 반환해야 한다", async () => {
			// Given
			const spaceSeq = 2n;
			mockRepository.findById.mockResolvedValue(null);

			// When
			const result = await service.getById(spaceSeq);

			// Then
			expect(result).toBeNull();
		});
	});

	describe("getFitnessCenterBySpaceId", () => {
		it("Space의 피트니스 센터를 조회해야 한다", async () => {
			// Given
			mockRepository.findFitnessCenterBySpaceId.mockResolvedValue(
				mockFitnessCenter as never,
			);

			// When
			const result = await service.getFitnessCenterBySpaceId(1n);

			// Then
			expect(mockRepository.findFitnessCenterBySpaceId).toHaveBeenCalledWith(
				1n,
			);
			expect(result).toEqual(mockFitnessCenter);
		});

		it("피트니스 센터가 없으면 예외를 던져야 한다", async () => {
			// Given
			mockRepository.findFitnessCenterBySpaceId.mockResolvedValue(null);

			// When / Then
			await expect(service.getFitnessCenterBySpaceId(1n)).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe("findByIdsWithFitnessCenter", () => {
		it("여러 Space를 FitnessCenter 포함으로 조회해야 한다", async () => {
			// Given
			const spaces = [mockSpace] as unknown as Space[];
			mockRepository.findByIdsWithFitnessCenter.mockResolvedValue(spaces);

			// When
			const result = await service.findByIdsWithFitnessCenter([1n]);

			// Then
			expect(mockRepository.findByIdsWithFitnessCenter).toHaveBeenCalledWith([
				1n,
			]);
			expect(result).toEqual(spaces);
		});
	});
});
