import { RoleAggregateRoot } from "@cocrepo/aggregate";
import { UpdateRoleCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateRoleCommand)
export class UpdateRoleUseCase implements ICommandHandler<UpdateRoleCommand> {
	constructor(private readonly rolesService: RoleAggregateRoot) {}

	execute(command: UpdateRoleCommand): Promise<unknown> {
		return this.rolesService.update(command.roleId, command.input);
	}
}
