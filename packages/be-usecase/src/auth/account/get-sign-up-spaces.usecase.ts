import { SpaceAggregate } from "@cocrepo/aggregate";
import { GetSignUpSpacesQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";
import { PLATFORM_FITNESS_CENTER_NAME } from "./platform-fitness-center-name";
import type { AuthSpaceResult } from "./space.result";
import { SYSTEM_SPACE_ULID } from "./system-space-ulid";

@QueryHandler(GetSignUpSpacesQuery)
export class GetSignUpSpacesUseCase {
	constructor(private readonly spacesService: SpaceAggregate) {}

	async execute(): Promise<AuthSpaceResult[]> {
		const spaceList = await this.spacesService.listSpaces();
		return spaceList.spaces
			.filter(
				(space) =>
					space.spaceId !== SYSTEM_SPACE_ULID &&
					space.fitnessCenter?.name !== PLATFORM_FITNESS_CENTER_NAME,
			)
			.map((space) => space);
	}
}
