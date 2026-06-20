import { SpaceAggregate } from "@cocrepo/aggregate";
import { GetSignUpSpacesQuery } from "@cocrepo/command";
import { SpaceDto } from "@cocrepo/dto";
import { QueryHandler } from "@nestjs/cqrs";
import { plainToInstance } from "class-transformer";
import { PLATFORM_GROUND_NAME, SYSTEM_SPACE_ID } from "./auth-support";

@QueryHandler(GetSignUpSpacesQuery)
export class GetSignUpSpacesUseCase {
	constructor(private readonly spacesService: SpaceAggregate) {}

	async execute(): Promise<SpaceDto[]> {
		const spaceList = await this.spacesService.listSpaces();
		return spaceList.spaces
			.filter(
				(space) =>
					space.id !== SYSTEM_SPACE_ID &&
					space.ground?.name !== PLATFORM_GROUND_NAME,
			)
			.map((space) => plainToInstance(SpaceDto, space));
	}
}
