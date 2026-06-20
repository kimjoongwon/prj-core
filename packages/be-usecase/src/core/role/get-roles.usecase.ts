import { RoleAggregate } from "@cocrepo/aggregate";
import { GetRolesQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetRolesQuery)
export class GetRolesUseCase {
	constructor(private readonly rolesService: RoleAggregate) {}

	execute(): Promise<unknown> {
		return this.rolesService.getAll();
	}
}
