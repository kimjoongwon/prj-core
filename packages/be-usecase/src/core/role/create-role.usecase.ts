import { RoleAggregate } from "@cocrepo/aggregate";
import { CreateRoleCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateRoleCommand)
export class CreateRoleUseCase {
	constructor(private readonly rolesService: RoleAggregate) {}

	execute(command: CreateRoleCommand): Promise<unknown> {
		return this.rolesService.create(command);
	}
}
