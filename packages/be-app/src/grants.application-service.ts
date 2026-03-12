import { BatchGrantRequestDto } from "@cocrepo/dto";
import { Grant } from "@cocrepo/entity";
import { GrantsService } from "@cocrepo/service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GrantsApplicationService {
	constructor(private readonly grantsService: GrantsService) {}

	batchAssignToRole(
		roleId: string,
		grants: string[],
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
