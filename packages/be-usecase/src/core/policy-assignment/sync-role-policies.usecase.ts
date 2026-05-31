import { PolicyAssignmentAggregateRoot } from "@cocrepo/aggregate";
import { SyncRolePoliciesCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(SyncRolePoliciesCommand)
export class SyncRolePoliciesUseCase
	implements ICommandHandler<SyncRolePoliciesCommand>
{
	constructor(
		private readonly policyAssignmentService: PolicyAssignmentAggregateRoot,
	) {}

	execute(command: SyncRolePoliciesCommand): Promise<unknown> {
		return this.policyAssignmentService.syncRolePolicies(
			command.roleId,
			command.rolePolicies,
		);
	}
}
