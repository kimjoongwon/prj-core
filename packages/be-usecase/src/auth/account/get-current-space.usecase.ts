import { SpaceAggregate } from "@cocrepo/aggregate";
import { GetCurrentSpaceQuery } from "@cocrepo/command";
import { CONTEXT_KEYS } from "@cocrepo/constant";
import { QueryHandler } from "@nestjs/cqrs";
import { ClsService } from "nestjs-cls";
import { resolveCurrentSpace } from "./resolve-current-space";
import type { AuthSpaceResult } from "./space.result";
import type { UserWithTenantsLike } from "./user-with-tenants-like";

@QueryHandler(GetCurrentSpaceQuery)
export class GetCurrentSpaceUseCase {
	constructor(
		private readonly cls: ClsService,
		private readonly spacesService: SpaceAggregate,
	) {}

	execute(query: GetCurrentSpaceQuery): Promise<AuthSpaceResult | null> {
		const user = this.cls.get<UserWithTenantsLike>(CONTEXT_KEYS.AUTH_USER);
		return resolveCurrentSpace(
			this.spacesService,
			user,
			query.requestedSpaceId,
		);
	}
}
