import { RoleAggregate } from "@cocrepo/aggregate";
import { DeleteRoleCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(DeleteRoleCommand)
export class DeleteRoleUseCase {
	constructor(private readonly rolesService: RoleAggregate) {}

	execute(command: DeleteRoleCommand): Promise<unknown> {
		return this.rolesService.delete(command.roleId);
	}
}
