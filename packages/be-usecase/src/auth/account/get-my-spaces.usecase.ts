import { SpaceAggregate } from "@cocrepo/aggregate";
import { GetMySpacesQuery } from "@cocrepo/command";
import { CONTEXT_KEYS } from "@cocrepo/constant";
import { QueryHandler } from "@nestjs/cqrs";
import { ClsService } from "nestjs-cls";
import { getAccessibleSpacesForUser } from "./get-accessible-spaces-for-user";
import type { AuthSpaceResult } from "./space.result";
import type { UserWithTenantsLike } from "./user-with-tenants-like";

@QueryHandler(GetMySpacesQuery)
export class GetMySpacesUseCase {
	constructor(
		private readonly cls: ClsService,
		private readonly spacesService: SpaceAggregate,
	) {}

	execute(): Promise<AuthSpaceResult[]> {
		const user = this.cls.get<UserWithTenantsLike>(CONTEXT_KEYS.AUTH_USER);
		return getAccessibleSpacesForUser(this.spacesService, user);
	}
}
