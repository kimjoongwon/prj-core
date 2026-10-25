import { SpaceAggregate } from "@cocrepo/aggregate";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { PLATFORM_SPACE_NAME } from "./platform-space-name";
import { SYSTEM_SPACE_ULID } from "./system-space-ulid";

export async function getSignUpSpaceOrThrow(
	spacesService: SpaceAggregate,
	spaceId: string,
): Promise<{ id: string }> {
	const space = await spacesService.getById(spaceId);
	if (!space || space.removedAt || space.id === SYSTEM_SPACE_ULID) {
		throw new BadRequestException("SIGN_UP_SPACE_NOT_FOUND");
	}

	if (space.name === PLATFORM_SPACE_NAME) {
		throw new BadRequestException("SIGN_UP_SPACE_NOT_FOUND");
	}

	try {
		// 가입 가능한 공간은 시설이 연결된 운영 공간으로 제한합니다.
		await spacesService.getFitnessCenterBySpaceId(spaceId);
	} catch (error) {
		if (error instanceof NotFoundException) {
			throw new BadRequestException("SIGN_UP_SPACE_NOT_FOUND");
		}
		throw error;
	}

	return { id: space.id };
}
