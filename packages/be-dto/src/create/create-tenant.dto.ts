import { Tenant } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

export class CreateTenantDto extends PickType(Tenant, [
	"roleSeq",
	"userSeq",
	"spaceSeq",
] as const) {}
