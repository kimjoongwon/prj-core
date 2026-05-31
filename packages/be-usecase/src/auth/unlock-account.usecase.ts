import { UnlockAccountCommand } from "@cocrepo/command";
import { UserService } from "@cocrepo/service";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UnlockAccountCommand)
export class UnlockAccountUseCase
	implements ICommandHandler<UnlockAccountCommand>
{
	constructor(private readonly usersService: UserService) {}

	async execute(command: UnlockAccountCommand): Promise<boolean> {
		await this.usersService.unlockAccount(command.userId);
		return true;
	}
}
