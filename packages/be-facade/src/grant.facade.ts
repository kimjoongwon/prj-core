import { BatchGrantRequestDto } from "@cocrepo/dto";
import { Grant } from "@cocrepo/entity";
import { GrantService } from "@cocrepo/service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GrantFacade {
	constructor(private readonly grantsService: GrantService) {}

	batchAssignToRole(
		roleId: string,
		grants: BatchGrantRequestDto["grants"],
	): Promise<Grant[]> {
		return this.batchAssignGrantsToRole(roleId, { grants });
	}

	batchAssignGrantsToRole(
		roleId: string,
		dto: BatchGrantRequestDto,
	): Promise<Grant[]> {
		return this.grantsService.batchAssignToRole(roleId, dto.grants);
	}

	findByRoleIds(roleIds: string[]): Promise<Grant[]> {
		return this.grantsService.findByRoleIds(roleIds);
	}

	getGrantsByRoleId(roleId: string): Promise<Grant[]> {
		return this.grantsService.findByRoleIds([roleId]);
	}
}
