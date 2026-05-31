import { RoleAggregateRoot } from "@cocrepo/aggregate";
import { DeleteRoleCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(DeleteRoleCommand)
export class DeleteRoleUseCase implements ICommandHandler<DeleteRoleCommand> {
	constructor(private readonly rolesService: RoleAggregateRoot) {}

	execute(command: DeleteRoleCommand): Promise<unknown> {
		return this.rolesService.delete(command.roleId);
	}
}
