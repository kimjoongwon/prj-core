import { PolicyAssignmentAggregate } from "@cocrepo/aggregate";
import { SyncRolePoliciesCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(SyncRolePoliciesCommand)
export class SyncRolePoliciesUseCase
	implements ICommandHandler<SyncRolePoliciesCommand>
{
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
