import { SpaceAggregateRoot } from "@cocrepo/aggregate";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { PLATFORM_GROUND_NAME } from "./platform-ground-name";
import { SYSTEM_SPACE_ID } from "./system-space-id";

export async function getSignUpSpaceOrThrow(
	spacesService: SpaceAggregateRoot,
	spaceId: string,
): Promise<{ id: string }> {
	const space = await spacesService.getById(spaceId);
	if (!space || space.removedAt || space.id === SYSTEM_SPACE_ID) {
		throw new BadRequestException("SIGN_UP_SPACE_NOT_FOUND");
	}

	try {
		const ground = await spacesService.getGroundBySpaceId(spaceId);
		if (ground.name === PLATFORM_GROUND_NAME) {
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
