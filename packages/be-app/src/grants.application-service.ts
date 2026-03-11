import { BatchGrantRequestDto } from "@cocrepo/dto";
import { Grant } from "@cocrepo/entity";
import { GrantsService } from "@cocrepo/service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GrantsApplicationService {
	constructor(private readonly grantsService: GrantsService) {}

	batchAssignGrantsToRole(
		roleId: string,
		dto: BatchGrantRequestDto,
	): Promise<Grant[]> {
		return this.grantsService.batchAssignToRole(roleId, dto.grants);
	}

	getGrantsByRoleId(roleId: string): Promise<Grant[]> {
		return this.grantsService.findByRoleIds([roleId]);
	}
}
