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
		id: 101n,
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
		companyId: 301n,
		spaceId: 101n,
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
			const spaceId = 101n;
			mockRepository.findById.mockResolvedValue(mockSpace as unknown as Space);

			// When
			const result = await service.getById(spaceId);

			// Then
			expect(mockRepository.findById).toHaveBeenCalledWith(spaceId);
			expect(result).toEqual(mockSpace);
		});

		it("Space가 없으면 null을 반환해야 한다", async () => {
			// Given
			const spaceId = 999n;
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
			mockRepository.create.mockResolvedValue(mockSpace as unknown as Space);

			// When
			const result = await service.createPersonalSpace();

			// Then
			expect(mockRepository.create).toHaveBeenCalledWith();
			expect(result).toEqual(mockSpace);
		});
	});

	describe("getFitnessCenterBySpaceId", () => {
		it("Space의 피트니스 센터를 조회해야 한다", async () => {
			// Given
			mockRepository.findFitnessCenterBySpaceId.mockResolvedValue(
				mockFitnessCenter as never,
			);

			// When
			const result = await service.getFitnessCenterBySpaceId(101n);

			// Then
			expect(mockRepository.findFitnessCenterBySpaceId).toHaveBeenCalledWith(
				101n,
			);
			expect(result).toEqual(mockFitnessCenter);
		});

		it("피트니스 센터가 없으면 예외를 던져야 한다", async () => {
			// Given
			mockRepository.findFitnessCenterBySpaceId.mockResolvedValue(null);

			// When / Then
			await expect(service.getFitnessCenterBySpaceId(101n)).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe("create", () => {
		it("옵션 없이 Space를 생성해야 한다", async () => {
			// Given
			mockRepository.create.mockResolvedValue(mockSpace as unknown as Space);

			// When
			const result = await service.create();

			// Then
			expect(mockRepository.create).toHaveBeenCalledWith(undefined);
			expect(result).toEqual(mockSpace);
		});

		it("옵션과 함께 Space를 생성해야 한다", async () => {
			// Given
			const createData = { id: 102n };
			const createdSpace = { ...mockSpace, id: createData.id };
			mockRepository.create.mockResolvedValue(createdSpace as unknown as Space);

			// When
			const result = await service.create(createData);

			// Then
			expect(mockRepository.create).toHaveBeenCalledWith(createData);
			expect(result.id).toBe(createData.id);
		});
	});

	describe("createSpaceWithFitnessCenter", () => {
		it("Space와 Company, FitnessCenter를 함께 생성해야 한다", async () => {
			// Given
			const input = {
				contentLanguageCode: "ko_KR",
				name: "테스트 센터",
				label: "테스트 라벨",
				address: "서울시 강남구",
				phone: "02-1234-5678",
				email: "fitness@example.com",
				businessNo: "123-45-67890",
				logoImageFileId: "logo-test-id",
				imageFileId: "image-test-id",
			} as const;
			mockRepository.create.mockResolvedValue(mockSpace as unknown as Space);
			mockRepository.createFitnessCenterBySpaceId.mockResolvedValue(
				mockSpace as unknown as Space,
			);

			// When
			const result = await service.createSpaceWithFitnessCenter(input);

			// Then
			expect(mockRepository.create).toHaveBeenCalledWith({
				contentLanguageCode: input.contentLanguageCode,
			});
			expect(mockRepository.createFitnessCenterBySpaceId).toHaveBeenCalledWith(
				mockSpace.id,
				{
					company: {
						name: input.name,
						label: input.label,
						address: input.address,
						phone: input.phone,
						email: input.email,
						businessNo: input.businessNo,
						logoImageFileId: input.logoImageFileId,
					},
					fitnessCenter: {
						name: input.name,
						label: input.label,
						address: input.address,
						phone: input.phone,
						email: input.email,
						imageFileId: input.imageFileId,
					},
				},
			);
			expect(result).toEqual(mockSpace);
		});
	});

	describe("updateFitnessCenterBySpaceId", () => {
		it("Space 언어와 FitnessCenter 필드만 수정해야 한다", async () => {
			// Given
			const input = {
				contentLanguageCode: "en_US",
				name: "업데이트 센터",
				label: "업데이트 라벨",
				address: "서울시 서초구",
				phone: "02-9999-8888",
				email: "updated@example.com",
				imageFileId: "updated-image-id",
			} as const;
			mockRepository.findFitnessCenterBySpaceId.mockResolvedValue(
				mockFitnessCenter as never,
			);
			mockRepository.updateById.mockResolvedValue(mockSpace as never);
			mockRepository.updateFitnessCenterBySpaceId.mockResolvedValue(
				mockSpace as never,
			);

			// When
			const result = await service.updateFitnessCenterBySpaceId(101n, input);

			// Then
			expect(mockRepository.updateById).toHaveBeenCalledWith(101n, {
				contentLanguageCode: input.contentLanguageCode,
			});
			expect(mockRepository.updateFitnessCenterBySpaceId).toHaveBeenCalledWith(
				101n,
				{
					fitnessCenter: {
						name: input.name,
						label: input.label,
						address: input.address,
						phone: input.phone,
						email: input.email,
						imageFileId: input.imageFileId,
					},
				},
			);
			expect(result).toEqual(mockSpace);
		});

		it("contentLanguageCode가 없으면 Space는 수정하지 않아야 한다", async () => {
			// Given
			mockRepository.findFitnessCenterBySpaceId.mockResolvedValue(
				mockFitnessCenter as never,
			);
			mockRepository.updateFitnessCenterBySpaceId.mockResolvedValue(
				mockSpace as never,
			);

			// When
			await service.updateFitnessCenterBySpaceId(101n, {
				name: "업데이트 센터",
			});

			// Then
			expect(mockRepository.updateById).not.toHaveBeenCalled();
			expect(mockRepository.updateFitnessCenterBySpaceId).toHaveBeenCalledWith(
				101n,
				{
					fitnessCenter: {
						name: "업데이트 센터",
					},
				},
			);
		});
	});

	describe("findByIdsWithFitnessCenter", () => {
		it("여러 Space를 FitnessCenter 포함으로 조회해야 한다", async () => {
			// Given
			const spaces = [mockSpace] as unknown as Space[];
			mockRepository.findByIdsWithFitnessCenter.mockResolvedValue(spaces);

			// When
			const result = await service.findByIdsWithFitnessCenter([101n]);

			// Then
			expect(mockRepository.findByIdsWithFitnessCenter).toHaveBeenCalledWith([
				101n,
			]);
			expect(result).toEqual(spaces);
		});
	});
});
