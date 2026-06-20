import { PolicyAggregate } from "@cocrepo/aggregate";
import { DeletePolicyCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(DeletePolicyCommand)
export class DeletePolicyUseCase
	implements ICommandHandler<DeletePolicyCommand>
{
	constructor(private readonly policyService: PolicyAggregate) {}

	execute(command: DeletePolicyCommand): Promise<unknown> {
		return this.policyService.deletePolicy(command.policyId);
	}
}
