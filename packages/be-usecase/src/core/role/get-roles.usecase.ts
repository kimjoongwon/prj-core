import { RoleAggregateRoot } from "@cocrepo/aggregate";
import { GetRolesQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetRolesQuery)
export class GetRolesUseCase implements IQueryHandler<GetRolesQuery> {
	constructor(private readonly rolesService: RoleAggregateRoot) {}

	execute(): Promise<unknown> {
		return this.rolesService.getAll();
	}
}
