import { RoleAssignmentAggregate } from "@cocrepo/aggregate";
import { GetRoleAssignmentsQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetRoleAssignmentsQuery)
export class GetRoleAssignmentsUseCase {
	constructor(
		private readonly roleAssignmentService: RoleAssignmentAggregate,
	) {}

	execute(query: GetRoleAssignmentsQuery): Promise<unknown> {
		return this.roleAssignmentService.getRoleAssignments(query.roleId);
	}
}
