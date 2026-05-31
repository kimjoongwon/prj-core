import { SpaceAggregateRoot } from "@cocrepo/aggregate";
import { GetCurrentSpaceQuery } from "@cocrepo/command";
import { CONTEXT_KEYS } from "@cocrepo/constant";
import { SpaceDto, UserDto } from "@cocrepo/dto";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ClsService } from "nestjs-cls";
import { resolveCurrentSpace } from "./auth-account.support";

@QueryHandler(GetCurrentSpaceQuery)
export class GetCurrentSpaceUseCase
	implements IQueryHandler<GetCurrentSpaceQuery>
{
	constructor(
		private readonly cls: ClsService,
		private readonly spacesService: SpaceAggregateRoot,
	) {}

	execute(query: GetCurrentSpaceQuery): Promise<SpaceDto | null> {
		const user = this.cls.get<UserDto>(CONTEXT_KEYS.AUTH_USER);
		return resolveCurrentSpace(
			this.spacesService,
			user,
			query.requestedSpaceId,
		);
	}
}
