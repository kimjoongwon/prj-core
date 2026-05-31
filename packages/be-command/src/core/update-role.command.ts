import type { UpdateRoleDto } from "@cocrepo/dto";

export class UpdateRoleCommand {
	constructor(
		readonly roleId: string,
		readonly dto: UpdateRoleDto,
	) {}
}
