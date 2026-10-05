import { Tenant } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";

export class UpdateTenantDto extends PartialType(
	PickType(Tenant, ["roleId", "userId", "spaceId"] as const),
) {}
