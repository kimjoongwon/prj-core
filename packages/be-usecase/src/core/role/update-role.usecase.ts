import { RoleAggregate } from "@cocrepo/aggregate";
import { UpdateRoleCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateRoleCommand)
export class UpdateRoleUseCase {
	constructor(private readonly rolesService: RoleAggregate) {}

	execute(command: UpdateRoleCommand): Promise<unknown> {
		return this.rolesService.update(command.roleId, command);
	}
}
