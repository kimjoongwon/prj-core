import { IdpAccountAggregate } from "@cocrepo/aggregate";
import { GrantIdpAccountAccessCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(GrantIdpAccountAccessCommand)
export class GrantIdpAccountAccessUseCase {
	constructor(private readonly idpAccountService: IdpAccountAggregate) {}

	execute(command: GrantIdpAccountAccessCommand): Promise<unknown> {
		return this.idpAccountService.grantAccess(command.userId, command);
	}
}
