import { RoleAggregateRoot } from "@cocrepo/aggregate";
import { GetRoleByIdQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetRoleByIdQuery)
export class GetRoleByIdUseCase implements IQueryHandler<GetRoleByIdQuery> {
	constructor(private readonly rolesService: RoleAggregateRoot) {}

	execute(query: GetRoleByIdQuery): Promise<unknown> {
		return this.rolesService.getById(query.roleId);
	}
}
