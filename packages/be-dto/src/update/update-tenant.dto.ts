import { Tenant } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";

export class UpdateTenantDto extends PartialType(
	PickType(Tenant, ["roleSeq", "userSeq", "spaceSeq"] as const),
) {}
