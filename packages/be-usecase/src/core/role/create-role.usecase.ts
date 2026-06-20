import { RoleAggregate } from "@cocrepo/aggregate";
import { CreateRoleCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateRoleCommand)
export class CreateRoleUseCase implements ICommandHandler<CreateRoleCommand> {
	constructor(private readonly rolesService: RoleAggregate) {}

	execute(command: CreateRoleCommand): Promise<unknown> {
		return this.rolesService.create(command.input);
	}
}
