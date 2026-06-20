import { SpaceAggregate } from "@cocrepo/aggregate";
import { GetSignUpSpacesQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";
import { PLATFORM_GROUND_NAME } from "./platform-ground-name";
import type { AuthSpaceResult } from "./space.result";
import { SYSTEM_SPACE_ID } from "./system-space-id";

@QueryHandler(GetSignUpSpacesQuery)
export class GetSignUpSpacesUseCase {
	constructor(private readonly spacesService: SpaceAggregate) {}

	async execute(): Promise<AuthSpaceResult[]> {
		const spaceList = await this.spacesService.listSpaces();
		return spaceList.spaces
			.filter(
				(space) =>
					space.id !== SYSTEM_SPACE_ID &&
					space.ground?.name !== PLATFORM_GROUND_NAME,
			)
			.map((space) => space);
	}
}
