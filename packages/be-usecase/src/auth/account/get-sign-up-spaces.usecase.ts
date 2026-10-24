import { SpaceAggregate } from "@cocrepo/aggregate";
import { GetSignUpSpacesQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";
import { PLATFORM_SPACE_NAME } from "./platform-space-name";
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
					space.spaceSeq !== SYSTEM_SPACE_ULID &&
					// 가입 가능한 공간은 살아있는 시설(FitnessCenter)이 연결된 운영 공간으로 제한합니다.
					space.fitnessCenter != null &&
					space.name !== PLATFORM_SPACE_NAME,
			)
			.map((space) => space);
	}
}
