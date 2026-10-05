import { SecurityPolicyAggregate } from "@cocrepo/aggregate";
import { UpdateSecurityPolicyCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateSecurityPolicyCommand)
export class UpdateSecurityPolicyUseCase {
	constructor(
		private readonly securityPolicyService: SecurityPolicyAggregate,
	) {}

	execute(command: UpdateSecurityPolicyCommand): Promise<unknown> {
		return this.securityPolicyService.update(command);
	}
}
