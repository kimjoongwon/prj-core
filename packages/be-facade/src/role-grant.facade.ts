import { BatchAssignRoleGrantRequestDto } from "@cocrepo/dto";
import { RoleGrant } from "@cocrepo/entity";
import { RoleGrantService } from "@cocrepo/service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RoleGrantFacade {
	constructor(private readonly roleGrantService: RoleGrantService) {}

	batchAssignToRole(
		roleId: string,
		roleGrants: BatchAssignRoleGrantRequestDto["roleGrants"],
	): Promise<RoleGrant[]> {
		return this.roleGrantService.batchAssignToRole(roleId, roleGrants);
	}
}
