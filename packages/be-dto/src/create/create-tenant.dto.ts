import { Tenant } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

export class CreateTenantDto extends PickType(Tenant, [
	"roleId",
	"userId",
	"spaceId",
] as const) {}
