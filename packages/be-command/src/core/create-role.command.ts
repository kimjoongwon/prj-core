import type { CreateRoleDto } from "@cocrepo/dto";

export class CreateRoleCommand {
	constructor(readonly dto: CreateRoleDto) {}
}
