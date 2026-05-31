import { PolicyAssignmentAggregateRoot } from "@cocrepo/aggregate";
import { SyncUserPoliciesCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(SyncUserPoliciesCommand)
export class SyncUserPoliciesUseCase
	implements ICommandHandler<SyncUserPoliciesCommand>
{
	constructor(
		private readonly policyAssignmentService: PolicyAssignmentAggregateRoot,
	) {}

	execute(command: SyncUserPoliciesCommand): Promise<unknown> {
		return this.policyAssignmentService.syncUserPolicies(
			command.userId,
			command.userPolicies,
		);
	}
}
