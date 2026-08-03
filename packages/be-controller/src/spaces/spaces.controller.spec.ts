import {
	CreateSpaceCommand,
	GetSpaceFitnessCenterQuery,
	ListSpacesQuery,
	UpdateSpaceFitnessCenterCommand,
} from "@cocrepo/command";
import { SpaceContext } from "@cocrepo/context";
import {
	CreateSpaceWithFitnessCenterDto,
	QuerySpaceDto,
	UpdateFitnessCenterDto,
} from "@cocrepo/dto";
import { ForbiddenException, RequestMethod } from "@nestjs/common";
import { METHOD_METADATA, PATH_METADATA } from "@nestjs/common/constants";
import type { CommandBus, QueryBus } from "@nestjs/cqrs";
import { DECORATORS } from "@nestjs/swagger/dist/constants";
import { SpacesController } from "./spaces.controller";

describe("SpacesController", () => {
	let controller: SpacesController;
	let commandBus: jest.Mocked<Pick<CommandBus, "execute">>;
	let queryBus: jest.Mocked<Pick<QueryBus, "execute">>;
	let spaceContext: {
		spaceIds: string[] | undefined;
		canAccessSpace: jest.Mock<boolean, [string]>;
	};

	beforeEach(() => {
		commandBus = {
			execute: jest.fn(),
		};
		queryBus = {
			execute: jest.fn(),
		};
		spaceContext = {
			spaceIds: ["space-a", "space-b"],
			canAccessSpace: jest.fn().mockReturnValue(true),
		};

		controller = new SpacesController(
			commandBus as unknown as CommandBus,
			queryBus as unknown as QueryBus,
			spaceContext as unknown as SpaceContext,
		);
	});

	it("컨트롤러가 정의되어야 한다", () => {
		expect(controller).toBeDefined();
	});

	it("getSpaces는 현재 접근 가능한 spaceIds를 포함한 ListSpacesQuery를 실행해야 한다", async () => {
		// Given
		const query = {
			search: "피트니스",
			take: 10,
		} as QuerySpaceDto;
		queryBus.execute.mockResolvedValue([]);

		// When
		await controller.getSpaces(query);

		// Then
		expect(queryBus.execute).toHaveBeenCalledWith(expect.any(ListSpacesQuery));
		const message = queryBus.execute.mock.calls[0]?.[0] as ListSpacesQuery;
		expect(message.search).toBe("피트니스");
		expect(message.take).toBe(10);
		expect(message.spaceIds).toEqual(["space-a", "space-b"]);
	});

	it("getSpaceFitnessCenter는 접근 가능한 spaceId면 GetSpaceFitnessCenterQuery를 실행해야 한다", async () => {
		// Given
		queryBus.execute.mockResolvedValue({ id: "fitness-center-id" });

		// When
		const result = await controller.getSpaceFitnessCenter(1n);

		// Then
		expect(spaceContext.canAccessSpace).toHaveBeenCalledWith(1n);
		expect(queryBus.execute).toHaveBeenCalledWith(
			expect.any(GetSpaceFitnessCenterQuery),
		);
		const message = queryBus.execute.mock
			.calls[0]?.[0] as GetSpaceFitnessCenterQuery;
		expect(message.spaceId).toBe(1n);
		expect(result).toEqual({ id: "fitness-center-id" });
	});

	it("getSpaceFitnessCenter는 접근할 수 없는 spaceId면 ForbiddenException을 던져야 한다", async () => {
		// Given
		spaceContext.canAccessSpace.mockReturnValue(false);

		// When & Then
		await expect(controller.getSpaceFitnessCenter(9n)).rejects.toThrow(
			ForbiddenException,
		);
		expect(queryBus.execute).not.toHaveBeenCalled();
	});

	it("createSpace는 CreateSpaceCommand로 FitnessCenter 생성 payload를 전달해야 한다", async () => {
		// Given
		const dto: CreateSpaceWithFitnessCenterDto = {
			name: "F45 광화문",
			label: "광화문점",
			address: "서울 종로구 세종대로 1",
			phone: "02-1234-5678",
			email: "gwanghwamun@example.com",
			contentLanguageCode: "ko_KR" as never,
			businessNo: "123-45-67890",
			logoImageFileId: "logo-file-id",
			imageFileId: "image-file-id",
		};
		commandBus.execute.mockResolvedValue({ id: "space-created" });

		// When
		const result = await controller.createSpace(dto);

		// Then
		expect(commandBus.execute).toHaveBeenCalledWith(
			expect.any(CreateSpaceCommand),
		);
		const message = commandBus.execute.mock.calls[0]?.[0] as CreateSpaceCommand;
		expect(message.name).toBe(dto.name);
		expect(message.businessNo).toBe(dto.businessNo);
		expect(message.logoImageFileId).toBe(dto.logoImageFileId);
		expect(message.imageFileId).toBe(dto.imageFileId);
		expect(result).toEqual({ id: "space-created" });
	});

	it("updateSpaceFitnessCenter는 UpdateSpaceFitnessCenterCommand로 FitnessCenter 수정 payload를 전달해야 한다", async () => {
		// Given
		const dto: UpdateFitnessCenterDto = {
			name: "F45 광화문 리뉴얼",
			label: "광화문 리뉴얼점",
			address: "서울 종로구 세종대로 11",
			phone: "02-0000-0000",
			email: "renewal@example.com",
			imageFileId: "next-image-file-id",
			contentLanguageCode: "en_US" as never,
		};
		commandBus.execute.mockResolvedValue({ id: "space-updated" });

		// When
		const result = await controller.updateSpaceFitnessCenter(1n, dto);

		// Then
		expect(spaceContext.canAccessSpace).toHaveBeenCalledWith(1n);
		expect(commandBus.execute).toHaveBeenCalledWith(
			expect.any(UpdateSpaceFitnessCenterCommand),
		);
		const message = commandBus.execute.mock
			.calls[0]?.[0] as UpdateSpaceFitnessCenterCommand;
		expect(message.spaceId).toBe(1n);
		expect(message.name).toBe(dto.name);
		expect(message.contentLanguageCode).toBe(dto.contentLanguageCode);
		expect(message.imageFileId).toBe(dto.imageFileId);
		expect(result).toEqual({ id: "space-updated" });
	});

	it("updateSpaceFitnessCenter는 접근할 수 없는 spaceId면 ForbiddenException을 던져야 한다", async () => {
		// Given
		spaceContext.canAccessSpace.mockReturnValue(false);

		// When & Then
		await expect(
			controller.updateSpaceFitnessCenter(9n, {
				contentLanguageCode: "ko_KR" as never,
			}),
		).rejects.toThrow(ForbiddenException);
		expect(commandBus.execute).not.toHaveBeenCalled();
	});

	it("fitness-center 상세 조회 endpoint는 새 경로와 GET 메타데이터를 유지해야 한다", () => {
		// Given
		const descriptor = Object.getOwnPropertyDescriptor(
			SpacesController.prototype,
			"getSpaceFitnessCenter",
		);

		// When
		const path = Reflect.getMetadata(PATH_METADATA, descriptor?.value);
		const method = Reflect.getMetadata(METHOD_METADATA, descriptor?.value);

		// Then
		expect(path).toBe(":spaceId/fitness-center");
		expect(method).toBe(RequestMethod.GET);
	});

	it("fitness-center 수정 endpoint는 새 경로와 PATCH 메타데이터를 유지해야 한다", () => {
		// Given
		const descriptor = Object.getOwnPropertyDescriptor(
			SpacesController.prototype,
			"updateSpaceFitnessCenter",
		);

		// When
		const path = Reflect.getMetadata(PATH_METADATA, descriptor?.value);
		const method = Reflect.getMetadata(METHOD_METADATA, descriptor?.value);

		// Then
		expect(path).toBe(":spaceId/fitness-center");
		expect(method).toBe(RequestMethod.PATCH);
	});

	it("fitness-center endpoint는 Swagger operationId와 설명을 새 시설 계약으로 노출해야 한다", () => {
		// Given
		const getDescriptor = Object.getOwnPropertyDescriptor(
			SpacesController.prototype,
			"getSpaceFitnessCenter",
		);
		const patchDescriptor = Object.getOwnPropertyDescriptor(
			SpacesController.prototype,
			"updateSpaceFitnessCenter",
		);

		// When
		const getOperation = Reflect.getMetadata(
			DECORATORS.API_OPERATION,
			getDescriptor?.value,
		);
		const patchOperation = Reflect.getMetadata(
			DECORATORS.API_OPERATION,
			patchDescriptor?.value,
		);

		// Then
		expect(getOperation.operationId).toBe("getSpaceFitnessCenter");
		expect(getOperation.description).toContain("FitnessCenter");
		expect(patchOperation.operationId).toBe("updateSpaceFitnessCenter");
		expect(patchOperation.description).toContain("FitnessCenter");
	});

	it("create/update payload 타입은 FitnessCenter DTO를 사용해야 한다", () => {
		// Given
		const createTypes = Reflect.getMetadata(
			"design:paramtypes",
			SpacesController.prototype,
			"createSpace",
		);
		const updateTypes = Reflect.getMetadata(
			"design:paramtypes",
			SpacesController.prototype,
			"updateSpaceFitnessCenter",
		);

		// When
		const createBodyType = createTypes?.[0];
		const updateBodyType = updateTypes?.[1];

		// Then
		expect(createBodyType).toBe(CreateSpaceWithFitnessCenterDto);
		expect(updateBodyType).toBe(UpdateFitnessCenterDto);
	});
});
