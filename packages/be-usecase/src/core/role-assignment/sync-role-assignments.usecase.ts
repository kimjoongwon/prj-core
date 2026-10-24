import { RoleAssignmentAggregate } from "@cocrepo/aggregate";
import { SyncRoleAssignmentsCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(SyncRoleAssignmentsCommand)
export class SyncRoleAssignmentsUseCase {
	constructor(
		private readonly roleAssignmentService: RoleAssignmentAggregate,
	) {}

	execute(command: SyncRoleAssignmentsCommand): Promise<unknown> {
		return this.roleAssignmentService.syncRoleAssignments(
			command.roleId,
			command.assignments,
		);
	}
}
