import { SpaceAggregateRoot } from "@cocrepo/aggregate";
import { GetMySpacesQuery } from "@cocrepo/command";
import { CONTEXT_KEYS } from "@cocrepo/constant";
import { SpaceDto, UserDto } from "@cocrepo/dto";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ClsService } from "nestjs-cls";
import { getAccessibleSpacesForUser } from "./auth-account.support";

@QueryHandler(GetMySpacesQuery)
export class GetMySpacesUseCase implements IQueryHandler<GetMySpacesQuery> {
	constructor(
		private readonly cls: ClsService,
		private readonly spacesService: SpaceAggregateRoot,
	) {}

	execute(): Promise<SpaceDto[]> {
		const user = this.cls.get<UserDto>(CONTEXT_KEYS.AUTH_USER);
		return getAccessibleSpacesForUser(this.spacesService, user);
	}
}
