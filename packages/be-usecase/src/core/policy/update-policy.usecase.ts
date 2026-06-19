import { PolicyAggregateRoot } from "@cocrepo/aggregate";
import { UpdatePolicyCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdatePolicyCommand)
export class UpdatePolicyUseCase
	implements ICommandHandler<UpdatePolicyCommand>
{
	constructor(private readonly policyService: PolicyAggregateRoot) {}

	execute(command: UpdatePolicyCommand): Promise<unknown> {
		return this.policyService.updatePolicy(command.policyId, command.input);
	}
}
