import { UnlockAccountCommand } from "@cocrepo/command";
import { UserService } from "@cocrepo/service";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(UnlockAccountCommand)
export class UnlockAccountUseCase {
	constructor(private readonly usersService: UserService) {}

	async execute(command: UnlockAccountCommand): Promise<boolean> {
		await this.usersService.unlockAccount(command.userId);
		return true;
	}
}
