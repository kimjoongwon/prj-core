import { SpaceAggregate } from "@cocrepo/aggregate";
import { ListSpacesQuery } from "@cocrepo/command";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import { Logger } from "@nestjs/common";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(ListSpacesQuery)
export class ListSpacesUseCase {
	private readonly logger = new Logger(ListSpacesUseCase.name);

	constructor(private readonly spaceService: SpaceAggregate) {}

	async execute(query: ListSpacesQuery): Promise<unknown> {
		this.logger.debug("공간 목록 조회");
		const spaceResult = await this.spaceService.listSpaces(query);
		const skip = 0;
		const take = spaceResult.spaces.length;
		return buildOffsetPaginatedResponse(
			spaceResult.spaces,
			spaceResult.total,
			skip,
			take,
		);
	}
}
