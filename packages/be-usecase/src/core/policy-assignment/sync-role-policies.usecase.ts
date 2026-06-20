import { PolicyAssignmentAggregate } from "@cocrepo/aggregate";
import { SyncRolePoliciesCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(SyncRolePoliciesCommand)
export class SyncRolePoliciesUseCase {
	constructor(
		private readonly policyAssignmentService: PolicyAssignmentAggregate,
	) {}

	execute(command: SyncRolePoliciesCommand): Promise<unknown> {
		return this.policyAssignmentService.syncRolePolicies(
			command.roleId,
			command.input.rolePolicies,
		);
	}
}
