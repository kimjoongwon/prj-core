import "reflect-metadata";
import type { SpaceAggregate } from "@cocrepo/aggregate";
import {
	CreateSpaceCommand,
	GetSpaceFitnessCenterQuery,
	UpdateSpaceFitnessCenterCommand,
} from "@cocrepo/command";
import { CreateSpaceUseCase } from "./create-space.usecase";
import { GetSpaceFitnessCenterUseCase } from "./get-space-fitness-center.usecase";
import { UpdateSpaceFitnessCenterUseCase } from "./update-space-fitness-center.usecase";

function createSpaceAggregate() {
	return {
		createSpaceWithFitnessCenter: jest.fn(),
		getFitnessCenterBySpaceId: jest.fn(),
		updateFitnessCenterBySpaceId: jest.fn(),
	} as unknown as jest.Mocked<SpaceAggregate>;
}

describe("space fitness-center use cases", () => {
	it("Given Space 생성 command When 실행하면 Then Space와 Company와 FitnessCenter 생성을 aggregate에 위임한다", async () => {
		const spaces = createSpaceAggregate();
		const createdSpace = {
			id: "space-created-id",
			contentLanguageCode: "ko_KR",
			fitnessCenter: {
				name: "강남 피트니스",
				company: {
					businessNo: "123-45-67890",
					name: "강남 피트니스",
				},
			},
		};
		spaces.createSpaceWithFitnessCenter.mockResolvedValue(
			createdSpace as unknown as Awaited<
				ReturnType<SpaceAggregate["createSpaceWithFitnessCenter"]>
			>,
		);
		const command = new CreateSpaceCommand({
			contentLanguageCode: "ko_KR",
			name: "강남 피트니스",
			label: null,
			address: "서울 강남구",
			phone: "02-1234-5678",
			email: "fitness@example.com",
			businessNo: "123-45-67890",
			logoImageFileId: "logo-file-id",
			imageFileId: "image-file-id",
		});
		const useCase = new CreateSpaceUseCase(spaces);

		await expect(useCase.execute(command)).resolves.toBe(createdSpace);
		expect(spaces.createSpaceWithFitnessCenter).toHaveBeenCalledWith(command);
	});

	it("Given Space ID When 피트니스 센터를 조회하면 Then fitnessCenter.company 포함 결과를 반환한다", async () => {
		const spaces = createSpaceAggregate();
		const fitnessCenter = {
			id: "fitness-center-id",
			name: "강남 피트니스",
			company: {
				id: "company-id",
				name: "강남 피트니스 운영사",
				businessNo: "123-45-67890",
			},
		};
		spaces.getFitnessCenterBySpaceId.mockResolvedValue(
			fitnessCenter as unknown as Awaited<
				ReturnType<SpaceAggregate["getFitnessCenterBySpaceId"]>
			>,
		);
		const useCase = new GetSpaceFitnessCenterUseCase(spaces);
		const spaceId = 101n;

		await expect(
			useCase.execute(new GetSpaceFitnessCenterQuery(spaceId)),
		).resolves.toBe(fitnessCenter);
		expect(spaces.getFitnessCenterBySpaceId).toHaveBeenCalledWith(spaceId);
	});

	it("Given FitnessCenter 수정 command When 실행하면 Then Company 공통 필드 없이 FitnessCenter 변경만 aggregate에 위임한다", async () => {
		const spaces = createSpaceAggregate();
		const updatedSpace = {
			id: "space-id",
			contentLanguageCode: "en_US",
			fitnessCenter: {
				name: "수정 피트니스",
				company: {
					businessNo: "123-45-67890",
					logoImageFileId: "logo-file-id",
				},
			},
		};
		spaces.updateFitnessCenterBySpaceId.mockResolvedValue(
			updatedSpace as unknown as Awaited<
				ReturnType<SpaceAggregate["updateFitnessCenterBySpaceId"]>
			>,
		);
		const spaceId = 101n;
		const command = new UpdateSpaceFitnessCenterCommand(spaceId, {
			contentLanguageCode: "en_US",
			name: "수정 피트니스",
			label: "리뉴얼",
			address: "서울 서초구",
			phone: "02-9999-0000",
			email: "updated@example.com",
			imageFileId: "new-image-file-id",
		});
		const useCase = new UpdateSpaceFitnessCenterUseCase(spaces);

		await expect(useCase.execute(command)).resolves.toBe(updatedSpace);
		expect(spaces.updateFitnessCenterBySpaceId).toHaveBeenCalledWith(
			spaceId,
			command,
		);
		expect(command).not.toHaveProperty("businessNo");
		expect(command).not.toHaveProperty("logoImageFileId");
	});
});
