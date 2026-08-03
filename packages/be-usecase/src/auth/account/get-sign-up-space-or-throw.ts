import { SpaceAggregate } from "@cocrepo/aggregate";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { PLATFORM_FITNESS_CENTER_NAME } from "./platform-fitness-center-name";
import { SYSTEM_SPACE_ULID } from "./system-space-ulid";

export async function getSignUpSpaceOrThrow(
	spacesService: SpaceAggregate,
	spaceId: bigint,
): Promise<{ id: bigint }> {
	const space = await spacesService.getById(spaceId);
	if (!space || space.removedAt || space.spaceId === SYSTEM_SPACE_ULID) {
		throw new BadRequestException("SIGN_UP_SPACE_NOT_FOUND");
	}

	try {
		const fitnessCenter =
			await spacesService.getFitnessCenterBySpaceId(spaceId);
		if (fitnessCenter.name === PLATFORM_FITNESS_CENTER_NAME) {
			throw new BadRequestException("SIGN_UP_SPACE_NOT_FOUND");
		}
	} catch (error) {
		if (error instanceof NotFoundException) {
			throw new BadRequestException("SIGN_UP_SPACE_NOT_FOUND");
		}
		throw error;
	}

	return { id: space.id };
}
