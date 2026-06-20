import { RoleAggregate } from "@cocrepo/aggregate";
import { UpdateRoleCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateRoleCommand)
export class UpdateRoleUseCase implements ICommandHandler<UpdateRoleCommand> {
	constructor(private readonly rolesService: RoleAggregate) {}

	execute(command: UpdateRoleCommand): Promise<unknown> {
		return this.rolesService.update(command.roleId, command.input);
	}
}
