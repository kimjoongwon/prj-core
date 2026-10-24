import { RoleAggregate } from "@cocrepo/aggregate";
import { GetRoleByIdQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetRoleByIdQuery)
export class GetRoleByIdUseCase {
	constructor(private readonly rolesService: RoleAggregate) {}

	execute(query: GetRoleByIdQuery): Promise<unknown> {
		return this.rolesService.getById(query.roleId);
	}
}
