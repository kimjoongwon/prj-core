import { GetUserTenantDetailQuery } from "@cocrepo/command";
import { UserService } from "@cocrepo/service";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetUserTenantDetailQuery)
export class GetUserTenantDetailUseCase {
	constructor(private readonly usersService: UserService) {}

	execute(query: GetUserTenantDetailQuery): Promise<unknown> {
		return this.usersService.getTenantDetailForUser(
			query.userId,
			query.tenantId,
			query.spaceId,
		);
	}
}
